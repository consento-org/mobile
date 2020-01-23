export interface ISortable {
  readonly sortBy: string
}

export function compareNames (a: ISortable, b: ISortable): number {
  return a.sortBy.toLowerCase().localeCompare(b.sortBy.toLowerCase(), 'en-co-phonebk')
}
