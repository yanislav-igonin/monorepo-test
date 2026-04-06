import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
	Info,
	ListChecks,
	SignOut,
	SidebarSimple,
} from "@phosphor-icons/react";
import { NavLink as RouterNavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "./api/auth";
import {
	ActionIcon,
	AppShell,
	Avatar,
	Burger,
	Button,
	Center,
	Divider,
	Group,
	Loader,
	Stack,
	Text,
	ThemeIcon,
	Tooltip,
	UnstyledButton,
} from "./components/ui";

type NavigationItem = {
	to: string;
	label: string;
	end?: boolean;
	icon: typeof ListChecks;
};

const navigationItems: NavigationItem[] = [
	{ to: "/", label: "Todos", end: true, icon: ListChecks },
	{ to: "/about", label: "About", icon: Info },
];

function getInitials(label: string) {
	const value = label.split("@")[0] ?? label;
	const parts = value.split(/[\s._-]+/).filter(Boolean);
	const initials = parts
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

	return initials || value.slice(0, 2).toUpperCase() || "U";
}

export function App() {
	const { data: session, isPending } = authClient.useSession();
	const location = useLocation();
	const navigate = useNavigate();
	const [mobileOpened, { close: closeMobile, toggle: toggleMobile }] =
		useDisclosure(false);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
	const profileLabel = session.user.name?.trim() || email;
	const profileCaption = session.user.name?.trim() ? email : "Signed in";
	const activeItem =
		navigationItems.find((item) =>
			item.end
				? location.pathname === item.to
				: location.pathname.startsWith(item.to),
		) ?? navigationItems[0];

	async function handleLogout() {
		await authClient.signOut();
		closeMobile();
		void navigate("/login");
	}

	return (
		<AppShell
			header={{ height: 64 }}
			navbar={{
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened },
				width: sidebarCollapsed ? 88 : 248,
			}}
			padding="lg"
		>
			<AppShell.Header>
				<Group h="100%" justify="space-between" px="md">
					<Group gap="sm">
						<Burger
							aria-label={mobileOpened ? "Close navigation" : "Open navigation"}
							hiddenFrom="sm"
							onClick={toggleMobile}
							opened={mobileOpened}
							size="sm"
						/>
						<Stack gap={0}>
							<Text fw={700} size="sm">
								Workspace
							</Text>
							<Text c="dimmed" size="xs">
								{activeItem.label}
							</Text>
						</Stack>
					</Group>

					<Group gap="sm" wrap="nowrap">
						<Group gap="sm" wrap="nowrap">
							<Avatar color="teal" radius="xl" size="sm">
								{getInitials(profileLabel)}
							</Avatar>
							<Stack gap={0} visibleFrom="xs">
								<Text fw={600} size="sm">
									{profileLabel}
								</Text>
								<Text c="dimmed" size="xs">
									{profileCaption}
								</Text>
							</Stack>
						</Group>
						<Button
							leftSection={<SignOut aria-hidden="true" size={16} />}
							onClick={() => void handleLogout()}
							size="xs"
							variant="default"
						>
							Log out
						</Button>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar p="sm">
				<AppShell.Section>
					<Group justify={sidebarCollapsed ? "center" : "space-between"}>
						{sidebarCollapsed ? null : (
							<Stack gap={0}>
								<Text fw={700} size="sm">
									Navigation
								</Text>
								<Text c="dimmed" size="xs">
									Authorized pages
								</Text>
							</Stack>
						)}
						<Tooltip
							disabled={false}
							label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							position="right"
						>
							<ActionIcon
								aria-label={
									sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
								}
								onClick={() => setSidebarCollapsed((current) => !current)}
								size="lg"
								variant="default"
								visibleFrom="sm"
							>
								<SidebarSimple
									aria-hidden="true"
									size={18}
									weight={sidebarCollapsed ? "fill" : "regular"}
								/>
							</ActionIcon>
						</Tooltip>
					</Group>
				</AppShell.Section>

				<Divider my="sm" />

				<AppShell.Section grow>
					<Stack gap="xs">
						{navigationItems.map((item) => {
							const isActive = item.end
								? location.pathname === item.to
								: location.pathname.startsWith(item.to);
							const Icon = item.icon;

							return (
								<Tooltip
									key={item.to}
									disabled={!sidebarCollapsed}
									label={item.label}
									position="right"
								>
									<UnstyledButton
										aria-current={isActive ? "page" : undefined}
										aria-label={item.label}
										component={RouterNavLink}
										end={item.end}
										onClick={closeMobile}
										style={(theme) => ({
											width: "100%",
											display: "block",
											padding: theme.spacing.xs,
											borderRadius: theme.radius.sm,
											color: isActive
												? theme.colors.teal[8]
												: theme.colors.gray[8],
											backgroundColor: isActive
												? theme.colors.teal[0]
												: "transparent",
											border: `1px solid ${
												isActive
													? theme.colors.teal[2]
													: "transparent"
											}`,
											transition:
												"background-color 150ms ease, border-color 150ms ease, color 150ms ease",
										})}
										to={item.to}
									>
										<Group
											gap="sm"
											justify={sidebarCollapsed ? "center" : "flex-start"}
											wrap="nowrap"
										>
											<ThemeIcon
												color={isActive ? "teal" : "gray"}
												radius="md"
												size={36}
												variant={isActive ? "light" : "subtle"}
											>
												<Icon
													aria-hidden="true"
													size={18}
													weight={isActive ? "fill" : "regular"}
												/>
											</ThemeIcon>
											{sidebarCollapsed ? null : (
												<Text fw={600} size="sm">
													{item.label}
												</Text>
											)}
										</Group>
									</UnstyledButton>
								</Tooltip>
							);
						})}
					</Stack>
				</AppShell.Section>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
