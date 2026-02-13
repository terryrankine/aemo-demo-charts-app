import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import FlowMap from './FlowMap';
import type { ElecSummaryRegion, InterconnectorFlow } from '../../api/types';

const mockRegions: ElecSummaryRegion[] = [
  { region: 'NSW1', price: 85.42, demand: 8500, generation: 9000, netInterchange: -500, scheduledGeneration: 7200, semiScheduledGeneration: 1800 },
  { region: 'QLD1', price: 72.15, demand: 6200, generation: 6700, netInterchange: 300, scheduledGeneration: 5800, semiScheduledGeneration: 900 },
  { region: 'VIC1', price: 45.30, demand: 5100, generation: 5400, netInterchange: 200, scheduledGeneration: 4200, semiScheduledGeneration: 1200 },
  { region: 'SA1', price: -12.50, demand: 1800, generation: 2000, netInterchange: -200, scheduledGeneration: 800, semiScheduledGeneration: 1200 },
  { region: 'TAS1', price: 55.00, demand: 1100, generation: 1200, netInterchange: -100, scheduledGeneration: 900, semiScheduledGeneration: 300 },
];

const mockInterconnectors: InterconnectorFlow[] = [
  { interconnectorId: 'NSW1-QLD1', exportRegion: 'NSW1', importRegion: 'QLD1', mwFlow: 300, exportLimit: 1200, importLimit: -800 },
];

describe('FlowMap', () => {
  it('renders all region nodes', () => {
    renderWithProviders(<FlowMap regions={mockRegions} interconnectors={mockInterconnectors} />);

    expect(screen.getByText('NSW')).toBeInTheDocument();
    expect(screen.getByText('QLD')).toBeInTheDocument();
    expect(screen.getByText('VIC')).toBeInTheDocument();
    expect(screen.getByText('SA')).toBeInTheDocument();
    expect(screen.getByText('TAS')).toBeInTheDocument();
  });

  it('displays prices for each region', () => {
    renderWithProviders(<FlowMap regions={mockRegions} interconnectors={mockInterconnectors} />);

    expect(screen.getByText('$85.42/MWh')).toBeInTheDocument();
    expect(screen.getByText('$72.15/MWh')).toBeInTheDocument();
    expect(screen.getByText('$-12.50/MWh')).toBeInTheDocument();
  });

  it('displays demand for each region', () => {
    renderWithProviders(<FlowMap regions={mockRegions} interconnectors={mockInterconnectors} />);

    expect(screen.getByText('8,500 MW')).toBeInTheDocument();
    expect(screen.getByText('6,200 MW')).toBeInTheDocument();
  });

  it('renders interconnector flow labels', () => {
    renderWithProviders(<FlowMap regions={mockRegions} interconnectors={mockInterconnectors} />);

    expect(screen.getByText('300 MW')).toBeInTheDocument();
  });

  it('renders with empty interconnectors', () => {
    renderWithProviders(<FlowMap regions={mockRegions} interconnectors={[]} />);

    expect(screen.getByText('NSW')).toBeInTheDocument();
  });
});
