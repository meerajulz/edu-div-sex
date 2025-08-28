import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema, signInSchemaLegacy } from "./lib/zod";
import bcrypt from "bcryptjs";
import { query } from "./lib/db";
import { hasStudentStartedActivities, getCurrentStudentActivity } from './lib/studentProgress';


export const { handlers, auth, signIn, signOut } = NextAuth({
	session: {
		strategy: "jwt",
	},
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// Support both email and username login
			credentials: {
				login: { label: "Email or Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				try {
					if (!credentials) {
						return null;
					}

					// Try new schema first (login + password)
					let login, password;
					try {
						const parsed = await signInSchema.parseAsync(credentials);
						login = parsed.login;
						password = parsed.password;
					} catch {
						// Fall back to legacy schema (email + password) for backwards compatibility
						try {
							const parsed = await signInSchemaLegacy.parseAsync(credentials);
							login = parsed.email;
							password = parsed.password;
						} catch (legacyError) {
							throw legacyError;
						}
					}

					// logic to verify if the user exists
					const user = await getUserFromDb(login, password);

					if (!user) {
						return null;
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name,
						role: user.role,
					};
				} catch (error) {
					if (error instanceof ZodError) {
						return null;
					}
					return null;
				}
			},
		}),
	],
	callbacks: {
		async redirect({ url, baseUrl, token }) {
			// Handle logout redirects to login page
			if (url === `${baseUrl}/auth/login`) {
				return url;
			}
			
			// Allow explicit relative URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			if (url.startsWith(baseUrl)) return url;
			
			// For students, check their activity progress to determine redirect
			if (token?.role === 'student' && token?.sub) {
				try {
					const hasStartedActivities = await hasStudentStartedActivities(token.sub);
					
					if (!hasStartedActivities) {
						// First-time student - redirect to home
						return `${baseUrl}/home`;
					} else {
						// Returning student - check for current activity
						const currentActivity = await getCurrentStudentActivity(token.sub);
						if (currentActivity) {
							return `${baseUrl}${currentActivity}`;
						} else {
							// Has progress but no current activity, go to dashboard
							return `${baseUrl}/dashboard`;
						}
					}
				} catch (error) {
					console.error('Error checking student progress:', error);
					// On error, default to dashboard
					return `${baseUrl}/dashboard`;
				}
			}
			
			// Default redirect to dashboard for login (non-students)
			return `${baseUrl}/dashboard`;
		},
		async jwt({ token, user }) {
			// Pass user data to token when user signs in
			if (user) {
				token.role = (user as { role?: string }).role;
				token.username = (user as { username?: string }).username;
				token.first_name = (user as { first_name?: string }).first_name;
				token.last_name = (user as { last_name?: string }).last_name;
			}
			return token;
		},
		async session({ session, token }) {
			// Add user info from token to session
			if (token && session.user) {
				session.user.id = token.sub as string;
				(session.user as { role?: string }).role = token.role as string;
				(session.user as { username?: string }).username = token.username as string;
				(session.user as { first_name?: string }).first_name = token.first_name as string;
				(session.user as { last_name?: string }).last_name = token.last_name as string;
			}
			return session;
		},
	},
});

async function getUserFromDb(login: string, password: string) {
	try {
		console.log('🔍 Login attempt for:', login);
		
		// Query database for user by email OR username (excluding deleted users)
		// Handle cases where username might be NULL for existing users
		// Use conditional query based on whether username column exists
		let result;
		try {
			result = await query(
				'SELECT id, email, username, password_hash, name, role, is_active, first_name, last_name FROM users WHERE (email = $1 OR (username IS NOT NULL AND username = $1)) AND deleted_at IS NULL',
				[login]
			);
		} catch (err) {
			// Fallback for databases without newer columns
			console.log('Falling back to basic query:', err instanceof Error ? err.message : 'Unknown error');
			try {
				result = await query(
					'SELECT id, email, username, password_hash, name, role, is_active FROM users WHERE (email = $1 OR (username IS NOT NULL AND username = $1)) AND deleted_at IS NULL',
					[login]
				);
			} catch (fallbackErr) {
				// Final fallback for minimal schema
				console.log('Final fallback to email-only query');
				result = await query(
					'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
					[login]
				);
			}
		}
		
		console.log('📊 Query result:', result.rows.length, 'users found');
		
		if (result.rows.length === 0) {
			console.log('❌ No user found with login:', login);
			return null;
		}
		
		const user = result.rows[0];
		console.log('👤 User found:', user.email, 'Role:', user.role, 'Active:', user.is_active);
		
		// Check if user is active
		if (!user.is_active) {
			console.log('❌ User is not active');
			return null;
		}
		
		// Verify password
		console.log('🔐 Verifying password...');
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		console.log('🔐 Password valid:', isPasswordValid);
		
		if (!isPasswordValid) {
			console.log('❌ Password verification failed');
			return null;
		}
		
		console.log('✅ Authentication successful for:', user.email);
		
		// Return user data with safe defaults for new fields
		return {
			id: user.id.toString(),
			email: user.email,
			name: user.name,
			role: user.role,
			username: user.username || null,
			first_name: user.first_name || null,
			last_name: user.last_name || null,
		};
	} catch (error) {
		console.error('Error in getUserFromDb:', error);
		return null;
	}
}

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 12;
	return await bcrypt.hash(password, saltRounds);
}

export async function createUser(email: string, password: string, name: string) {
	try {
		const hashedPassword = await hashPassword(password);
		const result = await query(
			'INSERT INTO users (email, password_hash, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name',
			[email, hashedPassword, name]
		);
		return result.rows[0];
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}
