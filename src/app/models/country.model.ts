import { Movie } from "./movie.model";
import { Person } from "./person.model";

export class Country {
  id?: number;
  code?: number;
  alpha2?: string;
  alpha3?: string;
  nomEnGb?: string;
  nomFrFr?: string;
  flag?: string;
  movies?: Movie[];
  actors?: Person[];
  producers?: Person[];
  directors?: Person[];
  screenwriters?: Person[];
  musicians?: Person[];
  photographers?: Person[];
  costumiers?: Person[];
  decorators?: Person[];
  editors?: Person[];
  casters?: Person[];
  artDirectors?: Person[];
  soundEditors?: Person[];
  visualEffectsSupervisors?: Person[];
  makeupArtists?: Person[];
  hairDressers?: Person[];
  stuntMen?: Person[];

  constructor(data?: Partial<Country>) {
    Object.assign(this, data);
  }

  display?() {
    return this.nomFrFr ?? '';
  }
}