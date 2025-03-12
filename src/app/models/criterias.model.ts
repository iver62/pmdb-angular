import { Moment } from "moment";
import { Country } from "./country.model";
import { Genre } from "./genre.model";

export interface Criterias {
  countries?: Country[],
  genres?: Genre[],
  fromReleaseDate?: Date | Moment,
  toReleaseDate?: Date | Moment,
  fromBirthDate?: Date | Moment,
  toBirthDate?: Date | Moment,
  fromDeathDate?: Date | Moment,
  toDeathDate?: Date | Moment,
  fromCreationDate?: Date | Moment,
  toCreationDate?: Date | Moment,
  fromLastUpdate?: Date | Moment,
  toLastUpdate?: Date | Moment
}