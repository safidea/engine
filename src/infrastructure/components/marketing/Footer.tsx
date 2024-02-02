import type { FooterProps } from '@domain/entities/page/Component/marketing/Footer'

export const Footer = ({ title, description, links, copyright }: FooterProps) => (
  <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
    <div className="mx-auto max-w-screen-xl text-center">
      <a
        href="#"
        className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
      >
        {title}
      </a>
      <p className="my-6 text-gray-500 dark:text-gray-400">{description}</p>
      <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className="mr-4 hover:underline md:mr-6 ">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">{copyright}</span>
    </div>
  </footer>
)
