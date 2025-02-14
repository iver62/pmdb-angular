import { Movie } from "./movie.model";
import { Person } from "./person.model";

export interface MovieActor {
  id?: number,
  actor?: Person,
  movie?: Movie,
  role?: string,
  rank?: number
}