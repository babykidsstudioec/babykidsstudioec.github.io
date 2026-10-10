const snowLayer = document.getElementById("snow-layer");

if (snowLayer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const cantidad = 55;

    for (let i = 0; i < cantidad; i++) {
        const snowflake = document.createElement("span");
        snowflake.className = "snowflake";

        const size = 4 + Math.random() * 10;
        const left = Math.random() * 100;
        const duration = 7 + Math.random() * 10;
        const delay = Math.random() * -12;
        const drift = -40 + Math.random() * 80;
        const opacity = 0.35 + Math.random() * 0.55;

        snowflake.style.left = `${left}vw`;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;
        snowflake.style.opacity = opacity.toFixed(2);
        snowflake.style.setProperty("--drift", `${drift}px`);

        snowLayer.appendChild(snowflake);
    }
}