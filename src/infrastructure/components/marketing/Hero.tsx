import type { Props } from '@infrastructure/engine'

export const Hero = ({ Title, Paragraph, Buttons }: Props['Hero']) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
      <Title size="xl" className="mb-4" />
      <Paragraph size="lg" className="mb-8" />
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        {Buttons.map((Button, index) => (
          <Button key={index} />
        ))}
      </div>
    </div>
  </section>
)
