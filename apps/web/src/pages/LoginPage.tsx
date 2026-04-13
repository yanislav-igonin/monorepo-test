import { type FormEvent, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Field, FieldGroup, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";

export function LoginPage() {
	const navigate = useNavigate();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	useEffect(() => {
		if (!isSessionPending && session) {
			void navigate("/");
		}
	}, [isSessionPending, navigate, session]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setPending(true);
		setError(null);
		const { error } = await authClient.signIn.email({
			email,
			password,
			callbackURL: "/",
		});
		setPending(false);
		if (error) {
			setError(error.message ?? "Login failed");
		} else {
			void navigate("/");
		}
	}

	if (isSessionPending) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4 text-sm text-muted-foreground">
				Checking session
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-sm items-center px-4 py-10">
			<div className="w-full space-y-6">
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight">Login</h1>
					<p className="text-sm text-muted-foreground">
						Use your existing account.
					</p>
				</div>

				{error ? (
					<Alert variant="destructive">
						<AlertCircle aria-hidden="true" />
						<AlertTitle>Unable to sign in</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : null}

				<form onSubmit={handleSubmit}>
					<FieldGroup className="gap-4">
						<Field>
							<FieldLabel htmlFor="login-email">Email</FieldLabel>
							<Input
								autoComplete="email"
								id="login-email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="user@example.com"
								required
								type="email"
								value={email}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="login-password">Password</FieldLabel>
							<Input
								autoComplete="current-password"
								id="login-password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Your password"
								required
								type="password"
								value={password}
							/>
						</Field>

						<Button className="w-full" disabled={pending} type="submit">
							{pending ? (
								<LoaderCircle
									aria-hidden="true"
									className="animate-spin"
									data-icon="inline-start"
								/>
							) : (
								<ArrowRight aria-hidden="true" data-icon="inline-start" />
							)}
							Login
						</Button>
					</FieldGroup>
				</form>

				<p className="text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						className="font-medium text-foreground underline-offset-4 hover:underline"
						to="/signup"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
