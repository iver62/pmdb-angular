import { Observable } from "rxjs";
import { PersonType } from "../enums";
import { Country, Movie } from "./";

export interface Person {
  id?: number;
  name: string;
  photoFileName?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  creationDate?: Date;
  lastUpdate?: Date;
  types?: PersonType[];
  movies?: Movie[];
  countries?: Country[];
  numberOfMovies?: number;
  numberOfAwards?: number;
  display?: () => string;
}

export interface PersonWithPhotoUrl extends Person {
  photoUrl$?: Observable<string>
}