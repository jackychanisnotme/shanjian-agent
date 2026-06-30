import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App smoke shell', () => {
  it('renders the Shanjian Agent shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '善见 Agent' })).toBeInTheDocument();
    expect(screen.getByText('大病救助项目系统 MVP')).toBeInTheDocument();
  });
});
