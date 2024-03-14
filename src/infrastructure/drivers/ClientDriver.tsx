import type { Driver } from '@adapter/spi/ClientSpi'
import type {
  ActionProps,
  FrameProps,
  StreamProps,
  StreamSourceProps,
} from '@domain/services/Client'

export class ClientDriver implements Driver {
  constructor() {}

  get metas() {
    return [
      {
        name: 'turbo-refresh-method',
        content: 'morph',
      },
      {
        name: 'turbo-refresh-scroll',
        content: 'preserve',
      },
    ]
  }

  Frame = ({ navigation, frameId, children, ...props }: FrameProps) => {
    return (
      <turbo-frame data-turbo-action={navigation} target={frameId} {...props}>
        {children}
      </turbo-frame>
    )
  }

  Stream = ({ action, target, children }: StreamProps) => {
    return (
      <turbo-stream action={action} target={target}>
        <template>{children}</template>
      </turbo-stream>
    )
  }

  StreamSource = (props: StreamSourceProps) => {
    return <turbo-stream-source {...props} />
  }

  getActionProps = (options?: ActionProps) => {
    const { reloadPageFrame = false, redirectPage = false } = options || {}
    const props: {
      'data-turbo-frame'?: string
      'data-turbo-action'?: string
    } = {}
    if (reloadPageFrame) props['data-turbo-frame'] = '_top'
    if (redirectPage) props['data-turbo-action'] = 'replace'
    return props
  }
}
