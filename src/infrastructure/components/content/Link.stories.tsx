import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './Link'
import { Icon } from './Icon'

const meta = {
  title: 'Content/Link',
  component: Link,
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'This is a link',
    href: '/',
  },
}

export const Active: Story = {
  args: {
    label: 'This is an active link',
    href: '/',
    active: true,
  },
}

export const WithBeforeIcon: Story = {
  args: {
    label: 'This is a link with a before icon',
    href: '/',
    PrefixIcon: (props) => <Icon name="Home" {...props} />,
  },
}

export const WithAfterIcon: Story = {
  args: {
    label: 'This is a link with an after icon',
    href: '/',
    SuffixIcon: (props) => <Icon name="Home" {...props} />,
  },
}
