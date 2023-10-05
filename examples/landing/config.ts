import type { Config } from '../../src/server'

const config: Config = {
  name: 'landing',
  pages: [
    {
      path: '/',
      title: 'Landing',
      components: [
        {
          type: 'container',
          components: [
            {
              type: 'columns',
              components: [
                {
                  type: 'rows',
                  components: [
                    {
                      type: 'title',
                      text: 'Requests',
                      size: 'extra-large',
                    },
                    {
                      type: 'paragraph',
                      text: 'Solumy Requests is a platform for managing requests. It allows you to create, view, and manage requests.',
                      size: 'large',
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'link',
                          text: 'New Request',
                          path: '/registration',
                          display: 'primary-button',
                        },
                        {
                          type: 'link',
                          text: 'View Requests',
                          path: '#features',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'image',
                  path: 'https://tailwindui.com/img/component-images/project-app-screenshot.png',
                  text: 'Requests',
                  width: '100%',
                },
              ],
            },
            {
              type: 'rows',
              components: [
                {
                  type: 'title',
                  text: 'What our customers are saying',
                },
                {
                  type: 'columns',
                  components: [
                    {
                      type: 'image',
                      path: 'https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg',
                      text: 'Transitor',
                      width: '200',
                    },
                    {
                      type: 'image',
                      path: 'https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg',
                      text: 'Reform',
                      width: '200',
                    },
                    {
                      type: 'image',
                      path: 'https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg',
                      text: 'Tuple',
                      width: '200',
                    },
                    {
                      type: 'image',
                      path: 'https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg',
                      text: 'Savvycal',
                      width: '200',
                    },
                    {
                      type: 'image',
                      path: 'https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg',
                      text: 'Statamic',
                      width: '200',
                    },
                  ],
                },
              ],
            },
            {
              type: 'columns',
              components: [
                {
                  type: 'rows',
                  components: [
                    {
                      type: 'title',
                      text: 'Features',
                      size: 'extra-small',
                    },
                    {
                      type: 'title',
                      text: 'Everything you need to manage your requests',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'image',
                  path: 'https://tailwindui.com/img/component-images/project-app-screenshot.png',
                  text: 'Statamic',
                  width: '100%',
                },
              ],
            },
            {
              type: 'columns',
              components: [
                {
                  type: 'image',
                  path: 'https://tailwindui.com/img/component-images/project-app-screenshot.png',
                  text: 'Statamic',
                  width: '100%',
                },
                {
                  type: 'rows',
                  components: [
                    {
                      type: 'title',
                      text: 'Features',
                      size: 'extra-small',
                    },
                    {
                      type: 'title',
                      text: 'Everything you need to manage your requests',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'columns',
              components: [
                {
                  type: 'rows',
                  components: [
                    {
                      type: 'title',
                      text: 'Features',
                      size: 'extra-small',
                    },
                    {
                      type: 'title',
                      text: 'Everything you need to manage your requests',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                    {
                      type: 'columns',
                      components: [
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
                          icon: {
                            name: 'home',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'image',
                  path: 'https://tailwindui.com/img/component-images/project-app-screenshot.png',
                  text: 'Statamic',
                  width: '100%',
                },
              ],
            },
            {
              type: 'rows',
              components: [
                {
                  type: 'title',
                  text: 'What our customers are saying',
                },
                {
                  type: 'columns',
                  components: [
                    {
                      type: 'card',
                      components: [
                        {
                          type: 'image',
                          path: 'https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg',
                          text: 'Transitor',
                          width: '200',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                        },
                      ],
                    },
                    {
                      type: 'card',
                      components: [
                        {
                          type: 'image',
                          path: 'https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg',
                          text: 'Transitor',
                          width: '200',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                        },
                      ],
                    },
                    {
                      type: 'card',
                      components: [
                        {
                          type: 'image',
                          path: 'https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg',
                          text: 'Transitor',
                          width: '200',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'rows',
              components: [
                {
                  type: 'title',
                  text: 'Pricing',
                },
                {
                  type: 'columns',
                  components: [
                    {
                      type: 'card',
                      components: [
                        {
                          type: 'title',
                          text: 'Basic',
                          size: 'small',
                        },
                        {
                          type: 'title',
                          text: '300€/month',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'button',
                          text: 'Sign up',
                        },
                      ],
                    },
                    {
                      type: 'card',
                      components: [
                        {
                          type: 'title',
                          text: 'Basic',
                          size: 'small',
                        },
                        {
                          type: 'title',
                          text: '300€/month',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'button',
                          text: 'Sign up',
                        },
                      ],
                    },
                    {
                      type: 'card',
                      components: [
                        {
                          type: 'title',
                          text: 'Basic',
                          size: 'small',
                        },
                        {
                          type: 'title',
                          text: '300€/month',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'paragraph',
                          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        },
                        {
                          type: 'button',
                          text: 'Sign up',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'columns',
              components: [
                {
                  type: 'rows',
                  components: [
                    {
                      type: 'title',
                      text: 'Frequently Asked Questions',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                    },
                  ],
                },
                {
                  type: 'rows',
                  components: [
                    {
                      type: 'title',
                      text: 'Frequently Asked Questions',
                      size: 'small',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                    },
                    {
                      type: 'title',
                      text: 'Frequently Asked Questions',
                      size: 'small',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                    },
                    {
                      type: 'title',
                      text: 'Frequently Asked Questions',
                      size: 'small',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                    },
                    {
                      type: 'title',
                      text: 'Frequently Asked Questions',
                      size: 'small',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                    },
                    {
                      type: 'title',
                      text: 'Frequently Asked Questions',
                      size: 'small',
                    },
                    {
                      type: 'paragraph',
                      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'card',
              components: [
                {
                  type: 'title',
                  text: 'Ready to get started?',
                },
                {
                  type: 'paragraph',
                  text: 'Everything you need to manage your requests',
                },
                {
                  type: 'button',
                  text: 'New Request',
                },
              ],
            },
            {
              type: 'columns',
              components: [
                {
                  type: 'link',
                  text: 'Home',
                  path: '/',
                },
                {
                  type: 'link',
                  text: 'About',
                  path: '/about',
                },
                {
                  type: 'link',
                  text: 'Contact',
                  path: '/contact',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default config
