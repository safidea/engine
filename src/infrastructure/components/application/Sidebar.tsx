import type { Props } from '@infrastructure/engine'
import { Link } from '../base/Link'
import { Title } from '../base/Title'

export const Sidebar = ({ title, links, children }: Props['Sidebar']) => (
  <div className="antialiased dark:bg-gray-900">
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
        {title ? <Title text={title} size="md" className="mb-4" /> : null}
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link {...link} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
    <main className="p-4 md:ml-64 h-auto">{children}</main>
  </div>
)
