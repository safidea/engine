'use client'

import Navigation from 'client-component/dist/components/Navigation'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function NextNavigation(props) {
  const router = useRouter()
  return <Navigation {...props} router={router} components={{ Image, Link }} />
}
