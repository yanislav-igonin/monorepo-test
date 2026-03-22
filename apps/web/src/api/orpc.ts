import type { TodoOrpcClient } from "@monorepo-test/shared";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

const link = new RPCLink({
  url: `${baseURL}/rpc`,
});

export const orpc: TodoOrpcClient = createORPCClient(link);
