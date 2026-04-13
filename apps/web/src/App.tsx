import { useEffect, useState } from "react";
import {
	Info,
	ListTodo,
	LogOut,
	Menu,
	PanelLeftClose,
	PanelLeftOpen,
} from "lucide-react";
import {
	NavLink as RouterNavLink,
	Outlet,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { authClient } from "./api/auth";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { Button, buttonVariants } from "./components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "./components/ui/sheet";
import { Separator } from "./components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "./components/ui/tooltip";
import { cn } from "./lib/utils";

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
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		if (!isPending && !session) {
			void navigate("/login");
		}
	}, [session, isPending, navigate]);

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4">
				<div className="flex items-center gap-3 rounded-full border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
					<div className="size-2 animate-pulse rounded-full bg-primary" />
					Loading workspace
				</div>
			</div>
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
		setMobileOpen(false);
		void navigate("/login");
	}

	function closeMobile() {
		setMobileOpen(false);
	}

	function renderNavigation(onNavigate?: () => void) {
		const isCollapsed = onNavigate ? false : sidebarCollapsed;

		return (
			<nav className="flex flex-1 flex-col gap-2">
				{navigationItems.map((item) => {
					const isActive = item.end
						? location.pathname === item.to
						: location.pathname.startsWith(item.to);
					const Icon = item.icon;
					const navItem = (
						<RouterNavLink
							aria-current={isActive ? "page" : undefined}
							aria-label={item.label}
							className={cn(
								buttonVariants({
									variant: isActive ? "secondary" : "ghost",
									size: isCollapsed ? "icon-lg" : "default",
								}),
								"w-full rounded-xl text-sm transition-colors",
								isCollapsed ? "justify-center" : "justify-start px-3",
								isActive &&
									"bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
								!isActive &&
									"text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
							)}
							end={item.end}
							onClick={onNavigate}
							to={item.to}
						>
							<Icon
								aria-hidden="true"
								data-icon={isCollapsed ? undefined : "inline-start"}
							/>
							{isCollapsed ? <span className="sr-only">{item.label}</span> : item.label}
						</RouterNavLink>
					);

					if (!isCollapsed) {
						return <div key={item.to}>{navItem}</div>;
					}

					return (
						<Tooltip key={item.to}>
							<TooltipTrigger asChild>{navItem}</TooltipTrigger>
							<TooltipContent side="right">{item.label}</TooltipContent>
						</Tooltip>
					);
				})}
			</nav>
		);
	}

	function renderSidebar(onNavigate?: () => void) {
		const isCollapsed = onNavigate ? false : sidebarCollapsed;

		return (
			<div className="flex h-full flex-col">
				<div
					className={cn(
						"flex items-center gap-3 px-4 py-5",
						isCollapsed ? "justify-center" : "justify-between",
					)}
				>
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
							<ListTodo aria-hidden="true" />
						</div>
						{!isCollapsed ? (
							<div className="flex flex-col">
								<span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
									Workspace
								</span>
								<span className="text-xs text-sidebar-foreground/65">
									{activeItem.label}
								</span>
							</div>
						) : null}
					</div>

					{!onNavigate ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
									className="hidden md:inline-flex"
									size="icon-sm"
									type="button"
									variant="ghost"
									onClick={() => setSidebarCollapsed((current) => !current)}
								>
									{sidebarCollapsed ? (
										<PanelLeftOpen aria-hidden="true" />
									) : (
										<PanelLeftClose aria-hidden="true" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								{sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							</TooltipContent>
						</Tooltip>
					) : null}
				</div>

				<Separator />

				<div className="flex flex-1 flex-col gap-6 px-3 py-4">
					{renderNavigation(onNavigate)}

					<div className="mt-auto flex flex-col gap-3">
						<div
							className={cn(
								"rounded-2xl border border-sidebar-border bg-background/70 p-3 shadow-sm",
								isCollapsed && "p-2",
							)}
						>
							<div
								className={cn(
									"flex items-center gap-3",
									isCollapsed && "justify-center",
								)}
							>
								<Avatar size="lg">
									<AvatarFallback>{getInitials(profileLabel)}</AvatarFallback>
								</Avatar>
								{!isCollapsed ? (
									<div className="min-w-0">
										<p className="truncate text-sm font-medium text-foreground">
											{profileLabel}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{profileCaption}
										</p>
									</div>
								) : null}
							</div>
						</div>

						<Button
							aria-label="Log out"
							className={cn("w-full rounded-xl", isCollapsed && "px-0")}
							size={isCollapsed ? "icon-lg" : "default"}
							type="button"
							variant="outline"
							onClick={() => void handleLogout()}
						>
							<LogOut
								aria-hidden="true"
								data-icon={isCollapsed ? undefined : "inline-start"}
							/>
							{isCollapsed ? <span className="sr-only">Log out</span> : "Log out"}
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border bg-sidebar/92 backdrop-blur md:flex",
					sidebarCollapsed ? "w-24" : "w-72",
				)}
			>
				{renderSidebar()}
			</aside>

			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetContent
					className="w-80 border-r border-sidebar-border bg-sidebar p-0"
					side="left"
					showCloseButton={false}
				>
					<div className="sr-only">
						<SheetTitle>Navigation</SheetTitle>
						<SheetDescription>Primary workspace navigation</SheetDescription>
					</div>
					{renderSidebar(closeMobile)}
				</SheetContent>
			</Sheet>

			<div
				className={cn(
					"flex min-h-screen flex-col transition-[padding-left] duration-200 md:pl-72",
					sidebarCollapsed && "md:pl-24",
				)}
			>
				<header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
					<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
						<div className="flex items-center gap-3">
							<Button
								aria-label="Open navigation"
								className="md:hidden"
								size="icon-sm"
								type="button"
								variant="outline"
								onClick={() => setMobileOpen(true)}
							>
								<Menu aria-hidden="true" />
							</Button>
							<div>
								<p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
									Workspace
								</p>
								<p className="text-base font-semibold tracking-tight text-foreground">
									{activeItem.label}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Badge className="hidden rounded-full px-3 py-1 text-[11px] md:inline-flex" variant="outline">
								{profileCaption}
							</Badge>
							<div className="hidden min-w-0 text-right sm:block">
								<p className="truncate text-sm font-medium text-foreground">
									{profileLabel}
								</p>
								<p className="truncate text-xs text-muted-foreground">{email}</p>
							</div>
							<Avatar>
								<AvatarFallback>{getInitials(profileLabel)}</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				<main className="flex-1 px-4 py-6 md:px-8 md:py-8">
					<div className="mx-auto w-full max-w-6xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
