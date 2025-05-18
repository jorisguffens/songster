<script lang="ts">
    import { SpotifyApi } from "@spotify/web-api-ts-sdk";
    import { env } from "$env/dynamic/public";
    import { Html5QrcodeScanner } from "html5-qrcode";
    import { page } from "$app/state";

    const sdk = SpotifyApi.withUserAuthorization(
        env.PUBLIC_SPOTIFY_CLIENT_ID!,
        env.PUBLIC_SPOTIFY_REDIRECT_URI!,
        [
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-currently-playing"
        ]);

    let current_track = $state<string>();

    $effect(() => {
        void sdk.authenticate().then(res => {
            if ( !res.authenticated ) {
                return;
            }

            const track_id = page.url.searchParams.get("track");
            if ( track_id ) {
                play(track_id);

                const url = new URL(page.url);
                url.searchParams.delete("track");
                history.replaceState({}, "", url)
            }
        })
    });

    function play(track_id: string) {
        current_track = track_id;
        sdk.player.startResumePlayback("", undefined, [track_id]);
    }

    function onScanSuccess(content: string) {
        console.info("Code scanned", content);

        const url = new URL(content);
        const track_id = url.searchParams.get("track");
        if ( !track_id || current_track === track_id) {
            return;
        }

        play(track_id);
    }

    function onScanFailure(error: string) {
        console.debug(error);
    }

    $effect(() => {
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "scanner",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    })
</script>

<div class="flex justify-center">
    <div id="scanner" width="600px"></div>
</div>