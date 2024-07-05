import type { Props } from '@domain/engine/page/component'
import { classNames, getFontClasses } from '../utils'

export const Markdown = ({ id, Content, className = '', font }: Props['Markdown']) => {
  return (
    <div id={id} className={classNames(getFontClasses(font), className)} data-component="Markdown">
      {Content}
    </div>
  )
}
