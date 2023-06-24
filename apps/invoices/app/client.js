import AppClient from 'foundation/client'
import Image from 'next/image'
import Link from 'next/link'

export default function NextAppClient({ page }) {
  return <AppClient serverProviderComponents={{ Image, Link }} page={page} />
}
