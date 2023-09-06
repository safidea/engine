import type { Meta, StoryObj } from '@storybook/react'

import LinkTailwindUI from '@infrastructure/ui/TailwindUI/LinkTailwindUI'
import { LinkComponent } from '@domain/entities/page/components/Link'

const meta: Meta<typeof LinkComponent> = {
  title: 'Tailwind/Link',
  component: ({ path, label }) => <LinkComponent path={path} label={label} UI={LinkTailwindUI} />,
  args: {
    path: '/new-page',
    label: 'Open a page',
  },
  argTypes: {
    path: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
