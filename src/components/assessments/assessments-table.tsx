'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SortableTable } from '@/components/ui/sortable-table';
import { AssessmentStatusBadge } from '@/components/assessments/assessment-status-badge';
import type { AssessmentWithCounts } from '@/lib/db/assessments';

interface AssessmentsTableProps {
  assessments: AssessmentWithCounts[];
  projectId: string;
}

export function AssessmentsTable({ assessments, projectId }: AssessmentsTableProps) {
  const t = useTranslations('assessments.table');
  const columns = [
    {
      key: 'name' as const,
      label: t('col_name'),
      render: (row: AssessmentWithCounts) => (
        <Link
          href={`/projects/${projectId}/assessments/${row.id}`}
          className="font-medium hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'status' as const,
      label: t('col_status'),
      render: (row: AssessmentWithCounts) => <AssessmentStatusBadge status={row.status} />,
    },
    {
      key: 'issue_count' as const,
      label: t('col_issues'),
      render: (row: AssessmentWithCounts) => row.issue_count,
    },
  ];

  return (
    <SortableTable
      columns={columns}
      rows={assessments}
      defaultSortKey="name"
      defaultSortDir="desc"
      getKey={(r) => r.id}
      emptyMessage={t('empty')}
    />
  );
}
