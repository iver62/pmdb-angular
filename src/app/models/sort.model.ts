import { SortDirection } from "@angular/material/sort";

export interface Sort {
  active: string,
  label: string,
  direction: SortDirection
}