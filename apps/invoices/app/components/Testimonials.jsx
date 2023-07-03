import Testimonials from 'client-component/dist/components/Testimonials'
import Image from 'next/image'
import Link from 'next/link'

export default function NextTestimonials(props) {
  return <Testimonials {...props} components={{ Image, Link }} />
}
