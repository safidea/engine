import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Link = ({
  id,
  className = '',
  label,
  href,
  PrefixIcon,
  SuffixIcon,
  active,
}: Props['Link']) => {
  const labelClass = classNames(PrefixIcon ? 'ml-3' : '', SuffixIcon ? 'mr-3' : '')
  const iconClass =
    'text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
  const linkClass = classNames(
    'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
    active ? 'bg-gray-100 dark:bg-gray-700' : ''
  )
  return (
    <a id={id} href={href} className={classNames(linkClass, className)}>
      {PrefixIcon ? <PrefixIcon className={iconClass} /> : null}
      <span className={labelClass}>{label}</span>
      {SuffixIcon ? <SuffixIcon className={iconClass} /> : null}
    </a>
  )
}
