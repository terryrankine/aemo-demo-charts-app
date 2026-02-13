import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import CompareToggle from './CompareToggle';

const meta = {
  title: 'Controls/CompareToggle',
  component: CompareToggle,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof CompareToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  args: {
    enabled: true,
  },
};

export const Disabled: Story = {
  args: {
    enabled: false,
    disabled: true,
  },
};
