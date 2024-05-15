import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Footer = ({
  id,
  className = '',
  Title,
  Paragraph,
  Links,
  copyright,
}: Props['Footer']) => (
  <footer id={id} className={classNames('p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800', className)}>
    <div className="mx-auto max-w-screen-xl text-center">
      <Title size="sm" className="flex justify-center items-center" />
      <Paragraph className="my-6" />
      <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
        {Links.map((Link, index) => (
          <li key={index}>
            <Link />
          </li>
        ))}
      </ul>
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">{copyright}</span>
    </div>
  </footer>
)
