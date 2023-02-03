// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react'

import Image from 'next/image'


    
export default function Testimonials() {
  
  

  return (<section className="overflow-hidden bg-gray-50 py-12 md:py-20 lg:py-24">
<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
<svg width={404} height={404} fill="none" viewBox="0 0 404 404" role="img" aria-labelledby="svg-workcation" className="absolute top-full right-full translate-x-1/3 -translate-y-1/4 transform lg:translate-x-1/2 xl:-translate-y-1/2">
<title id="svg-workcation">
Workcation
</title><defs >
<pattern id="ad119f34-7694-4c31-947f-5c9d249b21f3" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
<rect x={0} y={0} width={4} height={4} fill="currentColor" className="text-gray-200" />
</pattern>
</defs><rect width={404} height={404} fill="url(#ad119f34-7694-4c31-947f-5c9d249b21f3)" />
</svg><div className="relative">
<Image src="https://tailwindui.com/img/logos/workcation-logo-indigo-600-mark-gray-800-and-indigo-600-text.svg" alt="Workcation" className="mx-auto h-8" width="50" height="50" /><blockquote className="mt-10">
<div className="mx-auto max-w-3xl text-center text-2xl font-medium leading-9 text-gray-900">
<p >
&ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.&rdquo;
</p>
</div><footer className="mt-8">
<div className="md:flex md:items-center md:justify-center">
<div className="md:flex-shrink-0">
<Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="mx-auto h-10 w-10 rounded-full" width="50" height="50" />
</div><div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
<div className="text-base font-medium text-gray-900">
Judith Black
</div><svg fill="currentColor" viewBox="0 0 20 20" className="mx-1 hidden h-5 w-5 text-indigo-600 md:block">
<path d="M11 0h3L9 20H6l5-20z" />
</svg><div className="text-base font-medium text-gray-500">
CEO, Workcation
</div>
</div>
</div>
</footer>
</blockquote>
</div>
</div>
</section>)
}