import type { BrowserElementDriver } from './BrowserElementSPI'

export interface BrowserPageDriver {
  open(url: string): Promise<void>
  title(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<BrowserElementDriver | null>
  getInputByName(input: string): Promise<BrowserElementDriver | null>
  close(): Promise<void>
}
