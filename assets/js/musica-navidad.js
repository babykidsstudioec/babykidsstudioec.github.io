/* BABYKIDS - Música navideña original, opcional y en bucle. */
document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('.controls');
  if (!controls || document.getElementById('music')) return;

  const audio = new Audio('assets/audio/navidad-babykids.mp3');
  audio.loop = true;
  audio.volume = 0.22; // Fondo discreto para escuchar el giro del papel.
  audio.preload = 'none';

  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'music';
  button.textContent = '♫ Música';
  button.setAttribute('aria-label', 'Reproducir música navideña');
  button.setAttribute('aria-pressed', 'false');
  controls.appendChild(button);

  const update = () => {
    const playing = !audio.paused;
    button.textContent = playing ? '❚❚ Pausar música' : '♫ Música';
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pausar música navideña' : 'Reproducir música navideña');
  };

  button.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
    } else {
      try {
        await audio.play(); // Requiere clic, acorde con los navegadores.
      } catch (error) {
        console.warn('No se pudo reproducir la música', error);
        button.textContent = '♫ Música no disponible';
      }
    }
    update();
  });
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('error', () => {
    button.textContent = '♫ Audio no encontrado';
    button.disabled = true;
    console.warn('Coloca navidad-babykids.mp3 en assets/audio/');
  });
});
