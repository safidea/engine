'use client'

    import Hero from 'client-component/dist/components/Hero'
    import { useRouter } from 'next/navigation'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextHero(props) {
      const router = useRouter()
      return <Hero {...props} router={router} components={{ Image, Link }} />
    }
    