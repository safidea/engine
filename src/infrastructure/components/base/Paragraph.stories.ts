import type { Meta, StoryObj } from '@storybook/react'
import { Paragraph } from './Paragraph'

const meta = {
  title: 'Base/Paragraph',
  component: Paragraph,
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
  },
}
