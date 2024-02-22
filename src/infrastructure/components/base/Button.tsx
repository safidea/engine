import type { Props } from '@infrastructure/engine'

export const Button = ({ label, href, variant = 'primary' }: Props['Button']) => {
  const classes = getVariant(variant)
  if (href) {
    return (
      <a className={classes} href={href}>
        {label}
      </a>
    )
  } else {
    return <button className={classes}>{label}</button>
  }
}

function getVariant(ui: Props['Button']['variant']) {
  switch (ui) {
    case 'primary':
      return 'text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'
    case 'secondary':
      return 'text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800'
  }
}
