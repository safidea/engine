import type { Props } from '@infrastructure/client/engine'

export const Features = ({ Title, Paragraph, Features }: Props['Features']) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="max-w-screen-md mb-8 lg:mb-16">
        <Title className="mb-4" />
        <Paragraph size="xl" />
      </div>
      <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
        {Features.map((Feature, index) => {
          return (
            <div key={index}>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <Feature.Icon />
              </div>
              <Feature.Title className="mb-2" size="xs" />
              <Feature.Paragraph />
            </div>
          )
        })}
      </div>
    </div>
  </section>
)
