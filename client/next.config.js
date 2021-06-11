// next.config.js
const path = require('path')
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
// const typescript = require('@zeit/next-typescript');

// next.js configuration
const nextConfig = {
  // useFileSystemPublicRoutes: false,
  // distDir: 'build',
  serverless: true,
  // webpack5
  future: {
    webpack5: true,
  },
  // sass
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, options) => {

    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    });


    return config;
  },
};

module.exports = withPlugins([

  // add a plugin without a configuration
  withImages,

  // another plugin with a configuration
  // [typescript, {
  //   typescriptLoaderOptions: {
  //     transpileOnly: false,
  //   },
  // }],

], nextConfig);
