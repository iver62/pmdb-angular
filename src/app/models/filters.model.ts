import { Moment } from "moment";
import { Country } from "./country.model";
import { Genre } from "./genre.model";

export interface Filters {
  countries?: Country[],
  genres?: Genre[],
  startReleaseDate?: Date | Moment,
  endReleaseDate?: Date | Moment,
  startCreationDate?: Moment,
  endCreationDate?: Date,
  startLastUpdate?: Date,
  endLastUpdate?: Date
}