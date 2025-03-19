import { signIn } from "@/auth";

export function SignIn() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
				<h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
					LOGIN
				</h1>
				<form
					action={async (formData) => {
						"use server";

						// Get the remember me value from form data
						const remember = formData.get("remember") === "on";

						// Pass the remember option to signIn
						await signIn("credentials", formData, { remember: remember.toString() });
					}}
					className="space-y-6">
					<div className="space-y-2">
						<label className="block text-gray-700 font-medium">
							EMAIL
						</label>
						<input
							type="email"
							name="email"
							placeholder="Email"
							className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-gray-700 font-medium">
							CONTRASEÑA
						</label>
						<input
							type="password"
							name="password"
							placeholder="Contraseña"
							className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="flex items-center">
						<input
							type="checkbox"
							id="remember"
							name="remember"
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label htmlFor="remember" className="ml-2 text-gray-700">
							Recuerdame
						</label>
					</div>
					<button
						className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
					>
						ACCEDER
					</button>
				</form>
			</div>
		</div>
	);
}
