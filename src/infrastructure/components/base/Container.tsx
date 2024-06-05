import type { Props } from '@domain/engine/page/component'
import { classNames, getTextAlignClasses } from '../utils'

export const Container = ({ id, className = '', align = 'left', children }: Props['Container']) => (
  <section id={id} className={classNames('bg-white dark:bg-gray-900', className)}>
    <div
      className={classNames(
        'py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12',
        getTextAlignClasses(align)
      )}
    >
      {children}
    </div>
  </section>
)
