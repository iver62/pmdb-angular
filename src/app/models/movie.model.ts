import { Observable } from "rxjs";
import { Award, BoxOffice, Budget, Category, Country, MovieActor, TechnicalTeam, User } from "./";

export interface Movie {
  id?: number;
  title?: string;
  originalTitle?: string;
  synopsis?: string;
  releaseDate?: string;
  runningTime?: number;
  budget?: Budget;
  boxOffice?: BoxOffice;
  posterFileName?: string;
  numberOfAwards?: number;
  creationDate?: Date;
  lastUpdate?: Date;
  user?: User;
  technicalTeam?: TechnicalTeam;
  movieActors?: MovieActor[];
  categories?: Category[];
  countries?: Country[];
  awards?: Award[];
}

export interface MovieWithPoster extends Movie {
  posterUrl$: Observable<string>
}