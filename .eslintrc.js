module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'node': true,
    },
    'extends': ['eslint:recommended', 'google', 'plugin:jest/recommended', 'plugin:jest/style'],
    'parserOptions': {
        'ecmaVersion': 12,
    },
    'rules': {
        'semi': ['error', 'never'],
        'indent': ['error', 4],
        'comma-dangle': ['error', 'always-multiline'],
        'object-curly-spacing': ['error', 'always'],
        'space-in-parens': ['error', 'never'],
        'max-len': ['error', { 'code': 180 }],
        'require-jsdoc': 0,
        'linebreak-style': 0,
        'space-infix-ops': ['error', { 'int32Hint': false }],
        'eqeqeq': ['error', 'always'],
        'arrow-spacing': ['error', { 'before': true, 'after': true }],
    },
    'plugins': ['jest'],
}


