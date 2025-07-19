import { NextResponse } from "next/server";

export function middleware() {
	// Simplified middleware - just let everything through for now
	return NextResponse.next();
}

export const config = {
	matcher: [
		// Temporarily disable middleware
		// "/dashboard/:path*",
		// "/auth/:path*",
	],
};
