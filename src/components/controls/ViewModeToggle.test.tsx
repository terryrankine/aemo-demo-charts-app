import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewModeToggle from './ViewModeToggle';

describe('ViewModeToggle', () => {
  it('renders Overlay and Split buttons', () => {
    render(<ViewModeToggle mode="overlay" onChange={() => {}} />);
    expect(screen.getByText('Overlay')).toBeInTheDocument();
    expect(screen.getByText('Split')).toBeInTheDocument();
  });

  it('applies active class to overlay when selected', () => {
    render(<ViewModeToggle mode="overlay" onChange={() => {}} />);
    expect(screen.getByText('Overlay')).toHaveClass('active');
    expect(screen.getByText('Split')).not.toHaveClass('active');
  });

  it('applies active class to split when selected', () => {
    render(<ViewModeToggle mode="split" onChange={() => {}} />);
    expect(screen.getByText('Split')).toHaveClass('active');
    expect(screen.getByText('Overlay')).not.toHaveClass('active');
  });

  it('switches to split on click', async () => {
    const onChange = vi.fn();
    render(<ViewModeToggle mode="overlay" onChange={onChange} />);

    await userEvent.click(screen.getByText('Split'));
    expect(onChange).toHaveBeenCalledWith('split');
  });

  it('switches to overlay on click', async () => {
    const onChange = vi.fn();
    render(<ViewModeToggle mode="split" onChange={onChange} />);

    await userEvent.click(screen.getByText('Overlay'));
    expect(onChange).toHaveBeenCalledWith('overlay');
  });
});
