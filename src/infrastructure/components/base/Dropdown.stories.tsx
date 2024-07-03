import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'
import { Link } from '../content/Link'

const meta = {
  title: 'Base/Dropdown',
  component: Dropdown,
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'This is a link',
    Links: [
      (props) => <Link label="Request" href="/about" {...props} />,
      (props) => <Link label="Label" href="/link" {...props} />,
    ],
  },
}
