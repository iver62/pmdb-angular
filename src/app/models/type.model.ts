import { PersonType } from "../enums";

export interface Type {
  id?: number;
  name?: PersonType;
  display: () => string;
}