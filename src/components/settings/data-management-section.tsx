'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DataManagementSectionProps {
  dbPath: string;
  mediaPath: string;
}

export function DataManagementSection({ dbPath, mediaPath }: DataManagementSectionProps) {
  const t = useTranslations('settings.data');
  const tToast = useTranslations('settings.toast');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      const res = await fetch('/api/settings/reset', { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setResetConfirm('');
      toast.success(tToast('data_reset_success'));
      window.location.reload();
    } catch {
      toast.error(tToast('data_reset_failed'));
    } finally {
      setResetting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('heading')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="db-path">{t('db_path_label')}</Label>
            <Input id="db-path" value={dbPath} readOnly className="font-mono text-sm bg-muted" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="media-path">{t('media_path_label')}</Label>
            <Input
              id="media-path"
              value={mediaPath}
              readOnly
              className="font-mono text-sm bg-muted"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t.rich('read_only_note', {
              code: (chunks) => <code className="font-mono">{chunks}</code>,
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" disabled>
            {t('export_button')}
          </Button>
          <Button variant="outline" disabled>
            {t('import_button')}
          </Button>
        </div>

        <div className="rounded-lg border border-destructive/50 p-4 space-y-3">
          <h2 className="font-medium text-destructive">{t('danger_zone_heading')}</h2>
          <p className="text-sm text-muted-foreground">{t('danger_zone_description')}</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                {t('clear_button')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('clear_dialog_title')}</AlertDialogTitle>
                <AlertDialogDescription>{t('clear_dialog_description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-1.5">
                <Label htmlFor="reset-confirm">{t('reset_confirm_label')}</Label>
                <Input
                  id="reset-confirm"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  placeholder="RESET"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setResetConfirm('')}>
                  {t('clear_dialog_cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={resetConfirm !== 'RESET' || resetting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleReset}
                >
                  {t('clear_dialog_confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
