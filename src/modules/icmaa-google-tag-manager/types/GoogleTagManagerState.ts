export default interface GoogleTagManagerState {
  key?: null|string,
  enabled: boolean
}

export interface AttributeMapItem {
  field: string,
  name?: string,
  type?: string
}
