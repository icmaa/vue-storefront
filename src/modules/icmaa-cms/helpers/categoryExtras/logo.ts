import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import { Logger } from '@vue-storefront/core/lib/logger'

export class Logo {
  protected name: string
  protected category: Category
  protected logoFileName: string

  public constructor (category: Category | string) {
    if (typeof category === 'string') {
      this.name = category
    } else {
      this.category = category
      this.name = category.name
    }
  }

  public getLogoFileName (): string {
    if (!this.logoFileName) {
      let name = this.name.toLowerCase()

      const allowedCharacterRegExp = /[^a-zA-Z0-9äüöÄÜÖ]/gm
      name = name.replace(allowedCharacterRegExp, '')

      const specialChars = ['ä', 'ö', 'ü', 'ï', 'ë', 'ß', 'Ä', 'Ö', 'Ü', 'Ï', 'Ë']
      const specialCharsRep = ['ae', 'oe', 'ue', 'ie', 'ee', 'ss', 'ae', 'oe', 'ue', 'ie', 'ee']
      specialChars.forEach((c, i) => {
        name = name.replace(c, specialCharsRep[i])
      })

      this.logoFileName = name
    }

    return this.logoFileName
  }
}
