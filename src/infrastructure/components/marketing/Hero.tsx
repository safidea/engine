import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Hero = ({ id, className = '', Title, Paragraph, Buttons }: Props['Hero']) => (
  <section id={id} className={classNames('bg-white dark:bg-gray-900', className)}>
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
