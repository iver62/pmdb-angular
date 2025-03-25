import { Country } from "./country.model";
import { Movie } from "./movie.model";

export interface Person {
  id?: number,
  name: string,
  photoFileName?: string,
  dateOfBirth?: Date,
  dateOfDeath?: Date,
  creationDate?: Date,
  lastUpdate?: Date,
  movies?: Movie[],
  countries?: Country[],
  numberOfMovies?: number
}