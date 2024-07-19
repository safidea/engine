import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from './Heading'
import { Title } from '../content/Title'
import { Button } from '../base/Button'

const meta = {
  title: 'Application/Heading',
  component: Heading,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Request" {...props} />,
    Buttons: [
      (props) => <Button label="Log in" href="#" variant="secondary" {...props} />,
      (props) => <Button label="Sign up" href="#" variant="primary" {...props} />,
    ],
  },
}
