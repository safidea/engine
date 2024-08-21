import type { Props } from '@domain/entities/Component'

export const Html = ({ head, body }: Props['Html']) => (
  <html>
    <head lang="en">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {head}
    </head>
    <body>{body}</body>
  </html>
)
