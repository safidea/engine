import type { Props } from '@domain/entities/Component'

export const Html = ({ head, body }: Props['Html']) => (
  <html>
    <head>{head}</head>
    <body>{body}</body>
  </html>
)
