import next from 'eslint-config-next';

const config = [
  ...next,
  { ignores: ['.next/**', 'node_modules/**', 'referencia-cv/**', 'playwright-report/**', 'test-results/**'] },
];

export default config;
