import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeScaleToggle from './TimeScaleToggle';

describe('TimeScaleToggle', () => {
  it('renders 5 Min and 30 Min buttons', () => {
    render(<TimeScaleToggle selected="5MIN" onChange={() => {}} />);
    expect(screen.getByText('5 Min')).toBeInTheDocument();
    expect(screen.getByText('30 Min')).toBeInTheDocument();
  });

  it('applies active class to selected scale', () => {
    render(<TimeScaleToggle selected="5MIN" onChange={() => {}} />);
    expect(screen.getByText('5 Min')).toHaveClass('active');
    expect(screen.getByText('30 Min')).not.toHaveClass('active');
  });

  it('switches to 30MIN on click', async () => {
    const onChange = vi.fn();
    render(<TimeScaleToggle selected="5MIN" onChange={onChange} />);

    await userEvent.click(screen.getByText('30 Min'));
    expect(onChange).toHaveBeenCalledWith('30MIN');
  });

  it('switches to 5MIN on click', async () => {
    const onChange = vi.fn();
    render(<TimeScaleToggle selected="30MIN" onChange={onChange} />);

    await userEvent.click(screen.getByText('5 Min'));
    expect(onChange).toHaveBeenCalledWith('5MIN');
  });
});
