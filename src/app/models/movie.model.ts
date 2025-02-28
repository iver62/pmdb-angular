import { Award } from "./award.model";
import { Country } from "./country.model";
import { Genre } from "./genre.model";
import { MovieActor } from "./movie-actor.model";
import { TechnicalTeam } from "./technical-team.model";

export interface Movie {
  id?: number,
  title?: string,
  originalTitle?: string,
  synopsis?: string,
  releaseDate?: Date,
  runningTime?: number,
  budget?: number,
  boxOffice?: number,
  posterFileName?: string,
  creationDate?: Date,
  lastUpdate?: Date,
  technicalTeam?: TechnicalTeam,
  movieActors?: MovieActor[],
  genres?: Genre[],
  countries?: Country[],
  awards?: Award[]
}