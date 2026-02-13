import type { Meta, StoryObj } from '@storybook/react-vite';
import RenewableGauge from './RenewableGauge';

const meta = {
  title: 'Charts/RenewableGauge',
  component: RenewableGauge,
  tags: ['autodocs'],
} satisfies Meta<typeof RenewableGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = {
  args: {
    value: 72,
    title: 'Renewable Penetration',
  },
};

export const Medium: Story = {
  args: {
    value: 42,
    title: 'Renewable Penetration',
  },
};

export const Low: Story = {
  args: {
    value: 18,
    title: 'Renewable Penetration',
  },
};
