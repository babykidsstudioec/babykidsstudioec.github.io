
/* =====================================
   BABYKIDS STUDIO
   LIBRO DIGITAL CON SONIDO
===================================== */

const fotos = [
    {
        imagen: "assets/img/portada.webp",
        titulo: "Nuestra Navidad",
        texto: "Los mejores momentos se viven en familia."
    },
    {
        imagen: "assets/img/juntos.webp",
        titulo: "Siempre juntos",
        texto: "La familia es nuestro regalo más especial."
    },
    {
        imagen: "assets/img/sonrisas.webp",
        titulo: "Sonrisas inolvidables",
        texto: "Cada sonrisa guarda un recuerdo."
    },
    {
        imagen: "assets/img/dulces.webp",
        titulo: "Dulces momentos",
        texto: "La Navidad está llena de alegría."
    },
    {
        imagen: "assets/img/abrazos.webp",
        titulo: "Abrazos de amor",
        texto: "Los recuerdos más valiosos permanecen."
    }
];

// ELEMENTOS DEL ALBUM

const portada = document.querySelector(".portada");
const paginaFoto = document.getElementById("paginaFoto");
const paginaFinal = document.getElementById("paginaFinal");

const abrirAlbum = document.getElementById("abrirAlbum");
const anteriorFoto = document.getElementById("anteriorFoto");
const siguienteFoto = document.getElementById("siguienteFoto");
const volverInicio = document.getElementById("volverInicio");

const imagenFoto = document.getElementById("imagenFoto");
const tituloFoto = document.getElementById("tituloFoto");
const textoFoto = document.getElementById("textoFoto");
const contadorFoto = document.getElementById("contadorFoto");

let fotoActual = 0;
let animando = false;
let sonidoActivo = true;
let contextoAudio = null;

// PRECARGAR FOTOGRAFIAS

fotos.forEach(foto => {
    const imagen = new Image();
    imagen.src = foto.imagen;
});

// SONIDO DE PAPEL

function reproducirPapel() {
    if (!sonidoActivo) return;

    const AudioAPI =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioAPI) return;

    try {
        if (!contextoAudio) {
            contextoAudio = new AudioAPI();
        }

        if (contextoAudio.state === "suspended") {
            contextoAudio.resume();
        }

        const ctx = contextoAudio;
        const duracion = 0.55;
        const cantidad = Math.floor(
            ctx.sampleRate * duracion
        );

        const buffer = ctx.createBuffer(
            1, cantidad, ctx.sampleRate
        );

        const datos = buffer.getChannelData(0);

        for (let i = 0; i < cantidad; i++) {
            const ruido = Math.random() * 2 - 1;
            const textura = 0.65 +
                0.35 * Math.sin(i * 0.017);

            datos[i] = ruido * textura;
        }

        const fuente = ctx.createBufferSource();
        fuente.buffer = buffer;

        const filtro = ctx.createBiquadFilter();
        filtro.type = "bandpass";
        filtro.frequency.value = 1500;
        filtro.Q.value = 0.5;

        const volumen = ctx.createGain();
        const ahora = ctx.currentTime;

        volumen.gain.setValueAtTime(0.001, ahora);

        volumen.gain.exponentialRampToValueAtTime(
            0.045, ahora + 0.08
        );

        volumen.gain.exponentialRampToValueAtTime(
            0.015, ahora + 0.25
        );

        volumen.gain.exponentialRampToValueAtTime(
            0.04, ahora + 0.37
        );

        volumen.gain.exponentialRampToValueAtTime(
            0.001, ahora + duracion
        );

        fuente.connect(filtro);
        filtro.connect(volumen);
        volumen.connect(ctx.destination);

        fuente.start(ahora);
        fuente.stop(ahora + duracion);

    } catch (error) {
        console.warn("Audio no disponible", error);
    }
}

// BOTON ACTIVAR / SILENCIAR

const botonSonido = document.createElement("button");

botonSonido.className = "boton-sonido";
botonSonido.type = "button";
botonSonido.textContent = "🔊 Sonido activado";
botonSonido.setAttribute("aria-pressed", "true");

document.body.appendChild(botonSonido);

botonSonido.addEventListener("click", () => {
    sonidoActivo = !sonidoActivo;

    botonSonido.textContent = sonidoActivo
        ? "🔊 Sonido activado"
        : "🔇 Sonido apagado";

    botonSonido.setAttribute(
        "aria-pressed",
        String(sonidoActivo)
    );
});

// MOSTRAR FOTOGRAFIA

function mostrarFoto(numero) {
    fotoActual = numero;

    const foto = fotos[fotoActual];

    imagenFoto.src = foto.imagen;
    imagenFoto.alt = foto.titulo;
    tituloFoto.textContent = foto.titulo;
    textoFoto.textContent = foto.texto;

    contadorFoto.textContent =
        `${fotoActual + 1} de ${fotos.length}`;

    anteriorFoto.textContent =
        fotoActual === 0
            ? "← Portada"
            : "← Anterior";

    siguienteFoto.textContent =
        fotoActual === fotos.length - 1
            ? "Finalizar →"
            : "Siguiente →";

    portada.hidden = true;
    paginaFinal.hidden = true;
    paginaFoto.hidden = false;

    window.scrollTo(0, 0);
}

// EFECTO REALISTA DE HOJA

function pasarPagina(numero, direccion) {
    if (animando) return;

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducirMovimiento) {
        reproducirPapel();
        mostrarFoto(numero);
        return;
    }

    animando = true;

    window.scrollTo(0, 0);

    const rect = paginaFoto.getBoundingClientRect();

    // Crear hoja temporal
    const hoja = document.createElement("div");
    hoja.className = "hoja-flip";

    hoja.style.top = rect.top + "px";
    hoja.style.left = rect.left + "px";
    hoja.style.width = rect.width + "px";
    hoja.style.height = rect.height + "px";

    // Cara frontal con la foto actual
    const frente = paginaFoto.cloneNode(true);

    frente.removeAttribute("id");
    frente.classList.add("hoja-flip__anverso");
    frente.setAttribute("aria-hidden", "true");

    // Evitar controles interactivos duplicados
    frente.querySelectorAll("button").forEach(boton => {
        boton.tabIndex = -1;
    });

    // Cara posterior de papel
    const reverso = document.createElement("div");
    reverso.className = "hoja-flip__reverso";

    hoja.appendChild(frente);
    hoja.appendChild(reverso);

    document.body.appendChild(hoja);

    // Preparar la pagina siguiente por debajo
    mostrarFoto(numero);

    reproducirPapel();

    // Activar giro 3D
    requestAnimationFrame(() => {
        hoja.classList.add(
            direccion > 0 ? "avanza" : "retrocede"
        );
    });

    let terminado = false;

    function finalizarGiro() {
        if (terminado) return;
        terminado = true;

        hoja.remove();
        animando = false;
    }

    hoja.addEventListener(
        "animationend",
        finalizarGiro,
        { once: true }
    );

    // Respaldo si el navegador omite el evento
    setTimeout(finalizarGiro, 1200);
}

// ABRIR ALBUM

abrirAlbum.addEventListener("click", () => {
    if (animando) return;

    reproducirPapel();
    mostrarFoto(0);
});

// PAGINA SIGUIENTE

siguienteFoto.addEventListener("click", () => {
    if (animando) return;

    if (fotoActual < fotos.length - 1) {
        pasarPagina(fotoActual + 1, 1);
    } else {
        reproducirPapel();
        paginaFoto.hidden = true;
        paginaFinal.hidden = false;
        window.scrollTo(0, 0);
    }
});

// PAGINA ANTERIOR

anteriorFoto.addEventListener("click", () => {
    if (animando) return;

    if (fotoActual > 0) {
        pasarPagina(fotoActual - 1, -1);
    } else {
        reproducirPapel();
        paginaFoto.hidden = true;
        portada.hidden = false;
        window.scrollTo(0, 0);
    }
});

// VOLVER A LA PORTADA

volverInicio.addEventListener("click", () => {
    if (animando) return;

    reproducirPapel();

    paginaFinal.hidden = true;
    paginaFoto.hidden = true;
    portada.hidden = false;

    fotoActual = 0;

    window.scrollTo(0, 0);
});

// ESTADO INICIAL

paginaFoto.hidden = true;
paginaFinal.hidden = true;
portada.hidden = false;
