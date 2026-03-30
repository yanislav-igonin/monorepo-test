import { describe, expect, it } from "vitest";
import { createAppConfig } from "./config.js";

describe("createAppConfig", () => {
	it("applies local defaults", () => {
		const config = createAppConfig({
			BETTER_AUTH_SECRET: "super-secret",
		});

		expect(config.env).toBe("development");
		expect(config.server.port).toBe(3001);
		expect(config.web.origin).toBe("http://localhost:5173");
		expect(config.auth.baseUrl).toBe("http://localhost:3001");
		expect(config.auth.google).toBeNull();
	});

	it("builds nested auth config when google env is present", () => {
		const config = createAppConfig({
			BETTER_AUTH_SECRET: "super-secret",
			GOOGLE_CLIENT_ID: "client-id",
			GOOGLE_CLIENT_SECRET: "client-secret",
		});

		expect(config.auth.google).toEqual({
			clientId: "client-id",
			clientSecret: "client-secret",
		});
	});
});
