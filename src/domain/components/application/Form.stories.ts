import type { Meta, StoryObj } from '@storybook/react'
import { Form } from './Form'

const meta = {
  title: 'Application/Form',
  component: Form,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Contact Us',
    description:
      'Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.',
    inputs: [
      {
        name: 'email',
        label: 'Your email',
        placeholder: 'name@flowbite.com',
        type: 'email',
        required: true,
      },
      {
        name: 'subject',
        label: 'Subject',
        placeholder: 'Let us know how we can help you',
        type: 'text',
        required: true,
      },
      {
        name: 'message',
        label: 'Your message',
        placeholder: 'Leave a comment',
        type: 'text',
        required: true,
      },
    ],
    submitButton: {
      label: 'Send message',
    },
  },
}

export const Success: Story = {
  args: {
    ...Default.args,
    successMessage: 'Your message has been sent successfully!',
  },
}
