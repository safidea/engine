import { capitalize } from 'utils'
import type { ComponentUI } from '../types/component.type'

export default function getComponentsIndexScript(components: ComponentUI[]): string {
  let script = ''
  components.forEach(({ name }) => {
    script += `export { default as ${capitalize(name)} } from './${name}'\n`
  })
  return script
}
