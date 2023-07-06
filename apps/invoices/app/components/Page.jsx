'use client'

    import Page from 'client-component/dist/components/Page'
    import { useRouter } from 'next/navigation'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextPage(props) {
      const router = useRouter()
      return <Page {...props} router={router} components={{ Image, Link }} />
    }
    