import type { ContractRouterClient } from "@orpc/contract";
import { oc } from "@orpc/contract";
import { z } from "zod";
import {
	createTodoBodySchema,
	todoIdParamSchema,
	todoListSchema,
	todoSchema,
	updateTodoInputSchema,
} from "./schemas.js";

export const todoContract = {
	todos: {
		list: oc.input(z.object({})).output(todoListSchema),
		create: oc.input(createTodoBodySchema).output(todoSchema),
		update: oc.input(updateTodoInputSchema).output(todoSchema),
		remove: oc.input(todoIdParamSchema).output(z.void()),
	},
};

export type TodoOrpcClient = ContractRouterClient<typeof todoContract>;
