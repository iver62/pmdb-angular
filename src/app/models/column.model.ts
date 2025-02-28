import { Movie } from "./movie.model";
import { Person } from "./person.model";

export interface Column {
  columnDef: string,
  columnLabel: string;
  columnValue: (row: Movie | Person) => string | number | Date;
}