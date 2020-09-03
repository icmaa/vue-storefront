/**
 * Overwrite default method with our, more simple variant.
 * We don't need to create the complete image path to be able to extend it using our `icmaa-cdn` hooks.
 * @param product
 */
export function getMediaGallery (product) {
  let mediaGallery = []
  if (product.media_gallery) {
    for (let mediaItem of product.media_gallery) {
      if (mediaItem.image) {
        mediaGallery.push({
          'src': mediaItem.image
        })
      }
    }
  }
  return mediaGallery
}
