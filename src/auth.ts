import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";

export const { handlers, auth, signIn } = NextAuth({
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials, request) => {
				try {
					let user = null;

					const { email, password } =
						await signInSchema.parseAsync(credentials);

					// logic to salt and hash password
					const pwHash = saltAndHashPassword(password);

					// logic to verify if the user exists
					user = await getUserFromDb(email, pwHash);

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
		async redirect({ url, baseUrl }) {
			// After successful sign in, redirect to evaluation form
			return `${baseUrl}/evaluation-form`;
		},
	},
});

async function getUserFromDb(email: string, pwHash: string) {
	// In a real implementation, you would:
	// 1. Connect to your database
	// 2. Query for a user with matching email
	// 3. Compare password hashes
	// 4. Return user data or null

	// This is a mock implementation
	const mockDb = {
		users: [
			{
				id: "1",
				email: "test@example.com",
				passwordHash: "mockhash123",
				name: "Test User",
			},
		],
	};

	const user = mockDb.users.find(
		(u) => u.email === email && u.passwordHash === pwHash,
	);

	return user || null;
}

function saltAndHashPassword(password: unknown): string {
	if (typeof password !== "string") {
		throw new Error("Password must be a string");
	}

	// In a real implementation, you would:
	// 1. Generate a unique salt for each user
	// 2. Store the salt alongside the password hash
	// 3. Use a proper crypto library like bcrypt

	// This is a mock implementation
	if (password === "testpass123") {
		return "mockhash123";
	}

	return "invalidhash";
}
