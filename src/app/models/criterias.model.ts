import { Moment } from "moment";
import { Category, Country, Type, User } from "./";

export interface Criterias {
  countries?: Country[];
  categories?: Category[];
  users?: User[];
  types?: Type[];
  fromReleaseDate?: Date | Moment;
  toReleaseDate?: Date | Moment;
  fromBirthDate?: Date | Moment;
  toBirthDate?: Date | Moment;
  fromDeathDate?: Date | Moment;
  toDeathDate?: Date | Moment;
  fromCreationDate?: Date | Moment;
  toCreationDate?: Date | Moment;
  fromLastUpdate?: Date | Moment;
  toLastUpdate?: Date | Moment
}