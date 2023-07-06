import Cta from 'client-component/dist/components/Cta'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextCta(props) {
      return <Cta {...props} components={{ Image, Link }} />
    }
    