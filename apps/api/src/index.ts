import { serve } from "@hono/node-server";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import { createORPCContext } from "./orpc/context.js";
import { appRouter } from "./orpc/router.js";

const app = new Hono();

app.use(
	"/*",
	cors({
		origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type"],
		credentials: true,
	}),
);

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/rpc/*", async (c, next) => {
	const { matched, response } = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: await createORPCContext(c.req.raw),
	});
	if (matched) {
		return c.newResponse(response.body, response);
	}
	await next();
});

const port = Number(process.env.PORT) || 3001;

serve(
	{
		fetch: app.fetch,
		port,
	},
	(info) => {
		console.log(`API listening on http://localhost:${info.port}`);
	},
);
