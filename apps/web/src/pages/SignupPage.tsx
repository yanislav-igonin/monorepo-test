import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth";

export function SignupPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function handleEmailSignup(e: FormEvent) {
		e.preventDefault();
		setPending(true);
		setError(null);
		const { error } = await authClient.signUp.email({ name, email, password });
		setPending(false);
		if (error) {
			setError(error.message ?? "Sign up failed");
		} else {
			void navigate("/");
		}
	}

	async function handleGoogleSignup() {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/",
		});
	}

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleEmailSignup}>
				<div>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Display name"
						required
					/>
				</div>
				<div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
					/>
				</div>
				<div>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
					/>
				</div>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<button type="submit" disabled={pending}>
					{pending ? "Creating account…" : "Create account"}
				</button>
			</form>
			<hr />
			<button type="button" onClick={handleGoogleSignup}>
				Continue with Google
			</button>
			<p>
				Already have an account? <Link to="/login">Login</Link>
			</p>
		</div>
	);
}
