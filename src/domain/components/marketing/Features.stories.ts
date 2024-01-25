import type { Meta, StoryObj } from '@storybook/react'
import { Features } from './Features'

const meta = {
  title: 'Marketing/Features',
  component: Features,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Features>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Designed for business teams like yours',
    description:
      'Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.',
    features: [
      {
        title: 'Marketing',
        description:
          'Plan it, create it, launch it. Collaborate seamlessly with all the organization and hit your marketing goals every month with our marketing plan.',
        icon: 'icon-1',
      },
      {
        title: 'Legal',
        description:
          'Protect your organization, devices and stay compliant with our structured workflows and custom permissions made for you.',
        icon: 'icon-2',
      },
      {
        title: 'Business Automation',
        description:
          'Auto-assign tasks, send Slack messages, and much more. Now power up with hundreds of new templates to help you get started.',
        icon: 'icon-3',
      },
      {
        title: 'Sales',
        description:
          'Close more deals, track your progress, and get actionable insights with our sales tools.',
        icon: 'icon-4',
      },
      {
        title: 'Customer Support',
        description:
          'Get the help you need, when you need it with our 24/7 support. We’re here for you.',
        icon: 'icon-5',
      },
      {
        title: 'Human Resources',
        description:
          'Manage your team, track your progress, and get actionable insights with our sales tools.',
        icon: 'icon-6',
      },
    ],
  },
}
