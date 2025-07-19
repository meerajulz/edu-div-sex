import { signIn } from "@/auth";
import Image from "next/image";

export function SignIn() {
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

					<form
						action={async (formData) => {
							"use server";
							const remember = formData.get("remember") === "on";
							await signIn("credentials", formData, { remember: remember.toString() });
						}}
						className="space-y-6"
					>
						<div className="space-y-2">
							<label className="block font-medium" htmlFor="email">EMAIL</label>
							<input
								type="email"
								name="email"
								id="email"
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
