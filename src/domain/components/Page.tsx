import type { IPageLink, IPageMeta, IPageScript } from '@domain/entities/page/IPage'

export interface PageProps {
  children: React.ReactNode
  title?: string
  metas?: IPageMeta[]
  scripts?: IPageScript[]
  links?: IPageLink[]
}

export const Page = ({ children, title, metas = [], scripts = [], links = [] }: PageProps) => (
  <html>
    <head>
      {title ? <title>{title}</title> : null}
      {metas.map((meta, index) => (
        <meta key={index} {...meta}></meta>
      ))}
      {scripts.map(({ src, type = 'text/javascript' }, index) => (
        <script key={index} type={type} src={src}></script>
      ))}
      {links.map(({ href }, index) => (
        <link key={index} rel="stylesheet" href={href}></link>
      ))}
    </head>
    <body>{children}</body>
  </html>
)
