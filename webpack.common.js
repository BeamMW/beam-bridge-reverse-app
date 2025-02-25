const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;

  return {
    target: 'web',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      port: 13666
    },
    entry: {
      index: path.join(__dirname, './src/index.tsx'),
    },
    output: {
      path: path.join(__dirname, 'html'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsconfigPathsPlugin()],
      fallback: {
        process: require.resolve('process/browser')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['babel-loader', '@linaria/webpack-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'svgo-loader'],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: { url: false },
            },
          ],
        }, {
          test: /\.json$/,
          loader: 'json-loader',
          include: '/build/contracts/'
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(
          isProduction ? 'https://arbbridges-test-app.web.app' : 'http://localhost:8080'
        ),
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'src/wasm'),
            to: path.join(__dirname, 'html/'),
            context: 'public',
          },
          {
            from: path.join(__dirname, 'src/assets'),
            to: path.join(__dirname, 'html/assets'),
            context: 'public',
          },
          {
            from: path.join(__dirname, 'src/index.html'),
            to: path.join(__dirname, 'html'),
            context: 'public',
          }
        ],
      }),
    ],
    externals: ['fs'],
  };
};
