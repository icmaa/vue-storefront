import Product from 'core/modules/catalog/types/Product'

const getProductChildQtyByType = (product: Product): number => {
  if (product.type_id === 'configurable') {
    let qty = 0
    product.configurable_children.forEach(c => {
      if (c.stock.is_in_stock === true) {
        qty += c.stock.qty
      }
    })

    return qty
  } else if (product.type_id === 'bundle') {
    let qty = 0
    product.bundle_options?.forEach(o => {
      o.product_links?.forEach((p: any) => {
        if (p.stock.is_in_stock === true) {
          qty += p.stock.qty
        }
      })
    })

    return qty
  }

  return 0
}

export default getProductChildQtyByType
