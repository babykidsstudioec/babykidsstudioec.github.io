document.addEventListener("DOMContentLoaded", () => {
    const paginas = document.querySelectorAll(
        "#book .page:not(.cover):not(.back-cover) .page-inner"
    );

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    paginas.forEach((pagina) => {
        // GUARDAR el contenido actual
        const contenidoActual = Array.from(pagina.childNodes);

        // Crear decoraciones solo si no existen
        if (!pagina.querySelector(".guirnalda-luces")) {
            const guirnalda = document.createElement("div");
            guirnalda.className = "guirnalda-luces";

            for (let i = 0; i < 10; i++) {
                const luz = document.createElement("span");
                luz.className = "luz";
                guirnalda.appendChild(luz);
            }

            pagina.prepend(guirnalda);
        }

        if (!pagina.querySelector(".nieve-interior")) {
            const nieve = document.createElement("div");
            nieve.className = "nieve-interior";
            pagina.prepend(nieve);

            
if (true) {

                const cantidad = 36;

                for (let i = 0; i < cantidad; i++) {
                    const copo = document.createElement("span");
                    copo.className = "copo";

                    
const size = window.matchMedia("(max-width: 680px)").matches
    ? 4 + Math.random() * 5
    : 2 + Math.random() * 5;

                    const left = Math.random() * 100;
                    const duration = 7 + Math.random() * 6;
                    
const delay = -Math.random() * duration;

                    const drift = -15 + Math.random() * 30;
                    const opacity = 0.25 + Math.random() * 0.45;

                    copo.style.left = `${left}%`;
                    copo.style.width = `${size}px`;
                    copo.style.height = `${size}px`;
                    copo.style.setProperty("--bk-duration", `${duration}s`);
                    copo.style.setProperty("--bk-delay", `${delay}s`);
                    copo.style.opacity = opacity.toFixed(2);
                    copo.style.setProperty("--drift", `${drift}px`);

                    nieve.appendChild(copo);
                }
            }
        }
    });
});