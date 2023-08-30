import { resolve } from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const config = {
  mode: 'development',
  optimization: {
    minimizer: [new TerserPlugin({})],
  },
  entry: 'src/infrastructure/server/ExpressServer/client/index.tsx',
  output: {
    path: resolve(process.cwd(), 'dist'),
    filename: 'bundle.js',
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
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})],
  },
}

export default config
