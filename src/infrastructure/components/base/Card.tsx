import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Card = ({ id, className = '', Title, Paragraph, Image, href }: Props['Card']) => {
  const Layout = ({ id, className = '' }: { id?: string; className?: string }) => (
    <div
      id={id}
      className={classNames(
        'max-w-sm bg-white border border-gray-200 hover:bg-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700',
        className
      )}
    >
      <Image className="rounded-t-lg w-full object-cover h-96 mb-0" />
      <div className="p-5">
        <Title />
        <Paragraph className="mb-0" />
      </div>
    </div>
  )
  if (href)
    return (
      <a href={href} id={id} className={className}>
        <Layout />
      </a>
    )
  return <Layout id={id} className={className} />
}
