import React from 'react';
import type { Preview } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../src/core/api/queryClient';
import 'swiper/css';
import 'swiper/css/bundle';
import '../src/main.css';

const preview: Preview = {
  parameters: {
    decorators: [
      (Story) => (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    ],
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
