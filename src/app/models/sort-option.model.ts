import { SortDirection } from "@angular/material/sort";

export interface SortOption {
  active: string,
  label: string,
  direction: SortDirection
}