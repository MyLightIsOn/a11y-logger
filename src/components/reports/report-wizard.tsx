'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';

interface Project {
  id: string;
  name: string;
}
interface Assessment {
  id: string;
  project_id: string;
  name: string;
  status: string;
}

interface Props {
  projects: Project[];
  assessments: Assessment[];
}

export function ReportWizard({ projects, assessments }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [selectedAssessments, setSelectedAssessments] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const t = useTranslations('reports.wizard');

  const visibleAssessments = assessments.filter((a) => selectedProjects.has(a.project_id));

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error(t('title_required'));
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, assessment_ids: Array.from(selectedAssessments) }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error ?? t('create_failed'));
        return;
      }
      router.push(`/reports/${json.data.id}/edit`);
      router.refresh();
    } catch {
      toast.error(t('create_failed'));
    } finally {
      setIsCreating(false);
    }
  };

  const stepTitle =
    step === 1
      ? t('step_select_projects')
      : step === 2
        ? t('step_select_assessments')
        : t('step_name_report');

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <StepIndicator current={step} />
          <CardTitle className="text-lg">{stepTitle}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label>{t('projects_label')}</Label>
                <MultiSelect
                  options={projects.map((p) => ({ value: p.id, label: p.name }))}
                  selected={Array.from(selectedProjects)}
                  onChange={(values) => {
                    // Remove assessments for deselected projects
                    const removed = Array.from(selectedProjects).filter(
                      (id) => !values.includes(id)
                    );
                    if (removed.length > 0) {
                      const removedAssessmentIds = new Set(
                        assessments.filter((a) => removed.includes(a.project_id)).map((a) => a.id)
                      );
                      setSelectedAssessments((prev) => {
                        const next = new Set(prev);
                        for (const id of removedAssessmentIds) next.delete(id);
                        return next;
                      });
                    }
                    setSelectedProjects(new Set(values));
                  }}
                  placeholder={t('select_projects_placeholder')}
                />
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setStep(2)} disabled={selectedProjects.size === 0}>
                  {t('next_button')}
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label>{t('assessments_label')}</Label>
                <MultiSelect
                  options={visibleAssessments.map((a) => ({ value: a.id, label: a.name }))}
                  selected={Array.from(selectedAssessments)}
                  onChange={(values) => setSelectedAssessments(new Set(values))}
                  placeholder={
                    visibleAssessments.length === 0
                      ? t('no_assessments_placeholder')
                      : t('select_assessments_placeholder')
                  }
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  {t('back_button')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setStep(3)}
                  disabled={selectedAssessments.size === 0}
                >
                  {t('next_button')}
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="report-title">{t('report_title_label')}</Label>
                <Input
                  id="report-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('report_title_placeholder')}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                  {t('back_button')}
                </Button>
                <Button size="sm" onClick={handleCreate} disabled={isCreating || !title.trim()}>
                  {isCreating ? t('creating') : t('create_button')}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  const t = useTranslations('reports.wizard');
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {[1, 2, 3].map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted-foreground/40">—</span>}
          <span
            className={
              current >= n
                ? 'text-foreground font-medium flex items-center gap-1'
                : 'flex items-center gap-1'
            }
          >
            {t('step_label', { n })}
          </span>
        </span>
      ))}
    </div>
  );
}
