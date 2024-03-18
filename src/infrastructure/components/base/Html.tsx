import type { Props } from '@infrastructure/engine'

export const Html = ({ head, body }: Props['Html']) => (
  <html>
    <head>{head}</head>
    <body>{body}</body>
  </html>
)
