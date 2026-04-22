'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { SortableTable } from '@/components/ui/sortable-table';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

interface SnapshotSummary {
  id: string;
  vpat_id: string;
  version_number: number;
  published_at: string;
  created_at: string;
}

interface VpatVersionHistoryTableProps {
  vpatId: string;
  snapshots: SnapshotSummary[];
}

export function VpatVersionHistoryTable({ vpatId, snapshots }: VpatVersionHistoryTableProps) {
  const t = useTranslations('vpats.version_history');
  const columns = [
    {
      key: 'version_number' as const,
      label: t('col_version'),
      render: (row: SnapshotSummary) => (
        <Link
          href={`/vpats/${vpatId}/versions/${row.version_number}`}
          className="font-medium hover:underline"
        >
          v{row.version_number}
        </Link>
      ),
    },
    {
      key: 'published_at' as const,
      label: t('col_published'),
      render: (row: SnapshotSummary) => (
        <span className="text-muted-foreground">{formatDate(row.published_at)}</span>
      ),
    },
    {
      key: 'created_at' as const,
      label: t('col_created_at'),
      render: (row: SnapshotSummary) => (
        <span className="text-muted-foreground">{formatDate(row.created_at)}</span>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        {snapshots.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          <SortableTable
            columns={columns}
            rows={snapshots}
            defaultSortKey="version_number"
            defaultSortDir="desc"
            getKey={(r) => r.id}
            emptyMessage={t('empty')}
          />
        )}
      </CardContent>
    </Card>
  );
}
