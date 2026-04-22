'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SortableTable } from '@/components/ui/sortable-table';
import { AssessmentStatusBadge } from '@/components/assessments/assessment-status-badge';
import type { AssessmentWithProject } from '@/lib/db/assessments';

interface AllAssessmentsTableProps {
  assessments: AssessmentWithProject[];
}

export function AllAssessmentsTable({ assessments }: AllAssessmentsTableProps) {
  const t = useTranslations('assessments.table');
  const columns = [
    {
      key: 'name' as const,
      label: t('col_name'),
      render: (row: AssessmentWithProject) => (
        <Link
          href={`/projects/${row.project_id}/assessments/${row.id}`}
          className="font-medium hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'project_name' as const,
      label: t('col_project'),
      render: (row: AssessmentWithProject) => (
        <Link
          href={`/projects/${row.project_id}`}
          className="hover:underline text-muted-foreground"
        >
          {row.project_name}
        </Link>
      ),
    },
    {
      key: 'status' as const,
      label: t('col_status'),
      render: (row: AssessmentWithProject) => <AssessmentStatusBadge status={row.status} />,
    },
    {
      key: 'issue_count' as const,
      label: t('col_issues'),
      render: (row: AssessmentWithProject) => row.issue_count,
    },
  ];

  return (
    <SortableTable
      columns={columns}
      rows={assessments}
      defaultSortKey="created_at"
      defaultSortDir="desc"
      getKey={(r) => r.id}
      emptyMessage={t('empty')}
    />
  );
}
