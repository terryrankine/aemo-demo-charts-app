import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegionSelector from './RegionSelector';

const regions = [
  { id: 'NSW1', label: 'NSW' },
  { id: 'QLD1', label: 'QLD' },
  { id: 'VIC1', label: 'VIC' },
  { id: 'SA1', label: 'SA' },
  { id: 'TAS1', label: 'TAS' },
];

describe('RegionSelector', () => {
  it('renders all region buttons', () => {
    render(<RegionSelector regions={regions} selected="NSW1" onChange={() => {}} />);

    for (const r of regions) {
      expect(screen.getByText(r.label)).toBeInTheDocument();
    }
  });

  it('marks selected region with aria-checked', () => {
    render(<RegionSelector regions={regions} selected="NSW1" onChange={() => {}} />);

    const nswBtn = screen.getByText('NSW');
    expect(nswBtn).toHaveAttribute('aria-checked', 'true');

    const qldBtn = screen.getByText('QLD');
    expect(qldBtn).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange with region id on click', async () => {
    const onChange = vi.fn();
    render(<RegionSelector regions={regions} selected="NSW1" onChange={onChange} />);

    await userEvent.click(screen.getByText('QLD'));
    expect(onChange).toHaveBeenCalledWith('QLD1');
  });

  it('applies active class to selected button', () => {
    render(<RegionSelector regions={regions} selected="VIC1" onChange={() => {}} />);

    const vicBtn = screen.getByText('VIC');
    expect(vicBtn).toHaveClass('active');

    const nswBtn = screen.getByText('NSW');
    expect(nswBtn).not.toHaveClass('active');
  });

  it('has radiogroup role', () => {
    render(<RegionSelector regions={regions} selected="NSW1" onChange={() => {}} />);

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});
