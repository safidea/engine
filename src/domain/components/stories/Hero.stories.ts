import type { Meta, StoryObj } from '@storybook/react'
import { Hero } from '../Hero'

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
    title: 'Lorem ipsum dolor sit amet',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    primaryButton: {
      text: 'Lorem ipsum',
      path: '#',
    },
  },
}
