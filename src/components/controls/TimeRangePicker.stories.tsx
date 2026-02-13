import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TimeRangePicker from './TimeRangePicker';

const meta = {
  title: 'Controls/TimeRangePicker',
  component: TimeRangePicker,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TimeRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = {
  args: {
    selected: 'CURRENT',
  },
};
