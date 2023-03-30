import { promises as fs } from 'fs'
import { config, folder } from './setup'
import getTailwindScript from '../src/get-tailwind-script'

test('get tailwind script', async () => {
  const script = getTailwindScript(config.theme ?? {})

  await fs.writeFile(folder + '/tailwind.js', script)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { theme } = await import('./__running__/tailwind.js')

  const { fonts, extend, ...props } = config.theme ?? {}
  const result = {
    extend: {
      ...extend,
      fontFamily: {},
    },
    ...props,
  }
  if (fonts) {
    result.extend.fontFamily = {
      primary: [`var(--font-${fonts[0].name.toLowerCase().replace(/ /g, '-')})`],
      secondary: [`var(--font-${fonts[1].name.toLowerCase().replace(/ /g, '-')})`],
    }
  }
  expect(theme).toEqual(result)
})
