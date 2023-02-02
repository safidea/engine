



    
export default function Features() {
  
  

  return (<div className="bg-white py-24 sm:py-32">
<div className="mx-auto max-w-7xl px-6 lg:px-8">
<div className="mx-auto max-w-2xl lg:text-center">
<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
Deploy faster
</h2><p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
Everything you need to deploy your app
</p><p className="mt-6 text-lg leading-8 text-gray-600">
Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc.
</p>
</div><div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
<dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
{features.map((feature) => (<div key={feature.name} className="relative pl-16">
<dt className="text-base font-semibold leading-7 text-gray-900">
<div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
<feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
</div>{feature.name}
</dt><dd className="mt-2 text-base leading-7 text-gray-600">
{feature.description}
</dd>
</div>))}
</dl>
</div>
</div>
</div>)
}