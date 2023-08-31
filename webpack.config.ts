import { resolve } from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import type { Configuration } from 'webpack'

const isDevelopment = process.env.NODE_ENV === 'development'

const config: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  entry: 'src/infrastructure/server/ExpressServer/client.tsx',
  output: {
    path: resolve(process.cwd(), 'dist/public'),
    filename: 'bundle.js',
  },
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',
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
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})],
  },
  plugins: [],
  optimization: {
    minimizer: [new TerserPlugin({})],
  },
}

if (isDevelopment) {
  const devServer: DevServerConfiguration = {
    static: './dist/public',
    port: 8080,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
      },
    },
    open: true,
    compress: true,
    historyApiFallback: true,
    hot: true,
  }

  config.devServer = devServer
  config.plugins?.push(new ReactRefreshWebpackPlugin())
}

export default config
