export interface ISearchResult {
  id: string,
  name: string,
  description: string,
  service: 'File' | 'Password' | 'Calendar' | 'Notes' | 'ShareableLink',
  metadata: Record<string, string>
}

export interface MeSearchResponse {
  matched: ISearchResult[]
}
