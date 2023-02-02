import { theme, Components } from '../config'
import fonts from '../config/fonts'

import type { Component } from 'bold-page'

export default function Layout({ components }: { components: Component[] }) {
  const container = !!theme.container ? 'container' : ''
  const fontsJoined = fonts ? fonts.join(' ') : ''
  if (components === undefined) throw new Error('No components found in page.')

  return (
    <div className={[container, fontsJoined, 'font-primary'].join(' ')}>
      {components.map(({ type, id, props }: Component) => {
        const DynamicComponent = Components[type as keyof typeof Components] as React.FC<Component>
        if (!DynamicComponent) throw new Error(`No component found for type "${type}"`)
        return <DynamicComponent key={id} id={id} type={type} props={props} />
      })}
    </div>
  )
}
