import { signIn } from "@/auth";

export function SignIn() {
	return (
		<form
			action={async (formData) => {
				"use server";
				await signIn("credentials", formData);
			}}
		>
			<label>
				Email
				<input name="email" type="email" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button>Acceder</button>
		</form>
	);
}
