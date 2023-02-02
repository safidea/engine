
import Image from 'next/image'
import Link from 'next/link'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Popover } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'



    
export default function Header_OLD() {
  
  

  return (<Popover className={classes.container}>
<div className={classes._container.header}>
<div className={classes._container._header.logo}>
<Link href="/" className={classes._container._header._logo.image}>
<span className={classes._container._header._logo.label}>
{t('logoTitle')}
</span><Image src={logo.path} alt={t('logoTitle')} width={logo.width} height={logo.height} />
</Link>
</div><div className={classes._container._header.mobile}>
<Popover.Button className={classes._container._header._mobile.button}>
<span className={classes._container._header._mobile._button.label}>
{t('mobileMenu')}
</span><Bars3Icon aria-hidden="true" className={classes._container._header._mobile._button.icon} />
</Popover.Button>
</div><nav className={classes._container._header.navigation}>
{navigation.map((link: LinkInterface) => (<Link key={link.key} href={link.path} className={classes._container._header._navigation.link}>
{t(`navigation.${link.key}`)}
</Link>))}
</nav>{buttons && (<div className={classes._container._header.buttons}>
{buttons.secondary && (<Link href={buttons.secondary.path} className={classes._container._header._buttons.secondary}>
{t(`buttons.secondary`)}
</Link>)} {buttons.primary && (<Link href={buttons.primary.path} className={classes._container._header._buttons.primary}>
{t(`buttons.primary`)}
</Link>)}
</div>)}
</div><Transition as={Fragment} enter="duration-200 ease-out" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="duration-100 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
<Popover.Panel focus="true" className={classes._container.panel}>
<div className={classes._container._panel.header}>
<div className={classes._container._panel._header.top}>
<div className={classes._container._panel._header._top.logo}>
<div className={classes._container._panel._header._top._logo.image}>
<Image src={logo.path} alt={t('logoTitle')} width={logo.width} height={logo.height} />
</div><div className={classes._container._panel._header._top._logo.mobile}>
<Popover.Button className={classes._container._panel._header._top._logo._mobile.button}>
<span className={classes._container._panel._header._top._logo._mobile._button.label}>
{t('mobileMenu')}
</span><XMarkIcon aria-hidden="true" className={classes._container._panel._header._top._logo._mobile._button.icon} />
</Popover.Button>
</div>
</div>
</div><div className={classes._container._panel._header.bottom}>
<div className={classes._container._panel._header._bottom.navigation}>
{navigation.map((link: LinkInterface) => (<Link key={link.key} href={link.path} className={classes._container._panel._header._bottom._navigation.link}>
{t(`navigation.${link.key}`)}
</Link>))}
</div>{buttons && (<div className={classes._container._panel._header._bottom.buttons}>
{buttons.primary && (<Link href={buttons.primary.path} className={classes._container._panel._header._bottom._buttons.primary}>
{t(`buttons.primary`)}
</Link>)} {buttons.secondary && (<Link href={buttons.secondary.path} className={classes._container._panel._header._bottom._buttons.secondary}>
{t(`buttons.secondary`)}
</Link>)}
</div>)}
</div>
</div>
</Popover.Panel>
</Transition>
</Popover>)
}