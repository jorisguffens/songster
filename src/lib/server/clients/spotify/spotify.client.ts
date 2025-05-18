import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export function createSpotifyClient(
    client_id: string,
    client_secret: string,
) {
    return SpotifyApi.withClientCredentials(client_id, client_secret, []);
}