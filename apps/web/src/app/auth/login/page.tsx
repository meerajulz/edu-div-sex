import { SignIn } from "@/app/components/sign-in";

interface LoginPageProps {
	searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { error } = await searchParams;
	return (
		<main>
			<SignIn error={error} />
		</main>
	);
}
