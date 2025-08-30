import { SignIn } from "@/app/components/sign-in";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface LoginPageProps {
	searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
