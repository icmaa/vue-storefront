export interface CategoryExtras {
  hasLogo: boolean,
  logoline: boolean,
  product_logoline: boolean,
  account?: string|boolean|null,
  [key: string]: any
}

export interface CategoryExtrasContentHeader {
  [identifier: string]: CategoryExtrasContentHeaderContent[]
}

export interface CategoryExtrasContentHeaderContent {
  _uid: string,
  component: string,
  [key: string]: any
}

export default interface CategoryExtrasState {
  categoryContentHeader: CategoryExtrasContentHeader
}
