import { Person } from "./person.model";

export interface Award {
  id?: number;
  ceremony: string;
  name: string;
  persons?: Person[];
  year?: number;
}