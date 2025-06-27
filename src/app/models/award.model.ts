import { Person } from "./person.model";

export interface Award {
  id?: number;
  name?: string;
  persons?: Person[];
  year?: number;
}