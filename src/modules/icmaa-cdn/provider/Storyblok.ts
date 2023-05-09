import config from 'config'
import { ImageHookProperties, ImageHookReturn } from '../types/HookTypes'

const afterProductThumbnailPathGenerate = ({ path, sizeX, sizeY, pathType }: ImageHookProperties): ImageHookReturn => {
  if (!['storyblok'].includes(pathType)) return { path }

  if ((sizeX && sizeX > 0) || (sizeY && sizeY > 0)) {
    path = `${path}/m/${sizeX || 0}x${sizeY || 0}`
  }

  return { path }
}

export default { afterProductThumbnailPathGenerate }
