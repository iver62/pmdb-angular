import { Movie, Person } from "./";

export interface Column {
  columnDef: string;
  columnLabel: string;
  columnValue: (row: Movie | Person) => string | number | Date;
}