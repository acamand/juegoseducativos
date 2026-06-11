// ===== UTILIDADES NUMÉRICAS =====
function aleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== CONVERSIONES SEXAGESIMALES =====
function aSegundosTotales(ang) {
  return ang.d * 3600 + ang.m * 60 + ang.s;
}

function desdeSegundos(total) {
  const d = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, m, s };
}

function formatoAngulo(ang) {
  return `${ang.d}° ${ang.m}' ${ang.s}''`;
}

// ===== DIBUJO DE ÁNGULOS (SVG) =====
function svgAngulo(deg) {
  const W = 280, H = 200, cx = 140, cy = 170, R = 120, arcR = 36;

  if (deg >= 360) {
    return `<svg class="angulo-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <circle cx="${cx}" cy="${cy - 50}" r="70" fill="none" stroke="#2563eb" stroke-width="4"/>
      <line x1="${cx}" y1="${cy - 50}" x2="${cx + 70}" y2="${cy - 50}" stroke="#1e3a8a" stroke-width="4"/>
      <circle cx="${cx}" cy="${cy - 50}" r="4" fill="#1e3a8a"/>
      <text x="${cx + 75}" y="${cy - 45}" font-size="20" fill="#f97316">↺</text>
    </svg>`;
  }

  const rad = deg * Math.PI / 180;
  const x1 = cx + R, y1 = cy;
  const x2 = cx + R * Math.cos(rad), y2 = cy - R * Math.sin(rad);
  const ax1 = cx + arcR, ay1 = cy;
  const ax2 = cx + arcR * Math.cos(rad), ay2 = cy - arcR * Math.sin(rad);
  const largeArc = deg > 180 ? 1 : 0;

  return `<svg class="angulo-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#1e3a8a" stroke-width="4"/>
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1e3a8a" stroke-width="4"/>
    <path d="M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${largeArc} 0 ${ax2} ${ay2}" fill="none" stroke="#f97316" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="#1e3a8a"/>
  </svg>`;
}

// ===== CLASIFICACIÓN DE ÁNGULOS =====
function clasificarAngulo(deg) {
  if (deg === 90) return 'recto';
  if (deg === 180) return 'llano';
  if (deg >= 360) return 'completo';
  if (deg > 0 && deg < 90) return 'agudo';
  return 'obtuso';
}

const DEFINICIONES = {
  agudo: 'Un ángulo agudo mide más de 0° y menos de 90°.',
  recto: 'Un ángulo recto mide exactamente 90° (como la esquina de un folio).',
  obtuso: 'Un ángulo obtuso mide más de 90° y menos de 180°.',
  llano: 'Un ángulo llano mide exactamente 180° (es una línea recta).',
  completo: 'Un ángulo completo mide 360° (una vuelta entera).'
};

function generarAnguloAleatorio() {
  const tipo = aleatorio(['agudo', 'recto', 'obtuso', 'llano', 'completo']);
  let deg;
  switch (tipo) {
    case 'agudo': deg = randInt(10, 85); break;
    case 'recto': deg = 90; break;
    case 'obtuso': deg = randInt(95, 175); break;
    case 'llano': deg = 180; break;
    case 'completo': deg = 360; break;
  }
  return deg;
}

// ===== PUNTUACIÓN =====
const Puntos = {
  data: JSON.parse(localStorage.getItem('angulos-puntos') || '{"p":0,"a":0,"f":0}'),
  guardar() { localStorage.setItem('angulos-puntos', JSON.stringify(this.data)); this.render(); },
  acertar() { this.data.p += 10; this.data.a += 1; this.guardar(); },
  fallar() { this.data.f += 1; this.guardar(); },
  reset() { this.data = { p: 0, a: 0, f: 0 }; this.guardar(); },
  render() {
    document.getElementById('puntos').textContent = this.data.p;
    document.getElementById('aciertos').textContent = this.data.a;
    document.getElementById('fallos').textContent = this.data.f;
  }
};

// ===== GENERADORES DE OPCIONES =====
function opcionesNumericas(correcto, minVal = 0) {
  const set = new Set([correcto]);
  const deltas = [-10, -5, -2, -1, 1, 2, 5, 10, 60, -60];
  let intentos = 0;
  while (set.size < 4 && intentos < 50) {
    intentos++;
    const v = correcto + aleatorio(deltas);
    if (v >= minVal && !set.has(v)) set.add(v);
  }
  return mezclar([...set]).map(v => ({ texto: String(v), ok: v === correcto }));
}

function opcionesAngulo(totalSegCorrecto) {
  const set = new Set([totalSegCorrecto]);
  const deltas = [60, -60, 3600, -3600, 1, -1, 3540, -3540, 120, -120];
  let intentos = 0;
  while (set.size < 4 && intentos < 50) {
    intentos++;
    const v = totalSegCorrecto + aleatorio(deltas);
    if (v >= 0 && v <= 360 * 3600 && !set.has(v)) set.add(v);
  }
  return mezclar([...set]).map(v => ({
    texto: formatoAngulo(desdeSegundos(v)),
    ok: v === totalSegCorrecto
  }));
}

// ===== GENERADOR DE PREGUNTAS DE CONVERSIÓN =====
function generarConversion() {
  const tipo = aleatorio(['gradosAMin', 'minAGrados', 'minASeg', 'segAMin', 'completoASeg', 'segACompleto']);

  switch (tipo) {
    case 'gradosAMin': {
      const g = randInt(1, 12);
      return {
        pregunta: `¿Cuántos minutos (') son ${g}°?`,
        opciones: opcionesNumericas(g * 60, 0),
        explicacion: `Cada grado tiene 60 minutos, así que ${g}° = ${g} × 60 = ${g * 60}'.`
      };
    }
    case 'minAGrados': {
      const g = randInt(1, 8);
      const m = g * 60;
      return {
        pregunta: `¿Cuántos grados (°) son ${m}'?`,
        opciones: opcionesNumericas(g, 0),
        explicacion: `Cada 60 minutos forman 1 grado, así que ${m}' = ${m} ÷ 60 = ${g}°.`
      };
    }
    case 'minASeg': {
      const m = randInt(1, 12);
      return {
        pregunta: `¿Cuántos segundos ('') son ${m}'?`,
        opciones: opcionesNumericas(m * 60, 0),
        explicacion: `Cada minuto tiene 60 segundos, así que ${m}' = ${m} × 60 = ${m * 60}''.`
      };
    }
    case 'segAMin': {
      const m = randInt(1, 8);
      const s = m * 60;
      return {
        pregunta: `¿Cuántos minutos (') son ${s}''?`,
        opciones: opcionesNumericas(m, 0),
        explicacion: `Cada 60 segundos forman 1 minuto, así que ${s}'' = ${s} ÷ 60 = ${m}'.`
      };
    }
    case 'completoASeg': {
      const ang = { d: randInt(0, 5), m: randInt(0, 59), s: randInt(0, 59) };
      if (ang.d === 0 && ang.m === 0 && ang.s === 0) ang.s = 1;
      const total = aSegundosTotales(ang);
      return {
        pregunta: `¿Cuántos segundos en total son ${formatoAngulo(ang)}?`,
        opciones: opcionesNumericas(total, 0),
        explicacion: `${ang.d}° = ${ang.d * 3600}'', ${ang.m}' = ${ang.m * 60}'', más ${ang.s}'' → total = ${total}''.`
      };
    }
    case 'segACompleto': {
      const ang = { d: randInt(0, 4), m: randInt(0, 59), s: randInt(0, 59) };
      if (ang.d === 0 && ang.m === 0 && ang.s === 0) ang.s = 1;
      const total = aSegundosTotales(ang);
      return {
        pregunta: `¿A cuánto equivalen ${total}'' en grados, minutos y segundos?`,
        opciones: opcionesAngulo(total),
        explicacion: `${total} ÷ 3600 = ${ang.d}° (sobran ${total - ang.d * 3600}''). ${total - ang.d * 3600} ÷ 60 = ${ang.m}' y sobran ${ang.s}''. Resultado: ${formatoAngulo(ang)}.`
      };
    }
  }
}

// ===== GENERADOR DE SUMA Y RESTA =====
function anguloAleatorioPequeno() {
  return { d: randInt(1, 60), m: randInt(0, 59), s: randInt(0, 59) };
}

function generarSumaResta() {
  let a = anguloAleatorioPequeno();
  let b = anguloAleatorioPequeno();
  const op = aleatorio(['+', '-']);

  let totalA = aSegundosTotales(a);
  let totalB = aSegundosTotales(b);

  if (op === '-' && totalB > totalA) {
    [a, b] = [b, a];
    [totalA, totalB] = [totalB, totalA];
  }

  const totalCorrecto = op === '+' ? totalA + totalB : totalA - totalB;
  const correcto = desdeSegundos(totalCorrecto);

  // Distractores: errores típicos
  const set = new Set();
  set.add(formatoAngulo(correcto));

  // Error 1: sumar/restar componente a componente sin "llevadas"
  const sinLlevar = op === '+'
    ? { d: a.d + b.d, m: a.m + b.m, s: a.s + b.s }
    : { d: Math.abs(a.d - b.d), m: Math.abs(a.m - b.m), s: Math.abs(a.s - b.s) };
  set.add(formatoAngulo(sinLlevar));

  // Error 2: llevarse de 100 en 100 en vez de 60 en 60
  const totalAlt = totalCorrecto + (op === '+' ? -40 : 40);
  if (totalAlt >= 0) set.add(formatoAngulo(desdeSegundos(totalAlt)));

  // Error 3: desplazar 1 minuto
  const totalAlt2 = totalCorrecto + 60;
  if (totalAlt2 >= 0) set.add(formatoAngulo(desdeSegundos(totalAlt2)));

  // Rellenar si faltan opciones
  let extra = 1;
  while (set.size < 4) {
    const v = totalCorrecto + extra * 60;
    if (v >= 0) set.add(formatoAngulo(desdeSegundos(v)));
    extra++;
  }

  const opciones = mezclar([...set]).map(texto => ({
    texto,
    ok: texto === formatoAngulo(correcto)
  }));

  const simbolo = op === '+' ? '+' : '−';
  return {
    pregunta: `${formatoAngulo(a)} ${simbolo} ${formatoAngulo(b)} = ?`,
    opciones,
    explicacion: `Se suman/restan por separado los grados, minutos y segundos. Si los segundos o minutos pasan de 59, se "llevan" 60 a la unidad siguiente (1' = 60'', 1° = 60'). Resultado: ${formatoAngulo(correcto)}.`
  };
}

// ===== PANTALLAS =====
const Pantallas = {
  inicio() {
    return `
      <div class="welcome">
        <h2>¡Hola! 👋 Vamos a medir ángulos</h2>
        <p>En esta aplicación vas a aprender a <strong>clasificar ángulos</strong>, a <strong>convertir grados, minutos y segundos</strong>, y a <strong>sumar y restar</strong> medidas de ángulos. Si lo necesitas, empieza por el <strong>repaso</strong>.</p>
        <div class="cards">
          <div class="card" data-game="teoria">
            <span class="emoji">📖</span>
            <h3>Repaso</h3>
            <p>Tipos de ángulos y conversiones</p>
          </div>
          <div class="card" data-game="clasifica">
            <span class="emoji">📐</span>
            <h3>Clasifica ángulos</h3>
            <p>Agudo, recto, obtuso, llano o completo</p>
          </div>
          <div class="card" data-game="conversion">
            <span class="emoji">🔁</span>
            <h3>Conversiones</h3>
            <p>Grados, minutos y segundos</p>
          </div>
          <div class="card" data-game="sumaresta">
            <span class="emoji">➕</span>
            <h3>Suma y resta</h3>
            <p>Opera con ángulos sexagesimales</p>
          </div>
          <div class="card" data-game="mezcla">
            <span class="emoji">🎲</span>
            <h3>Mezcla</h3>
            <p>Todos los retos mezclados</p>
          </div>
        </div>
      </div>
    `;
  },

  teoria() {
    return `
      <div class="reglas-content">
        <h2>📖 Repaso: ángulos y unidades</h2>
        <div class="regla-box">
          <h3>1. ¿Qué es un ángulo?</h3>
          <p>Es la abertura que forman dos semirrectas (rayos) que se unen en un punto llamado <strong>vértice</strong>. Se mide en grados (°).</p>
        </div>
        <div class="regla-box">
          <h3>2. Tipos de ángulos según su medida</h3>
          <div class="ejemplo"><strong>Agudo:</strong> menos de 90°</div>
          <div class="ejemplo"><strong>Recto:</strong> exactamente 90°</div>
          <div class="ejemplo"><strong>Obtuso:</strong> entre 90° y 180°</div>
          <div class="ejemplo"><strong>Llano:</strong> exactamente 180°</div>
          <div class="ejemplo"><strong>Completo:</strong> 360° (una vuelta entera)</div>
        </div>
        <div class="regla-box">
          <h3>3. Grados, minutos y segundos</h3>
          <p>Para medir con más precisión, cada grado se divide en minutos y cada minuto en segundos:</p>
          <table class="tabla-conversion">
            <tr><th>Unidad</th><th>Equivale a</th></tr>
            <tr><td>1 grado (1°)</td><td>60 minutos (60')</td></tr>
            <tr><td>1 minuto (1')</td><td>60 segundos (60'')</td></tr>
            <tr><td>1 grado (1°)</td><td>3600 segundos (3600'')</td></tr>
          </table>
        </div>
        <div class="regla-box">
          <h3>4. Sumar y restar ángulos</h3>
          <p>Se suman (o restan) por separado los grados, los minutos y los segundos. Si los segundos llegan a 60 o más, se "llevan" como minutos; si los minutos llegan a 60 o más, se "llevan" como grados.</p>
          <div class="ejemplo">25° 40' 50'' + 10° 30' 20'' = 35° 70' 70'' = 35° 71' 10'' = 36° 11' 10''</div>
        </div>
        <div class="regla-box">
          <h3>🪄 Truco para recordarlo</h3>
          <p>Piensa en los ángulos como un reloj: 60 segundos = 1 minuto, 60 minutos = 1 grado. ¡Igual que con el tiempo!</p>
        </div>
      </div>
    `;
  },

  clasifica() {
    const deg = generarAnguloAleatorio();
    const correcta = clasificarAngulo(deg);
    const opcionesTipos = ['agudo', 'recto', 'obtuso', 'llano', 'completo'];
    const opciones = mezclar(opcionesTipos).map(t => ({
      texto: t.charAt(0).toUpperCase() + t.slice(1),
      ok: t === correcta
    }));
    return `
      <div class="game-area" id="game-pregunta">
        <h2>📐 Clasifica el ángulo</h2>
        <div class="instruccion">¿Qué tipo de ángulo es este?</div>
        ${svgAngulo(deg)}
        <div class="pregunta-grande">${deg}°</div>
        <div class="opciones">
          ${opciones.map(o => `<button class="opcion-btn" data-ok="${o.ok ? 1 : 0}">${o.texto}</button>`).join('')}
        </div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="explicacion-data" style="display:none">${DEFINICIONES[correcta]}</div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  conversion() {
    const q = generarConversion();
    return `
      <div class="game-area" id="game-pregunta">
        <h2>🔁 Conversión de unidades</h2>
        <div class="instruccion">Elige la respuesta correcta</div>
        <div class="pregunta-grande">${q.pregunta}</div>
        <div class="opciones">
          ${q.opciones.map(o => `<button class="opcion-btn" data-ok="${o.ok ? 1 : 0}">${o.texto}</button>`).join('')}
        </div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="explicacion-data" style="display:none">${q.explicacion}</div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  sumaresta() {
    const q = generarSumaResta();
    return `
      <div class="game-area" id="game-pregunta">
        <h2>➕ Suma y resta de ángulos</h2>
        <div class="instruccion">Calcula el resultado y elige la opción correcta</div>
        <div class="pregunta-grande">${q.pregunta}</div>
        <div class="opciones">
          ${q.opciones.map(o => `<button class="opcion-btn" data-ok="${o.ok ? 1 : 0}">${o.texto}</button>`).join('')}
        </div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="explicacion-data" style="display:none">${q.explicacion}</div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  mezcla() {
    const juegos = ['clasifica', 'conversion', 'sumaresta'];
    return Pantallas[aleatorio(juegos)]();
  }
};

// ===== LÓGICA DE INTERACCIÓN =====
let juegoActual = 'inicio';
let enMezcla = false;

function cargar(juego) {
  juegoActual = juego;
  enMezcla = (juego === 'mezcla');
  document.querySelectorAll('.menu-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.game === juego);
  });
  document.getElementById('screen').innerHTML = Pantallas[juego]();
  conectarEventos();
}

function siguientePregunta() {
  if (enMezcla) {
    document.getElementById('screen').innerHTML = Pantallas.mezcla();
  } else {
    document.getElementById('screen').innerHTML = Pantallas[juegoActual]();
  }
  conectarEventos();
}

function mostrarFeedback(ok, texto) {
  const fb = document.getElementById('feedback');
  if (!fb) return;
  fb.className = 'feedback ' + (ok ? 'ok' : 'no');
  fb.textContent = texto;
}

function mostrarExplicacion() {
  const data = document.getElementById('explicacion-data');
  const box = document.getElementById('explicacion-box');
  if (box && data) box.innerHTML = `<div class="explicacion">📚 ${data.textContent}</div>`;
}

function mostrarBotonSiguiente() {
  const box = document.getElementById('siguiente-box');
  if (box) {
    box.innerHTML = `<button class="btn-siguiente" id="btn-sig">Siguiente ➡️</button>`;
    document.getElementById('btn-sig').addEventListener('click', siguientePregunta);
  }
}

function conectarEventos() {
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', () => cargar(c.dataset.game));
  });

  const game = document.getElementById('game-pregunta');
  if (game) {
    document.querySelectorAll('.opcion-btn').forEach(b => {
      b.addEventListener('click', () => {
        const esCorrecta = b.dataset.ok === '1';
        document.querySelectorAll('.opcion-btn').forEach(x => x.disabled = true);

        if (esCorrecta) {
          b.classList.add('correcta');
          Puntos.acertar();
          mostrarFeedback(true, '¡Correcto! 🎉');
        } else {
          b.classList.add('incorrecta');
          const correctaBtn = document.querySelector('.opcion-btn[data-ok="1"]');
          if (correctaBtn) correctaBtn.classList.add('mostrar-correcta');
          Puntos.fallar();
          mostrarFeedback(false, 'No es correcto. Mira la respuesta correcta y la explicación.');
        }
        mostrarExplicacion();
        mostrarBotonSiguiente();
      });
    });
  }
}

// ===== INICIO =====
document.querySelectorAll('.menu-btn').forEach(b => {
  b.addEventListener('click', () => cargar(b.dataset.game));
});
document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('¿Quieres reiniciar tu puntuación?')) Puntos.reset();
});

Puntos.render();
cargar('inicio');
