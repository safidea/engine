import type { Variant } from '@domain/engine/page/component/base/Button'
import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Button = ({
  id,
  label,
  href,
  variant = 'primary',
  className = '',
  actionClientProps = {},
  type,
  action,
  method,
  formId,
  // TODO: replace this infrastructure dependency by domain dependency
  'data-action': actionData,
}: Props['Button']) => {
  const classes = getVariant(variant)
  if (action) {
    return (
      <form
        action={action}
        method={method}
        className="m-0"
        {...actionClientProps}
        data-component="Button"
      >
        <button id={id} type={type} className={classNames(classes, className)}>
          {label}
        </button>
      </form>
    )
  } else if (href) {
    return (
      <a
        id={id}
        className={classNames(classes, className)}
        href={href}
        {...actionClientProps}
        data-component="Button"
      >
        {label}
      </a>
    )
  } else {
    return (
      <button
        id={id}
        type={type}
        form={formId}
        className={classNames(classes, className)}
        data-action={actionData}
        data-component="Button"
      >
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
