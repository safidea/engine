import Footer from 'client-component/dist/components/Footer'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function NextFooter(props) {
      return <Footer {...props} components={{ Image, Link }} />
    }
    