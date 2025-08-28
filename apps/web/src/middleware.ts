import { NextResponse } from "next/server";

export function middleware() {
	// Disable middleware for now due to edge runtime limitations
	return NextResponse.next();
}

export const config = {
	matcher: [
		// Temporarily disable middleware
		// "/actividad-:path*",
	],
};
