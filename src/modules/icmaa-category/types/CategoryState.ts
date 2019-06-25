export default interface CategoryState {
  lists: CategoryStateListItem[]
}

export interface CategoryStateListItem {
  parent: CategoryStateCategory,
  list: CategoryStateCategory[]
}

export interface CategoryStateCategory {
  id: string
}
