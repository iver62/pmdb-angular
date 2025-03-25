import { EMPTY_STRING } from "../app.component";

export class User {
  id: string;
  username: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  numberOfMovies?: number;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

  display?() {
    return this.username ?? EMPTY_STRING;
  }
}