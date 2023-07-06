'use client'

    import Form from 'client-component/dist/components/Form'
    import { useRouter } from 'next/navigation'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextForm(props) {
      const router = useRouter()
      return <Form {...props} router={router} components={{ Image, Link }} />
    }
    