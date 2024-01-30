import type { IBrowserElementDriver } from './IBrowserElementDriver'

export interface IBrowserPageDriver {
  open(url: string): Promise<void>
  title(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<IBrowserElementDriver | null>
  getInputByName(input: string): Promise<IBrowserElementDriver | null>
  close(): Promise<void>
}
