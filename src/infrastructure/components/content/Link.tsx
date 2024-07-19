import type { Props } from '@domain/entities/Component'
import { classNames, getFontClasses } from '../utils'

export const Link = ({
  id,
  className = '',
  label,
  href,
  PrefixIcon,
  SuffixIcon,
  active,
  font,
}: Props['Link']) => {
  const labelClass = classNames(PrefixIcon ? 'ml-3' : '', SuffixIcon ? 'mr-3' : '')
  const iconClass =
    'text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
  const linkClass = classNames(
    'inline-flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white group',
    active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
  )
  return (
    <a
      id={id}
      href={href}
      className={classNames(linkClass, getFontClasses(font), className)}
      data-active={active}
      data-component="Link"
    >
      {PrefixIcon ? <PrefixIcon className={iconClass} /> : null}
      <span className={labelClass}>{label}</span>
      {SuffixIcon ? <SuffixIcon className={iconClass} /> : null}
    </a>
  )
}
