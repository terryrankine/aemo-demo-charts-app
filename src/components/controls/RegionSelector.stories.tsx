import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import RegionSelector from './RegionSelector';
import { NEM_REGIONS } from '../../api/types';

const meta = {
  title: 'Controls/RegionSelector',
  component: RegionSelector,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RegionSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NemRegions: Story = {
  args: {
    regions: NEM_REGIONS,
    selected: 'NSW1',
  },
};

export const WithNemOption: Story = {
  args: {
    regions: [{ id: 'NEM', label: 'NEM' }, ...NEM_REGIONS],
    selected: 'NEM',
  },
};
