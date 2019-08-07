export default interface SpotifyState {
  relatedArtists: RelatedArtistsStateListItem[]
}

export interface RelatedArtistsStateListItem {
  categoryId: number,
  relatedArtists: string[]
}
