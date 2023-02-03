import dynamic from 'next/dynamic'
const Components = {
CTA: dynamic(() => import('./CTA')),Features: dynamic(() => import('./Features')),Footer: dynamic(() => import('./Footer')),Header: dynamic(() => import('./Header')),Hero: dynamic(() => import('./Hero')),Stats: dynamic(() => import('./Stats')),Testimonials: dynamic(() => import('./Testimonials')),}
export default Components