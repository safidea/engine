import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Title } from './Title'
import { Image } from './Image'
import { Paragraph } from './Paragraph'

const meta = {
  title: 'Base/Card',
  component: Card,
} satisfies Meta<typeof Card>

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
    Image: (props) => <Image src="https://picsum.photos/200/300" alt="image" {...props} />,
  },
}

export const WithLink: Story = {
  args: {
    Title: (props) => <Title text="We invest in the world’s potential" {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        {...props}
      />
    ),
    Image: (props) => <Image src="https://picsum.photos/200/300" alt="image" {...props} />,
    href: '#',
  },
}
