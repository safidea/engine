'use client'

import { Components } from 'foundation'
import { useRouter } from 'next/navigation'

export default function Form(props) {
  const router = useRouter()
  return <Components.Form {...props} router={router} />
}
