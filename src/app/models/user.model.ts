export interface User {
  id?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  lastName?: string;
  firstName?: string;
  numberOfMovies?: number;
  display: () => string;
}