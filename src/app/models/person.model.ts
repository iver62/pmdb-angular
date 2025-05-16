import { Observable } from "rxjs";
import { Country, Movie } from "./";

export interface Person {
  id?: number,
  name: string,
  photoFileName?: string,
  dateOfBirth?: string,
  dateOfDeath?: string,
  creationDate?: Date,
  lastUpdate?: Date,
  movies?: Movie[],
  countries?: Country[],
  numberOfMovies?: number
}

export interface PersonWithPhotoUrl extends Person {
  photoUrl$?: Observable<string>
}