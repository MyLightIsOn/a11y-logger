export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/db/projects';
import { getAssessments } from '@/lib/db/assessments';
import { ReportWizard } from '@/components/reports/report-wizard';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default async function NewReportPage() {
  const t = await getTranslations('reports.new');
  const tNav = await getTranslations('reports.list');

  const rawProjects = await getProjects();
  const projects = rawProjects.map((p) => ({ id: p.id, name: p.name }));
  const assessments = (
    await Promise.all(
      projects.map((p) =>
        getAssessments(p.id).then((list) =>
          list.map((a) => ({
            id: a.id,
            project_id: a.project_id,
            name: a.name,
            status: a.status,
          }))
        )
      )
    )
  ).flat();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: tNav('page_title'), href: '/reports' }, { label: t('page_title') }]}
      />
      <h1 className="text-2xl font-bold mb-6">{t('page_title')}</h1>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold mb-2">{t('no_projects_heading')}</h2>
          <p className="text-muted-foreground mb-4">{t('no_projects_description')}</p>
          <Link href="/projects/new" className="text-primary hover:underline">
            {t('create_project_link')}
          </Link>
        </div>
      ) : (
        <ReportWizard projects={projects} assessments={assessments} />
      )}
    </div>
  );
}
