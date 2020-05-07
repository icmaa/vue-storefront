import { NewsletterState as OrgNewsletterState } from '@vue-storefront/core/modules/newsletter/types/NewsletterState'

export interface NewsletterVoucher {
  rule_id: number,
  coupon_id: number,
  is_active: number,
  code: string
}

export default interface NewsletterState extends OrgNewsletterState {
  voucher: NewsletterVoucher
}
