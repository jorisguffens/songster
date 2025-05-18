import { error } from "@sveltejs/kit";
import { SpotifyPlaylistTracksUseCase } from "$lib/server";
import { QrGenerator } from "$lib/server/services/qr-generator/qr-generator";

export class GenerateLoadController {

    constructor(
        private readonly spotifyPlaylistTracksUseCase: SpotifyPlaylistTracksUseCase,
    ) {
    }

    async load(url: URL) {
        const playlist_id = url.searchParams.get("playlist_id");
        if (!playlist_id) {
            error(400, "Missing url parameter 'playlist_id'.");
        }

        const tracks = await Array.fromAsync(this.spotifyPlaylistTracksUseCase.getPlaylistTracks(playlist_id));
        const qrcodes = await Promise.all(tracks.map((track) => {
            return QrGenerator.generateAsDataUrl(track.track.uri);
        }));

        return {
            tracks,
            qrcodes,
        };
    }

}