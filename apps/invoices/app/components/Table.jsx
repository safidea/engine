'use client'

    import Table from 'client-component/dist/components/Table'
    import { useRouter } from 'next/navigation'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextTable(props) {
      const router = useRouter()
      return <Table {...props} router={router} components={{ Image, Link }} />
    }
    