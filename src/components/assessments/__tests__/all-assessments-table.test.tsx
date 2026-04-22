import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

import { AllAssessmentsTable } from '../all-assessments-table';
import type { AssessmentWithProject } from '@/lib/db/assessments';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>
  );
}

const assessment: AssessmentWithProject = {
  id: 'a1',
  project_id: 'p1',
  project_name: 'My Project',
  name: 'Q1 Audit',
  description: null,
  test_date_start: null,
  test_date_end: null,
  status: 'ready',
  assigned_to: null,
  created_by: null,
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
  issue_count: 5,
};

test('renders assessment name as link', () => {
  renderWithIntl(<AllAssessmentsTable assessments={[assessment]} />);
  const link = screen.getByRole('link', { name: 'Q1 Audit' });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/projects/p1/assessments/a1');
});

test('renders project name as link', () => {
  renderWithIntl(<AllAssessmentsTable assessments={[assessment]} />);
  const link = screen.getByRole('link', { name: 'My Project' });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/projects/p1');
});

test('renders status badge', () => {
  renderWithIntl(<AllAssessmentsTable assessments={[assessment]} />);
  expect(screen.getByText('Ready')).toBeInTheDocument();
});

test('renders issue count', () => {
  renderWithIntl(<AllAssessmentsTable assessments={[assessment]} />);
  expect(screen.getByText('5')).toBeInTheDocument();
});

test('renders empty message when no assessments', () => {
  renderWithIntl(<AllAssessmentsTable assessments={[]} />);
  expect(screen.getByText('No assessments yet.')).toBeInTheDocument();
});
