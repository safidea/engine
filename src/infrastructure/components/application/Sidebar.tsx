import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Sidebar = ({ id, className = '', Title, Links, children }: Props['Sidebar']) => (
  <div
    id={id}
    className={classNames('antialiased dark:bg-gray-900', className)}
    data-component="Sidebar"
  >
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
        {Title ? <Title className="mb-4 ml-2" /> : null}
        <ul className="space-y-2">
          {Links.map((Link, index) => (
            <li key={index}>
              <Link />
            </li>
          ))}
        </ul>
      </div>
    </aside>
    <main className="ml-64 h-auto">{children}</main>
  </div>
)
