import { Movie } from "./movie.model";
import { Person } from "./person.model";

export interface MovieActor {
  actor?: Person;
  movie?: Movie;
  role?: string;
}