export interface IBrowserElement {
  getAttribute(attribute: string): Promise<string | undefined>
  getValue(): Promise<string | undefined>
  type(value: string): Promise<void>
}

export interface IBrowserPage {
  open(url: string): Promise<void>
  title(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<IBrowserElement | null>
  getInputByName(input: string): Promise<IBrowserElement | null>
  close(): Promise<void>
}

export interface IBrowserLaunchOptions {
  baseUrl: string
}

export interface IBrowser {
  launch(options?: IBrowserLaunchOptions): Promise<IBrowserPage>
}
