import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
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
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				try {
					let user = null;

					const { email, password } =
						await signInSchema.parseAsync(credentials);

					// logic to verify if the user exists
					user = await getUserFromDb(email, password);

					if (!user) {
						throw new Error("Invalid credentials.");
					}

					// return JSON object with the user data
					return {
						id: user.id,
						email: user.email,
						name: user.name,
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
			// After successful sign in, redirect to evaluation form
			return `${baseUrl}/home`;
		},
		async session({ session, token }) {
			// Add user info from token to session
			if (token && session.user) {
				session.user.id = token.sub as string;
			}
			return session;
		},
	},
});

async function getUserFromDb(email: string, password: string) {
	try {
		const result = await query(
			'SELECT id, email, name, password_hash FROM users WHERE email = $1',
			[email]
		);

		if (result.rows.length === 0) {
			return null;
		}

		const user = result.rows[0];
		const isValidPassword = await bcrypt.compare(password, user.password_hash);

		if (!isValidPassword) {
			return null;
		}

		return {
			id: user.id.toString(),
			email: user.email,
			name: user.name,
		};
	} catch (error) {
		console.error('Database error:', error);
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
