import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

const [typescriptCoreOverrides] = tseslint.configs['eslint-recommended'].overrides;

export default [
	eslint.configs.recommended,
	{
		files: ['**/*.{js,ts,svelte}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			'@typescript-eslint': tseslint
		},
		rules: {
			...tseslint.configs.recommended.rules
		}
	},
	{
		files: ['**/*.{js,ts}'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		}
	},
	{
		// TypeScript checks undefined identifiers itself; disable core rules it supersedes.
		files: ['**/*.{ts,svelte}'],
		rules: {
			...typescriptCoreOverrides.rules
		}
	},
	...sveltePlugin.configs['flat/recommended'],
	{
		files: ['**/*.svelte', '**/*.svelte.{js,ts}'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsparser
			}
		},
		rules: {
			// Core prefer-const misreads `let { ... } = $props()`; the Svelte variant understands runes.
			'prefer-const': 'off',
			'svelte/prefer-const': 'error'
		}
	},
	prettier,
	...sveltePlugin.configs['flat/prettier'],
	{
		ignores: ['.svelte-kit/', 'build/', 'node_modules/', '.wrangler/', '.claude/']
	}
];
