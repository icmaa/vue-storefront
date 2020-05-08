const NewsletterVoucher = () => import(/* webpackChunkName: "vsf-icmaa-newsletter-newsletter-voucher" */ 'icmaa-newsletter/pages/NewsletterVoucher.vue')

export default [
  { name: 'icmaa-newsletter-voucher', path: '/newsletter/voucher', component: NewsletterVoucher },
  { name: 'icmaa-newsletter-birthday-voucher', path: '/newsletter/birthday-voucher', component: NewsletterVoucher, props: { isBirthday: true } }
]
