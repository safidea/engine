export interface IBrowserElement {}

export interface IBrowserPage {
  open(url: string): Promise<void>
  getByText(text: string): Promise<IBrowserElement | null>
  close(): Promise<void>
}

export interface IBrowserLaunchOptions {
  baseUrl: string
}

export interface IBrowser {
  launch(options?: IBrowserLaunchOptions): Promise<IBrowserPage>
}
