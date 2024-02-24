import type { StreamProps } from '@domain/services/Ui'

export default function Stream({ action, target, children }: StreamProps) {
  return (
    <turbo-stream action={action} target={target}>
      <template>{children}</template>
    </turbo-stream>
  )
}
