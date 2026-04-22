import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';

const { mockPush, mockToastSuccess, mockToastError } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('sonner', () => ({
  toast: { success: mockToastSuccess, error: mockToastError },
}));

vi.mock('@/components/issues/issue-form', () => ({
  IssueForm: ({
    onSubmit,
    loading,
    externalButtons,
  }: {
    projectId: string;
    onSubmit: (data: Record<string, unknown>) => void;
    loading?: boolean;
    externalButtons?: string;
  }) => (
    <form
      id={externalButtons}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title: 'Test Issue', severity: 'high' });
      }}
    >
      <span data-testid="issue-form-loading">{loading ? 'loading' : 'idle'}</span>
      <button type="submit">Submit</button>
    </form>
  ),
}));

import { NewIssueClient } from '../new-issue-client';

const messages = {
  issues: {
    list: {
      new_button: 'New Issue',
    },
    form: {
      save_button: 'Save Issue',
      cancel_button: 'Cancel',
    },
    toast: {
      created: 'Issue created',
      create_failed: 'Failed to create issue',
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

describe('NewIssueClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the heading and issue form', () => {
    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    expect(screen.getByRole('heading', { name: 'New Issue' })).toBeInTheDocument();
    expect(screen.getByTestId('issue-form-loading')).toBeInTheDocument();
  });

  it('passes loading=false initially', () => {
    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    expect(screen.getByTestId('issue-form-loading')).toHaveTextContent('idle');
  });

  it('navigates to the new issue page and shows success toast on successful submission', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ success: true, data: { id: 'issue-99' } }),
    });

    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/projects/p1/assessments/a1/issues',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Issue', severity: 'high' }),
      })
    );
    expect(mockToastSuccess).toHaveBeenCalledWith('Issue created');
    expect(mockPush).toHaveBeenCalledWith('/projects/p1/assessments/a1/issues/issue-99');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('shows error toast when API returns success=false', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ success: false, error: 'Validation failed' }),
    });

    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockToastError).toHaveBeenCalledWith('Failed to create issue');
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows error toast when fetch throws a network error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockToastError).toHaveBeenCalledWith('Failed to create issue');
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renders a Cancel link pointing to the assessment page', () => {
    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    const cancelLink = screen.getByRole('link', { name: /cancel/i });
    expect(cancelLink).toHaveAttribute('href', '/projects/p1/assessments/a1');
  });

  it('renders a Save Issue submit button with the form attribute', () => {
    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    const btn = screen.getByRole('button', { name: /save issue/i });
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('form', 'new-issue-form');
  });

  it('Save Issue button has an icon', () => {
    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    const btn = screen.getByRole('button', { name: /save issue/i });
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('Cancel link has an icon', () => {
    renderWithIntl(<NewIssueClient projectId="p1" assessmentId="a1" />);
    const link = screen.getByRole('link', { name: /cancel/i });
    expect(link.querySelector('svg')).toBeInTheDocument();
  });
});
