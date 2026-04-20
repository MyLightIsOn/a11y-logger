'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KNOWN_MODELS, AI_TASKS } from '@/lib/ai/models';

interface AIEnvSource {
  provider: string | null;
  apiKey: boolean;
  model: string | null;
  baseUrl: string | null;
}

interface AIConfigSectionProps {
  provider?: string;
  apiKey?: string;
  baseUrl?: string;
  modelIssues?: string;
  modelVpat?: string;
  modelReports?: string;
  modelVpatReview?: string;
  reviewPassEnabled?: boolean;
  envSource?: AIEnvSource;
  onSave: (data: {
    provider: string;
    apiKey: string;
    baseUrl: string;
    modelIssues: string;
    modelVpat: string;
    modelReports: string;
    modelVpatReview: string;
    reviewPassEnabled: boolean;
  }) => Promise<void>;
}

const needsApiKey = (p: string) =>
  ['openai', 'anthropic', 'google', 'openai-compatible'].includes(p);
const needsBaseUrl = (p: string) => ['ollama', 'openai-compatible'].includes(p);

// ─── TaskModelSelector ────────────────────────────────────────────────────────

interface TaskModelSelectorProps {
  id: string;
  label: string;
  description: string;
  provider: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function TaskModelSelector({
  id,
  label,
  description,
  provider,
  value,
  onChange,
  disabled,
}: TaskModelSelectorProps) {
  const t = useTranslations('settings.ai');
  const knownModels = KNOWN_MODELS[provider] ?? [];
  const isCustomValue = value !== '' && !knownModels.some((m) => m.value === value);
  const [showOther, setShowOther] = useState(isCustomValue);

  const PROVIDER_DEFAULT = '__default__';
  const dropdownValue = showOther ? 'other' : value === '' ? PROVIDER_DEFAULT : value;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
      {knownModels.length > 0 ? (
        <>
          <Select
            value={dropdownValue}
            onValueChange={(v) => {
              if (v === 'other') {
                setShowOther(true);
                onChange('');
              } else if (v === PROVIDER_DEFAULT) {
                setShowOther(false);
                onChange('');
              } else {
                setShowOther(false);
                onChange(v);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger id={id} aria-label={label}>
              <SelectValue placeholder={t('provider_default')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PROVIDER_DEFAULT}>{t('provider_default')}</SelectItem>
              {knownModels.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
              <SelectItem value="other">{t('other_model')}</SelectItem>
            </SelectContent>
          </Select>
          {showOther && (
            <Input
              id={`${id}-other`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="model-name"
              aria-label={`${label} custom model name`}
            />
          )}
        </>
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="model-name"
          aria-label={label}
        />
      )}
    </div>
  );
}

// ─── AIConfigSection ──────────────────────────────────────────────────────────

export function AIConfigSection({
  provider = '',
  apiKey = '',
  baseUrl = '',
  modelIssues = '',
  modelVpat = '',
  modelReports = '',
  modelVpatReview = '',
  reviewPassEnabled = false,
  envSource,
  onSave,
}: AIConfigSectionProps) {
  const t = useTranslations('settings.ai');
  const PROVIDERS = [
    { value: 'none', label: t('provider_none') },
    { value: 'openai', label: t('provider_openai') },
    { value: 'anthropic', label: t('provider_anthropic') },
    { value: 'google', label: t('provider_google') },
    { value: 'ollama', label: t('provider_ollama') },
    { value: 'openai-compatible', label: t('provider_compatible') },
  ];
  const [selectedProvider, setSelectedProvider] = useState(envSource?.provider ?? provider);
  const [key, setKey] = useState(apiKey);
  const [selectedBaseUrl, setSelectedBaseUrl] = useState(envSource?.baseUrl ?? baseUrl);
  const [models, setModels] = useState({
    issues: modelIssues,
    vpat: modelVpat,
    reports: modelReports,
    vpat_review: modelVpatReview,
  });
  const [reviewEnabled, setReviewEnabled] = useState(reviewPassEnabled);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasEnvOverride = !!(
    envSource?.provider ||
    envSource?.apiKey ||
    envSource?.model ||
    envSource?.baseUrl
  );
  const providerFromEnv = !!envSource?.provider;

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onSave({
        provider: selectedProvider,
        apiKey: key,
        baseUrl: selectedBaseUrl,
        modelIssues: models.issues,
        modelVpat: models.vpat,
        modelReports: models.reports,
        modelVpatReview: models.vpat_review,
        reviewPassEnabled: reviewEnabled,
      });
    } finally {
      setLoading(false);
    }
  };

  const showTaskModels = selectedProvider && selectedProvider !== 'none';

  return (
    <div className="space-y-4">
      {/* Provider Setup */}
      <Card>
        <CardHeader>
          <CardTitle>{t('heading')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasEnvOverride && (
            <div
              role="alert"
              className="flex gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{t('env_override_note')}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ai-provider">
              {t('provider_label')}
              {providerFromEnv && <EnvBadge />}
            </Label>
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
              disabled={providerFromEnv}
            >
              <SelectTrigger id="ai-provider">
                <SelectValue placeholder={t('select_provider')} />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvider === 'openai-compatible' && (
            <p className="text-sm text-muted-foreground">{t('custom_provider_description')}</p>
          )}

          {needsApiKey(selectedProvider) && (
            <div className="space-y-1.5">
              <Label htmlFor="api-key">
                {t('api_key_label')}{' '}
                {selectedProvider === 'openai-compatible' && (
                  <span className="text-muted-foreground">{t('optional')}</span>
                )}
                {envSource?.apiKey && <EnvBadge />}
              </Label>
              {envSource?.apiKey ? (
                <p className="text-sm text-muted-foreground">{t('set_via_env')}</p>
              ) : (
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={t('api_key_placeholder')}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                    aria-label={showKey ? t('hide_api_key') : t('show_api_key')}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          )}

          {needsBaseUrl(selectedProvider) && (
            <div className="space-y-1.5">
              <Label htmlFor="base-url">
                {t('base_url_label')}
                {envSource?.baseUrl && <EnvBadge />}
              </Label>
              <Input
                id="base-url"
                type="url"
                value={selectedBaseUrl}
                onChange={(e) => setSelectedBaseUrl(e.target.value)}
                disabled={!!envSource?.baseUrl}
                placeholder={
                  selectedProvider === 'ollama'
                    ? t('ollama_base_url_placeholder')
                    : t('base_url_placeholder')
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model per Task */}
      {showTaskModels && (
        <Card>
          <CardHeader>
            <CardTitle>{t('model_per_task_title')}</CardTitle>
            <CardDescription>{t('model_per_task_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AI_TASKS.filter((task) => task.key !== 'vpat_review').map((task) => (
                <TaskModelSelector
                  key={task.key}
                  id={`ai-model-${task.key}`}
                  label={task.label}
                  description={task.description}
                  provider={selectedProvider}
                  value={models[task.key as keyof typeof models]}
                  onChange={(v) => setModels((prev) => ({ ...prev, [task.key]: v }))}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Review Pass */}
      {showTaskModels && (
        <Card>
          <CardHeader>
            <CardTitle>{t('review_pass_title')}</CardTitle>
            <CardDescription>{t('review_pass_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="review-pass-toggle">{t('enable_review_pass')}</Label>
              <Switch
                id="review-pass-toggle"
                checked={reviewEnabled}
                onCheckedChange={setReviewEnabled}
                aria-label={t('enable_review_pass')}
              />
            </div>
            {reviewEnabled && (
              <TaskModelSelector
                id="ai-model-vpat-review"
                label={t('review_pass_model_label')}
                description={t('review_pass_model_description')}
                provider={selectedProvider}
                value={models.vpat_review}
                onChange={(v) => setModels((prev) => ({ ...prev, vpat_review: v }))}
              />
            )}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave}>{loading ? t('save_button_loading') : t('save_button')}</Button>
    </div>
  );
}

function EnvBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400">
      env
    </span>
  );
}
