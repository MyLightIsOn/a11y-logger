'use client';
import { ReportSectionList } from './report-section-list';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  onDelete: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

/** Thin wrapper around ReportSectionList — preserves the named export for existing call sites. */
export function QuickWinsSection(props: Props) {
  return <ReportSectionList titleKey="quick_wins_title" placeholderPrefix="Quick win" {...props} />;
}
