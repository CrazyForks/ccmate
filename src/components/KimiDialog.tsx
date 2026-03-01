import { openUrl } from "@tauri-apps/plugin-opener";
import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateConfig, useSetCurrentConfig } from "@/lib/query";
import {
	Anchor,
	Button,
	Modal,
	PasswordInput,
	Stack,
	Text,
} from "@mantine/core";

export function KimiDialog(props: {
	opened: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const { t } = useTranslation();
	const [apiKey, setApiKey] = useState("");
	const createConfigMutation = useCreateConfig();
	const setCurrentConfigMutation = useSetCurrentConfig();

	const handleCreateConfig = async () => {
		if (!apiKey.trim()) {
			return;
		}

		try {
			const store = await createConfigMutation.mutateAsync({
				title: "Kimi For Coding",
				settings: {
					env: {
						ANTHROPIC_API_KEY: apiKey.trim(),
						ANTHROPIC_BASE_URL: "https://api.kimi.com/coding/",
						ANTHROPIC_MODEL: "kimi-for-coding",
						ANTHROPIC_DEFAULT_OPUS_MODEL: "kimi-for-coding",
						ANTHROPIC_DEFAULT_SONNET_MODEL: "kimi-for-coding",
						ANTHROPIC_DEFAULT_HAIKU_MODEL: "kimi-for-coding",
					},
				},
			});

			await setCurrentConfigMutation.mutateAsync(store.id);
			props.onClose();
			setApiKey("");
			props.onSuccess?.();
		} catch (error) {
			console.error("Failed to create Kimi config:", error);
		}
	};

	return (
		<Modal
			centered
			opened={props.opened}
			onClose={props.onClose}
			title={t("kimi.config")}
			radius="lg"
		>
			<Stack gap="lg">
				<Text size="sm" c="dimmed">
					{t("kimi.description")}
				</Text>

				<Stack gap="xs">
					<Text size="sm" fw={500}>
						{t("kimi.step1")}
					</Text>
					<Anchor
						size="sm"
						onClick={() => openUrl("https://www.kimi.com/")}
						style={{ cursor: "pointer" }}
					>
						<ExternalLinkIcon size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
						{t("kimi.goToKimi")}
					</Anchor>
					<Text size="xs" c="dimmed">
						{t("kimi.step1Description")}
					</Text>
				</Stack>

				<Stack gap="xs">
					<Text size="sm" fw={500}>
						{t("kimi.step2")}
					</Text>
					<Text size="xs" c="dimmed">
						{t("kimi.step2Description")}
					</Text>
				</Stack>

				<PasswordInput
					label={t("kimi.step3")}
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
					placeholder={t("kimi.apiKeyPlaceholder")}
					radius="md"
				/>

				<Button
					fullWidth
					radius="md"
					onClick={handleCreateConfig}
					disabled={!apiKey.trim() || createConfigMutation.isPending}
					loading={createConfigMutation.isPending}
				>
					{t("kimi.createConfig")}
				</Button>
			</Stack>
		</Modal>
	);
}
