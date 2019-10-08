export interface TeaserStateItem {
  showFrom: string,
  showTo: string,
  active: boolean,
  [key: string]: any
}

export default interface TeaserState {
  items: TeaserStateItem[]
}
