import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'
import { HomeIcon } from '@heroicons/react/24/outline'
import type { BaseProps } from '@domain/entities/Component/base'

const meta = {
  title: 'Content/Icon',
  component: Icon,
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Icon: (props: BaseProps) => <HomeIcon {...props} />,
  },
}
