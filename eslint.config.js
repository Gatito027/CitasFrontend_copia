import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
<<<<<<< HEAD
import importPlugin from 'eslint-plugin-import'
=======
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29

export default defineConfig([
  globalIgnores(['dist']),
  {
<<<<<<< HEAD
    ignores: ['vite.config.js', 'eslint.config.js'],
    files: ['**/*.{js,jsx}'],
    plugins: {
      import: importPlugin,
    },
=======
    files: ['**/*.{js,jsx}'],
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
<<<<<<< HEAD
      'import/no-unresolved': 'error',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'], // 👈 esto va en settings, no en rules
        },
      },
=======
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
    },
  },
])
