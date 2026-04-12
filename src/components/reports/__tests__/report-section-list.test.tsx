import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { ReportSectionList } from '@/components/reports/report-section-list';

const messages = {
  reports: {
    sections: {
      quick_wins_title: 'Quick Wins',
      top_risks_title: 'Top Risks',
      generate_button: 'Generate',
      generating_label: 'Generating…',
      generating_overlay: 'Generating with AI...',
      delete_button: 'Delete',
    },
  },
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('ReportSectionList', () => {
  it('renders 5 numbered inputs', () => {
    renderWithIntl(
      <ReportSectionList
        titleKey="quick_wins_title"
        placeholderPrefix="Quick win"
        items={[]}
        onChange={vi.fn()}
        onDelete={vi.fn()}
        onGenerate={vi.fn()}
        isGenerating={false}
      />
    );
    expect(screen.getAllByRole('textbox')).toHaveLength(5);
  });

  it('renders the correct title from titleKey', () => {
    renderWithIntl(
      <ReportSectionList
        titleKey="top_risks_title"
        placeholderPrefix="Risk"
        items={[]}
        onChange={vi.fn()}
        onDelete={vi.fn()}
        onGenerate={vi.fn()}
        isGenerating={false}
      />
    );
    expect(screen.getByText('Top Risks')).toBeInTheDocument();
  });

  it('uses placeholderPrefix for input placeholders', () => {
    renderWithIntl(
      <ReportSectionList
        titleKey="quick_wins_title"
        placeholderPrefix="Quick win"
        items={[]}
        onChange={vi.fn()}
        onDelete={vi.fn()}
        onGenerate={vi.fn()}
        isGenerating={false}
      />
    );
    expect(screen.getByPlaceholderText('Quick win 1')).toBeInTheDocument();
  });

  it('calls onChange with updated array when item changed', () => {
    const onChange = vi.fn();
    renderWithIntl(
      <ReportSectionList
        titleKey="quick_wins_title"
        placeholderPrefix="Quick win"
        items={['A', 'B']}
        onChange={onChange}
        onDelete={vi.fn()}
        onGenerate={vi.fn()}
        isGenerating={false}
      />
    );
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0]!, { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalledWith(['Updated', 'B', '', '', '']);
  });
});
