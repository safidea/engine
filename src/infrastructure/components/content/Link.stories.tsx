import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './Link'
import { HomeIcon } from '@heroicons/react/24/outline'
import { Icon } from './Icon'
import type { BaseProps } from '@domain/engine/page/component/base/base'

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
    PrefixIcon: () => <Icon Icon={(props: BaseProps) => <HomeIcon {...props} />} />,
  },
}

export const WithAfterIcon: Story = {
  args: {
    label: 'This is a link with an after icon',
    href: '/',
    SuffixIcon: () => <Icon Icon={(props: BaseProps) => <HomeIcon {...props} />} />,
  },
}
