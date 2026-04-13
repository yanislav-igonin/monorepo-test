export function AboutPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight">About</h1>
				<p className="max-w-2xl text-sm text-muted-foreground">
					Minimal todo app with a shared contract.
				</p>
			</div>

			<section className="space-y-2">
				<h2 className="text-sm font-medium">Shared contract</h2>
				<p className="max-w-2xl text-sm text-muted-foreground">
					The web client talks to the API through ORPC, and both sides stay in
					sync through the shared schemas in `packages/shared`.
				</p>
			</section>

			<section className="space-y-2">
				<h2 className="text-sm font-medium">Runtime</h2>
				<p className="max-w-2xl text-sm text-muted-foreground">
					The API base URL still comes from `VITE_API_URL`, while this page
					shares the same authenticated shell and layout as the rest of the
					workspace.
				</p>
			</section>
		</div>
	);
}
