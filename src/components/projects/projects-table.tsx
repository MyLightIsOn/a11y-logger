'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SortableTable } from '@/components/ui/sortable-table';
import type { ProjectWithCounts } from '@/lib/db/projects';

interface ProjectsTableProps {
  projects: ProjectWithCounts[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const t = useTranslations('projects.table');
  const columns = [
    {
      key: 'name' as const,
      label: t('col_name'),
      className: 'w-[30%]',
      cellClassName: 'max-w-0',
      render: (row: ProjectWithCounts) => (
        <Link href={`/projects/${row.id}`} className="font-medium hover:underline truncate block">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'description' as const,
      label: t('col_description'),
      className: 'w-[50%]',
      cellClassName: 'max-w-0',
      render: (row: ProjectWithCounts) => (
        <span className="text-muted-foreground text-sm truncate block">
          {row.description ?? '—'}
        </span>
      ),
    },
    {
      key: 'assessment_count' as const,
      label: t('col_assessments'),
      className: 'w-[10%] text-center',
      cellClassName: 'text-center',
      render: (row: ProjectWithCounts) => row.assessment_count,
    },
    {
      key: 'issue_count' as const,
      label: t('col_issues'),
      className: 'w-[10%] text-center',
      cellClassName: 'text-center',
      render: (row: ProjectWithCounts) => row.issue_count,
    },
  ];

  return (
    <SortableTable
      columns={columns}
      rows={projects}
      defaultSortKey="name"
      defaultSortDir="asc"
      getKey={(r) => r.id}
      emptyMessage={t('empty')}
    />
  );
}
