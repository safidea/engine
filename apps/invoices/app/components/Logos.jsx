import Logos from 'client-component/dist/components/Logos'
import Image from 'next/image'
import Link from 'next/link'

export default function NextLogos(props) {
  return <Logos {...props} components={{ Image, Link }} />
}
