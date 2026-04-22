import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';
import { AssessmentCard } from '@/components/assessments/assessment-card';
import type { AssessmentWithProject } from '@/lib/db/assessments';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>
  );
}

const mockAssessment: AssessmentWithProject = {
  id: 'a1',
  project_id: 'p1',
  project_name: 'My Project',
  name: 'Q1 Audit',
  description: 'Testing the main flows',
  status: 'in_progress',
  issue_count: 5,
  test_date_start: null,
  test_date_end: null,
  assigned_to: null,
  created_by: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('AssessmentCard', () => {
  it('renders name as a link to the assessment', () => {
    renderWithIntl(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/p1/assessments/a1');
    expect(screen.getByText('Q1 Audit')).toBeInTheDocument();
  });

  it('renders project name', () => {
    renderWithIntl(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('renders description when present', () => {
    renderWithIntl(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByText('Testing the main flows')).toBeInTheDocument();
  });

  it('does not render description when absent', () => {
    renderWithIntl(<AssessmentCard assessment={{ ...mockAssessment, description: null }} />);
    expect(screen.queryByText('Testing the main flows')).not.toBeInTheDocument();
  });

  it('renders issue count', () => {
    renderWithIntl(<AssessmentCard assessment={mockAssessment} />);
    expect(screen.getByText(/5 issue/i)).toBeInTheDocument();
  });
});
