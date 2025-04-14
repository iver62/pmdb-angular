import { Observable } from "rxjs";
import { Award, Country, Genre, MovieActor, TechnicalTeam, User } from "./";

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
  user?: User,
  technicalTeam?: TechnicalTeam,
  movieActors?: MovieActor[],
  genres?: Genre[],
  countries?: Country[],
  awards?: Award[]
}

export interface MovieWithPoster extends Movie {
  posterUrl$: Observable<string>
}