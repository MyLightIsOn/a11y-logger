import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/components/projects/project-form', () => ({
  ProjectForm: ({ externalButtons }: { externalButtons?: string }) => (
    <form id={externalButtons} data-testid="project-form" />
  ),
}));

import NewProjectPage from '../page';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>
  );
}

test('renders Save button outside the card', () => {
  renderWithIntl(<NewProjectPage />);
  const btn = screen.getByRole('button', { name: /save project/i });
  expect(btn).toHaveAttribute('type', 'submit');
  expect(btn).toHaveAttribute('form', 'new-project-form');
});

test('renders Cancel link outside the card', () => {
  renderWithIntl(<NewProjectPage />);
  expect(screen.getByRole('link', { name: /cancel/i })).toHaveAttribute('href', '/projects');
});

test('form has the correct id', () => {
  const { container } = renderWithIntl(<NewProjectPage />);
  expect(container.querySelector('form#new-project-form')).toBeInTheDocument();
});
