var path = require('path');
var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',
  entry: [
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // your code:
    './src/index'
  ],
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
      electron: 'electron'
    }),
    devFlagPlugin
  ],
  // node: {
  //   child_process: 'empty'
  // },
  module: {
    loaders: [
      {
        test: /\.js$/,
        // loaders: ['babel'],
        include: path.join(__dirname, 'src'),
        loader: require.resolve('babel-loader'),
        queries: {
          plugins: ['transform-runtime'],
          presets: ["react", "es2015", "babel-preset-stage-0"],
        },
        exclude: /node_modules/
      },

      {
        test: /\.less$/,
        loader: 'style!css!less',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['', '.js', '.min.js', '.json'],
    modulesDirectories: ['node_modules', path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')]
  },
  resolveLoader: {
    modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
  },
  externals: [
      (function () {
        var IGNORES = [
          'electron'
        ];
        return function (context, request, callback) {
          if (IGNORES.indexOf(request) >= 0) {
            return callback(null, "require('" + request + "')");
          }
          return callback();
        };
      })()
    ]
};
