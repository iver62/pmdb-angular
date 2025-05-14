import { EMPTY_STRING } from "../app.component";

export class Country {
  id?: number;
  code?: number;
  alpha2?: string;
  alpha3?: string;
  nomEnGb?: string;
  nomFrFr?: string;

  constructor(data?: Partial<Country>) {
    Object.assign(this, data);
  }

  display?() {
    return this.nomFrFr ?? EMPTY_STRING;
  }
}