import type { Meta, StoryObj } from '@storybook/react'
import { Logos } from './Logos'
import { Title } from '../content/Title'
import { Image } from '../content/Image'

const meta = {
  title: 'Marketing/Logos',
  component: Logos,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Logos>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="You’ll be in good company" {...props} />,
    Images: [
      (props) => <Image src="https://via.placeholder.com/150" alt="Placeholder image" {...props} />,
      (props) => <Image src="https://via.placeholder.com/150" alt="Placeholder image" {...props} />,
      (props) => <Image src="https://via.placeholder.com/150" alt="Placeholder image" {...props} />,
    ],
  },
}
