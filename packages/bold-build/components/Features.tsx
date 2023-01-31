import { ComponentPageInterface, ComponentTreeInterface } from '../../component/component.interfaces'
import Template from '../../component/Template'

const ui: ComponentTreeInterface = {
  "tag": "div",
  "class": "bg-white py-24 sm:py-32",
  "children": [
    {
      "tag": "div",
      "class": "mx-auto max-w-7xl px-6 lg:px-8",
      "children": [
        {
          "tag": "div",
          "class": "mx-auto max-w-2xl lg:text-center",
          "children": [
            {
              "tag": "h2",
              "class": "text-lg font-semibold leading-8 tracking-tight text-indigo-600",
              "children": [
                "Deploy faster"
              ]
            },
            {
              "tag": "p",
              "class": "mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl",
              "children": [
                "Everything you need to deploy your app"
              ]
            },
            {
              "tag": "p",
              "class": "mt-6 text-lg leading-8 text-gray-600",
              "children": [
                "Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc."
              ]
            }
          ]
        },
        {
          "tag": "div",
          "class": "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl",
          "children": [
            {
              "tag": "dl",
              "class": "grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16",
              "children": [
                "{features.map((feature) => (",
                {
                  "tag": "div",
                  "key": "{feature.name}",
                  "class": "relative pl-16",
                  "children": [
                    {
                      "tag": "dt",
                      "class": "text-base font-semibold leading-7 text-gray-900",
                      "children": [
                        {
                          "tag": "div",
                          "class": "absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600",
                          "children": [
                            {
                              "tag": "feature.icon",
                              "aria-hidden": "true",
                              "class": "h-6 w-6 text-white"
                            }
                          ]
                        },
                        "{feature.name}"
                      ]
                    },
                    {
                      "tag": "dd",
                      "class": "mt-2 text-base leading-7 text-gray-600",
                      "children": [
                        "{feature.description}"
                      ]
                    }
                  ]
                },
                "))}"
              ]
            }
          ]
        }
      ]
    }
  ]
}

export default function Features(props: ComponentPageInterface) {
  return (<Template ui={ui} {...props} />)
}