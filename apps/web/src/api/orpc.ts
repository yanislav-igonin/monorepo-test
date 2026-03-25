import type { TodoOrpcClient } from "@monorepo-test/shared";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const baseURL =
	import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

const link = new RPCLink({
	url: `${baseURL}/rpc`,
	fetch(request, init) {
		return fetch(request, {
			...init,
			credentials: "include",
		});
	},
});

export const orpcClient: TodoOrpcClient = createORPCClient(link);
export const orpc = orpcClient;
export const orpcQuery = createTanstackQueryUtils(orpcClient);
