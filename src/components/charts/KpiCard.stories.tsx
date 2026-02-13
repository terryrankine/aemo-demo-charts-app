import type { Meta, StoryObj } from '@storybook/react-vite';
import KpiCard from './KpiCard';

const meta = {
  title: 'Charts/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Spot Price',
    value: 85.42,
    unit: '$/MWh',
  },
};

export const WithSubtitle: Story = {
  args: {
    label: 'Demand',
    value: 8500,
    unit: 'MW',
    subtitle: 'Total scheduled + semi-scheduled',
  },
};

export const NegativePrice: Story = {
  args: {
    label: 'Spot Price',
    value: -12.50,
    unit: '$/MWh',
    color: '#ef4444',
  },
};

export const WithTrend: Story = {
  args: {
    label: 'Price Change',
    value: 92.10,
    unit: '$/MWh',
    trend: 'up',
  },
};

export const HighPrice: Story = {
  args: {
    label: 'Peak Price',
    value: 14250.00,
    unit: '$/MWh',
    trend: 'up',
    color: '#ef4444',
  },
};
