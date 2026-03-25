import { createAuthClient } from "better-auth/react";

const baseURL =
	import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

export const authClient = createAuthClient({
	baseURL,
	fetchOptions: {
		credentials: "include",
	},
});
