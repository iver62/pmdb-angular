import { View } from "../enums"

export interface SearchConfig {
  page?: number,
  size?: number,
  sort?: string,
  direction?: 'asc' | 'desc'
  term?: string,
  view?: View
}