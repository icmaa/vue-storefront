export default interface Coupon {
  number: string,
  pin: string,
  expires: string,
  balance: number,
  currency: string
}

export interface CouponResult {
  cert_id: number,
  cert_number: string,
  balance: number,
  currency_code: string,
  pin: number,
  status: string,
  expire_at: string|null,
  recipient_name: string|null,
  recipient_email: string|null,
  recipient_address: string|null,
  recipient_message: string|null,
  store_id: number,
  sender_name: string
}
