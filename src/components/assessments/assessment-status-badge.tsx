'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { Assessment } from '@/lib/db/assessments';

const statusClassName: Record<Assessment['status'], string> = {
  ready: 'bg-gray-100 border border-gray-500 text-primary dark:text-primary-foreground',
  in_progress: 'bg-blue-100 border border-blue-500 text-primary dark:text-primary-foreground',
  completed: 'bg-green-100 border border-green-500 text-primary dark:text-primary-foreground',
};

interface AssessmentStatusBadgeProps {
  status: Assessment['status'];
}

export function AssessmentStatusBadge({ status }: AssessmentStatusBadgeProps) {
  const t = useTranslations('assessments.status');
  const className = statusClassName[status] ?? '';
  return <Badge className={className}>{t(status)}</Badge>;
}
