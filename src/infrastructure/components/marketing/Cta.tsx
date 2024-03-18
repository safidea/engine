import type { Props } from '@infrastructure/engine'

export const Cta = ({ Title, Paragraph, Buttons }: Props['Cta']) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="max-w-screen-md">
        <Title className="mb-4" />
        <Paragraph className="mb-8" size="xl" />
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {Buttons.map((Button, index) => (
            <Button key={index} className="inline-flex items-center justify-center" />
          ))}
        </div>
      </div>
    </div>
  </section>
)
