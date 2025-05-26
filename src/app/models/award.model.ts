import { Movie } from "./movie.model";
import { Person } from "./person.model";

export interface Award {
  id?: number;
  ceremony: string;
  name: string;
  movie: Movie;
  persons?: Person[];
  year?: number;
}