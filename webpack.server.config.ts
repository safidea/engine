import { resolve } from 'path'
import nodeExternals from 'webpack-node-externals'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

import type { Configuration } from 'webpack'

const isDevelopment = process.env.NODE_ENV === 'development'

const config: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/server.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.webpack.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: 'tsconfig.webpack.json',
      }),
    ],
  },
  output: {
    filename: 'bundle.js', // Output file name
    path: resolve(__dirname, 'dist'), // Output directory
    libraryTarget: 'commonjs2', // This is important for libraries
  },
  externals: [nodeExternals()],
}

export default config
