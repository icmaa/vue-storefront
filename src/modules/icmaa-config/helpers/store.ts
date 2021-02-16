import { storeViews } from 'config'

export const storeCodeFromUrlPath = (path: string): string|boolean => {
  const { multistore, mapStoreUrlsFor: storeCodes } = storeViews

  if (multistore) {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    const regex = new RegExp(`^/(${storeCodes.join('|')})`, 'i')
    if (regex.test(path)) {
      return regex.exec(path).pop()
    }
  }

  return false
}
