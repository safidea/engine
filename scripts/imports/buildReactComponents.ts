import fs from 'fs-extra'
import { join } from 'path'
import { buildCodeFromRules } from './openai'

const dir = join(__dirname, 'components')

const buildReactComponent = async (name: string) => {
  const html: { style: string; code: string }[] = await fs.readJSON(join(dir, `${name}.json`))
  const guidelines = [
    'Your task is to build and return a TypeScript Functional Component file code.',
    'You will get in a JSON a list of HTML code with the type of style that are examples of what the component should render depending on the props configuration.',
    "The component should be named according to the 'name' provided.",
    'The component should only use props to change its design and be able to render different HTML examples base on multiples props.',
    'The component should be able to render all the examples provided in the JSON.',
    'The component should be used as if it was a UI library component.',
    "Each type of each example should be rendered by a combination of different values in props, you can't use the type as a prop, you should use the props to render the type.",
    "You can use this import: 'import { classNames } from '../utils'' to merge multiple classes in one string, here is the function: export function classNames(...classes: (string | undefined)[]) {  const filtered = classes.filter(Boolean)  if (filtered.length === 0) return undefined  return filtered.join(' ')}",
    'Text values should be passed as props to the component.',
    'You should not use any hooks, states or manual React imports.',
  ]
  const userPrompt =
    'Generate a react component code from this JSON : ' + JSON.stringify({ html, name }, null, 2)
  console.log(`Building ${name}.tsx component from a ${userPrompt.length} length user prompt`)
  const { code } = await buildCodeFromRules(guidelines, userPrompt)
  await fs.writeFile(
    join(process.cwd(), 'src/infrastructure/components/__imports', `${name}.tsx`),
    code
  )
}

buildReactComponent('accordion')
