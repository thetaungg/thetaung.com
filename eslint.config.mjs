import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const rootDir = import.meta.dirname;

// Shared rules for all TypeScript files
const sharedRules = {
    '@typescript-eslint/no-unused-vars': [
        'warn',
        {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
        },
    ],
    'no-unused-vars': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
};

export default [
    // Ignore patterns
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/.astro/**'],
    },

    // Base JS config
    js.configs.recommended,

    // TypeScript config - scoped to apps only
    ...tseslint.configs.recommended.map(config => ({
        ...config,
        files: ['apps/**/*.{ts,tsx}'],
        languageOptions: {
            ...config.languageOptions,
            parserOptions: {
                ...config.languageOptions?.parserOptions,
                tsconfigRootDir: rootDir,
            },
        },
    })),

    // Frontend: React/Astro (apps/website)
    {
        files: ['apps/website/**/*.{ts,tsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
            'simple-import-sort': simpleImportSort,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...sharedRules,
            ...react.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            ...reactHooks.configs.recommended.rules,
            'react-hooks/exhaustive-deps': 'error',
        },
    },

    // Backend: Hono/Bun (apps/backend)
    {
        files: ['apps/backend/**/*.ts'],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly',
                Bun: 'readonly',
            },
        },
        rules: {
            ...sharedRules,
        },
    },

    // Prettier - must be last to override conflicting rules
    prettierConfig,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
        },
    },
];
