import { type FormEvent, useEffect, useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
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
						<Title order={2}>Create account</Title>

						{error ? (
							<Alert color="red" title="Unable to sign up" variant="light">
								{error}
							</Alert>
						) : null}

						<form noValidate onSubmit={handleEmailSignup}>
							<Stack gap="md">
								<TextInput
									autoComplete="name"
									error={fieldErrors.name}
									id="signup-name"
									label="Name"
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

								<TextInput
									autoComplete="email"
									error={fieldErrors.email}
									id="signup-email"
									label="Email"
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

								<PasswordInput
									autoComplete="new-password"
									error={fieldErrors.password}
									id="signup-password"
									label="Password"
									onChange={(e) => {
										setPassword(e.target.value);
										setFieldErrors((current) => ({
											...current,
											password: null,
										}));
									}}
									placeholder="Create a password"
									required
									value={password}
								/>

								<Button
									disabled={googlePending}
									fullWidth
									loading={emailPending}
									type="submit"
								>
									Create account
								</Button>
							</Stack>
						</form>

						<Button
							disabled={emailPending}
							fullWidth
							leftSection={<GoogleLogo aria-hidden="true" size={18} weight="fill" />}
							loading={googlePending}
							onClick={() => void handleGoogleSignup()}
							variant="default"
						>
							Continue with Google
						</Button>

						<Text c="dimmed" size="sm">
							Already have an account?{" "}
							<Anchor component={Link} fw={600} to="/login">
								Login
							</Anchor>
						</Text>
					</Stack>
				</Paper>
			</Container>
		</Center>
	);
}
