export default interface GoogleTagManagerState {
  initiated: boolean,
  enabled: boolean,
  lastOrderId: string
}

export interface RouteEvent {
  event: string,
  'content-name': string,
  'content-view-name': string,
  [key: string]: any
}

export interface AttributeMapItem {
  field: string,
  name?: string,
  type?: string
}
