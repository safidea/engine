import type { Configuration } from 'webpack'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/drivers/ui/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config: Configuration) => {
    if (!config.resolve) config.resolve = {}
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ]
    return config
  },
}
export default config
