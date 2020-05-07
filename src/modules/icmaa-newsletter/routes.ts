const NewsletterVoucher = () => import(/* webpackChunkName: "vsf-icmaa-newsletter-newsletter-voucher" */ 'icmaa-newsletter/pages/NewsletterVoucher.vue')

export default [
  { name: 'newsletter-voucher', path: '/newsletter/voucher', component: NewsletterVoucher },
  { name: 'newsletter-birthday-voucher', path: '/newsletter/birthday-voucher', component: NewsletterVoucher, props: { isBirthday: true } }
]
