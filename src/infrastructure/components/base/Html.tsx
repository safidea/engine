import type { Props } from '@infrastructure/engine/App'

export const Html = ({ head, body }: Props['Html']) => (
  <html>
    <head>{head}</head>
    <body>{body}</body>
  </html>
)
