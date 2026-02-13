import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TimeScaleToggle from './TimeScaleToggle';

const meta = {
  title: 'Controls/TimeScaleToggle',
  component: TimeScaleToggle,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TimeScaleToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveMinute: Story = {
  args: {
    selected: '5MIN',
  },
};

export const ThirtyMinute: Story = {
  args: {
    selected: '30MIN',
  },
};
