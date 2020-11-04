import config from 'config'
import { ImageHookProperties, ImageHookReturn } from '../types/HookTypes'

const afterProductThumbnailPathGenerate = ({ path, sizeX, sizeY, pathType }: ImageHookProperties): ImageHookReturn => {
  let { baseUrl, quality } = config.icmaa_cdn['scalecommerce']

  const { paths } = config.images
  pathType = paths[pathType] || pathType

  baseUrl = baseUrl.replace(/\/*$/, '')
  path = path.replace(/^\/*/, '')

  if (sizeX && sizeY && sizeX > 0 && sizeY > 0) {
    path = `${baseUrl}/${sizeX}x${sizeY}x${quality}/${pathType}/${path}`
  } else {
    path = `${baseUrl}/${pathType}/${path}`
  }

  return { path }
}

export default { afterProductThumbnailPathGenerate }
