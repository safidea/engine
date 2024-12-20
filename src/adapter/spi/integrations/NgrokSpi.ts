import type { NgrokConfig } from '@domain/integrations/Ngrok'

export interface INgrokIntegration {
  getConfig: () => NgrokConfig
  start: (port: number) => Promise<string>
  stop: () => Promise<void>
}
