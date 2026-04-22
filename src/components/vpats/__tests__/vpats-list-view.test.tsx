import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('@/components/vpats/vpat-card', () => ({
  VpatCard: () => <div data-testid="vpat-card" />,
}));

import { VpatsListView } from '../vpats-list-view';

const messages = {
  vpats: {
    list: {
      heading: 'VPATs',
      new_button: 'New VPAT',
      empty_title: 'No VPATs yet',
      empty_description:
        'Create a Voluntary Product Accessibility Template to document how your product conforms to WCAG criteria.',
      empty_cta: 'Create VPAT',
      col_title: 'Title',
      col_scope: 'Scope',
      col_status: 'Status',
      col_version: 'Version',
      col_updated: 'Updated',
    },
    status: {
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
      reviewed: 'Reviewed',
    },
    card: {
      no_project: 'No project',
      criteria_resolved: '{resolved} of {total} criteria resolved',
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

describe('VpatsListView layout', () => {
  it('renders the New VPAT link', () => {
    renderWithIntl(<VpatsListView vpats={[]} />);
    expect(screen.getByRole('link', { name: /new vpat/i })).toBeInTheDocument();
  });

  it('wraps heading in a labelled section', () => {
    renderWithIntl(<VpatsListView vpats={[]} />);
    const heading = screen.getByRole('heading', { name: 'VPATs' });
    expect(heading).toHaveAttribute('id', 'vpats-heading');
    const section = heading.closest('section')!;
    expect(section).toHaveAttribute('aria-labelledby', 'vpats-heading');
  });

  it('ViewToggle is in the header row with the New VPAT button', () => {
    renderWithIntl(<VpatsListView vpats={[]} />);
    const heading = screen.getByRole('heading', { name: 'VPATs' });
    const headerRow = heading.closest('div')!;
    const viewGroup = screen.getByRole('group', { name: 'View options' });
    expect(headerRow).toContainElement(viewGroup);
  });

  it('does not render an Import from OpenACR button', () => {
    renderWithIntl(<VpatsListView vpats={[]} />);
    expect(screen.queryByRole('button', { name: /import from openacr/i })).not.toBeInTheDocument();
  });
});
