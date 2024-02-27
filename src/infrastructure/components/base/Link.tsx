import type { Props } from '@infrastructure/engine'
import { classNames, getIcon } from '../utils'

export const Link = ({ label, href, beforeIcon, afterIcon, active }: Props['Link']) => {
  const BeforeIcon = beforeIcon && getIcon(beforeIcon)
  const AfterIcon = afterIcon && getIcon(afterIcon)
  const labelClass = classNames(BeforeIcon ? 'ml-3' : '', AfterIcon ? 'mr-3' : '')
  const iconClass =
    'w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
  const linkClass = classNames(
    'flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
    active ? 'bg-gray-100 dark:bg-gray-700' : ''
  )
  return (
    <a href={href} className={linkClass}>
      {BeforeIcon ? <BeforeIcon className={iconClass} /> : null}
      <span className={labelClass}>{label}</span>
      {AfterIcon ? <AfterIcon className={iconClass} /> : null}
    </a>
  )
}
