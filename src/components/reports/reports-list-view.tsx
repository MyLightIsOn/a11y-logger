'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ViewToggle } from '@/components/ui/view-toggle';
import { ReportCard } from '@/components/reports/report-card';
import { getStatusBadgeClass } from '@/components/reports/report-badge-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Report } from '@/lib/db/reports';

interface ReportsListViewProps {
  reports: Report[];
}

export function ReportsListView({ reports }: ReportsListViewProps) {
  const t = useTranslations('reports.list');
  const tTable = useTranslations('reports.table');
  const [view, setView] = useState<'grid' | 'table'>('table');

  return (
    <div className="p-6 space-y-6">
      <section aria-labelledby="reports-heading">
        <div className="flex items-center justify-between">
          <h1 id="reports-heading" className="text-lg font-semibold">
            {t('page_title')}
          </h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="success">
              <Link href="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('new_button')}
              </Link>
            </Button>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
      </section>

      {reports.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4">{t('empty_cta_description')}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/reports/new">{t('empty_cta_button')}</Link>
          </Button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tTable('col_title')}</TableHead>
                  <TableHead>{tTable('col_status')}</TableHead>
                  <TableHead>{tTable('col_updated')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Link href={`/reports/${report.id}`} className="font-medium hover:underline">
                        {report.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(report.status)}>
                        {report.status === 'published'
                          ? tTable('status_published')
                          : tTable('status_draft')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(report.updated_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
