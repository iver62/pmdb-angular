import { SortDirection } from "@angular/material/sort"
import { View } from "../enums"

export interface SearchConfig {
  page?: number,
  size?: number,
  sort?: string,
  direction?: SortDirection
  term?: string,
  view?: View
}