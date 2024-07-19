import type { Props } from '@domain/entities/Component'

export const NotFound = ({ Title, Paragraph, Button }: Props['NotFound']) => (
  <section className="bg-white dark:bg-gray-900" data-component="NotFound">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
          404
        </h1>
        <div className="mb-8">
          <Title align="center" />
          <Paragraph align="center" size="lg" />
        </div>
        <Button />
      </div>
    </div>
  </section>
)
