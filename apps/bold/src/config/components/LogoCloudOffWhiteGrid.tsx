// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Image from 'next/image'

export default function LogoCloudOffWhiteGrid() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-6 lg:py-16 lg:px-8">
        <p className="text-center text-lg font-semibold text-gray-600">
          Trusted by over 5 very average small businesses
        </p>
        <div className="mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-8">
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image
              src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
              alt="Workcation"
              className="max-h-12"
              width="50"
              height="50"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image
              src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
              alt="Mirage"
              className="max-h-12"
              width="50"
              height="50"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image
              src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
              alt="Tuple"
              className="max-h-12"
              width="50"
              height="50"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image
              src="https://tailwindui.com/img/logos/laravel-logo-gray-400.svg"
              alt="Laravel"
              className="max-h-12"
              width="50"
              height="50"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image
              src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
              alt="StaticKit"
              className="max-h-12"
              width="50"
              height="50"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <Image
              src="https://tailwindui.com/img/logos/statamic-logo-gray-400.svg"
              alt="Statamic"
              className="max-h-12"
              width="50"
              height="50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
