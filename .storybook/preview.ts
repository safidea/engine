import type { Preview } from '@storybook/react'

import '../dist/output.css'
import '../dist/public/index.js'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
