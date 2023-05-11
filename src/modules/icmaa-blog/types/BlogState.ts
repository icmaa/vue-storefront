import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'
import { Route } from 'vue-router'

type Dictionary < T > = { [key: string]: T }
export interface BlogRoute extends Route {
  params: {
    identifier?: string
  } & Dictionary<string>
}

export interface BlogArticle extends AbstractStateItem {
  title: string
}

export default interface BlogState {
  urls: Record<string, string[]>,
  items: BlogArticle[]
}

export type BlogCategory = {
  url: string,
  name: string,
  children?: BlogCategory[]
}
