import { promises as fs } from 'fs'
import yaml from 'js-yaml'
import { fsExists } from '../build.utils'
import type {
  ComponentTreeInterface as Component,
  ComponentStateInterface as State,
} from '../../component/component.interfaces'

const folder = './config-folder'

function addElementToJson(
  json: Component,
  { el, text }: { el?: Component; text?: string }
): Component {
  if (el) {
    if (el.className) {
      el.class = el.className
      delete el.className
    }
    if (el._open) el.children = []
  } else if (text) {
    text = text.trim().replace(/  +/g, ' ')
    if (text === '') return json
  } else {
    return json
  }

  if (Object.keys(json).length === 0 && el) return el

  if (json.children != null) {
    const elements = json.children as (string | Component)[]
    const index = elements.findIndex((e: string | Component) => typeof e !== 'string' && e._open)
    if (index > -1) {
      const element = elements[index] as Component
      elements[index] = addElementToJson(element, { el, text })
    } else {
      if (el) {
        elements.push(el)
      } else if (text) {
        elements.push(text)
      }
    }
    json.children = elements
  }
  return json
}

function closeLastJsonElement(el: Component): Component {
  if (el.children) {
    const elements = el.children as (string | Component)[]
    const index = elements.findIndex((e: string | Component) => typeof e !== 'string' && e._open)
    if (index > -1) {
      const element = elements[index] as Component
      elements[index] = closeLastJsonElement(element)
    } else if (el.hasOwnProperty('_open')) {
      delete el._open
    }
  }
  return el
}

async function convertComponentToYaml(
  name: string,
  configFolder = folder,
  ext = 'jsx'
): Promise<void> {
  const filePath = `${configFolder}/${name}.yaml`
  if (await fsExists(filePath)) return

  const html = (await fs.readFile(`${configFolder}/${name}.${ext}`, 'utf8')).replace(/\n/g, '')

  let json: Component = {}
  const state: State = {
    status: 'text',
    key: '',
    value: '',
    element: {
      _open: 'true',
    },
  }
  for (let i = 0; i < html.length; i++) {
    switch (html[i]) {
      case '<':
        switch (state.status) {
          case 'value':
            state.value += html[i]
            break
          case 'text':
            json = addElementToJson(json, { text: state.value })
            state.value = ''
          default:
            state.status = 'tag'
            break
        }
        break
      case '>':
        switch (state.status) {
          case 'tag':
            state.element.tag = state.key
            state.key = ''
          case 'attribute':
            json = addElementToJson(json, { el: state.element })
            state.status = 'text'
            state.element = { _open: 'true' }
            break
          case 'close':
            state.status = 'text'
            break
          case 'text':
          case 'value':
            state.value += html[i]
            break
          default:
            break
        }
        break
      case ' ':
        switch (state.status) {
          case 'tag':
            state.status = 'attribute'
            state.element.tag = state.key
            state.key = ''
            break
          case 'text':
          case 'value':
            state.value += html[i]
            break
          case 'attribute':
            if (state.key !== '') {
              state.element[state.key] = 'true'
              state.key = ''
            }
            break
          default:
            break
        }
        break
      case '=':
        switch (state.status) {
          case 'text':
          case 'value':
            state.value += html[i]
            break
          default:
            break
        }
        break
      case '"':
        switch (state.status) {
          case 'attribute':
            state.status = 'value'
            break
          case 'value':
            state.status = 'attribute'
            state.element[state.key] = state.value
            state.key = ''
            state.value = ''
            break
          case 'text':
            state.value += html[i]
            break
          default:
            break
        }
        break
      case '{':
        switch (state.status) {
          case 'attribute':
            state.status = 'value'
          case 'value':
          case 'text':
            state.value += html[i]
            break
          default:
            break
        }
        break
      case '}':
        switch (state.status) {
          case 'value':
            if (state.value !== '') {
              state.value += html[i]
              state.status = 'attribute'
              state.element[state.key] = state.value
              state.key = ''
              state.value = ''
            }
            break
          case 'text':
            state.value += html[i]
            break
          default:
            break
        }
        break
      case '/':
        switch (state.status) {
          case 'tag':
            state.status = 'close'
            json = closeLastJsonElement(json)
            break
          case 'text':
          case 'value':
            state.value += html[i]
            break
          case 'attribute':
            state.status = 'close'
            delete state.element._open
            json = addElementToJson(json, { el: state.element })
            state.element = {
              _open: 'true',
            }
            break
          default:
            break
        }
        break
      default:
        switch (state.status) {
          case 'tag':
          case 'attribute':
            state.key += html[i]
            break
          case 'text':
          case 'value':
            state.value += html[i]
            break
          default:
            break
        }
        break
    }
  }

  await fs.writeFile(filePath, yaml.dump(json))
}

export default async function convertComponentsToYaml(configFolder = folder): Promise<void> {
  const components = await fs.readdir(configFolder)
  await Promise.all(
    components
      .filter((file: string) => file.match(/(.html|.jsx|.tsx)$/))
      .map((file: string) => {
        const [name, ext] = file.split('.')
        return convertComponentToYaml(name, configFolder, ext)
      })
  )
}
