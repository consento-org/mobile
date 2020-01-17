export interface IDisplayName {
  readonly displayName: string
}

export function compareNames (a: IDisplayName, b: IDisplayName): number {
  return a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase(), 'en-co-phonebk')
}
