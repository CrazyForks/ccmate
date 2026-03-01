import {
	ActivityIcon,
	BellIcon,
	BotIcon,
	BrainIcon,
	CpuIcon,
	FileJsonIcon,
	FolderIcon,
	SettingsIcon,
	TerminalIcon,
} from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { cn, isMacOS } from "../lib/utils";
import { UpdateButton } from "./UpdateButton";

export function Layout() {
	const { t } = useTranslation();

	const navGroups = [
		[
			{ to: "/", icon: FileJsonIcon, label: t("navigation.configurations") },
			{ to: "/projects", icon: FolderIcon, label: t("navigation.projects") },
		],
		[
			{ to: "/mcp", icon: CpuIcon, label: t("navigation.mcp") },
			{ to: "/agents", icon: BotIcon, label: "Agents" },
			{ to: "/memory", icon: BrainIcon, label: t("navigation.memory") },
			{
				to: "/commands",
				icon: TerminalIcon,
				label: t("navigation.commands"),
			},
		],
		[
			{
				to: "/notification",
				icon: BellIcon,
				label: t("navigation.notifications"),
			},
			{ to: "/usage", icon: ActivityIcon, label: t("navigation.usage") },
			{
				to: "/settings",
				icon: SettingsIcon,
				label: t("navigation.settings"),
			},
		],
	];

	const dragRegionStyle = {
		WebkitUserSelect: "none",
		WebkitAppRegion: "drag",
	} as React.CSSProperties;

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<nav
				data-tauri-drag-region
				style={dragRegionStyle}
				className="w-[220px] shrink-0 flex flex-col border-r border-border/40"
			>
				{isMacOS && (
					<div
						data-tauri-drag-region
						className="h-10 shrink-0"
						style={dragRegionStyle}
					/>
				)}
				<div
					className="flex flex-col flex-1 justify-between px-3 pt-1"
					data-tauri-drag-region
				>
					<div>
						{navGroups.map((group, gi) => (
							<div
								key={gi}
								className={cn("space-y-0.5", gi > 0 && "mt-5")}
							>
								{group.map((link) => (
									<NavLink
										key={link.to}
										to={link.to}
										end={link.to === "/"}
										className={({ isActive: active }) =>
											cn(
												"flex items-center gap-3 px-3 py-1.5 text-[13px] rounded-md transition-colors duration-150",
												active
													? "text-foreground font-medium bg-foreground/[0.05]"
													: "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]",
											)
										}
									>
										<link.icon size={16} strokeWidth={1.5} />
										{link.label}
									</NavLink>
								))}
							</div>
						))}
					</div>
					<div className="pb-3">
						<UpdateButton />
					</div>
				</div>
			</nav>

			{/* Main content */}
			<main
				data-tauri-drag-region
				className="flex-1 min-w-0 h-screen overflow-y-auto"
			>
				<Outlet />
			</main>
		</div>
	);
}
