import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';
import { ProjectAssessmentsCard } from '../project-assessments-card';
import type { AssessmentWithCounts } from '@/lib/db/assessments';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>
  );
}

const assessment: AssessmentWithCounts = {
  id: 'a1',
  project_id: 'p1',
  name: 'Q1 Audit',
  description: null,
  test_date_start: null,
  test_date_end: null,
  status: 'ready',
  assigned_to: null,
  created_by: null,
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
  issue_count: 3,
};

test('renders assessments card heading', () => {
  renderWithIntl(
    <ProjectAssessmentsCard projectId="p1" projectName="My Project" assessments={[assessment]} />
  );
  expect(screen.getByText('Assessments')).toBeInTheDocument();
});

test('shows table view by default', () => {
  renderWithIntl(
    <ProjectAssessmentsCard projectId="p1" projectName="My Project" assessments={[assessment]} />
  );
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('shows empty state when no assessments', () => {
  renderWithIntl(
    <ProjectAssessmentsCard projectId="p1" projectName="My Project" assessments={[]} />
  );
  expect(screen.getByText('No assessments yet.')).toBeInTheDocument();
});
