export interface ConfigStateStore {
  storeCode: string,
  extend?: string,
  [key: string]: any
}

export default interface ConfigState {
  map: ConfigStateStore[]
}
