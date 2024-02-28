import type { Props } from '@infrastructure/engine'

export const Footer = ({ Title, Paragraph, Links, copyright }: Props['Footer']) => (
  <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
    <div className="mx-auto max-w-screen-xl text-center">
      <Title />
      <Paragraph />
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
