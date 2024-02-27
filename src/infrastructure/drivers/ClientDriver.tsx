import type { Driver } from '@adapter/spi/ClientSpi'
import type { FrameProps, StreamProps, StreamSourceProps } from '@domain/services/Client'

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

  getLinkProps = () => {
    return {
      'data-turbo-frame': '_top',
    }
  }
}
