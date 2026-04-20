'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsYaml from 'js-yaml';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { parseOpenAcr, type OpenAcrParseResult } from '@/lib/import/parse-openacr';

type Edition = 'WCAG' | '508' | 'EU' | 'INT' | 'IMPORT';

export default function NewVpatPage() {
  const t = useTranslations('vpats.wizard');
  const router = useRouter();

  const EDITIONS = [
    {
      value: 'WCAG',
      label: t('edition_wcag_label'),
      description: t('edition_wcag_description'),
    },
    {
      value: '508',
      label: t('edition_508_label'),
      description: t('edition_508_description'),
    },
    {
      value: 'EU',
      label: t('edition_eu_label'),
      description: t('edition_eu_description'),
    },
    {
      value: 'INT',
      label: t('edition_int_label'),
      description: t('edition_int_description'),
    },
    {
      value: 'IMPORT',
      label: t('edition_import_label'),
      description: t('edition_import_description'),
    },
  ] as const;

  const PRODUCT_SCOPES = [
    { value: 'web', label: t('scope_web') },
    { value: 'software-desktop', label: t('scope_desktop') },
    { value: 'software-mobile', label: t('scope_mobile') },
    { value: 'documents', label: t('scope_documents') },
    { value: 'hardware', label: t('scope_hardware') },
    { value: 'telephony', label: t('scope_telephony') },
  ];

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [edition, setEdition] = useState<Edition>('WCAG');

  // Step 2 — create flow
  const [wcagVersion, setWcagVersion] = useState<'2.1' | '2.2'>('2.1');
  const [wcagLevel, setWcagLevel] = useState<'A' | 'AA' | 'AAA'>('AA');
  const [productScope, setProductScope] = useState<string[]>(['web']);

  // Step 2 — import flow
  const [yamlString, setYamlString] = useState('');
  const [parsed, setParsed] = useState<OpenAcrParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3 — shared
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectsError, setProjectsError] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((body) => {
        if (body.success) setProjects(body.data);
      })
      .catch(() => {
        setProjectsError(true);
      });
  }, []);

  function toggleScope(value: string) {
    setProductScope((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    setParsed(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const doc = jsYaml.load(text);
        const result = parseOpenAcr(doc);
        if (!result) {
          setParseError(t('invalid_openacr'));
          return;
        }
        setYamlString(text);
        setParsed(result);
      } catch {
        setParseError(t('yaml_parse_error'));
      }
    };
    reader.readAsText(file);
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t('title_required'));
      return;
    }
    if (!projectId) {
      toast.error(t('project_required'));
      return;
    }
    if (productScope.length === 0) {
      toast.error(t('scope_required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        project_id: projectId,
        standard_edition: edition,
        product_scope: productScope,
        description: description.trim() || null,
      };
      if (edition !== '508') payload.wcag_version = wcagVersion;
      if (edition !== '508' && edition !== 'EU') payload.wcag_level = wcagLevel;

      const res = await fetch('/api/vpats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error ?? t('create_failed'));
        return;
      }
      toast.success(t('create_success'));
      router.push(`/vpats/${json.data.id}`);
    } catch {
      toast.error(t('create_failed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleImportSubmit() {
    if (isSubmitting) return;
    if (!projectId) {
      toast.error(t('project_required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vpats/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, yaml: yamlString }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? t('import_failed'));
        return;
      }
      toast.success(t('import_success'));
      router.push(`/vpats/${json.data.id}`);
    } catch {
      toast.error(t('import_failed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'VPATs', href: '/vpats' }, { label: t('page_title') }]} />
      <h1 className="text-2xl font-bold">{t('page_title')}</h1>

      {/* Step 1: Edition */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step1_title')}</CardTitle>
            <CardDescription>{t('step1_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {EDITIONS.map((ed) => (
              <label
                key={ed.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  edition === ed.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="edition"
                  value={ed.value}
                  checked={edition === ed.value}
                  onChange={() => setEdition(ed.value as Edition)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{ed.label}</div>
                  <div className="text-sm text-muted-foreground">{ed.description}</div>
                </div>
              </label>
            ))}
            <div className="flex justify-end pt-2">
              <Button type="button" onClick={() => setStep(2)}>
                {t('next_button')} <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Upload (import flow) */}
      {step === 2 && edition === 'IMPORT' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step2_upload_title')}</CardTitle>
            <CardDescription>{t('step2_upload_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="yaml-file-input">{t('yaml_file_label')}</Label>
              <input
                id="yaml-file-input"
                ref={fileInputRef}
                type="file"
                accept=".yaml,.yml"
                onChange={handleFileChange}
                className="block w-full text-sm mt-1"
              />
            </div>
            {parseError && <p className="text-sm text-destructive">{parseError}</p>}
            {parsed && (
              <div className="rounded border p-3 text-sm space-y-1">
                <p className="font-medium">{parsed.title}</p>
                <p className="text-muted-foreground">
                  {parsed.standard_edition} · WCAG {parsed.wcag_version} · Level {parsed.wcag_level}
                </p>
                <p className="text-muted-foreground">{parsed.criteria.length} criteria</p>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <Button type="button" variant="cancel" onClick={() => setStep(1)}>
                <ChevronLeft /> {t('back_button')}
              </Button>
              <Button type="button" onClick={() => setStep(3)} disabled={!parsed}>
                {t('next_button')} <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Scope (create flow) */}
      {step === 2 && edition !== 'IMPORT' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step2_scope_title')}</CardTitle>
            <CardDescription>{t('step2_scope_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {edition !== '508' && (
              <div className="space-y-1.5">
                <Label htmlFor="wcag-version">{t('wcag_version_label')}</Label>
                <Select
                  value={wcagVersion}
                  onValueChange={(v) => setWcagVersion(v as '2.1' | '2.2')}
                >
                  <SelectTrigger id="wcag-version">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2.1">WCAG 2.1</SelectItem>
                    <SelectItem value="2.2">WCAG 2.2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {edition !== '508' && edition !== 'EU' && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-bold">{t('conformance_level_legend')}</legend>
                {(['A', 'AA', 'AAA'] as const).map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wcag-level"
                      value={lvl}
                      checked={wcagLevel === lvl}
                      onChange={() => setWcagLevel(lvl)}
                    />
                    <span className="text-sm">
                      {lvl === 'A'
                        ? t('level_a_only')
                        : lvl === 'AA'
                          ? t('level_a_aa')
                          : t('level_a_aa_aaa')}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {(edition === '508' || edition === 'EU') && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {t('conformance_locked', {
                  edition: edition === '508' ? t('edition_508_label') : t('edition_eu_label'),
                })}
              </p>
            )}

            <fieldset className="space-y-2">
              <legend className="text-sm font-bold">{t('product_scope_legend')}</legend>
              <p className="text-sm text-muted-foreground">{t('product_scope_description')}</p>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCT_SCOPES.map((scope) => (
                  <label key={scope.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productScope.includes(scope.value)}
                      onChange={() => toggleScope(scope.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{scope.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="cancel" onClick={() => setStep(1)}>
                <ChevronLeft /> {t('back_button')}
              </Button>
              <Button type="button" onClick={() => setStep(3)} disabled={productScope.length === 0}>
                {t('next_button')} <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Project + Confirm (import flow) */}
      {step === 3 && edition === 'IMPORT' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('step3_import_title')}</CardTitle>
            <CardDescription>{t('step3_import_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsed && (
              <div className="rounded border p-3 text-sm space-y-1 bg-muted/30">
                <p className="font-medium">{parsed.title}</p>
                <p className="text-muted-foreground">
                  {parsed.standard_edition} · WCAG {parsed.wcag_version} · Level {parsed.wcag_level}{' '}
                  · {parsed.criteria.length} criteria
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="import-project">
                {t('project_label')} <span className="text-destructive">*</span>
              </Label>
              <select
                id="import-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t('select_project')}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {projectsError && (
                <p className="text-sm text-destructive">{t('projects_load_failed')}</p>
              )}
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="cancel" onClick={() => setStep(2)}>
                <ChevronLeft /> {t('back_button')}
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="cancel" asChild>
                  <Link href="/vpats">{t('cancel_button')}</Link>
                </Button>
                <Button onClick={handleImportSubmit} disabled={!projectId || isSubmitting}>
                  {isSubmitting ? t('importing') : t('import_button')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details (create flow) */}
      {step === 3 && edition !== 'IMPORT' && (
        <form onSubmit={handleCreateSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{t('step3_create_title')}</CardTitle>
              <CardDescription>{t('step3_create_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t('title_label')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('title_placeholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">
                  {t('project_label')} <span className="text-destructive">*</span>
                </Label>
                <select
                  id="project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">{t('select_project')}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {projectsError && (
                  <p className="text-sm text-destructive">{t('projects_load_failed_long')}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('description_label')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('description_placeholder')}
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  {t('back_button')}
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="cancel" asChild>
                    <Link href="/vpats">{t('cancel_button')}</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('creating') : t('create_button')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
