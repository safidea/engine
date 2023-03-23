// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { useTranslation } from 'next-i18next'
import Image from 'next/image'


    
export default function LogoCloudOffWhiteGrid() {
  
  
  const { t } = useTranslation()
  
  
  return (<div className="bg-white">
<div className="mx-auto max-w-7xl py-12 px-6 lg:py-16 lg:px-8">
<p className="text-center text-lg font-semibold text-gray-600">
{t("customers.title")}
</p><div className="mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-8">
<div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
<Image src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg" alt="Workcation" width="138" height="48" />
</div><div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
<Image src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg" alt="Mirage" width="138" height="48" />
</div><div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
<Image src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Tuple" width="138" height="48" />
</div><div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
<Image src="https://tailwindui.com/img/logos/laravel-logo-gray-400.svg" alt="Laravel" width="138" height="48" />
</div><div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
<Image src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="StaticKit" width="138" height="48" />
</div><div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
<Image src="https://tailwindui.com/img/logos/statamic-logo-gray-400.svg" alt="Statamic" width="138" height="48" />
</div>
</div>
</div>
</div>)
}