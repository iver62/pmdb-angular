export interface SearchConfig {
  page?: number,
  size?: number,
  sort?: string,
  direction?: 'Ascending' | 'Descending'
  term?: string
}