import { Award } from "./award.model";
import { Ceremony } from "./ceremony.model";
import { Movie } from "./movie.model";

export interface CeremonyAwards {
  id?: number;
  ceremony?: Ceremony;
  movie?: Movie;
  awards?: Award[];
}