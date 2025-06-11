import { Movie, Person } from ".";

export interface MovieTechnician {
  id?: number;
  person?: Person;
  movie?: Movie;
  role?: string;
}