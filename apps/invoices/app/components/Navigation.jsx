'use client'

import { Components } from 'foundation'
import { useRouter } from 'next/navigation'

export default function Navigation(props) {
  const router = useRouter()
  return <Components.Navigation {...props} router={router} />
}
