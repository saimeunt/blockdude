/** @type {import('next').NextConfig} */
module.exports = {
  /* webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      '^react-native$': 'react-native-web',
    };
    return config;
  }, */
  /* experimental: {
    swcPlugins: [['@nissy-dev/swc-plugin-react-native-web', { commonjs: true }]],
  }, */
  trailingSlash: false,
  reactStrictMode: true,
};
