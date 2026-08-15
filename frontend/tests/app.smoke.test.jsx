import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app/App.jsx';

test('renders the ResQMap application title', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText('ResQMap')).toBeInTheDocument();
});
