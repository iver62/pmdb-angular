import { Award } from "./award.model";
import { Country } from "./country.model";
import { Genre } from "./genre.model";
import { Person } from "./person.model";
import { TechnicalSummary } from "./technical-summary.model";

export interface Movie {
  id?: number,
  title: string,
  originalTitle?: string,
  synopsis?: string,
  releaseDate?: Date,
  runningTime?: number,
  budget?: number,
  boxOffice?: number,
  posterFileName?: string,
  creationDate?: Date,
  lastUpdate?: Date,
  technicalSummary?: TechnicalSummary,
  movieActors?: Person[],
  genres?: Genre[],
  countries?: Country[],
  awards?: Award[]
}