module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['drizzle'],
  extends: [
    'standard-with-typescript',
    'plugin:drizzle/all'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', {
      disallowTypeAnnotations: true,
      prefer: 'no-type-imports'
    }]
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules']
};
