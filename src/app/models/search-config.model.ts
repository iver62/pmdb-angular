import { SortDirection } from "@angular/material/sort"
import { View } from "../enums"
import { Criterias } from "./"

export interface SearchConfig {
  page?: number,
  size?: number,
  sort?: string,
  direction?: SortDirection
  term?: string,
  lang?: string,
  criterias?: Criterias,
  view?: View
}