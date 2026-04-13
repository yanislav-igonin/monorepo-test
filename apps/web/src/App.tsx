import { useEffect } from "react";
import { Info, ListTodo, LogOut } from "lucide-react";
import {
	NavLink as RouterNavLink,
	Outlet,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { authClient } from "./api/auth";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
} from "./components/ui/sidebar";

type NavigationItem = {
	to: string;
	label: string;
	end?: boolean;
	icon: typeof ListTodo;
};

const navigationItems: NavigationItem[] = [
	{ to: "/", label: "Todos", end: true, icon: ListTodo },
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

	useEffect(() => {
		if (!isPending && !session) {
			void navigate("/login");
		}
	}, [session, isPending, navigate]);

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4 text-sm text-muted-foreground">
				Loading workspace
			</div>
		);
	}

	if (!session) return null;

	const email = session.user.email ?? "Unknown user";
	const profileLabel = session.user.name?.trim() || email;
	const activeItem =
		navigationItems.find((item) =>
			item.end
				? location.pathname === item.to
				: location.pathname.startsWith(item.to),
		) ?? navigationItems[0];

	async function handleLogout() {
		await authClient.signOut();
		void navigate("/login");
	}

	return (
		<SidebarProvider defaultOpen>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="flex items-center gap-3 px-2 py-1">
						<Avatar>
							<AvatarFallback>{getInitials(profileLabel)}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 group-data-[collapsible=icon]:hidden">
							<p className="truncate text-sm font-medium text-sidebar-foreground">
								{profileLabel}
							</p>
							<p className="truncate text-xs text-sidebar-foreground/70">
								{email}
							</p>
						</div>
					</div>
				</SidebarHeader>

				<SidebarSeparator />

				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							{navigationItems.map((item) => {
								const isActive = item.end
									? location.pathname === item.to
									: location.pathname.startsWith(item.to);
								const Icon = item.icon;

								return (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.label}
										>
											<RouterNavLink end={item.end} to={item.to}>
												<Icon aria-hidden="true" />
												<span>{item.label}</span>
											</RouterNavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>

				<SidebarSeparator />

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={() => void handleLogout()}
								tooltip="Log out"
							>
								<LogOut aria-hidden="true" />
								<span>Log out</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>

			<SidebarInset>
				<header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
					<SidebarTrigger />
					<div className="min-w-0">
						<p className="text-sm font-medium text-foreground">{activeItem.label}</p>
					</div>
					<div className="ml-auto hidden truncate text-sm text-muted-foreground sm:block">
						{email}
					</div>
					<Button
						aria-label="Sign out"
						className="sm:hidden"
						size="icon-sm"
						type="button"
						variant="ghost"
						onClick={() => void handleLogout()}
					>
						<LogOut aria-hidden="true" />
					</Button>
				</header>

				<main className="flex-1 px-4 py-6 md:px-6">
					<div className="mx-auto w-full max-w-4xl">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
