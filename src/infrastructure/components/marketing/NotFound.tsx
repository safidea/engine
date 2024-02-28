import type { Props } from '@infrastructure/engine'

export const NotFound = ({ Title, Paragraph, Button }: Props['NotFound']) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
          404
        </h1>
        <Title />
        <Paragraph />
        <Button />
      </div>
    </div>
  </section>
)
