import type { Meta, StoryObj } from '@storybook/react-vite';
import HorizontalBar from './HorizontalBar';
import { getFuelColor } from '../../theme/fuel-colors';

const meta = {
  title: 'Charts/HorizontalBar',
  component: HorizontalBar,
  tags: ['autodocs'],
} satisfies Meta<typeof HorizontalBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleRegion: Story = {
  args: {
    title: 'Fuel Mix — NSW',
    items: [
      { name: 'Black Coal', value: 4200, color: getFuelColor('Black Coal') },
      { name: 'Solar', value: 1800, color: getFuelColor('Solar') },
      { name: 'Wind', value: 900, color: getFuelColor('Wind') },
      { name: 'Gas', value: 600, color: getFuelColor('Gas') },
      { name: 'Hydro', value: 400, color: getFuelColor('Hydro') },
      { name: 'Battery', value: 150, color: getFuelColor('Battery') },
    ],
    unit: 'MW',
  },
};

export const Comparison: Story = {
  args: {
    title: 'Fuel Mix — NSW vs QLD',
    items: [
      { name: 'Black Coal', value: 4200, color: getFuelColor('Black Coal') },
      { name: 'Solar', value: 1800, color: getFuelColor('Solar') },
      { name: 'Wind', value: 900, color: getFuelColor('Wind') },
      { name: 'Gas', value: 600, color: getFuelColor('Gas') },
      { name: 'Hydro', value: 400, color: getFuelColor('Hydro') },
    ],
    itemsB: [
      { name: 'Black Coal', value: 3800, color: getFuelColor('Black Coal') },
      { name: 'Solar', value: 2200, color: getFuelColor('Solar') },
      { name: 'Gas', value: 500, color: getFuelColor('Gas') },
      { name: 'Wind', value: 300, color: getFuelColor('Wind') },
    ],
    regionALabel: 'NSW',
    regionBLabel: 'QLD',
    regionAColor: '#4A90D9',
    regionBColor: '#E74C3C',
    unit: 'MW',
  },
};
