import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

vi.mock('@/components/projects/project-card', () => ({
  ProjectCard: () => <div data-testid="project-card" />,
}));
vi.mock('@/components/projects/projects-table', () => ({
  ProjectsTable: () => <div data-testid="projects-table" />,
}));

import { ProjectsListView } from '../projects-list-view';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('ProjectsListView layout', () => {
  it('renders the New Project link', () => {
    renderWithIntl(<ProjectsListView projects={[]} />);
    expect(screen.getByRole('link', { name: /new project/i })).toBeInTheDocument();
  });

  it('ViewToggle is in the header row with the New Project button', () => {
    renderWithIntl(<ProjectsListView projects={[]} />);
    const heading = screen.getByRole('heading', { name: 'Projects' });
    const headerRow = heading.closest('div')!;
    const viewGroup = screen.getByRole('group', { name: 'View options' });
    expect(headerRow).toContainElement(viewGroup);
  });

  it('ViewToggle is rendered on the page', () => {
    renderWithIntl(<ProjectsListView projects={[]} />);
    expect(screen.getByRole('group', { name: 'View options' })).toBeInTheDocument();
  });
});
