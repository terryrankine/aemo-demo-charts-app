import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/theme/ThemeContext';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
