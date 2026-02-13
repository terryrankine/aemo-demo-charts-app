import type { Meta, StoryObj } from '@storybook/react-vite';
import DualAxisChart from './DualAxisChart';

const timeLabels = Array.from({ length: 12 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = (i % 2) * 30;
  return `2025-01-15T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
});

const meta = {
  title: 'Charts/DualAxisChart',
  component: DualAxisChart,
  tags: ['autodocs'],
  args: {
    categories: timeLabels,
    height: 400,
  },
} satisfies Meta<typeof DualAxisChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleRegion: Story = {
  args: {
    title: 'NSW — Price & Demand',
    priceSeries: [78, 82, 95, 110, 88, 76, 85, 120, 145, 130, 98, 85],
    demandSeries: [8200, 8400, 8800, 9200, 9000, 8700, 8500, 9100, 9500, 9300, 8900, 8600],
  },
};

export const Comparison: Story = {
  args: {
    title: 'NSW vs QLD — Price & Demand',
    priceSeries: [78, 82, 95, 110, 88, 76, 85, 120, 145, 130, 98, 85],
    demandSeries: [8200, 8400, 8800, 9200, 9000, 8700, 8500, 9100, 9500, 9300, 8900, 8600],
    regionALabel: 'NSW',
    regionBLabel: 'QLD',
    regionAId: 'NSW1',
    regionBId: 'QLD1',
    priceSeriesB: [65, 72, 80, 95, 78, 68, 75, 105, 125, 115, 82, 72],
    demandSeriesB: [5800, 6000, 6400, 6800, 6500, 6200, 6000, 6600, 7000, 6800, 6300, 6100],
  },
};
