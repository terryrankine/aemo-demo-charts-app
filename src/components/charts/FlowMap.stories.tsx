import type { Meta, StoryObj } from '@storybook/react-vite';
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
  { interconnectorId: 'VIC1-NSW1', exportRegion: 'VIC1', importRegion: 'NSW1', mwFlow: 200, exportLimit: 1600, importLimit: -1000 },
  { interconnectorId: 'V-SA', exportRegion: 'VIC1', importRegion: 'SA1', mwFlow: -150, exportLimit: 600, importLimit: -500 },
  { interconnectorId: 'T-V-MNSP1', exportRegion: 'TAS1', importRegion: 'VIC1', mwFlow: 100, exportLimit: 600, importLimit: -500 },
];

const meta = {
  title: 'Charts/FlowMap',
  component: FlowMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FlowMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    regions: mockRegions,
    interconnectors: mockInterconnectors,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500 }}>
        <Story />
      </div>
    ),
  ],
};
