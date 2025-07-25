import { Observable } from "rxjs";
import { Movie, Person } from "./";

export interface MovieActor {
  id?: number;
  person?: Person;
  movie?: Movie;
  role?: string;
  rank?: number;
}

export interface PersonWithPhoto extends MovieActor {
  photoUrl$?: Observable<string>
}