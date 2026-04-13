import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createAppQueryClient } from "../api/query-client";
import { TooltipProvider } from "../components/ui/tooltip";

type AppProvidersProps = {
	children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	const [queryClient] = useState(() => createAppQueryClient());

	return (
		<TooltipProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</TooltipProvider>
	);
}
