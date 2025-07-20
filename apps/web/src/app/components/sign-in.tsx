import { signIn, auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

interface SignInProps {
	error?: string;
}

async function getStudentRedirectPath(studentId: string): Promise<string> {
	try {
		// Query student's progress to find next incomplete activity/scene
		const progress = await query(`
			SELECT 
				a.slug as activity_slug,
				s.slug as scene_slug,
				s.order_number as scene_order,
				sp.status
			FROM activities a
			JOIN scenes s ON s.activity_id = a.id
			LEFT JOIN student_progress sp ON sp.activity_id = a.id 
				AND sp.scene_id = s.id 
				AND sp.student_id = $1
			WHERE a.is_active = true AND s.is_active = true
			ORDER BY a.order_number, s.order_number
		`, [studentId]);

		// Find first incomplete scene or default to first activity
		for (const row of progress.rows) {
			if (!row.status || row.status !== 'completed') {
				return `/${row.activity_slug}/${row.scene_slug}`;
			}
		}
		
		// If all completed, go to first activity
		return '/actividad-1';
	} catch (error) {
		console.error('Error getting student redirect:', error);
		// Fallback to first activity
		return '/actividad-1';
	}
}

export function SignIn({ error }: SignInProps) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-white">
			{/* Background Gradient */}
			<div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />

			{/* Overlay Background Image */}
				<div className="absolute inset-0 z-0 overflow-hidden AMIGUES">
					<Image
						src="/image/amigues.png"
						alt="Background illustration"
						layout="fill"
						objectFit="contain"
						objectPosition="top"
						priority
						className="opacity-20"
					/>
				</div>

			{/* Logo in top-left */}
			<div className="absolute top-4 left-4 z-10">
				<Image
					src="/svg/logo/logo.svg"
					alt="App Logo"
					width={120}
					height={40}
					className="w-auto h-auto"
				/>
			</div>

			{/* Main Content */}
			<div className="relative z-10 min-h-screen flex items-center justify-center px-4">
				<div className="max-w-md w-full mx-auto p-6 bg-fuchsia-700 text-white rounded-lg border border-fuchsia-800 shadow-lg">
					<h1 className="text-2xl font-semibold text-center mb-6">LOGIN</h1>

					{error && (
						<div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm">
							{error === 'CredentialsSignin' 
								? 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.'
								: 'Error de autenticación. Por favor, inténtalo de nuevo.'
							}
						</div>
					)}

					<form
						action={async (formData) => {
							"use server";
							try {
								const result = await signIn("credentials", {
									login: formData.get('login'),
									password: formData.get('password'),
									redirect: false
								});
								
								if (result?.error) {
									redirect("/auth/login?error=CredentialsSignin");
								} else {
									// Get user info directly from database to check role
									const login = formData.get('login') as string;
									const userResult = await query(
										'SELECT id, role FROM users WHERE email = $1 OR (username IS NOT NULL AND username = $1)',
										[login]
									);
									
									if (userResult.rows.length > 0) {
										const user = userResult.rows[0];
										if (user.role === 'student') {
											// Redirect students directly to their appropriate activity
											const studentPath = await getStudentRedirectPath(user.id.toString());
											redirect(studentPath);
										} else {
											// Redirect non-students to dashboard
											redirect("/dashboard");
										}
									} else {
										// Fallback to dashboard if user not found
										redirect("/dashboard");
									}
								}
							} catch (error) {
								// Check if this is a NEXT_REDIRECT error (which is normal)
								if (error && typeof error === 'object' && 'digest' in error && 
								    typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
									throw error; // Re-throw to allow the redirect to work
								}
								// Only handle actual authentication errors
								redirect("/auth/login?error=CredentialsSignin");
							}
						}}
						className="space-y-6"
					>
						<div className="space-y-2">
							<label className="block font-medium" htmlFor="login">EMAIL</label>
							<input
								type="email"
								name="login"
								id="login"
								placeholder="Email"
								className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
								required
							/>
						</div>
						<div className="space-y-2">
							<label className="block font-medium" htmlFor="password">CONTRASEÑA</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Contraseña"
								className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
								required
							/>
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								name="remember"
								className="h-4 w-4 rounded border-gray-300 text-fuchsia-700 focus:ring-white"
							/>
							<label htmlFor="remember" className="ml-2">Recuérdame</label>
						</div>
						<button
							className="w-full bg-white text-fuchsia-700 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
						>
							ACCEDER
						</button>
					</form>
				</div>
			</div>

			{/* Decorative bottom gradient */}
			<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent z-5" />
		</div>
	);
}
