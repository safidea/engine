import type { Props } from '@infrastructure/engine'
import { Button } from '../base/Button'
import { Link } from '../base/Link'

export const Header = ({ title, links, buttons }: Props['Header']) => (
  <header>
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <a href="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            {title}
          </span>
        </a>
        <div className="justify-between items-center flex w-auto">
          <ul className="flex flex-row font-medium space-x-8 mt-0">
            {links.map((link, index) => (
              <li key={index}>
                <Link {...link} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center">
          {buttons.map((button, index) => (
            <Button key={index} {...button} />
          ))}
        </div>
      </div>
    </nav>
  </header>
)
