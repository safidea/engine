import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Heading = ({ id, className = '', Title, Buttons }: Props['Heading']) => (
  <section id={id} className={classNames('dark:bg-gray-800 relative overflow-hidden', className)}>
    <div className="flex flex-col border-b md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
      <div className="w-full md:w-1/2">
        <Title />
      </div>
      {Buttons && (
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          {Buttons.map((Button, index) => (
            <Button key={index} />
          ))}
        </div>
      )}
    </div>
  </section>
)
