import faker from 'faker'
import Settings from './Settings'

/**
 * Example usage:
 *
 * import { Faker, getRandomIcmaaEmail } from '../../support/utils/Faker'
 *
 * const faker = Faker()
 * const name = faker.name
 * const password = faker.internet.password()
 *
 * const email = getRandomIcmaaEmail()
 */

/**
 * Import faker.js using the current storeview or a specific one
 * @param country
 */
export const Faker = (country?: string): Faker.FakerStatic => {
  faker.locale = country || Settings.currentStoreView
  return faker
}

/**
 * Return a random ICMAA-like email address
 */
export const getRandomIcmaaEmail = () => {
  return [
    'a9.tests+',
    new Date().getTime(),
    '@impericon.com'
  ].join('')
}
