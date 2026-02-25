'use client'

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SignInProps {
	error?: string;
}

export function SignIn({ error }: SignInProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState(error || '');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// Clear errors when user starts typing
	const handleInputChange = () => {
		if (loginError) setLoginError('');
		if (passwordError) setPasswordError('');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log('🔄 FORM SUBMITTED - Event triggered');
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);
		setLoginError('');
		setPasswordError('');

		const formData = new FormData(e.currentTarget);
		const login = formData.get('login') as string;
		const password = formData.get('password') as string;

		console.log('🚀 Sign-in: Starting authentication for:', login);
		console.log('🔑 Password length:', password?.length);

		// Block any navigation attempts during login
		const blockNavigation = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			return '';
		};
		window.addEventListener('beforeunload', blockNavigation);

		try {
			console.log('📡 Calling signIn with redirect: false');
			const result = await signIn("credentials", {
				login,
				password,
				redirect: false
			}).catch((err) => {
				console.error('🚨 signIn threw error:', err);
				return { ok: false, error: 'SignInError' };
			});

			console.log('🔍 Sign-in result:', JSON.stringify(result, null, 2));
			console.log('✅ Result OK:', result?.ok);
			console.log('❌ Result Error:', result?.error);
			console.log('🔗 Result URL:', result?.url);

			// Remove navigation block
			window.removeEventListener('beforeunload', blockNavigation);

			if (result?.ok) {
				console.log('✅ Login successful, redirecting to home...');
				// Only redirect on success
				window.location.href = '/home';
			} else {
				console.log('❌ Login failed with error:', result?.error);

				// Force staying on the same page
				if (window.location.pathname !== '/auth/login') {
					window.history.pushState(null, '', '/auth/login');
				}

				// Handle specific error messages
				if (result?.error === 'CredentialsSignin' || result?.error?.includes('Invalid')) {
					setPasswordError('Usuario o contraseña incorrectos');
					setLoginError('Las credenciales no son válidas. Por favor, verifica tu usuario y contraseña.');
				} else if (result?.error?.includes('User not found')) {
					setLoginError('El usuario no existe');
					setPasswordError('');
				} else {
					setLoginError('Error de autenticación. Por favor, inténtalo de nuevo.');
					setPasswordError('Verifica tus credenciales');
				}
			}
		} catch (error) {
			console.error('❌ Sign-in: Unexpected error:', error);
			window.removeEventListener('beforeunload', blockNavigation);
			setLoginError('Error de autenticación. Por favor, inténtalo de nuevo.');
			setPasswordError('');
		} finally {
			setIsLoading(false);
		}
	};

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

					{loginError && (
						<div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm">
							{loginError}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="block font-medium" htmlFor="login">EMAIL O USUARIO</label>
							<input
								type="text"
								name="login"
								id="login"
								placeholder="Email o nombre de usuario"
								className="w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
								required
								disabled={isLoading}
								onChange={handleInputChange}
							/>
						</div>
						<div className="space-y-2">
							<label className="block font-medium" htmlFor="password">CONTRASEÑA</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									id="password"
									placeholder="Contraseña"
									className={`w-full p-3 pr-12 rounded-lg text-gray-900 placeholder-gray-400 border focus:outline-none focus:ring-2 transition-colors ${
										passwordError
											? 'border-red-500 focus:ring-red-300'
											: 'border-gray-300 focus:ring-white'
									}`}
									required
									disabled={isLoading}
									onChange={handleInputChange}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
									disabled={isLoading}
									aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
							{passwordError && (
								<p className="text-red-300 text-sm mt-1 flex items-center gap-1">
									<span className="font-bold">⚠</span> {passwordError}
								</p>
							)}
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="remember"
								name="remember"
								className="h-4 w-4 rounded border-gray-300 text-fuchsia-700 focus:ring-white"
								disabled={isLoading}
							/>
							<label htmlFor="remember" className="ml-2">Recuérdame</label>
						</div>
						<button
							type="submit"
							disabled={isLoading}
							onClick={() => console.log('📱 BUTTON CLICKED!')}
							className="w-full bg-white text-fuchsia-700 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'ACCEDIENDO...' : 'ACCEDER'}
						</button>
					</form>
				</div>
			</div>

			{/* Decorative bottom gradient */}
			<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent z-5" />
		</div>
	);
}