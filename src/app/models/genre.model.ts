import { EMPTY_STRING } from "../app.component";

export class Genre {
  id?: number;
  name?: string;
  creationDate?: Date;
  lastUpdate?: Date;

  constructor(data?: Partial<Genre>) {
    Object.assign(this, data);
  }

  display?() {
    return this.name ?? EMPTY_STRING;
  }
}