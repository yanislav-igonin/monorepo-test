import { Container, Paper, Stack, Text, Title } from "../components/ui";

export function AboutPage() {
	return (
		<Container px={0} size="md">
			<Stack gap="lg">
				<div>
					<Text c="dimmed" fw={600} size="xs" tt="uppercase">
						About
					</Text>
					<Title order={1}>About</Title>
				</div>

				<Paper p="lg" withBorder>
					<Stack gap="sm">
						<Text fw={600}>Minimal todo app with a shared contract.</Text>
						<Text c="dimmed" size="sm">
							The web client talks to the API through ORPC, and both sides stay
							in sync through the shared schemas in `packages/shared`.
						</Text>
						<Text c="dimmed" size="sm">
							The API base URL still comes from `VITE_API_URL`, while this page
							shares the same authenticated shell and layout as the rest of the
							workspace.
						</Text>
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
}
