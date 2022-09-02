export default interface CartState {
  itemsAfterPlatformTotals: any,
  platformTotals: any,
  platformTotalSegments: any,
  cartIsLoaded: boolean,
  cartServerToken: string,
  shipping: any,
  payment: any,
  cartItemsHash: string,
  cartServerLastSyncDate: number,
  cartServerLastTotalsSyncDate: number,
  cartItems: any[],
  connectBypassCount: number,
  isAddingToCart: boolean
}
