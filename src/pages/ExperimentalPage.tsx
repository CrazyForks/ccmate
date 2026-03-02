import { openUrl } from "@tauri-apps/plugin-opener";
import { ExternalLinkIcon, FlaskConicalIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import {
  Badge,
  Button,
  Group,
  NativeSelect,
  Switch,
  Text,
} from "@mantine/core";
import { useConfigFile, useWriteExperimentalSettings } from "@/lib/query";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="min-w-0 mr-4">
        <Text size="sm">{label}</Text>
        {description && (
          <Text size="xs" c="dimmed" mt={2}>
            {description}
          </Text>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function ExperimentalPage() {
  const { t } = useTranslation();
  const { data: configFile } = useConfigFile("user");
  const { mutate: writeSettings } = useWriteExperimentalSettings();

  const settings = (configFile?.content || {}) as Record<string, any>;
  const env = settings.env || {};
  const isAgentTeamsEnabled = env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === "1";
  const teammateMode = settings.teammateMode || "auto";

  const handleAgentTeamsToggle = (checked: boolean) => {
    const newEnv = { ...env };
    if (checked) {
      newEnv.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1";
    } else {
      delete newEnv.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS;
    }
    writeSettings({
      ...settings,
      env: newEnv,
    });
  };

  const handleTeammateModeChange = (mode: string) => {
    writeSettings({
      ...settings,
      teammateMode: mode,
    });
  };

  return (
    <div>
      <PageHeader title={t("experimental.title")} />
      <div className="px-5">
        <Group gap="xs" mb="md">
          <FlaskConicalIcon size={14} />
          <Text size="sm" c="dimmed">
            {t("experimental.description")}
          </Text>
        </Group>

        <Group mb="lg">
          <Badge color="orange" variant="light" size="sm">
            {t("experimental.warning")}
          </Badge>
        </Group>

        <div className="border border-[var(--mantine-color-default-border)] rounded-lg p-4 mb-4">
          <Group justify="space-between" mb="md">
            <Text fw={500}>{t("experimental.agentTeams.title")}</Text>
            <Button
              variant="subtle"
              size="compact-xs"
              leftSection={<ExternalLinkIcon size={12} />}
              onClick={() =>
                openUrl("https://code.claude.com/docs/en/agent-teams")
              }
            >
              {t("experimental.agentTeams.documentation")}
            </Button>
          </Group>

          <Text size="xs" c="dimmed" mb="md">
            {t("experimental.agentTeams.description")}
          </Text>

          <SettingRow label={t("experimental.agentTeams.enabled")}>
            <Switch
              size="sm"
              checked={isAgentTeamsEnabled}
              onChange={(e) => handleAgentTeamsToggle(e.currentTarget.checked)}
            />
          </SettingRow>

          {isAgentTeamsEnabled && (
            <SettingRow
              label={t("experimental.agentTeams.teammateMode")}
              description={t("experimental.agentTeams.teammateModeDescription")}
            >
              <NativeSelect
                size="xs"
                value={teammateMode}
                onChange={(e) => handleTeammateModeChange(e.currentTarget.value)}
                data={[
                  { label: t("experimental.agentTeams.teammateModeAuto"), value: "auto" },
                  { label: t("experimental.agentTeams.teammateModeInProcess"), value: "in-process" },
                  { label: t("experimental.agentTeams.teammateModeTmux"), value: "tmux" },
                ]}
                w={160}
              />
            </SettingRow>
          )}
        </div>
      </div>
    </div>
  );
}
