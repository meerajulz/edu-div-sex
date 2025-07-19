import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

	// Redirect authenticated users from auth pages to home
	if (isLoggedIn && isAuthPage) {
		return NextResponse.redirect(new URL("/home", req.url));
	}

	// Protect these routes
	const protectedPaths = ["/dashboard", "/home", "/evaluation-form"];

	// Check if the path is protected
	const isProtectedPath = protectedPaths.some((path) =>
		req.nextUrl.pathname.startsWith(path),
	);

	// Redirect unauthenticated users to login
	if (!isLoggedIn && isProtectedPath) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	return NextResponse.next();
});

// Configurar las rutas que deben ser manejadas por el middleware
export const config = {
	matcher: [
		"/dashboard/:path*",
		"/home/:path*",
		"/evaluation-form/:path*",
		"/auth/:path*",
	],
};
