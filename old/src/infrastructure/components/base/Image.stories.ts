import type { Meta, StoryObj } from '@storybook/react'
import { Image } from './Image'

const meta = {
  title: 'Base/Image',
  component: Image,
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://via.placeholder.com/150',
    alt: 'Placeholder image',
  },
}
