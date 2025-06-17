export interface Category {
  id?: number;
  name?: string;
  creationDate?: Date;
  lastUpdate?: Date;
  display?: () => string;
}