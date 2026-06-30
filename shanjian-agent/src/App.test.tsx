import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App smoke shell', () => {
  it('renders the Shanjian Agent public home shell', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: '善见 Agent' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /公众项目展示/ })).toBeInTheDocument();
  });
});
