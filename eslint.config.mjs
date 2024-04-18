import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended });

export default [
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.browser } },
	...compat.extends('xo'),
	{
		rules: {
			eqeqeq: 'error',
			'new-cap': 0,
			'no-unused-vars': 'error',
			'no-trailing-spaces': 'error',
			'object-curly-spacing': [
				'error', 'always',
			],
			'arrow-spacing': [
				'error', { before: true, after: true },
			],
		},
	},
];
