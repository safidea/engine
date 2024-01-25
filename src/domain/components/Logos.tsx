export interface LogosProps {
  title: string
  logos: {
    src: string
    alt: string
  }[]
}

export interface ILogos extends LogosProps {
  component: 'Logos'
}

export const Logos = ({ title, logos }: LogosProps) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
      <h2 className="mb-8 lg:mb-16 text-3xl font-extrabold tracking-tight leading-tight text-center text-gray-900 dark:text-white md:text-4xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-3 lg:grid-cols-6 dark:text-gray-400">
        {logos.map((logo, index) => (
          <img
            key={index}
            className="h-12 opacity-50 hover:opacity-100 transition-opacity duration-200"
            src={logo.src}
            alt={logo.alt}
          />
        ))}
      </div>
    </div>
  </section>
)
