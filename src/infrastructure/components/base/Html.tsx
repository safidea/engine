import type { HtmlProps } from '@domain/entities/Component/Html'

export const Html = ({ head, body }: HtmlProps) => (
  <html>
    <head>{head}</head>
    <body>{body}</body>
  </html>
)
