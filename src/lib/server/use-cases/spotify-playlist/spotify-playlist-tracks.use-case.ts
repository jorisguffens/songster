import type { Page, PlaylistedTrack, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";

export class SpotifyPlaylistTracksUseCase {

    constructor(
        private readonly spotifyClient: SpotifyApi
    ) {
    }

    async *getPlaylistTracks(playlist_id: string) {
        const playlist = await this.spotifyClient.playlists.getPlaylist(playlist_id);
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        let page: Page<PlaylistedTrack<Track>> = playlist.tracks;
        let offset = 100;
        do {
            for ( const item of page.items ) {
                yield item;
            }
            offset += 50;
            if ( !page.next ) {
                break;
            }

            page = await this.spotifyClient.playlists.getPlaylistItems(playlist_id, undefined, undefined, offset, 50);
        } while (page.next);
    }
}