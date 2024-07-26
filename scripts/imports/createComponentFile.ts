import fs from 'fs-extra'
import { getChatGPTResponse } from './openai'
import { join } from 'path'

interface Params {
  component: string
  category: string
  prompt:
    | 'createComponentConfig'
    | 'createComponentEntity'
    | 'createComponentInfra'
    | 'createComponentMapper'
    | 'createComponentStories'
    | 'createComponentTests'
    | 'createReactComponent'
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

async function createComponentFile({ component, category, prompt }: Params) {
  console.log(`Running ${prompt} for ${category}/${component}`)
  let path = ''
  if (prompt === 'createReactComponent') {
    path = `src/infrastructure/components/__imports__/${capitalize(component)}.tsx`
  } else if (prompt === 'createComponentConfig') {
    path = `src/adapter/api/configs/Component/${category}/${capitalize(component)}Config.ts`
  } else if (prompt === 'createComponentEntity') {
    path = `src/domain/entities/Component/${category}/${capitalize(component)}.ts`
  } else if (prompt === 'createComponentInfra') {
    path = `src/infrastructure/components/${category}/${capitalize(component)}.tsx`
  } else if (prompt === 'createComponentMapper') {
    path = `src/adapter/api/mappers/Component/${category}/${capitalize(component)}Mapper.ts`
  } else if (prompt === 'createComponentStories') {
    path = `src/infrastructure/components/${category}/${capitalize(component)}.stories.tsx`
  } else if (prompt === 'createComponentTests') {
    path = `tests/components/${category}/${component}.test.ts`
  } else {
    throw new Error('Invalid prompt')
  }
  const system = await fs.readFile(join(__dirname, `prompts/${prompt}.txt`), 'utf-8')
  const examples = await fs.readJSON(join(__dirname, `components/${component}.json`))
  const user = JSON.stringify({ component, examples }, null, 2)
  const code = await getChatGPTResponse({ system, user })
  await fs.writeFile(path, code)
  console.log(`Created ${path}`)
}

createComponentFile({ component: 'accordion', category: 'base', prompt: 'createReactComponent' })
