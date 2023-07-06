import Features from 'client-component/dist/components/Features'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextFeatures(props) {
      return <Features {...props} components={{ Image, Link }} />
    }
    