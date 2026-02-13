import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KpiCard from './KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Price" value={85.42} />);
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('85.42')).toBeInTheDocument();
  });

  it('renders unit when provided', () => {
    render(<KpiCard label="Price" value={85.42} unit="$/MWh" />);
    expect(screen.getByText('$/MWh')).toBeInTheDocument();
  });

  it('applies negative class for negative values', () => {
    render(<KpiCard label="Price" value={-12.5} />);
    const valueEl = screen.getByText('-12.5');
    expect(valueEl).toHaveClass('negative');
  });

  it('does not apply negative class for positive values', () => {
    render(<KpiCard label="Price" value={85.42} />);
    const valueEl = screen.getByText('85.42');
    expect(valueEl).not.toHaveClass('negative');
  });

  it('renders trend arrow for up', () => {
    render(<KpiCard label="Price" value={85} trend="up" />);
    expect(screen.getByText('▲')).toBeInTheDocument();
  });

  it('renders trend arrow for down', () => {
    render(<KpiCard label="Price" value={85} trend="down" />);
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('does not render trend arrow for neutral', () => {
    render(<KpiCard label="Price" value={85} trend="neutral" />);
    expect(screen.queryByText('▲')).not.toBeInTheDocument();
    expect(screen.queryByText('▼')).not.toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<KpiCard label="Price" value={85} subtitle="As of 10:00 AM" />);
    expect(screen.getByText('As of 10:00 AM')).toBeInTheDocument();
  });

  it('formats numbers with locale', () => {
    render(<KpiCard label="Demand" value={8500} />);
    expect(screen.getByText('8,500')).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(<KpiCard label="Status" value="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });
});
