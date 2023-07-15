const path = require('path')

module.exports = {
  entry: './src/infrastructure/client/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: 'bundle.js',
    publicPath: '/dist/public/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
}
