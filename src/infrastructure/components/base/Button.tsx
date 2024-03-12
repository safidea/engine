import type { Variant } from '@domain/engine/page/component/base/Button'
import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Button = ({
  label,
  href,
  variant = 'primary',
  className = '',
  clientProps = {},
  type,
  action,
  method,
}: Props['Button']) => {
  const classes = getVariant(variant)
  if (action) {
    return (
      <form action={action} method={method}>
        <button type={type} className={classNames(classes, className)}>
          {label}
        </button>
      </form>
    )
  } else if (href) {
    return (
      <a className={classNames(classes, className)} href={href} {...clientProps}>
        {label}
      </a>
    )
  } else {
    return (
      <button type={type} className={classNames(classes, className)}>
        {label}
      </button>
    )
  }
}

function getVariant(ui: Variant) {
  switch (ui) {
    case 'primary':
      return 'text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'
    case 'secondary':
      return 'text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800'
  }
}
