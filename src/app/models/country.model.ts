export interface Country {
  id?: number;
  code?: number;
  alpha2?: string;
  alpha3?: string;
  nomEnGb?: string;
  nomFrFr?: string;
  display?: () => string;
}