import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import ViewModeToggle from './ViewModeToggle';

const meta = {
  title: 'Controls/ViewModeToggle',
  component: ViewModeToggle,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ViewModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overlay: Story = {
  args: {
    mode: 'overlay',
  },
};

export const Split: Story = {
  args: {
    mode: 'split',
  },
};
