import type { Meta, StoryObj } from '@storybook/react'
import { Form } from './Form'
import { Title } from '../content/Title'
import { Paragraph } from '../content/Paragraph'
import { Input } from '../base/Input'
import { Button } from '../base/Button'

const meta = {
  title: 'Application/Form',
  component: Form,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Contact us" {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know."
        {...props}
      />
    ),
    action: '#',
    Inputs: [
      (props) => (
        <Input
          name="name"
          label="Your name"
          placeholder="John Doe"
          type="text"
          required
          {...props}
        />
      ),
      (props) => (
        <Input name="email" label="Your email" placeholder="" type="email" required {...props} />
      ),
      (props) => (
        <Input
          name="subject"
          label="Subject"
          placeholder="Let us know how we can help you"
          type="text"
          required
          {...props}
        />
      ),
      (props) => (
        <Input
          name="message"
          label="Your message"
          placeholder="Leave a comment"
          type="text"
          required
          {...props}
        />
      ),
    ],
    Buttons: [(props) => <Button type="submit" label="Submit" variant="primary" {...props} />],
    formId: 'contact-form',
  },
}

export const Success: Story = {
  args: {
    ...Default.args,
    successMessage: 'Your message has been sent successfully!',
  },
}

export const WithDeleteButton: Story = {
  args: {
    ...Default.args,
    Buttons: [
      (props) => <Button type="submit" label="Delete Message" variant="secondary" {...props} />,
      (props) => <Button type="submit" label="Submit" variant="primary" {...props} />,
    ],
  },
}
