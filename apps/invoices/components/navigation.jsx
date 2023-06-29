'use client'

    import Components from 'foundation/components'
    import { useRouter } from 'next/navigation'
    
    export default function Navigation() {
      const router = useRouter()
      return <Components.Navigation router={router} />
    }
    