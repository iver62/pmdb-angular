import { Person } from "./person.model";

export interface MovieActor {
  id?: number,
  actor?: Person,
  role?: string
}