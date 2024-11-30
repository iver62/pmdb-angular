import { Movie } from "./movie.model";
import { Person } from "./person.model";

export interface Award {
  id?: number;
  name?: string;
  year?: number;
  movie?: Movie;
  person?: Person;
}