'use client'

import Components from 'foundation/components'
import { useRouter } from 'next/navigation'

export default function List() {
  const router = useRouter()
  return <Components.List router={router} />
}
