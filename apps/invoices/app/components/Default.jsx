import Default from 'client-component/dist/components/Default'
import Image from 'next/image'
import Link from 'next/link'

export default function NextDefault(props) {
  return <Default {...props} components={{ Image, Link }} />
}
