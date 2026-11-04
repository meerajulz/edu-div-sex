import { SignIn } from "@/app/components/sign-in";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/app/demo/demoConfig";

interface LoginPageProps {
	searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	// Demo build: no login — every route that sends users to login lands on the demo selector
	if (DEMO_MODE) {
		redirect('/demo');
	}

	// Check if user is already authenticated
	const session = await auth();
	
	// If user is already logged in, redirect to home
	if (session) {
		redirect('/home');
	}
	
	const { error } = await searchParams;
	return (
		<main>
			<SignIn error={error} />
		</main>
	);
}
