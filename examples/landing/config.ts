import type { Config } from '../../src/server'

const config: Config = {
  name: 'Landing',
  pages: [
    {
      path: '/',
      title: 'Landing',
      components: [
        {
          type: 'container',
          components: [
            /*{
              type: 'column',
              components: [
                {
                  type: 'image',
                  url: 'https://solumy.com/img/screenshot.png',
                  alt: 'Requests',
                },
                {
                  type: 'title',
                  text: 'Requests',
                  size: 'large',
                },
                {
                  type: 'paragraph',
                  text: 'Solumy is a platform for managing requests. It allows you to create, view, and manage requests.',
                  size: 'large',
                },
                {
                  type: 'row',
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
              type: 'column',
              components: [
                {
                  type: 'image',
                  url: 'https://solumy.com/img/screenshot.png',
                  alt: 'Requests',
                },
              ],
            },*/
          ],
        },
        /*{
          type: 'marketing/logos',
          title: 'What our customers are saying',
          logos: [
            {
              url: 'https://solumy.com/img/logos/airbnb.svg',
              alt: 'Airbnb',
            },
            {
              url: 'https://solumy.com/img/logos/coinbase.svg',
              alt: 'Coinbase',
            },
            {
              url: 'https://solumy.com/img/logos/lyft.svg',
              alt: 'Lyft',
            },
            {
              url: 'https://solumy.com/img/logos/netflix.svg',
              alt: 'Netflix',
            },
            {
              url: 'https://solumy.com/img/logos/slack.svg',
              alt: 'Slack',
            },
            {
              url: 'https://solumy.com/img/logos/spotify.svg',
              alt: 'Spotify',
            },
          ],
        },
        {
          type: 'marketing/features',
          title: 'Features',
          tagline: 'Everything you need to manage your requests',
          subtitle: 'Everything you need to manage your requests',
          image: {
            url: 'https://solumy.com/img/features.png',
            alt: 'Features',
            position: 'left',
          },
          features: [
            {
              name: 'Feature 1',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-1.svg',
            },
            {
              name: 'Feature 2',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-2.svg',
            },
            {
              name: 'Feature 3',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-3.svg',
            },
          ],
        },
        {
          type: 'marketing/features',
          title: 'Features',
          tagline: 'Everything you need to manage your requests',
          subtitle: 'Everything you need to manage your requests',
          image: {
            url: 'https://solumy.com/img/features.png',
            alt: 'Features',
            position: 'right',
          },
          features: [
            {
              name: 'Feature 1',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-1.svg',
            },
            {
              name: 'Feature 2',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-2.svg',
            },
            {
              name: 'Feature 3',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-3.svg',
            },
          ],
        },
        {
          type: 'marketing/features',
          title: 'Features',
          tagline: 'Everything you need to manage your requests',
          subtitle: 'Everything you need to manage your requests',
          image: {
            url: 'https://solumy.com/img/features.png',
            alt: 'Features',
            position: 'left',
          },
          features: [
            {
              name: 'Feature 1',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-1.svg',
            },
            {
              name: 'Feature 2',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-2.svg',
            },
            {
              name: 'Feature 3',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisi.',
              icon: 'https://solumy.com/img/icons/feature-3.svg',
            },
          ],
        },
        {
          type: 'marketing/testimonials',
          title: 'What our customers are saying',
          tagline: 'Everything you need to manage your requests',
          display: 'grid',
          testimonials: [
            {
              name: 'John Doe',
              title: 'CEO, Company',
              image: {
                url: 'https://solumy.com/img/testimonials/john-doe.jpg',
                alt: 'John Doe',
              },
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
            },
            {
              name: 'John Doe',
              title: 'CEO, Company',
              image: {
                url: 'https://solumy.com/img/testimonials/john-doe.jpg',
                alt: 'John Doe',
              },
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
            },
            {
              name: 'John Doe',
              title: 'CEO, Company',
              image: {
                url: 'https://solumy.com/img/testimonials/john-doe.jpg',
                alt: 'John Doe',
              },
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
            },
            {
              name: 'John Doe',
              title: 'CEO, Company',
              image: {
                url: 'https://solumy.com/img/testimonials/john-doe.jpg',
                alt: 'John Doe',
              },
              quote:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae aliquet.',
            },
          ],
        },
        {
          type: 'marketing/pricing',
          title: 'Pricing',
          tagline: 'Everything you need to manage your requests',
          subtitle: 'Everything you need to manage your requests',
          plans: [
            {
              name: 'Basic',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              price: {
                monthly: 3000,
                yearly: 0,
              }
              features: [
                {
                  name: 'Feature 1',
                  included: true,
                },
                {
                  name: 'Feature 2',
                  included: true,
                },
                {
                  name: 'Feature 3',
                  included: false,
                },
                {
                  name: 'Feature 4',
                  included: false,
                },
              ],
              primaryButton: {
                label: 'Get Started',
                link: '/signup',
              },
            },
            {
              name: 'Basic',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              price: {
                monthly: 0,
                yearly: 0,
              }
              features: [
                {
                  name: 'Feature 1',
                  included: true,
                },
                {
                  name: 'Feature 2',
                  included: true,
                },
                {
                  name: 'Feature 3',
                  included: true,
                },
                {
                  name: 'Feature 4',
                  included: false,
                },
              ],
              primaryButton: {
                label: 'Get Started',
                link: '/signup',
              },
            },
             {
              name: 'Basic',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              price: {
                monthly: 0,
                yearly: 0,
              }
              features: [
                {
                  name: 'Feature 1',
                  included: true,
                },
                {
                  name: 'Feature 2',
                  included: true,
                },
                {
                  name: 'Feature 3',
                  included: true,
                },
                {
                  name: 'Feature 4',
                  included: true,
                },
              ],
              primaryButton: {
                label: 'Get Started',
                link: '/signup',
              },
            },
          ],      
        },
        {
          type: 'marketing/faq',
          title: 'Frequently Asked Questions',
          questions: [
            {
              question: 'Question 1?',
              answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
            },
            {
              question: 'Question 2?',
              answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
            },
            {
              question: 'Question 3?',
              answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
            },
            {
              question: 'Question 4?',
              answer:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget nunc ultricies aliquam. Donec euismod, nisl vitae.',
            },
          ],
        },
        {
          type: 'marketing/cta',
          display: 'panel',
          title: 'Ready to get started?',
          subtitle: 'Everything you need to manage your requests',
          primaryButton: {
            label: 'New Request',
            link: '/requests/new',
          },
          secondaryButton: {
            label: 'View Requests',
            link: '/requests',
          },
          image: {
            url: 'https://solumy.com/img/screenshot.png',
            alt: 'Requests',
          },
        },
        {
          type: 'marketing/footer',
          navigation: [
            {
              label: 'Home',
              link: '/',
            },
            {
              label: 'About',
              link: '/about',
            },
            {
              label: 'Contact',
              link: '/contact',
            },
          ],
          social: [
            {
              icon: 'twitter',
              link: 'https://twitter.com/solumy',
            },
            {
              icon: 'gitHub',
              link: '',
            },
            {
              icon: 'linkedIn',
              link: '',
            },
          ],
          copyright:
            '© 2021 Solumy. All rights reserved. Solumy is a registered trademark of Solumy, Inc.',
        },*/
      ],
    },
  ],
}

export default config
