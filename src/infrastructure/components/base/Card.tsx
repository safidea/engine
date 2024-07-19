import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Card = ({ id, className = '', Title, Paragraph, Image, href }: Props['Card']) => {
  const mainClasses = classNames('mb-4', className)
  const Layout = ({ id, className = '' }: { id?: string; className?: string }) => (
    <div
      id={id}
      className={classNames(
        'max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700',
        href ? 'hover:bg-gray-100' : '',
        className
      )}
      data-component="Card"
    >
      {Image ? <Image className="rounded-t-lg w-full h-64 object-cover mb-0" /> : null}
      <div className="p-5">
        <Title />
        <Paragraph className="mb-0" />
      </div>
    </div>
  )
  if (href)
    return (
      <a href={href} id={id} className={mainClasses}>
        <Layout />
      </a>
    )
  return <Layout id={id} className={mainClasses} />
}
