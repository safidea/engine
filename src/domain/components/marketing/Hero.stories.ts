import type { Meta, StoryObj } from '@storybook/react'
import { Hero } from './Hero'

const meta = {
  title: 'Marketing/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'We invest in the world’s potential',
    description:
      'Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.',
    primaryButton: {
      text: 'Learn more',
      path: '#',
    },
  },
}
