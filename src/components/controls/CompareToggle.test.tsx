import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareToggle from './CompareToggle';

describe('CompareToggle', () => {
  it('renders Compare button', () => {
    render(<CompareToggle enabled={false} onChange={() => {}} />);
    expect(screen.getByText('Compare')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const onChange = vi.fn();
    render(<CompareToggle enabled={false} onChange={onChange} />);

    await userEvent.click(screen.getByText('Compare'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles off when currently enabled', async () => {
    const onChange = vi.fn();
    render(<CompareToggle enabled={true} onChange={onChange} />);

    await userEvent.click(screen.getByText('Compare'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('applies aria-pressed when enabled', () => {
    render(<CompareToggle enabled={true} onChange={() => {}} />);
    expect(screen.getByText('Compare')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not have aria-pressed true when disabled', () => {
    render(<CompareToggle enabled={false} onChange={() => {}} />);
    expect(screen.getByText('Compare')).toHaveAttribute('aria-pressed', 'false');
  });

  it('disables the button when disabled prop is true', () => {
    render(<CompareToggle enabled={false} onChange={() => {}} disabled={true} />);
    expect(screen.getByText('Compare')).toBeDisabled();
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<CompareToggle enabled={false} onChange={onChange} disabled={true} />);

    await userEvent.click(screen.getByText('Compare'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
