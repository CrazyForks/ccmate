import { openUrl } from "@tauri-apps/plugin-opener";
import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateConfig, useSetCurrentConfig } from "@/lib/query";
import {
	Anchor,
	Button,
	Modal,
	NativeSelect,
	PasswordInput,
	Stack,
	Text,
} from "@mantine/core";

export function MiniMaxDialog(props: {
	opened: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const { t } = useTranslation();
	const [apiKey, setApiKey] = useState("");
	const [selectedRegion, setSelectedRegion] = useState("china-mainland");
	const createConfigMutation = useCreateConfig();
	const setCurrentConfigMutation = useSetCurrentConfig();

	const isInternational = selectedRegion === "international";

	const handleCreateConfig = async () => {
		if (!apiKey.trim()) {
			return;
		}

		try {
			const baseUrl = isInternational
				? "https://api.minimax.io/anthropic"
				: "https://api.minimaxi.com/anthropic";

			const store = await createConfigMutation.mutateAsync({
				title: isInternational
					? t("minimax.internationalTitle")
					: t("minimax.mainlandTitle"),
				settings: {
					env: {
						ANTHROPIC_AUTH_TOKEN: apiKey.trim(),
						ANTHROPIC_BASE_URL: baseUrl,
						API_TIMEOUT_MS: "3000000",
						CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: 1,
						ANTHROPIC_MODEL: "MiniMax-M2",
						ANTHROPIC_SMALL_FAST_MODEL: "MiniMax-M2",
						ANTHROPIC_DEFAULT_SONNET_MODEL: "MiniMax-M2",
						ANTHROPIC_DEFAULT_OPUS_MODEL: "MiniMax-M2",
						ANTHROPIC_DEFAULT_HAIKU_MODEL: "MiniMax-M2",
					},
				},
			});

			await setCurrentConfigMutation.mutateAsync(store.id);
			props.onClose();
			setApiKey("");
			setSelectedRegion("china-mainland");
			props.onSuccess?.();
		} catch (error) {
			console.error("Failed to create MiniMax config:", error);
		}
	};

	return (
		<Modal
			centered
			opened={props.opened}
			onClose={props.onClose}
			title={
				isInternational
					? t("minimax.configInternational")
					: t("minimax.configMainland")
			}
			radius="lg"
		>
			<Stack gap="lg">
				<Text size="sm" c="dimmed">
					{t("minimax.description", {
						provider: isInternational ? "MiniMax" : t("minimax.minimax"),
					})}
				</Text>

				<NativeSelect
					label={t("minimax.region") as string}
					value={selectedRegion}
					onChange={(e) => setSelectedRegion(e.target.value)}
					data={[
						{ value: "china-mainland", label: t("minimax.chinaMainland") },
						{ value: "international", label: t("minimax.international") },
					]}
					radius="md"
				/>

				<Stack gap="xs">
					<Text size="sm" fw={500}>
						{t("minimax.step1")}
					</Text>
					<Anchor
						size="sm"
						onClick={() => {
							const url = isInternational
								? "https://platform.minimax.io/user-center/basic-information/interface-key"
								: "https://platform.minimaxi.com/user-center/basic-information/interface-key";
							openUrl(url);
						}}
						style={{ cursor: "pointer" }}
					>
						<ExternalLinkIcon size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
						{t("minimax.enterConsole")}
					</Anchor>
				</Stack>

				<PasswordInput
					label={t("minimax.step2")}
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
					placeholder={t("minimax.apiKeyPlaceholder")}
					radius="md"
				/>

				<Button
					fullWidth
					radius="md"
					onClick={handleCreateConfig}
					disabled={!apiKey.trim() || createConfigMutation.isPending}
					loading={createConfigMutation.isPending}
				>
					{t("minimax.createConfig")}
				</Button>
			</Stack>
		</Modal>
	);
}
