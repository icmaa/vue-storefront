import { ImageHookProperties } from '../types/HookTypes'

const afterProductThumbnailPathGenerate = (props: ImageHookProperties, output): Partial<ImageHookProperties> => {
  let { path, sizeX, sizeY, pathType } = props
  if (!['storyblok'].includes(pathType)) {
    return output
  }

  if ((sizeX && sizeX > 0) || (sizeY && sizeY > 0)) {
    path = `${path}/m/${sizeX || 0}x${sizeY || 0}`
  }

  return { path }
}

export default { afterProductThumbnailPathGenerate }
