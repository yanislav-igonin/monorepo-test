type AppConfig = {
	env: string;
	server: {
		port: number;
	};
	web: {
		origin: string;
	};
	auth: {
		secret: string;
		baseUrl: string;
		google:
			| {
					clientId: string;
					clientSecret: string;
			  }
			| null;
	};
};

function createAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
	const googleEnabled =
		Boolean(env.GOOGLE_CLIENT_ID) && Boolean(env.GOOGLE_CLIENT_SECRET);

	return {
		env: env.NODE_ENV || "development",
		server: {
			port: env.PORT ? Number.parseInt(env.PORT, 10) : 3001,
		},
		web: {
			origin: env.WEB_ORIGIN || "http://localhost:5173",
		},
		auth: {
			secret: env.BETTER_AUTH_SECRET || "",
			baseUrl: env.BETTER_AUTH_URL || "http://localhost:3001",
			google: googleEnabled
				? {
						clientId: env.GOOGLE_CLIENT_ID!,
						clientSecret: env.GOOGLE_CLIENT_SECRET!,
					}
				: null,
		},
	};
}

const appConfig = createAppConfig();

export { appConfig, createAppConfig };
export type { AppConfig };
