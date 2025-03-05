import { SortDirection } from "@angular/material/sort"
import { View } from "../enums"
import { Filters } from "./filters.model"

export interface SearchConfig {
  page?: number,
  size?: number,
  sort?: string,
  direction?: SortDirection
  term?: string,
  filters?: Filters,
  view?: View
}