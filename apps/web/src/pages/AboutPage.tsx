import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";

export function AboutPage() {
	return (
		<div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
			<section className="rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur">
				<p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
					About
				</p>
				<div className="mt-4 space-y-3">
					<h1 className="text-3xl font-semibold tracking-tight text-foreground">
						About
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
						Minimal todo app with a shared contract. Web and API stay aligned
						through shared ORPC schemas, so the interface can move fast without
						guessing request shapes.
					</p>
				</div>
			</section>

			<div className="grid gap-4">
				<Card className="border-border/70 bg-card/95 shadow-sm">
					<CardHeader>
						<CardTitle>Shared contract</CardTitle>
						<CardDescription>One schema source for client and server.</CardDescription>
					</CardHeader>
					<CardContent className="text-sm leading-6 text-muted-foreground">
						The web client talks to the API through ORPC, and both sides stay in
						sync through the shared schemas in `packages/shared`.
					</CardContent>
				</Card>

				<Card className="border-border/70 bg-card/95 shadow-sm">
					<CardHeader>
						<CardTitle>Same runtime flow</CardTitle>
						<CardDescription>UI changed. App behavior did not.</CardDescription>
					</CardHeader>
					<CardContent className="text-sm leading-6 text-muted-foreground">
						The API base URL still comes from `VITE_API_URL`, while this page
						uses the same authenticated shell and layout as the rest of the
						workspace.
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
