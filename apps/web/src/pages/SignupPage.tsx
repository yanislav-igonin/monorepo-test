import { type FormEvent, useEffect, useState } from "react";
import {
	AlertCircle,
	ArrowRight,
	Globe,
	LoaderCircle,
	Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
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
			<div className="flex min-h-screen items-center justify-center px-4">
				<div className="flex items-center gap-3 rounded-full border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
					<LoaderCircle aria-hidden="true" className="animate-spin" />
					Checking session
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-10">
			<div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
				<Card className="order-2 border-border/70 bg-card/95 shadow-xl lg:order-1">
					<CardHeader className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
							New workspace
						</p>
						<CardTitle className="text-3xl tracking-tight">
							Create account
						</CardTitle>
						<CardDescription>
							Set up your login and start shipping todos immediately.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{error ? (
							<Alert variant="destructive">
								<AlertCircle aria-hidden="true" />
								<AlertTitle>Unable to sign up</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}

						<form noValidate onSubmit={handleEmailSignup}>
							<FieldGroup className="gap-5">
								<Field data-invalid={Boolean(fieldErrors.name)}>
									<FieldLabel htmlFor="signup-name">Name</FieldLabel>
									<Input
										aria-invalid={fieldErrors.name ? true : undefined}
										autoComplete="name"
										id="signup-name"
										onChange={(e) => {
											setName(e.target.value);
											setFieldErrors((current) => ({
												...current,
												name: null,
											}));
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
											setFieldErrors((current) => ({
												...current,
												email: null,
											}));
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
									className="mt-2 w-full"
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
								className="font-medium text-primary underline-offset-4 hover:underline"
								to="/login"
							>
								Login
							</Link>
						</p>
					</CardContent>
				</Card>

				<section className="order-1 rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_70%,white),color-mix(in_oklab,var(--secondary)_78%,white))] p-8 shadow-lg lg:order-2">
					<div className="flex h-full flex-col justify-between gap-10">
						<div className="space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
								<Sparkles aria-hidden="true" />
								Lightweight starter
							</div>
							<div className="space-y-3">
								<h2 className="max-w-sm text-4xl font-semibold tracking-tight text-foreground">
									Build fast with one shared contract.
								</h2>
								<p className="max-w-md text-sm leading-6 text-muted-foreground">
									Sign up once, land in the authenticated shell, and manage todos
									through the same ORPC shape the API implements.
								</p>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm">
								<p className="text-sm font-medium text-foreground">Auth ready</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Email and Google flows stay intact.
								</p>
							</div>
							<div className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm">
								<p className="text-sm font-medium text-foreground">UI reset</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Mantine removed. Tailwind and shadcn drive every screen.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
