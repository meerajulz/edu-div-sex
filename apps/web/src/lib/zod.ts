import { object, string } from "zod";

export const signInSchema = object({
	// Accept either email or username (login field)
	login: string({ required_error: "Email or username is required" })
		.min(1, "Email or username is required"),
	password: string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(3, "Password is too short") // Allow simple passwords like "cat blue run"
		.max(100, "Password is too long"), // Allow for longer simple passwords
});

// Legacy schema for backwards compatibility
export const signInSchemaLegacy = object({
	email: string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});
