import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createAppQueryClient } from "../api/query-client";
import { appTheme } from "../theme/app-theme";

type AppProvidersProps = {
	children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	const [queryClient] = useState(() => createAppQueryClient());

	return (
		<MantineProvider theme={appTheme} defaultColorScheme="light">
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MantineProvider>
	);
}
