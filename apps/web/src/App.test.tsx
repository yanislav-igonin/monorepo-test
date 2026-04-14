import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { AppProviders } from "./providers/AppProviders";

const authMocks = vi.hoisted(() => ({
	signOut: vi.fn(),
	useSession: vi.fn(),
}));

vi.mock("./api/auth", () => ({
	authClient: {
		signOut: authMocks.signOut,
		useSession: authMocks.useSession,
	},
}));

function renderApp(initialEntries: string[] = ["/"]) {
	const router = createMemoryRouter(
		[
			{
				path: "/login",
				element: <h1>Login</h1>,
			},
			{
				path: "/",
				element: <App />,
				children: [
					{
						index: true,
						element: <h1>Todos</h1>,
					},
					{
						path: "about",
						element: <h1>About</h1>,
					},
				],
			},
		],
		{
			initialEntries,
		},
	);

	return render(
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>,
	);
}

describe("App", () => {
	beforeEach(() => {
		authMocks.signOut.mockReset();
		authMocks.useSession.mockReset();
		authMocks.useSession.mockReturnValue({
			data: {
				user: {
					email: "user@example.com",
				},
			},
			isPending: false,
		});
	});

	it("renders the authenticated shell and allows navigation between pages", async () => {
		renderApp();

		expect(screen.getAllByText("user@example.com").length).toBeGreaterThan(0);
		expect(
			screen.getByRole("button", { name: "Toggle Sidebar" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Todos/ })).toBeInTheDocument();

		fireEvent.click(screen.getByRole("link", { name: /About/ }));

		expect(
			await screen.findByRole("heading", { name: "About" }),
		).toBeInTheDocument();
	});

	it("signs out the current user and redirects to login", async () => {
		authMocks.signOut.mockResolvedValueOnce(undefined);

		renderApp();

		fireEvent.click(screen.getByRole("button", { name: "Log out" }));

		await waitFor(() => {
			expect(authMocks.signOut).toHaveBeenCalledTimes(1);
		});

		expect(
			await screen.findByRole("heading", { name: "Login" }),
		).toBeInTheDocument();
	});
});
