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
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		console.log('🔄 FORM SUBMITTED - Event triggered');
		e.preventDefault();
		setIsLoading(true);
		setLoginError('');
		
		const formData = new FormData(e.currentTarget);
		const login = formData.get('login') as string;
		const password = formData.get('password') as string;
		
		console.log('🚀 Sign-in: Starting authentication for:', login);
		console.log('🔑 Password length:', password?.length);
		
		try {
			const result = await signIn("credentials", {
				login,
				password,
				redirect: false
			});
			
			if (result?.ok) {
				// Simple redirect - just go to home
				window.location.href = '/home';
			} else {
				setLoginError('Login failed');
			}
		} catch (error) {
			console.error('❌ Sign-in: Unexpected error:', error);
			setLoginError('Error de autenticación. Por favor, inténtalo de nuevo.');
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
									className="w-full p-3 pr-12 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
									required
									disabled={isLoading}
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