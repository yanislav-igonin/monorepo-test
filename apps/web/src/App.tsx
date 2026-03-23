import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authClient } from "./api/auth";

export function App() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      void navigate("/login");
    }
  }, [session, isPending, navigate]);

  if (isPending) return <p>Loading…</p>;
  if (!session) return null;

  async function handleLogout() {
    await authClient.signOut();
    void navigate("/login");
  }

  return (
    <div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Todos
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          About
        </NavLink>
        <span style={{ marginLeft: "auto" }}>{session.user.email}</span>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
