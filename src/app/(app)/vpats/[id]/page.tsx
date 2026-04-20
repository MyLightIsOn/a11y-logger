'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { History, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { VpatCriteriaTable } from '@/components/vpats/vpat-criteria-table';
import { VpatCoverSheetView } from '@/components/vpats/vpat-cover-sheet-view';
import { VpatSettingsMenu } from '@/components/vpats/vpat-settings-menu';
import { VpatVersionHistoryTable } from '@/components/vpats/vpat-version-history-table';
import type { VpatData } from '@/lib/db/vpats';
import { EDITION_SECTION_KEYS } from '@/lib/vpat-tabs';

/** Maps section key → vpats.tabs translation key */
const SECTION_TAB_KEY: Record<string, string> = {
  A: 'level_a',
  AA: 'level_aa',
  AAA: 'level_aaa',
  Chapter3: 'chapter3',
  Chapter4: 'chapter4',
  Chapter5: 'chapter5',
  Chapter6: 'chapter6',
  Clause4: 'clause4',
  Clause5: 'clause5',
  Clause6: 'clause6',
  Clause7: 'clause7',
  Clause8: 'clause8',
  Clause10: 'clause10',
  Clause11: 'clause11',
  Clause12: 'clause12',
  Clause13: 'clause13',
};

export default function VpatDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const vpatId = params.id;
  const t = useTranslations('vpats');

  const [vpat, setVpat] = useState<VpatData | null>(null);
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [snapshots, setSnapshots] = useState<
    {
      id: string;
      vpat_id: string;
      version_number: number;
      published_at: string;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/vpats/${vpatId}`);
        const json = await res.json();
        if (!json.success) {
          toast.error(t('detail.load_failed'));
          router.push('/vpats');
          return;
        }
        setVpat(json.data);
        setLocale((json.data.locale as string) ?? 'en');
        // Load version history
        try {
          const snapRes = await fetch(`/api/vpats/${vpatId}/versions`);
          const snapJson = await snapRes.json();
          if (snapJson.success) setSnapshots(snapJson.data);
        } catch {
          // non-fatal — version history tab shows empty state
        }
      } catch {
        toast.error(t('detail.load_failed'));
        router.push('/vpats');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [vpatId, router, t]);

  async function handlePublish() {
    if (!vpat) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/vpats/${vpat.id}/publish`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error ?? t('detail.publish_failed'));
        return;
      }
      setVpat((prev) => (prev ? { ...prev, ...json.data } : json.data));
      // Refresh snapshots
      const snapRes = await fetch(`/api/vpats/${vpat.id}/versions`);
      const snapJson = await snapRes.json();
      if (snapJson.success) setSnapshots(snapJson.data);
      toast.success(t('detail.publish_success'));
    } catch {
      toast.error(t('detail.publish_failed'));
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleReview(reviewerName: string) {
    setIsReviewing(true);
    try {
      const res = await fetch(`/api/vpats/${vpatId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_name: reviewerName }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error ?? t('detail.review_failed'));
        return;
      }
      setVpat((prev) => (prev ? { ...prev, ...json.data } : json.data));
      toast.success(t('detail.review_success'));
    } catch {
      toast.error(t('detail.review_failed'));
    } finally {
      setIsReviewing(false);
    }
  }

  async function handleUnpublish() {
    try {
      const res = await fetch(`/api/vpats/${vpatId}/unpublish`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error ?? t('detail.unpublish_failed'));
        return;
      }
      setVpat((prev) => (prev ? { ...prev, ...json.data } : json.data));
      toast.success(t('detail.unpublish_success'));
    } catch {
      toast.error(t('detail.unpublish_failed'));
    }
  }

  async function handleEditPublished() {
    try {
      const res = await fetch(`/api/vpats/${vpatId}/unpublish`, { method: 'POST' });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error ?? t('detail.edit_reset_failed'));
        return;
      }
      router.push(`/vpats/${vpatId}/edit`);
    } catch {
      toast.error(t('detail.edit_reset_failed'));
    }
  }

  if (isLoading)
    return <div className="text-muted-foreground text-sm p-6">{t('detail.loading')}</div>;
  if (!vpat) return null;

  const resolvedCount = vpat.criterion_rows.filter((r) => r.conformance !== 'not_evaluated').length;
  const totalCount = vpat.criterion_rows.length;

  const isPublished = vpat.status === 'published';
  const isReviewed = vpat.status === 'reviewed';

  function getEditionLabel(v: VpatData): string {
    if (v.standard_edition === '508') return t('detail.edition_508');
    if (v.standard_edition === 'EU') return t('detail.edition_eu');
    if (v.standard_edition === 'INT') return t('detail.edition_int');
    return t('detail.edition_wcag', { version: v.wcag_version, level: v.wcag_level });
  }

  const editionLabel = getEditionLabel(vpat);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'VPATs', href: '/vpats' }, { label: vpat.title }]} />

      {/* Header card */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-[4px] border py-6 px-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{vpat.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{editionLabel}</Badge>
              <Badge
                className={
                  isPublished
                    ? 'bg-green-100 border border-green-500 text-primary dark:text-primary-foreground'
                    : isReviewed
                      ? 'bg-blue-100 border border-blue-500 text-primary dark:text-primary-foreground'
                      : 'bg-yellow-100 border border-yellow-500 text-primary dark:text-primary-foreground'
                }
              >
                {isPublished
                  ? t('status.published')
                  : isReviewed
                    ? t('status.reviewed')
                    : t('status.draft')}
              </Badge>
            </div>
            {(isReviewed || isPublished) && vpat.reviewed_by && vpat.reviewed_at && (
              <p className="text-sm text-muted-foreground">
                {t('detail.reviewed_by', {
                  name: vpat.reviewed_by,
                  date: new Date(vpat.reviewed_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <VpatSettingsMenu
              vpatId={vpat.id}
              vpatTitle={vpat.title}
              status={vpat.status as 'draft' | 'reviewed' | 'published'}
              resolvedCount={resolvedCount}
              totalCount={totalCount}
              isPublishing={isPublishing}
              isReviewing={isReviewing}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onReview={handleReview}
              onEdit={handleEditPublished}
              variant="view"
            />
          </div>
        </div>
      </div>

      {(() => {
        const sectionKeys = EDITION_SECTION_KEYS[vpat.standard_edition] ?? ['A', 'AA', 'AAA'];
        return (
          <Tabs defaultValue="cover-sheet">
            <div className="overflow-x-auto overflow-y-hidden mb-4">
              <TabsList variant="segmented" className="flex-nowrap w-max">
                <TabsTrigger value="cover-sheet">
                  <FileText className="h-4 w-4" />
                  {t('tabs.cover_sheet')}
                </TabsTrigger>
                {sectionKeys.map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {SECTION_TAB_KEY[key]
                      ? t(`tabs.${SECTION_TAB_KEY[key]}` as Parameters<typeof t>[0])
                      : key}
                  </TabsTrigger>
                ))}
                <TabsTrigger value="history">
                  <History className="h-4 w-4" />
                  {t('tabs.version_history')}
                  {snapshots.length > 0 && (
                    <span className="ml-1 text-xs opacity-70">({snapshots.length})</span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="cover-sheet">
              <VpatCoverSheetView vpatId={vpatId} />
            </TabsContent>
            {sectionKeys.map((key) => (
              <TabsContent key={key} value={key}>
                <VpatCriteriaTable
                  rows={vpat.criterion_rows}
                  locale={locale}
                  sectionKey={key}
                  onRowChange={() => {}}
                  onSaveRemarks={() => {}}
                  readOnly={true}
                  aiEnabled={false}
                  onCriterionClick={() => {}}
                />
              </TabsContent>
            ))}
            <TabsContent value="history">
              <VpatVersionHistoryTable vpatId={vpatId} snapshots={snapshots} />
            </TabsContent>
          </Tabs>
        );
      })()}
    </div>
  );
}
