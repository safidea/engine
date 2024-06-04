import type { Meta, StoryObj } from '@storybook/react'
import { Menu } from './Menu'
import { Link } from './Link'

const meta = {
  title: 'Base/Menu',
  component: Menu,
} satisfies Meta<typeof Menu>

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
