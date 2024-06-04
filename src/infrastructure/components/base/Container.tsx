import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'
import type { TextAlign } from '@domain/engine/page/component/base/Container'

export const Container = ({
  id,
  className = '',
  textAlign = 'left',
  children,
}: Props['Container']) => (
  <section id={id} className={classNames('bg-white dark:bg-gray-900', className)}>
    <div
      className={classNames(
        'py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12',
        getTextAlignClass(textAlign)
      )}
    >
      {children}
    </div>
  </section>
)

function getTextAlignClass(textAlign: TextAlign) {
  switch (textAlign) {
    case 'left':
      return 'text-left'
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
  }
}
