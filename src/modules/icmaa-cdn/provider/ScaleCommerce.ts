import config from 'config'
import { ImageHookProperties } from '../types/HookTypes'

const afterProductThumbnailPathGenerate = (props: ImageHookProperties, output): Partial<ImageHookProperties> => {
  let { path, sizeX, sizeY, pathType } = props
  if (!['product', 'media'].includes(pathType)) {
    return output
  }

  let { baseUrl, quality } = config.icmaa_cdn['scalecommerce']

  baseUrl = baseUrl.replace(/\/*$/, '')
  path = path.replace(/^\/*/, '')

  if (sizeX && sizeY && sizeX > 0 && sizeY > 0) {
    path = `${baseUrl}/${sizeX}x${sizeY}x${quality}/media/${path}`
  } else {
    path = `${baseUrl}/media/${path}`
  }

  return { path }
}

export default { afterProductThumbnailPathGenerate }
