import { PersonType } from "../enums";

export class Type {
  id?: number;
  name?: PersonType;

  constructor(data?: Partial<Type>) {
    Object.assign(this, data);
  }

  display() { return this.name; };
}