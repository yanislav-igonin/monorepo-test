import { useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createAppQueryClient } from "../api/query-client";
import { AppProviders } from "./AppProviders";

function ClientProbe({ onClient }: { onClient: (client: QueryClient) => void }) {
  const client = useQueryClient();

  onClient(client);

  return null;
}

describe("createAppQueryClient", () => {
  it("uses retry false and refetchOnWindowFocus false defaults", () => {
    const client = createAppQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.retry).toBe(false);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.queries?.staleTime).toBe(0);
    expect(defaults.mutations?.retry).toBe(false);
  });
});

describe("AppProviders", () => {
  it("renders children with a single query client instance", () => {
    const clients: QueryClient[] = [];

    const { rerender } = render(
      <AppProviders>
        <ClientProbe onClient={(client) => clients.push(client)} />
      </AppProviders>,
    );

    rerender(
      <AppProviders>
        <ClientProbe onClient={(client) => clients.push(client)} />
      </AppProviders>,
    );

    expect(clients).toHaveLength(2);
    expect(clients[0]).toBe(clients[1]);
  });
});
