import type { Meta, StoryObj } from '@storybook/react'
import { Hero } from './Hero'
import { Title } from '../content/Title'
import { Button } from '../base/Button'
import { Paragraph } from '../content/Paragraph'

const meta = {
  title: 'Marketing/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="We invest in the world’s potential" {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        {...props}
      />
    ),
    Buttons: [
      (props) => <Button label="Get started" href="#" {...props} />,
      (props) => <Button label="Learn more" href="#" variant="secondary" {...props} />,
    ],
  },
}
