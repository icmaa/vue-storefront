import { helpers } from 'vuelidate/lib/validators'

export const iban = (v: string): boolean => {
  return !helpers.req(v) || /[A-Z]{2}\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?[\d]{0,2}/.test(v)
}

export const bic = (v: string): boolean => {
  return !helpers.req(v) || /([a-zA-Z]{4})([a-zA-Z]{2})(([2-9a-zA-Z]{1})([0-9a-np-zA-NP-Z]{1}))((([0-9a-wy-zA-WY-Z]{1})([0-9a-zA-Z]{2}))|([xX]{3})|)/.test(v)
}
