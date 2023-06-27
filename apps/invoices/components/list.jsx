'use client'

    import Components from 'foundation/components'
    import { useRouter } from 'next/navigation'

    const List = (props) => Components.list({ ...props, router: useRouter() })
    
    export default List
    