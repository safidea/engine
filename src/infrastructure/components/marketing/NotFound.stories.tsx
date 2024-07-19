import type { Meta, StoryObj } from '@storybook/react'
import { NotFound } from './NotFound'
import { Title } from '../content/Title'
import { Paragraph } from '../content/Paragraph'
import { Button } from '../base/Button'

const meta = {
  title: 'Marketing/NotFound',
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NotFound>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Something's missing." {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Sorry, we can't find that page. You'll find lots to explore on the home page."
        {...props}
      />
    ),
    Button: (props) => <Button label="Go to home page" variant="primary" {...props} />,
  },
}
