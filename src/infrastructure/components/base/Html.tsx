import type { Props } from '@domain/engine/page/component'

export const Html = ({ head, body }: Props['Html']) => (
  <html>
    <head>{head}</head>
    <body>{body}</body>
  </html>
)
