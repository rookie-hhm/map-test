module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 'off',
    'quotes': 'off',
    'indentation': 'off',
    'indent': 'off',
    'comma-dangle': 'off',
    'no-trailing-spaces': 'off',
    'no-useless-return': 'off',
    'prefer-const': 'off',
    'no-unused-vars': 'off',
    'spaced-comment': 'off',
    'space-before-function-paren': 'off',
    'no-undef': 'off',
    'dot-notation': 'off',

  }
}
