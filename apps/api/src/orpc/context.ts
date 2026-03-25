import { auth } from "../auth.js";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface ORPCContext {
	session: Session;
}

export async function createORPCContext(
	request: Request,
): Promise<ORPCContext> {
	const session = await auth.api.getSession({ headers: request.headers });
	return { session };
}
