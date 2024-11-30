import { Award } from "./award.model";
import { Country } from "./country.model";
import { Genre } from "./genre.model";
import { Person } from "./person.model";

export interface Movie {
  id?: number;
  title: string;
  originalTitle?: string;
  synopsis?: string;
  releaseDate?: Date
  runningTime?: number;
  budget?: number;
  boxOffice?: number;
  posterPath?: string;
  creationDate?: Date;
  lastUpdate?: Date;
  producers?: Person[];
  directors?: Person[];
  screenwriters?: Person[];
  musicians?: Person[];
  photographers?: Person[];
  costumiers?: Person[];
  decorators?: Person[];
  editors?: Person[];
  movieActors?: Person[];
  genres?: Genre[];
  countries?: Country[];
  awards?: Award[];
}