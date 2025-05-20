import { Moment } from "moment";
import { PersonType } from "../enums";
import { Country, Genre, User } from "./";

export interface Criterias {
  countries?: Country[],
  genres?: Genre[],
  users?: User[],
  types?: PersonType[],
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