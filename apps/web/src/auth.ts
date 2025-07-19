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
	// Mock authentication for local testing
	// Replace this with real database logic when DATABASE_URL is configured
	if (login === 'test@example.com' && password === 'testpass123') {
		return {
			id: '1',
			email: 'test@example.com',
			username: 'testuser',
			name: 'Test User',
			role: 'owner', // This will show the owner dashboard
			first_name: 'Test',
			last_name: 'User',
		};
	}
	
	// Additional test users for different roles
	if (login === 'admin@example.com' && password === 'testpass123') {
		return {
			id: '2',
			email: 'admin@example.com',
			username: 'adminuser',
			name: 'Admin User',
			role: 'admin',
			first_name: 'Admin',
			last_name: 'User',
		};
	}
	
	if (login === 'teacher@example.com' && password === 'testpass123') {
		return {
			id: '3',
			email: 'teacher@example.com',
			username: 'teacheruser',
			name: 'Teacher User',
			role: 'teacher',
			first_name: 'Teacher',
			last_name: 'User',
		};
	}
	
	return null;
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
