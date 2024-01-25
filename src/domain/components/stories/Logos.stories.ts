import type { Meta, StoryObj } from '@storybook/react'
import { Logos } from '../Logos'

const meta = {
  title: 'Marketing/Logos',
  component: Logos,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Logos>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    logos: [
      {
        src: 'https://via.placeholder.com/150',
        alt: 'Lorem ipsum',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'Lorem ipsum',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'Lorem ipsum',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'Lorem ipsum',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'Lorem ipsum',
      },
      {
        src: 'https://via.placeholder.com/150',
        alt: 'Lorem ipsum',
      },
    ],
  },
}
