import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { ignores: ['vitest.config.js'] },
  { files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
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
            ].flatMap(path => [
              `@server/${path}`,
              `@mono/server/src/${path}`,
            ]),
            message: 'Please only import from @server/shared or @mono/server/src/shared.',
          },
        ],
      },
    ]
    },
  },
  eslintConfigPrettier,
]
