// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck



import Link from 'next/link'

import type { ComponentUI } from 'bold-component'
    
export default function Footer({ props }: ComponentUI) {
  const { navigation } = props
  
  
  
  return (<footer className="bg-white">
<div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
<nav aria-label="Footer" className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12">
{navigation.main.map((item) => (<div key={item.name} className="pb-6">
<Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
{item.name}
</Link>
</div>))}
</nav><div className="mt-10 flex justify-center space-x-10">
{navigation.social.map((item) => (<Link key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
<span className="sr-only">
{item.name}
</span><item.icon aria-hidden="true" className="h-6 w-6" />
</Link>))}
</div><p className="mt-10 text-center text-xs leading-5 text-gray-500">
&copy; 2020 Your Company, Inc. All rights reserved.
</p>
</div>
</footer>)
}