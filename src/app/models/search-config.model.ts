import { SortDirection } from "@angular/material/sort"
import { Language, View } from "../enums"
import { Criterias } from "./"

export interface SearchConfig {
  page?: number;
  size?: number;
  sort?: string;
  direction?: SortDirection;
  term?: string;
  lang?: Language;
  criterias?: Criterias;
  view?: View;
  excludedActorIds?: number[];
}