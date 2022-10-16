const STRING_MAX_LENGTH = 120;

module.exports = {
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	extends: ['eslint:all', 'prettier', 'plugin:markdown/recommended'],
	ignorePatterns: ['**/*.bundle.js'],
	overrides: [
		{
			files: ['**/*.md'],
			processor: 'markdown/markdown'
		},
		{
			files: '**/*.md/*.js',
			rules: {
				'import/no-unresolved': 'off'
			}
		}
	],
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 2020,
		requireConfigFile: false,
		sourceType: 'module'
	},
	plugins: ['markdown'],
	root: true,
	rules: {
		'array-element-newline': ['error', 'consistent'],
		'capitalized-comments': [
			'warn',
			'always',
			{
				ignoreConsecutiveComments: true,
				ignoreInlineComments: true
			}
		],
		'consistent-return': 'off',
		'dot-location': ['error', 'property'],
		'function-call-argument-newline': ['error', 'consistent'],
		'id-length': [
			'error',
			{
				exceptions: ['i']
			}
		],
		indent: ['error', 'tab'],
		'max-len': ['error', STRING_MAX_LENGTH],
		'max-statements': 'off',
		'multiline-comment-style': ['error', 'separate-lines'],
		'multiline-ternary': ['error', 'never'],
		'no-console': [
			'warn',
			{
				allow: ['error', 'info', 'warn']
			}
		],
		'no-magic-numbers': [
			'error',
			{
				ignore: [-1, 0, 1]
			}
		],
		'no-param-reassign': 'off',
		'no-plusplus': 'off',
		'no-return-await': 'off',
		'no-tabs': [
			'error',
			{
				allowIndentationTabs: true
			}
		],
		'no-ternary': 'off',
		'no-underscore-dangle': 'off',
		'object-curly-spacing': ['error', 'always'],
		'object-property-newline': [
			'error',
			{
				allowAllPropertiesOnSameLine: true
			}
		],
		'one-var': ['error', 'never'],
		'padded-blocks': ['error', 'never'],
		'prefer-destructuring': 'off',
		'quote-props': ['error', 'as-needed'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				asyncArrow: 'always',
				named: 'never'
			}
		]
	}
};
