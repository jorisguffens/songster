import * as awilix from "awilix";
import { createSpotifyClient } from "$lib/server/clients";
import { SpotifyPlaylistTracksUseCase } from "$lib/server/use-cases";

export function registerInjections(container: awilix.AwilixContainer) {
    container.register({
        // clients
        spotifyClient: awilix.asFunction((VAR_SPOTIFY_CLIENT_ID, VAR_SPOTIFY_CLIENT_SECRET) => {
            return createSpotifyClient(VAR_SPOTIFY_CLIENT_ID, VAR_SPOTIFY_CLIENT_SECRET);
        }),

        // use cases
        spotifyPlaylistTracksUseCase: awilix.asClass(SpotifyPlaylistTracksUseCase),
    });
}

export function registerEnvironment(container: awilix.AwilixContainer, env: Record<string, string | undefined>) {
    container.register({
        VAR_SPOTIFY_CLIENT_ID: awilix.asFunction(() => assertNonNull(env.PUBLIC_SPOTIFY_CLIENT_ID)),
        VAR_SPOTIFY_CLIENT_SECRET: awilix.asFunction(() => assertNonNull(env.SECRET_SPOTIFY_CLIENT_SECRET)),
    });
}

function assertNonNull<T>(value: T | undefined | null) {
    if (value === null || value === undefined) {
        throw new Error("Value is null or undefined");
    }
    return value;
}