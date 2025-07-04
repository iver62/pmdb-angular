import { MovieTechnician } from "./";

export interface TechnicalTeam {
  producers?: MovieTechnician[];
  directors?: MovieTechnician[];
  assistantDirectors?: MovieTechnician[];
  screenwriters?: MovieTechnician[];
  composers?: MovieTechnician[];
  musicians?: MovieTechnician[];
  photographers?: MovieTechnician[];
  costumeDesigners?: MovieTechnician[];
  setDesigners?: MovieTechnician[];
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