/** @type {import('next').NextConfig} */
const ignored = [
  '**/node_modules/**',
  'C:\\DumpStack.log.tmp',
  'C:\\hiberfil.sys',
  'C:\\swapfile.sys',
  'C:\\pagefile.sys',
];

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored,
    };
    return config;
  },
};
