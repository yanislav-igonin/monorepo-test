import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../api/auth";
import {
	Alert,
	Anchor,
	Button,
	Center,
	Container,
	Loader,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from "../components/ui";

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
			<Center mih="100vh">
				<Loader size="sm" />
			</Center>
		);
	}

	return (
		<Center mih="100vh" px="md">
			<Container size={360} w="100%">
				<Paper p="lg" withBorder>
					<Stack gap="md">
						<Title order={2}>Login</Title>

						{error ? (
							<Alert color="red" title="Unable to sign in" variant="light">
								{error}
							</Alert>
						) : null}

						<form onSubmit={handleSubmit}>
							<Stack gap="md">
								<TextInput
									autoComplete="email"
									id="login-email"
									label="Email"
									onChange={(e) => setEmail(e.target.value)}
									placeholder="user@example.com"
									required
									type="email"
									value={email}
								/>

								<PasswordInput
									autoComplete="current-password"
									id="login-password"
									label="Password"
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Your password"
									required
									value={password}
								/>

								<Button fullWidth loading={pending} type="submit">
									Login
								</Button>
							</Stack>
						</form>

						<Text c="dimmed" size="sm">
							Don&apos;t have an account?{" "}
							<Anchor component={Link} fw={600} to="/signup">
								Sign up
							</Anchor>
						</Text>
					</Stack>
				</Paper>
			</Container>
		</Center>
	);
}
