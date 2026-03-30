import { todoContract } from "@monorepo-test/shared";
import { implement, ORPCError } from "@orpc/server";
import type { ORPCContext, Session } from "./context.js";

const i = implement(todoContract).$context<ORPCContext>();

export type AuthenticatedSession = NonNullable<Session>;

export type AuthenticatedContext = {
	session: AuthenticatedSession;
};

export const protectedRouter = i.use(({ context, next }) => {
	if (!context.session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Unauthorized" });
	}

	return next({
		context: {
			session: context.session,
		},
	});
});

export { i };
