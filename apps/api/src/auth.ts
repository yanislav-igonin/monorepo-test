import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { appConfig } from "./config.js";
import { db } from "./db/index.js";
import * as authSchema from "./db/auth-schema.js";

const googleConfig = appConfig.auth.google;

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
	secret: appConfig.auth.secret,
	baseURL: appConfig.auth.baseUrl,
	trustedOrigins: [appConfig.web.origin],
	emailAndPassword: { enabled: true },
	socialProviders: googleConfig
		? {
				google: {
					clientId: googleConfig.clientId,
					clientSecret: googleConfig.clientSecret,
				},
			}
		: {},
});
