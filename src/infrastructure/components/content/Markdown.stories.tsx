import type { Meta, StoryObj } from '@storybook/react'
import { Markdown } from './Markdown'

const meta = {
  title: 'Content/Markdown',
  component: Markdown,
} satisfies Meta<typeof Markdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Content: (
      <div>
        # Markdown
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
        ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
      </div>
    ),
  },
}
