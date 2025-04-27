import { TranslateService } from "@ngx-translate/core";
import { EMPTY_STRING } from "../app.component";

export class Country {
  id?: number;
  code?: number;
  alpha2?: string;
  alpha3?: string;
  nomEnGb?: string;
  nomFrFr?: string;

  constructor(private translate: TranslateService, data?: Partial<Country>) {
    Object.assign(this, data);
  }

  display?() {
    return this.translate.currentLang == 'fr' ? this.nomFrFr : this.nomEnGb ?? EMPTY_STRING;
  }
}