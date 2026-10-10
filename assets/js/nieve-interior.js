document.addEventListener("DOMContentLoaded", () => {
    const paginasInteriores = document.querySelectorAll(
        "#book .page:not(.cover):not(.back-cover) .page-inner"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    paginasInteriores.forEach((pagina) => {
        if (!pagina.querySelector(".decoracion-navidad")) {
            const decoracion = document.createElement("div");
            decoracion.className = "decoracion-navidad";
            pagina.prepend(decoracion);
        }

        if (!pagina.querySelector(".snow-inside")) {
            const nieve = document.createElement("div");
            nieve.className = "snow-inside";
            pagina.prepend(nieve);

            if (!reducedMotion) {
                const cantidad = 14;

                for (let i = 0; i < cantidad; i++) {
                    const copo = document.createElement("span");
                    copo.className = "flake-inside";

                    const size = 3 + Math.random() * 7;
                    const left = Math.random() * 100;
                    const duration = 6 + Math.random() * 6;
                    const delay = Math.random() * -8;
                    const drift = -20 + Math.random() * 40;
                    const opacity = 0.18 + Math.random() * 0.30;

                    copo.style.left = `${left}%`;
                    copo.style.width = `${size}px`;
                    copo.style.height = `${size}px`;
                    copo.style.animationDuration = `${duration}s`;
                    copo.style.animationDelay = `${delay}s`;
                    copo.style.opacity = opacity.toFixed(2);
                    copo.style.setProperty("--drift", `${drift}px`);

                    nieve.appendChild(copo);
                }
            }
        }
    });
});