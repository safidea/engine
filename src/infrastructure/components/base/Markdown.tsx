import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Markdown = ({ id, Content, className = '' }: Props['Markdown']) => {
  return (
    <p id={id} className={classNames(className)}>
      {Content}
    </p>
  )
}
