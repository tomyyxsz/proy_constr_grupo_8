// vitest.config.js
import { defineConfig } from 'vitest/config'

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/main.jsx',
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}'
      ]
    }
  }
})