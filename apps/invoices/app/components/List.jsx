'use client'

import List from 'client-component/dist/components/List'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function NextList(props) {
  const router = useRouter()
  return <List {...props} router={router} components={{ Image, Link }} />
}
