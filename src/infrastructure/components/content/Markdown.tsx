import type { Props } from '@domain/entities/Component'
import { classNames, getFontClasses } from '../utils'

export const Markdown = ({ id, Content, className = '', font }: Props['Markdown']) => {
  return (
    <div id={id} className={classNames(getFontClasses(font), className)}>
      {Content}
    </div>
  )
}
