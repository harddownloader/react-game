const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
  },
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ['babel-loader', 'eslint-loader'],
      },
      // {
      //   test: /\.ts(x?)$/,
      //   exclude: /node_modules/,
      //   use: [{ loader: 'ts-loader' }, { loader: 'eslint-loader' }],
      // },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|eot|ttf|woff|woff2)$/i,
        use: ['file-loader'],
        include: path.join(__dirname, 'src/assets/')
      },
      {
        test: /\.mp3$/,
        include: path.join(__dirname, 'src/assets/'),
        loader: 'file-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
};
