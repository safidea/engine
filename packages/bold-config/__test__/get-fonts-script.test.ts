import { config } from './setup'
import getFontsScript from '../src/get-fonts-script'

test('get fonts script', async () => {
  const fonts = config.theme?.fonts ?? []
  const script = getFontsScript(fonts)
  for (const font of fonts) {
    expect(script).toContain(`--font-${font.name.toLowerCase().replace(/ /g, '-')}`)
  }
})
