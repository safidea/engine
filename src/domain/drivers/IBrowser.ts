export interface IBrowserPage {
  open(url: string): Promise<void>
  title(): Promise<string>
  close(): Promise<void>
}

export interface IBrowser {
  launch(): Promise<IBrowserPage>
}
