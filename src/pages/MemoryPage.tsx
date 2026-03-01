import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { yamlFrontmatter } from "@codemirror/lang-yaml";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { SaveIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClaudeMemory, useWriteClaudeMemory } from "@/lib/query";
import { useCodeMirrorTheme } from "@/lib/use-codemirror-theme";

function MemoryPageSkeleton() {
	return (
		<div className="flex flex-col h-screen">
			<div
				className="sticky top-0 z-10 bg-background/80 backdrop-blur-md"
				data-tauri-drag-region
			>
				<div
					className="flex items-center justify-between px-5 pt-5 pb-3"
					data-tauri-drag-region
				>
					<div data-tauri-drag-region>
						<Skeleton className="h-6 w-16 mb-2" />
						<Skeleton className="h-4 w-64" />
					</div>
					<Skeleton className="h-8 w-16" />
				</div>
			</div>
			<div className="flex-1 px-5 pb-5 overflow-hidden">
				<div className="rounded-lg overflow-hidden border h-full">
					<div className="h-full flex items-center justify-center">
						<div className="space-y-2 w-full max-w-2xl">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function MemoryPageContent() {
	const { t } = useTranslation();
	const { data: memoryData } = useClaudeMemory();
	const { mutate: saveMemory, isPending: saving } = useWriteClaudeMemory();
	const [content, setContent] = useState<string>("");
	const codeMirrorTheme = useCodeMirrorTheme();

	// Update local content when memory data loads
	useEffect(() => {
		if (memoryData?.content) {
			setContent(memoryData.content);
		}
	}, [memoryData]);

	const handleSave = () => {
		saveMemory(content);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		// Cmd+S or Ctrl+S to save
		if ((e.metaKey || e.ctrlKey) && e.key === "s") {
			e.preventDefault();
			handleSave();
		}
	};

	// Add keyboard event listener
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [content]);

	return (
		<div className="flex flex-col h-screen">
			<PageHeader
				title={t("memory.title")}
				description={t("memory.description")}
				actions={
					<Button
						onClick={handleSave}
						disabled={saving}
						variant="default"
						size="sm"
						className="flex items-center gap-2"
					>
						<SaveIcon className="w-4 h-4" />
						{saving ? t("memory.saving") : t("memory.save")}
					</Button>
				}
			/>

			<div className="flex-1 px-5 pb-5 overflow-hidden">
				<div className="rounded-lg overflow-hidden border h-full">
					<CodeMirror
						value={content}
						height="100%"
						extensions={[
							yamlFrontmatter({
								content: markdown({
									base: markdownLanguage,
								}),
							}),
							EditorView.lineWrapping,
						]}
						placeholder="~/.claude/CLAUDE.md"
						onChange={(value) => setContent(value)}
						theme={codeMirrorTheme}
						basicSetup={{
							lineNumbers: false,
							highlightActiveLineGutter: true,
							foldGutter: false,
							dropCursor: false,
							allowMultipleSelections: false,
							indentOnInput: true,
							bracketMatching: true,
							closeBrackets: true,
							autocompletion: true,
							highlightActiveLine: true,
							highlightSelectionMatches: true,
							searchKeymap: false,
						}}
						className="h-full"
						style={{ width: "100%" }}
					/>
				</div>
			</div>
		</div>
	);
}

export function MemoryPage() {
	return (
		<Suspense fallback={<MemoryPageSkeleton />}>
			<MemoryPageContent />
		</Suspense>
	);
}
