export interface IBrowserPage {
  open(url: string): Promise<void>
  title(): Promise<string>
}

export interface IBrowser {
  openPage(url: string): Promise<IBrowserPage>
  close(): Promise<void>
}
