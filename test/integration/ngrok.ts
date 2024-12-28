import http from 'http'
import type { INgrokIntegration } from '@adapter/spi/integrations/NgrokSpi'
import type { TestRunner } from '@test/integrations'

export function testNgrokIntegration(
  { describe, it, expect }: TestRunner,
  integration: INgrokIntegration
) {
  describe('start', () => {
    it('should return an url', async () => {
      // GIVEN
      const message = 'Congrats you have created an ngrok web server'
      const server = await new Promise<http.Server>((resolve) => {
        const srv = http.createServer((_, res) => {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(message)
        })
        srv.listen(() => resolve(srv))
      })
      const address = server.address()
      if (!address) {
        throw new Error('Server address is not valid')
      }
      const port =
        typeof address === 'string' ? parseInt(address.split(':').pop() || '', 10) : address.port

      // WHEN
      const url = await integration.start(port)

      // THEN
      const response = await fetch(url).then((res) => res.text())
      expect(response).toBe(message)
    })
  })
}
