import { Person } from "./person.model";

export interface TechnicalSummary {
  producers?: Person[],
  directors?: Person[],
  screenwriters?: Person[],
  musicians?: Person[],
  photographers?: Person[],
  costumiers?: Person[],
  decorators?: Person[],
  editors?: Person[],
  casters?: Person[],
  artDirectors?: Person[],
  soundEditors?: Person[],
  visualEffectsSupervisors?: Person[],
  makeupArtists?: Person[],
  hairDressers?: Person[]
}