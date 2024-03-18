export {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'turbo-frame': {
        id: string
        class?: string
        children: React.ReactNode
        target?: string
        'data-turbo-action'?: string
      }
      'turbo-stream': {
        action: string
        target: string
        children: React.ReactNode
      }
      'turbo-stream-source': { src: string }
    }
  }

  interface Window {
    Stimulus: import('@hotwired/stimulus').Application
    setEditorValue(value: string): void
    getEditorValue(): string | undefined
  }
}
