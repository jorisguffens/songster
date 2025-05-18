<script lang="ts">
    import { SpotifyApi } from "@spotify/web-api-ts-sdk";
    import { env } from "$env/dynamic/public";
    import { Html5QrcodeScanner } from "html5-qrcode";

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
        sdk.authenticate().then(res => {
            console.log(res);
        })
    });

    function onScanSuccess(content: string) {
        console.info("Code scanned", content);

        if (!content.startsWith("spotify:track:")) {
            return;
        }
        if (current_track === content) {
            return;
        }

        current_track = content;
        sdk.player.startResumePlayback("", undefined, [content]);
    }

    function onScanFailure(error: string) {
        console.debug(error);
    }

    $effect(() => {
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "scanner",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    })
</script>

<div class="flex justify-center">
    <div id="scanner" width="600px"></div>
</div>