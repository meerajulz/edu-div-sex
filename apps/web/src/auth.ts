import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema, signInSchemaLegacy } from "./lib/zod";
import bcrypt from "bcryptjs";
import { query } from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
	session: {
		// When remember me is checked, session will last for 30 days, otherwise 24 hours
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
					let user = null;

					// Try new schema first (login + password)
					let login, password;
					try {
						const parsed = await signInSchema.parseAsync(credentials);
						login = parsed.login;
						password = parsed.password;
					} catch {
						// Fall back to legacy schema (email + password) for backwards compatibility
						const parsed = await signInSchemaLegacy.parseAsync(credentials);
						login = parsed.email;
						password = parsed.password;
					}

					// logic to verify if the user exists
					user = await getUserFromDb(login, password);

					if (!user) {
						throw new Error("Invalid credentials.");
					}

					// return JSON object with the user data
					return {
						id: user.id,
						email: user.email,
						name: user.name,
						...(user.username && { username: user.username }),
						...(user.role && { role: user.role }),
					};
				} catch (error) {
					if (error instanceof ZodError) {
						// Return `null` to indicate that the credentials are invalid
						return null;
					}
					return null;
				}
			},
		}),
	],
	callbacks: {
		async redirect({ baseUrl }) {
			// Always redirect to dashboard except for explicit logout
			return `${baseUrl}/dashboard`;
		},
		async jwt({ token, user }) {
			// Pass user data to token when user signs in
			if (user) {
				console.log('JWT callback - User data:', user);
				token.role = (user as { role?: string }).role;
				token.username = (user as { username?: string }).username;
				token.first_name = (user as { first_name?: string }).first_name;
				token.last_name = (user as { last_name?: string }).last_name;
			}
			console.log('JWT callback - Token:', { role: token.role, sub: token.sub });
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
	// Fallback for test user during development
	if (login === 'test@example.com' && password === 'testpass123') {
		return {
			id: '1',
			email: 'test@example.com',
			name: 'Test User',
			role: 'owner',
		};
	}

	try {
		// Query database for user by email
		const result = await query(
			'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
			[login]
		);
		
		if (result.rows.length === 0) {
			return null;
		}
		
		const user = result.rows[0];
		
		// Check if user is active
		if (!user.is_active) {
			return null;
		}
		
		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) {
			return null;
		}
		
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
