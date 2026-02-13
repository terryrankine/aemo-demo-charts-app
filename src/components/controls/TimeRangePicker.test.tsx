import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeRangePicker from './TimeRangePicker';

describe('TimeRangePicker', () => {
  it('renders all period buttons', () => {
    render(<TimeRangePicker selected="CURRENT" onChange={() => {}} />);
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('24h')).toBeInTheDocument();
    expect(screen.getByText('48h')).toBeInTheDocument();
    expect(screen.getByText('3 Months')).toBeInTheDocument();
    expect(screen.getByText('12 Months')).toBeInTheDocument();
  });

  it('applies active class to selected period', () => {
    render(<TimeRangePicker selected="CURRENT" onChange={() => {}} />);
    expect(screen.getByText('Current')).toHaveClass('active');
    expect(screen.getByText('24h')).not.toHaveClass('active');
  });

  it('calls onChange with period id on click', async () => {
    const onChange = vi.fn();
    render(<TimeRangePicker selected="CURRENT" onChange={onChange} />);

    await userEvent.click(screen.getByText('24h'));
    expect(onChange).toHaveBeenCalledWith('24H');
  });

  it('highlights 3 Months when selected', () => {
    render(<TimeRangePicker selected="3M" onChange={() => {}} />);
    expect(screen.getByText('3 Months')).toHaveClass('active');
  });
});
