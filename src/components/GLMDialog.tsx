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

export function GLMDialog(props: {
	opened: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const { t } = useTranslation();
	const [apiKey, setApiKey] = useState("");
	const [selectedRegion, setSelectedRegion] = useState("china-mainland");
	const createConfigMutation = useCreateConfig();
	const setCurrentConfigMutation = useSetCurrentConfig();

	const isZai = selectedRegion === "z-ai";

	const handleCreateConfig = async () => {
		if (!apiKey.trim()) {
			return;
		}

		try {
			const baseUrl = isZai
				? "https://api.z.ai/api/anthropic"
				: "https://open.bigmodel.cn/api/anthropic";

			const store = await createConfigMutation.mutateAsync({
				title: isZai ? t("glm.zaiTitle") : t("glm.zhipuTitle"),
				settings: {
					env: {
						ANTHROPIC_AUTH_TOKEN: apiKey.trim(),
						ANTHROPIC_BASE_URL: baseUrl,
						ANTHROPIC_MODEL: "GLM-4.6",
						ANTHROPIC_DEFAULT_OPUS_MODEL: "GLM-4.6",
						ANTHROPIC_DEFAULT_SONNET_MODEL: "GLM-4.6",
						ANTHROPIC_DEFAULT_HAIKU_MODEL: "GLM-4.5-Air",
					},
				},
			});

			await setCurrentConfigMutation.mutateAsync(store.id);
			props.onClose();
			setApiKey("");
			setSelectedRegion("china-mainland");
			props.onSuccess?.();
		} catch (error) {
			console.error("Failed to create GLM config:", error);
		}
	};

	return (
		<Modal
			centered
			opened={props.opened}
			onClose={props.onClose}
			title={isZai ? t("glm.configZai") : t("glm.configZhipu")}
			radius="lg"
		>
			<Stack gap="lg">
				<Text size="sm" c="dimmed">
					{t("glm.description", {
						provider: isZai ? "Z.ai" : t("glm.zhipu"),
					})}
				</Text>

				<NativeSelect
					label={t("glm.region") as string}
					value={selectedRegion}
					onChange={(e) => setSelectedRegion(e.target.value)}
					data={[
						{ value: "china-mainland", label: t("glm.chinaMainland") },
						{ value: "z-ai", label: t("glm.international") },
					]}
					radius="md"
				/>

				<Stack gap="xs">
					<Text size="sm" fw={500}>
						{t("glm.step1")}
					</Text>
					<Anchor
						size="sm"
						onClick={() => {
							const url = isZai
								? "https://z.ai/subscribe?ic=EBGYZCJRYJ"
								: "https://www.bigmodel.cn/claude-code?ic=UP1VEQEATH";
							openUrl(url);
						}}
						style={{ cursor: "pointer" }}
					>
						<ExternalLinkIcon size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
						{t("glm.buyFromOfficial")}
					</Anchor>
					<Text size="xs" c="dimmed">
						{t("glm.discount")}
					</Text>
				</Stack>

				<Stack gap="xs">
					<Text size="sm" fw={500}>
						{t("glm.step2")}
					</Text>
					<Anchor
						size="sm"
						onClick={() => {
							const url = isZai
								? "https://z.ai/manage-apikey/apikey-list"
								: "https://bigmodel.cn/usercenter/proj-mgmt/apikeys";
							openUrl(url);
						}}
						style={{ cursor: "pointer" }}
					>
						<ExternalLinkIcon size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
						{t("glm.enterConsole")}
					</Anchor>
				</Stack>

				<PasswordInput
					label={t("glm.step3")}
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
					placeholder={
						isZai
							? t("glm.zaiApiKeyPlaceholder")
							: t("glm.zhipuApiKeyPlaceholder")
					}
					radius="md"
				/>

				<Button
					fullWidth
					radius="md"
					onClick={handleCreateConfig}
					disabled={!apiKey.trim() || createConfigMutation.isPending}
					loading={createConfigMutation.isPending}
				>
					{t("glm.createConfig")}
				</Button>
			</Stack>
		</Modal>
	);
}
