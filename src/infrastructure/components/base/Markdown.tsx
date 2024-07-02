import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Markdown = ({ id, content, className = '' }: Props['Markdown']) => {
  return (
    <p id={id} className={classNames(className)}>
      {content}
    </p>
  )
}
