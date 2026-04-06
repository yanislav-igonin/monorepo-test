import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "../providers/AppProviders";
import { SignupPage } from "./SignupPage";

const authMocks = vi.hoisted(() => ({
	signInSocial: vi.fn(),
	signUpEmail: vi.fn(),
	useSession: vi.fn(),
}));

vi.mock("../api/auth", () => ({
	authClient: {
		signIn: {
			social: authMocks.signInSocial,
		},
		signUp: {
			email: authMocks.signUpEmail,
		},
		useSession: authMocks.useSession,
	},
}));

function renderSignupPage() {
	const router = createMemoryRouter(
		[
			{
				path: "/signup",
				element: <SignupPage />,
			},
			{
				path: "/",
				element: <h1>Todos</h1>,
			},
			{
				path: "/login",
				element: <h1>Login</h1>,
			},
		],
		{
			initialEntries: ["/signup"],
		},
	);

	return render(
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>,
	);
}

describe("SignupPage", () => {
	beforeEach(() => {
		authMocks.signInSocial.mockReset();
		authMocks.signUpEmail.mockReset();
		authMocks.useSession.mockReset();
		authMocks.useSession.mockReturnValue({
			data: null,
			isPending: false,
		});
	});

	it("redirects to the todos index after a successful email signup", async () => {
		authMocks.signUpEmail.mockResolvedValueOnce({
			error: null,
		});

		renderSignupPage();

		fireEvent.change(screen.getByPlaceholderText("Jane Doe"), {
			target: { value: "Jane Doe" },
		});
		fireEvent.change(screen.getByPlaceholderText("user@example.com"), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Create a password"), {
			target: { value: "hunter2" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Create account" }));

		await waitFor(() => {
			expect(authMocks.signUpEmail).toHaveBeenCalledWith({
				name: "Jane Doe",
				email: "user@example.com",
				password: "hunter2",
			});
		});

		expect(
			await screen.findByRole("heading", { name: "Todos" }),
		).toBeInTheDocument();
	});

	it("shows field validation before sending the signup request", async () => {
		renderSignupPage();

		fireEvent.change(screen.getByPlaceholderText("Jane Doe"), {
			target: { value: "Jane Doe" },
		});
		fireEvent.change(screen.getByPlaceholderText("user@example.com"), {
			target: { value: "not-an-email" },
		});
		fireEvent.change(screen.getByPlaceholderText("Create a password"), {
			target: { value: "hunter2" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Create account" }));

		expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
		expect(authMocks.signUpEmail).not.toHaveBeenCalled();
	});

	it("shows an authentication error returned by the email signup request", async () => {
		authMocks.signUpEmail.mockResolvedValueOnce({
			error: {
				message: "Email already exists",
			},
		});

		renderSignupPage();

		fireEvent.change(screen.getByPlaceholderText("Jane Doe"), {
			target: { value: "Jane Doe" },
		});
		fireEvent.change(screen.getByPlaceholderText("user@example.com"), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Create a password"), {
			target: { value: "hunter2" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Create account" }));

		expect(await screen.findByText("Email already exists")).toBeInTheDocument();
	});

	it("starts the Google signup flow", async () => {
		authMocks.signInSocial.mockResolvedValueOnce(undefined);

		renderSignupPage();

		fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

		await waitFor(() => {
			expect(authMocks.signInSocial).toHaveBeenCalledWith({
				provider: "google",
				callbackURL: "/",
			});
		});
	});

	it("redirects away from /signup when a session already exists", async () => {
		authMocks.useSession.mockReturnValue({
			data: {
				session: {
					id: "session-1",
				},
				user: {
					email: "user@example.com",
				},
			},
			isPending: false,
		});

		renderSignupPage();

		expect(
			await screen.findByRole("heading", { name: "Todos" }),
		).toBeInTheDocument();
	});
});
