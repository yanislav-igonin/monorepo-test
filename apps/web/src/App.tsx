import { NavLink, Outlet } from "react-router-dom";

export function App() {
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
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
