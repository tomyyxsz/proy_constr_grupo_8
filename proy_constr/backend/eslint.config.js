import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['generated']),
  {
    files: ['**/*.{js,ts}'],
    extends: [
      js.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'camelcase': ['error', { properties: 'always' }],
      'no-unreachable': 'error',
      'max-lines-per-function': ['error', { max: 150, skipComments: false, skipBlankLines: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
])
