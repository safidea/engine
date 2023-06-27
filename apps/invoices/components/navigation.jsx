'use client'

    import Components from 'foundation/components'
    import { useRouter } from 'next/navigation'

    const Navigation = (props) => Components.navigation({ ...props, router: useRouter() })
    
    export default Navigation
    