import { type FormEvent, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
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
			<div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
				<section className="hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--secondary)_75%,white),color-mix(in_oklab,var(--accent)_55%,white))] p-8 shadow-lg lg:flex lg:flex-col lg:justify-between">
					<div className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
							Return to focus
						</p>
						<div className="space-y-3">
							<h2 className="max-w-sm text-4xl font-semibold tracking-tight text-foreground">
								Login
							</h2>
							<p className="max-w-md text-sm leading-6 text-muted-foreground">
								Step back into your workspace, pick up your list, and keep the
								shared contract in sync without touching the API surface.
							</p>
						</div>
					</div>
					<div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm">
						<p className="text-sm font-medium text-foreground">
							Single place for auth, todos, and shared contract flow.
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Email login stays unchanged. Only UI layer moved to shadcn/ui.
						</p>
					</div>
				</section>

				<Card className="border-border/70 bg-card/95 shadow-xl">
					<CardHeader className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
							Welcome back
						</p>
						<CardTitle className="text-3xl tracking-tight">Login</CardTitle>
						<CardDescription>
							Use your existing account to open the workspace.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{error ? (
							<Alert variant="destructive">
								<AlertCircle aria-hidden="true" />
								<AlertTitle>Unable to sign in</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}

						<form onSubmit={handleSubmit}>
							<FieldGroup className="gap-5">
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

								<Button className="mt-2 w-full" disabled={pending} type="submit">
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
								className="font-medium text-primary underline-offset-4 hover:underline"
								to="/signup"
							>
								Sign up
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
