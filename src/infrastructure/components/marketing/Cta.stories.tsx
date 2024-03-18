import type { Meta, StoryObj } from '@storybook/react'
import { Cta } from './Cta'
import { Title } from '../base/Title'
import { Paragraph } from '../base/Paragraph'
import { Button } from '../base/Button'

const meta = {
  title: 'Marketing/Cta',
  component: Cta,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Cta>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Let's find more that brings us together." {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Flowbite helps you connect with friends, family and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups, Watch and Marketplace."
        {...props}
      />
    ),
    Buttons: [(props) => <Button label="Get started" href="#" {...props} />],
  },
}
