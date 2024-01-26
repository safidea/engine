import type { Meta, StoryObj } from '@storybook/react'
import { CTA } from './CTA'

const meta = {
  title: 'Marketing/CTA',
  component: CTA,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CTA>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Let's find more that brings us together.",
    description:
      'Flowbite helps you connect with friends, family and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups, Watch and Marketplace.',
    primaryButton: {
      label: 'Get started',
      href: '#',
    },
  },
}
