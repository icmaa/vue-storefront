import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'

export interface BlogArticle extends AbstractStateItem {
  title: string
}

export default interface BlogState {
  items: BlogArticle[]
}
