import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'

export default [
  { ignores: ['vitest.config.js'] },
  { files: ['**/*.{js,mjs,cjs,ts,tsx,jsx,vue}'] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: 'vue-eslint-parser', // Use vue-eslint-parser for .vue files
      parserOptions: {
        parser: '@typescript-eslint/parser', // Specify TypeScript parser
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'], // Recognize .vue files
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  vue.configs['vue3-recommended'],
  {
    rules: {
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false },
      ],
      'import/prefer-default-export': 'off',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // using gitignore syntax
              group: [
                'app',
                'config',
                'database',
                'schemas',
                'modules',
                'repositories',
                'trpc',
                'utils',
              ].flatMap((path) => [
                `@server/${path}`,
                `@mono/server/src/${path}`,
              ]),
              message:
                'Please only import from @server/shared or @mono/server/src/shared.',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
]
