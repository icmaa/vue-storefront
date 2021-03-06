import { AbstractStateItem } from './AbstractState'

export interface PageStateItem extends AbstractStateItem {
  routeName: string,
  content: string,
  rte: string,
  metaTitle: string,
  metaDescription: string,
  metaTags: string
}

export default interface PageState {
  items: PageStateItem[]
}
