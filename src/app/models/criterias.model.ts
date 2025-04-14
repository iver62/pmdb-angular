import { Moment } from "moment";
import { Country, Genre, User } from "./";

export interface Criterias {
  countries?: Country[],
  genres?: Genre[],
  users?: User[],
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