<script lang="ts">

    const { data } = $props();
    const { tracks, qrcodes } = $derived(data);

    let print_view = $state<HTMLElement>();

    function print() {
        if ( !print_view) {
            return;
        }

        const print_window = window.open('', 'PRINT', '_blank');
        if (print_window === null) {
            return;
        }

        print_window.document.writeln("<html>")
        print_window.document.writeln(document.head.outerHTML)
        print_window.document.writeln("<body class=\"flex justify-center\">")
        print_window.document.writeln(print_view.outerHTML)
        print_window.document.writeln("</body>")
        print_window.document.writeln("</html>")
        print_window.document.close();
        print_window.print();
        print_window.close();
    }

    const page_size = 20;
    const pages = $derived(Math.ceil(tracks.length / page_size));
</script>

<div class="flex justify-center">
    <div class="w-4xl m-4">
        <div class="flex justify-end mb-8">
            <button class="btn btn-primary" onclick={() => print()}>
                Print
            </button>
        </div>
        <div class="grid grid-cols-1 gap-8" bind:this={print_view}>
            {#each { length: pages } as _, page}
                {@const offset = page * page_size}
                <div class="grid grid-cols-4 grid-rows-5 border-1 border-base-200 bg-base-100 break-after-page">
                    {#each tracks.slice(offset, offset + page_size) as track}
                        <div class="flex flex-col gap-4 justify-around p-4 text-center border-1 border-base-200 aspect-square">
                            <div class="h-10 text-sm">
                                {track.title}
                            </div>
                            <div class="flex items-center justify-center font-semibold text-4xl">
                                {track.year}
                            </div>
                            <div class="flex items-end justify-center h-10 text-sm">
                                {track.artist}
                            </div>
                        </div>
                    {/each}
                </div>
                <div class="grid grid-cols-4 grid-rows-5 border-1 border-base-200 bg-base-100 break-after-page" style="direction: rtl;">
                    {#each qrcodes.slice(offset, offset + page_size) as qrcode, i}
                        <div class="p-4 text-center border-1 border-base-200 aspect-square">
                            <img src={qrcode} alt="" class="w-full h-full">
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

