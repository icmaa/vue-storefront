export interface ImageHookProperties {
  path: string,
  pathType: string,
  sizeX: number,
  sizeY: number
}

export interface ImageHook {
  afterProductThumbnailPathGenerate(params: ImageHookProperties, output: unknown)
}
