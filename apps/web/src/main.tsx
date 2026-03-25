import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { AppProviders } from "./providers/AppProviders";
import "./index.css";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { TodosPage } from "./pages/TodosPage";

const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/signup",
		element: <SignupPage />,
	},
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <TodosPage /> },
			{ path: "about", element: <AboutPage /> },
		],
	},
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error('Root element "root" was not found.');
}

createRoot(rootElement).render(
	<StrictMode>
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	</StrictMode>,
);
