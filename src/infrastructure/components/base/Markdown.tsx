import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Markdown = ({ id, Content, className = '' }: Props['Markdown']) => {
  return (
    <div id={id} className={classNames(className)} data-component="Markdown">
      {Content}
    </div>
  )
}
