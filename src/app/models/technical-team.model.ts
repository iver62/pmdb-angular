import { MovieTechnician } from "./";

export interface TechnicalTeam {
  producers?: MovieTechnician[];
  directors?: MovieTechnician[];
  screenwriters?: MovieTechnician[];
  composers?: MovieTechnician[];
  musicians?: MovieTechnician[];
  photographers?: MovieTechnician[];
  costumiers?: MovieTechnician[];
  decorators?: MovieTechnician[];
  editors?: MovieTechnician[];
  casters?: MovieTechnician[];
  artists?: MovieTechnician[];
  soundEditors?: MovieTechnician[];
  vfxSupervisors?: MovieTechnician[];
  sfxSupervisors?: MovieTechnician[];
  makeupArtists?: MovieTechnician[];
  hairDressers?: MovieTechnician[];
  stuntmen?: MovieTechnician[];
}