import { error } from "@sveltejs/kit";
import { SpotifyPlaylistTracksUseCase } from "$lib/server";
import { QrGenerator } from "$lib/server/services/qr-generator/qr-generator";
import * as fs from "node:fs";
import path from "node:path";
import csv from "csv-parser";

export class GenerateLoadController {

    constructor(
        private readonly spotifyPlaylistTracksUseCase: SpotifyPlaylistTracksUseCase,
        private readonly VAR_APP_PLAY_URL: string,
    ) {
    }

    async load(url: URL) {
        const playlist_id = url.searchParams.get("playlist_id");

        const tracks = playlist_id ? await this.from_spotify(playlist_id) : await this.from_csv("./songster.csv");
        const qrcodes = await Promise.all(tracks.map((track) => {
            return QrGenerator.generateAsDataUrl(`${this.VAR_APP_PLAY_URL}?track=${track.spotify_track_id}`);
        }));

        return {
            tracks,
            qrcodes,
        };
    }

    private async from_spotify(playlist_id: string) {
        const spotify_tracks = await Array.fromAsync(this.spotifyPlaylistTracksUseCase.getPlaylistTracks(playlist_id));
        return spotify_tracks.map((ti) => {
            return {
                year: new Date(ti.track.album.release_date).getFullYear().toString(),
                artist: ti.track.artists.map((artist) => artist.name).join(", "),
                title: ti.track.name,
                spotify_track_id: ti.track.uri,
            };
        });
    }

    private async from_csv(filename: string) {
        const csv = await this.read<{
            Year: string,
            Artist: string,
            Name: string,
            Spotify: string,
        }>(path.resolve(import.meta.dirname, filename));
        return csv.map(record => {
            const track_id = "spotify:track:" + new URL(record.Spotify).pathname.split("/").pop()!;
            return {
                year: record.Year,
                artist: record.Artist,
                title: record.Name,
                spotify_track_id: track_id,
            };
        })
    }

    read<T>(filename: string) {
        return new Promise<T[]>((resolve, reject) => {
            const results: T[] = [];
            fs.createReadStream(filename)
                .pipe(csv())
                .on('data', (data) => results.push(Object.fromEntries(Object.entries(data)
                    .map(([key, value]) => [key.trim(), value])) as unknown as T))
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        })
    }

}