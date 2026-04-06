import { useEffect } from "react";
import {
	NavLink as RouterNavLink,
	Outlet,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { authClient } from "./api/auth";
import {
	AppShell,
	Button,
	Center,
	Group,
	Loader,
	NavLink as MantineNavLink,
	Text,
} from "./components/ui";

type NavigationItem = {
	to: string;
	label: string;
	end?: boolean;
};

const navigationItems: NavigationItem[] = [
	{ to: "/", label: "Todos", end: true },
	{ to: "/about", label: "About" },
];

export function App() {
	const { data: session, isPending } = authClient.useSession();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isPending && !session) {
			void navigate("/login");
		}
	}, [session, isPending, navigate]);

	if (isPending) {
		return (
			<Center mih="100vh">
				<Loader size="sm" />
			</Center>
		);
	}

	if (!session) return null;

	const email = session.user.email ?? "Unknown user";

	async function handleLogout() {
		await authClient.signOut();
		void navigate("/login");
	}

	return (
		<AppShell header={{ height: 60 }} padding="md">
			<AppShell.Header>
				<Group h="100%" justify="space-between" px="md">
					<Group gap="xs">
						{navigationItems.map((item) => {
							const isActive = item.end
								? location.pathname === item.to
								: location.pathname.startsWith(item.to);

							return (
								<MantineNavLink
									key={item.to}
									active={isActive}
									component={RouterNavLink}
									end={item.end}
									label={item.label}
									to={item.to}
									variant="subtle"
								/>
							);
						})}
					</Group>

					<Group gap="sm">
						<Text c="dimmed" size="sm">
							{email}
						</Text>
						<Button onClick={() => void handleLogout()} size="xs" variant="default">
							Log out
						</Button>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
