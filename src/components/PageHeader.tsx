interface PageHeaderProps {
	title: string;
	description?: string;
	actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div
			className="sticky top-0 z-10 bg-background/80 backdrop-blur-md"
			data-tauri-drag-region
		>
			<div
				className="flex items-center justify-between px-5 pt-5 pb-3"
				data-tauri-drag-region
			>
				<div data-tauri-drag-region>
					<h1
						className="text-base font-semibold tracking-tight"
						data-tauri-drag-region
					>
						{title}
					</h1>
					{description && (
						<p
							className="text-sm text-muted-foreground mt-0.5"
							data-tauri-drag-region
						>
							{description}
						</p>
					)}
				</div>
				{actions && <div className="flex items-center gap-2">{actions}</div>}
			</div>
		</div>
	);
}
