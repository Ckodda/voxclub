<script>
    import { onDestroy, tick } from "svelte";
    import { BrowserMultiFormatReader } from "@zxing/library";
    import { Input, Button, Label, Card } from "flowbite-svelte";
    import { router } from "@inertiajs/svelte";
    import App from "../App.svelte";

    let codigo = "";
    let videoRef;
    let scanner;
    let escaneando = false;

    async function iniciarEscaneo() {
        escaneando = true;
        await tick();

        // Verifica compatibilidad
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert(
                "Tu navegador no soporta acceso a la cámara o no está en HTTPS.",
            );
            escaneando = false;
            return;
        }

        try {
            // 🔒 Paso 1: Solicita permisos explícitos al usuario
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            // ⚙️ Paso 2: Muestra el video en el elemento <video>
            videoRef.srcObject = stream;
            videoRef.setAttribute("playsinline", "true");
            await videoRef.play();

            // ⚡️ Paso 3: Inicia el lector
            scanner = new BrowserMultiFormatReader();

            const devices = await scanner.listVideoInputDevices();

            if (devices.length === 0) {
                alert("No se encontró cámara disponible");
                escaneando = false;
                return;
            }

            const deviceId = devices[0].deviceId;

            scanner.decodeFromVideoDevice(
                deviceId,
                videoRef,
                (result, error) => {
                    if (result) {
                        codigo = result.getText();
                        detenerEscaneo();
                    }
                    if (error && !(error.name === "NotFoundException")) {
                        console.warn(error);
                    }
                },
            );
        } catch (error) {
            console.error("Error accediendo a la cámara:", error);
            alert(
                "No se pudo acceder a la cámara. Es posible que hayas denegado el permiso.",
            );
            escaneando = false;
        }
    }

    function detenerEscaneo() {
        if (scanner) {
            scanner.reset();
            scanner = null;
        }
        escaneando = false;
    }

    function enviarFormulario() {
        router.post("/procesar-qr", { codigo });
    }

    onDestroy(() => {
        if (scanner) {
            scanner.reset();
        }
    });
</script>

<App>
    <div class="flex flex-col items-center justify-center">
        <Card class="mt-10 shadow p-4 ">
            <form on:submit|preventDefault={enviarFormulario} class="space-y-4">
                <div>
                    <Label for="codigo">Código</Label>
                    <Input
                        id="codigo"
                        placeholder="Ingresa o escanea un código"
                        bind:value={codigo}
                        required
                    />
                </div>

                <div class="flex gap-4">
                    <Button
                        type="button"
                        color="light"
                        
                        onclick={iniciarEscaneo}
                        disabled={escaneando}
                    >
                        {escaneando ? "Escaneando..." : "Escanear QR"}
                    </Button>

                    <Button type="submit" color="blue" disabled={!codigo}>
                        Enviar
                    </Button>
                </div>
            </form>

            {#if escaneando}
                <div class="mt-6 space-y-4">
                    <video
                        bind:this={videoRef}
                        width="100%"
                        height="300"
                        style="border:1px solid #ccc; border-radius: 8px;"
                        autoplay
                        muted
                    ></video>

                    <Button color="gray" onclick={detenerEscaneo}>
                        Cancelar escaneo
                    </Button>
                </div>
            {/if}

            {#if codigo && !escaneando}
                <div class="mt-4 text-sm text-gray-700">
                    <strong>Código detectado:</strong>
                    {codigo}
                </div>
            {/if}
        </Card>
    </div>
</App>
