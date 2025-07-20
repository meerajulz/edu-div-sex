import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema, signInSchemaLegacy } from "./lib/zod";
import bcrypt from "bcryptjs";
import { query } from "./lib/db";


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
		async redirect({ url, baseUrl }) {
			// Handle logout redirects to login page
			if (url === `${baseUrl}/auth/login`) {
				return url;
			}
			
			// Allow explicit relative URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			if (url.startsWith(baseUrl)) return url;
			
			// Default redirect to dashboard for login
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
				'SELECT id, email, username, password_hash, name, role, is_active FROM users WHERE (email = $1 OR (username IS NOT NULL AND username = $1)) AND deleted_at IS NULL',
				[login]
			);
		} catch (err) {
			// Fallback for databases without username or deleted_at columns
			console.log('Falling back to basic email query:', err instanceof Error ? err.message : 'Unknown error');
			result = await query(
				'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
				[login]
			);
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
		
		// Return user data
		return {
			id: user.id.toString(),
			email: user.email,
			name: user.name,
			role: user.role,
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
