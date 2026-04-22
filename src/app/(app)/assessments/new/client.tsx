'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { AssessmentForm } from '@/components/assessments/assessment-form';
import type { AssessmentFormData } from '@/lib/validators/assessments';

const FORM_ID = 'new-assessment-form';

interface Props {
  projects: { id: string; name: string }[];
}

export default function NewAssessmentClient({ projects }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations('assessments.new');
  const tToast = useTranslations('assessments.toast');
  const tNav = useTranslations('assessments.list');

  const handleSubmit = async (data: AssessmentFormData) => {
    if (!data.project_id) {
      toast.error(t('project_required'));
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = { name: data.name, status: data.status };
      if (data.description) payload.description = data.description;
      if (data.test_date_start)
        payload.test_date_start = new Date(data.test_date_start).toISOString();
      if (data.test_date_end) payload.test_date_end = new Date(data.test_date_end).toISOString();

      const res = await fetch(`/api/projects/${data.project_id}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(tToast('created'));
      router.push(`/projects/${data.project_id}/assessments/${json.data.id}`);
    } catch {
      toast.error(tToast('create_failed'));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: tNav('page_title'), href: '/assessments' }, { label: t('page_title') }]}
      />
      <h1 className="text-2xl font-bold">{t('page_title')}</h1>
      <Card>
        <CardContent>
          <AssessmentForm
            onSubmit={handleSubmit}
            loading={loading}
            projects={projects}
            externalButtons={FORM_ID}
          />
        </CardContent>
      </Card>
      <div className="flex items-center gap-2">
        <Button type="submit" form={FORM_ID} disabled={loading}>
          <Save className="h-4 w-4" />
          {loading ? t('saving') : t('save_button')}
        </Button>
        <Button asChild variant="cancel">
          <Link href="/assessments">
            <X className="h-4 w-4" />
            {t('cancel_button')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
