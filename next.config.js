/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/JoDash' : '',
  assetPrefix: isProd ? '/JoDash/' : '',
  eslint: {
    dirs: ['app', 'components', 'lib', '__tests__'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
};

module.exports = nextConfig;
