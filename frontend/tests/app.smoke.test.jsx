import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app/App.jsx';
import { repository } from '../src/repository/index.js';

test('renders the operations console shell and live command center', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText('RESQMAP')).toBeInTheDocument();
  expect(screen.getByLabelText('Primary navigation')).toBeInTheDocument();
  expect(screen.getAllByText('Operational')).toHaveLength(2);
  expect(screen.getByLabelText('Live operation status')).toBeInTheDocument();
  expect(screen.getByText('Report received')).toBeInTheDocument();
  expect(screen.getByText('Verify evidence')).toBeInTheDocument();
  expect(screen.getByText('Human decision')).toBeInTheDocument();
});

test('guides a presenter through the Chennai rescue journey while data connects', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Hackathon demo' })).toBeInTheDocument();
  expect(screen.getByText('1. Verify the report')).toBeInTheDocument();
  expect(screen.getByText('2. Resolve the conflict')).toBeInTheDocument();
  expect(screen.getByText('3. Approve the response')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Connecting to response network');
});

test('restarts the demo scenario and confirms it is ready', async () => {
  const user = userEvent.setup();
  const reset = vi.spyOn(repository, 'resetDemo').mockResolvedValue({});
  render(<MemoryRouter><App /></MemoryRouter>);

  await user.click(screen.getByRole('button', { name: 'Restart demo' }));

  expect(reset).toHaveBeenCalledOnce();
  expect(await screen.findByText('Demo restored. Start with the verification queue.')).toBeInTheDocument();
  reset.mockRestore();
});
