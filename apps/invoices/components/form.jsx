'use client'

    import Components from 'foundation/components'
    import { useRouter } from 'next/navigation'

    const Form = (props) => Components.form({ ...props, router: useRouter() })
    
    export default Form
    