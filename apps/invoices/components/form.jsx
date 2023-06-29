'use client'

import Components from 'foundation/components'
import { useRouter } from 'next/navigation'

export default function Form() {
  const router = useRouter()
  return <Components.Form router={router} />
}
