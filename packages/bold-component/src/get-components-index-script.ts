import { capitalize } from 'utils'
import type { ComponentUI } from '../types/component.type'

export default function getComponentsIndexScript(components: ComponentUI[]): string {
  let script = "import dynamic from 'next/dynamic'\nconst Components = {\n"
  components.forEach(({ name }) => {
    script += `${capitalize(name)}: dynamic(() => import('./${name}')),`
  })
  script += '}\nexport default Components'
  return script
}
