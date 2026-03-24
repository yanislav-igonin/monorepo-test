import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const authMocks = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("../api/auth", () => ({
  authClient: {
    signIn: {
      email: authMocks.signInEmail,
    },
    useSession: authMocks.useSession,
  },
}));

function renderLoginPage() {
  const router = createMemoryRouter(
    [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <h1>Todos</h1>,
      },
    ],
    {
      initialEntries: ["/login"],
    },
  );

  return render(<RouterProvider router={router} />);
}

describe("LoginPage", () => {
  beforeEach(() => {
    authMocks.signInEmail.mockReset();
    authMocks.useSession.mockReset();
    authMocks.useSession.mockReturnValue({
      data: null,
      isPending: false,
    });
  });

  it("redirects to the todos index after a successful email login", async () => {
    authMocks.signInEmail.mockResolvedValueOnce({
      error: null,
    });

    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "hunter2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(authMocks.signInEmail).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "hunter2",
        callbackURL: "/",
      });
    });

    expect(await screen.findByRole("heading", { name: "Todos" })).toBeInTheDocument();
  });

  it("redirects away from /login when a session already exists", async () => {
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

    renderLoginPage();

    expect(await screen.findByRole("heading", { name: "Todos" })).toBeInTheDocument();
  });
});
