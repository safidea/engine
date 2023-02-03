import { promises as fs } from 'fs'
import yaml from 'js-yaml'

import type { UI, State } from 'bold-component'

const importComponentsFolder = './import/components'
const configComponentsFolder = './config/components'

function getState(script: string): State {
  const state: State = {}
  const statesKeys = script.match(/(?<=\[)[a-zA-Z]+(?=,)/g)
  const statesValues = script.match(/(?<=useState\().+(?=\))/g)
  if (statesKeys && statesValues) {
    for (let i = 0; i < statesKeys.length; i++) {
      state[statesKeys[i]] = statesValues[i]
    }
  }
  return state
}

function getProps(script: string): string[] {
  const props = script.match(
    /(?<=const\s)[a-z][a-zA-Z]+(?=\s=)|(?<=function\s)[a-z][a-zA-Z]+(?=\()/g
  )
  return props || []
}

function addElementToJson(json: UI, { el, text }: { el?: UI; text?: string }): UI {
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
    const elements = json.children as (string | UI)[]
    const index = elements.findIndex((e: string | UI) => typeof e !== 'string' && e._open)
    if (index > -1) {
      const element = elements[index] as UI
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

function closeLastJsonElement(el: UI): UI {
  if (el.children) {
    const elements = el.children as (string | UI)[]
    const index = elements.findIndex((e: string | UI) => typeof e !== 'string' && e._open)
    if (index > -1) {
      const element = elements[index] as UI
      elements[index] = closeLastJsonElement(element)
    } else if (el.hasOwnProperty('_open')) {
      delete el._open
    }
  }
  return el
}

function convertComponentToYaml(script: string): UI {
  let json: UI = {}
  const state: {
    status: 'text' | 'tag' | 'attribute' | 'value' | 'close'
    key: string
    value: string
    element: UI
  } = {
    status: 'text',
    key: '',
    value: '',
    element: {
      _open: 'true',
    },
  }

  const match = script.match(/(?<=return\s\().+(?=\))/gs)
  if (!match) throw new Error(`No return react statement found in script: \`${script}\``)
  script = match[0].replace(/\n/g, '')

  for (let i = 0; i < script.length; i++) {
    switch (script[i]) {
      case '<':
        switch (state.status) {
          case 'value':
            state.value += script[i]
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
            state.value += script[i]
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
            state.value += script[i]
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
            state.value += script[i]
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
            state.value += script[i]
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
            state.value += script[i]
            break
          default:
            break
        }
        break
      case '}':
        switch (state.status) {
          case 'value':
            if (state.value !== '') {
              state.value += script[i]
              state.status = 'attribute'
              state.element[state.key] = state.value
              state.key = ''
              state.value = ''
            }
            break
          case 'text':
            state.value += script[i]
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
            state.value += script[i]
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
            state.key += script[i]
            break
          case 'text':
          case 'value':
            state.value += script[i]
            break
          default:
            break
        }
        break
    }
  }

  return json
}

;(async () => {
  const components = await fs.readdir(importComponentsFolder)
  const reactFiles = components.filter((file: string) => file.match(/(.jsx|.tsx)$/))
  for (const file of reactFiles) {
    console.log(`Converting ${file} to yaml`)
    const [name] = file.split('.')
    const script = await fs.readFile(`${importComponentsFolder}/${file}`, 'utf8')
    const ui = convertComponentToYaml(script)
    const state = getState(script)
    const props = getProps(script)
    const component = {
      name,
      state,
      props,
      ui,
    }
    await fs.writeFile(`${configComponentsFolder}/${name}.yaml`, yaml.dump(component))
    console.log(`${file} converted!\n`)
  }
})()
