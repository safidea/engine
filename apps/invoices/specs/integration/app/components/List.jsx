'use client'

    import { Components } from 'foundation'
    import { useRouter } from 'next/navigation'
    
    export default function List(props) {
      const router = useRouter()
      return <Components.List {...props} router={router} />
    }
    