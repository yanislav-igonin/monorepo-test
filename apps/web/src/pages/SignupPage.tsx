import { type FormEvent, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Globe, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";

type FieldErrors = {
	name: string | null;
	email: string | null;
	password: string | null;
};

const emptyFieldErrors: FieldErrors = {
	name: null,
	email: null,
	password: null,
};

export function SignupPage() {
	const navigate = useNavigate();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyFieldErrors);
	const [error, setError] = useState<string | null>(null);
	const [emailPending, setEmailPending] = useState(false);
	const [googlePending, setGooglePending] = useState(false);

	useEffect(() => {
		if (!isSessionPending && session) {
			void navigate("/");
		}
	}, [isSessionPending, navigate, session]);

	function validateFields() {
		const nextErrors: FieldErrors = {
			name: name.trim() ? null : "Name is required",
			email: null,
			password: password ? null : "Password is required",
		};

		if (!email.trim()) {
			nextErrors.email = "Email is required";
		} else if (!/^\S+@\S+\.\S+$/.test(email)) {
			nextErrors.email = "Enter a valid email";
		}

		setFieldErrors(nextErrors);

		return Object.values(nextErrors).every((value) => value === null);
	}

	async function handleEmailSignup(e: FormEvent) {
		e.preventDefault();
		setError(null);

		if (!validateFields()) {
			return;
		}

		setEmailPending(true);
		const { error } = await authClient.signUp.email({
			name: name.trim(),
			email: email.trim(),
			password,
		});
		setEmailPending(false);

		if (error) {
			setError(error.message ?? "Sign up failed");
			return;
		}

		void navigate("/");
	}

	async function handleGoogleSignup() {
		setError(null);
		setGooglePending(true);

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/",
			});
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Google sign up failed");
		} finally {
			setGooglePending(false);
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
					<h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
					<p className="text-sm text-muted-foreground">
						Create a new account to access the workspace.
					</p>
				</div>

				{error ? (
					<Alert variant="destructive">
						<AlertCircle aria-hidden="true" />
						<AlertTitle>Unable to sign up</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : null}

				<form noValidate onSubmit={handleEmailSignup}>
					<FieldGroup className="gap-4">
						<Field data-invalid={Boolean(fieldErrors.name)}>
							<FieldLabel htmlFor="signup-name">Name</FieldLabel>
							<Input
								aria-invalid={fieldErrors.name ? true : undefined}
								autoComplete="name"
								id="signup-name"
								onChange={(e) => {
									setName(e.target.value);
									setFieldErrors((current) => ({ ...current, name: null }));
								}}
								placeholder="Jane Doe"
								required
								value={name}
							/>
							<FieldError>{fieldErrors.name}</FieldError>
						</Field>

						<Field data-invalid={Boolean(fieldErrors.email)}>
							<FieldLabel htmlFor="signup-email">Email</FieldLabel>
							<Input
								aria-invalid={fieldErrors.email ? true : undefined}
								autoComplete="email"
								id="signup-email"
								onChange={(e) => {
									setEmail(e.target.value);
									setFieldErrors((current) => ({ ...current, email: null }));
								}}
								placeholder="user@example.com"
								required
								type="email"
								value={email}
							/>
							<FieldError>{fieldErrors.email}</FieldError>
						</Field>

						<Field data-invalid={Boolean(fieldErrors.password)}>
							<FieldLabel htmlFor="signup-password">Password</FieldLabel>
							<Input
								aria-invalid={fieldErrors.password ? true : undefined}
								autoComplete="new-password"
								id="signup-password"
								onChange={(e) => {
									setPassword(e.target.value);
									setFieldErrors((current) => ({
										...current,
										password: null,
									}));
								}}
								placeholder="Create a password"
								required
								type="password"
								value={password}
							/>
							<FieldError>{fieldErrors.password}</FieldError>
						</Field>

						<Button
							className="w-full"
							disabled={googlePending || emailPending}
							type="submit"
						>
							{emailPending ? (
								<LoaderCircle
									aria-hidden="true"
									className="animate-spin"
									data-icon="inline-start"
								/>
							) : (
								<ArrowRight aria-hidden="true" data-icon="inline-start" />
							)}
							Create account
						</Button>
					</FieldGroup>
				</form>

				<Button
					className="w-full"
					disabled={emailPending || googlePending}
					type="button"
					variant="outline"
					onClick={() => void handleGoogleSignup()}
				>
					{googlePending ? (
						<LoaderCircle
							aria-hidden="true"
							className="animate-spin"
							data-icon="inline-start"
						/>
					) : (
						<Globe aria-hidden="true" data-icon="inline-start" />
					)}
					Continue with Google
				</Button>

				<p className="text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						className="font-medium text-foreground underline-offset-4 hover:underline"
						to="/login"
					>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
