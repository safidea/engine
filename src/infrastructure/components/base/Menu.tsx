import type { Props } from '@domain/engine/page/component'

export const Menu = ({ id, className = '', label, Links }: Props['Menu']) => {
  return (
    <div id={id} data-controller="menu" className={className}>
      <button
        data-action="click->menu#open"
        className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        {label}
      </button>
      <div
        data-menu-target="panel"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden absolute left-1/2 z-10 mt-5 w-screen max-w-max -translate-x-1/2"
      >
        <div className="max-w-sm flex-auto rounded-3xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5">
          {Links.map((Link, index) => {
            return <Link key={index} />
          })}
        </div>
      </div>
    </div>
  )
}
