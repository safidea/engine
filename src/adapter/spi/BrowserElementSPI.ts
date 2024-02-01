export interface BrowserElementDriver {
  getAttribute(attribute: string): Promise<string | undefined>
  getValue(): Promise<string | undefined>
  type(value: string): Promise<void>
}
