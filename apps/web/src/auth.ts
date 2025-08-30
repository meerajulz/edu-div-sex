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
						username: user.username,
						first_name: user.first_name,
						last_name: user.last_name,
						sex: user.sex,
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
		async jwt({ token, user }) {
			console.log('🔑 [TERMINAL] JWT CALLBACK TRIGGERED - User present:', !!user, 'Token sub:', token.sub);
			if (user) {
				console.log('✅ [TERMINAL] JWT: Creating token for user:', user.email, 'Role:', (user as { role?: string }).role);
				token.role = (user as { role?: string }).role;
				token.username = (user as { username?: string }).username;
				token.first_name = (user as { first_name?: string }).first_name;
				token.last_name = (user as { last_name?: string }).last_name;
				token.sex = (user as { sex?: string }).sex;
			} else {
				console.log('🔄 [TERMINAL] JWT: Refreshing existing token for sub:', token.sub, 'Role:', token.role);
			}
			return token;
		},
		async session({ session, token }) {
			console.log('🎯 [TERMINAL] SESSION CALLBACK TRIGGERED - Token sub:', token.sub, 'Role:', token.role);
			if (token && session.user) {
				session.user.id = token.sub as string;
				(session.user as { role?: string }).role = token.role as string;
				(session.user as { username?: string }).username = token.username as string;
				(session.user as { first_name?: string }).first_name = token.first_name as string;
				(session.user as { last_name?: string }).last_name = token.last_name as string;
				(session.user as { sex?: string }).sex = token.sex as string;
				console.log('✅ [TERMINAL] SESSION: Session created for:', session.user.email, 'Role:', (session.user as { role?: string }).role);
			}
			return session;
		},
	},
});

async function getUserFromDb(login: string, password: string) {
	try {
		console.log('🔍 Login attempt for:', login);
		
		// Simple query first - try email
		let result = await query(
			'SELECT id, email, username, password_hash, name, role, is_active, first_name, last_name, sex FROM users WHERE email = $1',
			[login]
		);
		
		// If no user found by email, try username
		if (result.rows.length === 0) {
			console.log('🔍 No user found by email, trying username...');
			result = await query(
				'SELECT id, email, username, password_hash, name, role, is_active, first_name, last_name, sex FROM users WHERE username = $1',
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
		
		// Return user data with safe defaults for new fields
		return {
			id: user.id.toString(),
			email: user.email,
			name: user.name,
			role: user.role,
			username: user.username || null,
			first_name: user.first_name || null,
			last_name: user.last_name || null,
			sex: user.sex || null,
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