import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './Header'
import { Title } from '../content/Title'
import { Link } from '../content/Link'
import { Button } from '../base/Button'

const meta = {
  title: 'Marketing/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Request" {...props} />,
    Links: [
      (props) => <Link label="About" href="#" {...props} />,
      (props) => <Link label="Pricing" href="#" {...props} />,
      (props) => <Link label="Contact" href="#" {...props} />,
      (props) => <Link label="Careers" href="#" {...props} />,
    ],
    Buttons: [
      (props) => <Button label="Log in" href="#" variant="secondary" {...props} />,
      (props) => <Button label="Sign up" href="#" {...props} />,
    ],
  },
}
