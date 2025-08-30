// Disabled dashboard middleware to prevent session conflicts
// export { auth as middleware } from "@/auth";

import { NextResponse } from "next/server";

export function middleware() {
	return NextResponse.next();
}
