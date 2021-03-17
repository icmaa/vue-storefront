export interface ImageHookProperties {
  path: string,
  pathType: string,
  sizeX: number,
  sizeY: number
}

export interface ImageHookReturn {
  path: string
}

export interface ImageHook {
  afterProductThumbnailPathGenerate(params: ImageHookProperties): ImageHookReturn
}
