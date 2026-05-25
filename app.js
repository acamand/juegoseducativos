// ===== BASE DE DATOS DE PALABRAS =====
// p = palabra, s = sílabas, t = índice de la sílaba tónica (0 = primera)
const PALABRAS = [
  // Agudas con tilde
  {p:'camión',    s:['ca','mión'],         t:1},
  {p:'jamás',     s:['ja','más'],          t:1},
  {p:'café',      s:['ca','fé'],           t:1},
  {p:'compás',    s:['com','pás'],         t:1},
  {p:'sofá',      s:['so','fá'],           t:1},
  {p:'balón',     s:['ba','lón'],          t:1},
  {p:'después',   s:['des','pués'],        t:1},
  {p:'también',   s:['tam','bién'],        t:1},
  {p:'Perú',      s:['Pe','rú'],           t:1},
  {p:'rincón',    s:['rin','cón'],         t:1},
  {p:'anís',      s:['a','nís'],           t:1},
  {p:'corazón',   s:['co','ra','zón'],     t:2},

  // Agudas sin tilde
  {p:'reloj',     s:['re','loj'],          t:1},
  {p:'papel',     s:['pa','pel'],          t:1},
  {p:'cantar',    s:['can','tar'],         t:1},
  {p:'feliz',     s:['fe','liz'],          t:1},
  {p:'nariz',     s:['na','riz'],          t:1},
  {p:'ciudad',    s:['ciu','dad'],         t:1},
  {p:'verdad',    s:['ver','dad'],         t:1},
  {p:'amor',      s:['a','mor'],           t:1},
  {p:'pastel',    s:['pas','tel'],         t:1},
  {p:'caracol',   s:['ca','ra','col'],     t:2},
  {p:'pared',     s:['pa','red'],          t:1},

  // Llanas con tilde
  {p:'árbol',     s:['ár','bol'],          t:0},
  {p:'lápiz',     s:['lá','piz'],          t:0},
  {p:'césped',    s:['cés','ped'],         t:0},
  {p:'huésped',   s:['hués','ped'],        t:0},
  {p:'azúcar',    s:['a','zú','car'],      t:1},
  {p:'fácil',     s:['fá','cil'],          t:0},
  {p:'difícil',   s:['di','fí','cil'],     t:1},
  {p:'fútbol',    s:['fút','bol'],         t:0},
  {p:'túnel',     s:['tú','nel'],          t:0},
  {p:'álbum',     s:['ál','bum'],          t:0},
  {p:'cárcel',    s:['cár','cel'],         t:0},
  {p:'ángel',     s:['án','gel'],          t:0},

  // Llanas sin tilde
  {p:'casa',      s:['ca','sa'],           t:0},
  {p:'mesa',      s:['me','sa'],           t:0},
  {p:'libro',     s:['li','bro'],          t:0},
  {p:'coche',     s:['co','che'],          t:0},
  {p:'amigo',     s:['a','mi','go'],       t:1},
  {p:'ventana',   s:['ven','ta','na'],     t:1},
  {p:'camino',    s:['ca','mi','no'],      t:1},
  {p:'problema',  s:['pro','ble','ma'],    t:1},
  {p:'cuaderno',  s:['cua','der','no'],    t:1},
  {p:'examen',    s:['e','xa','men'],      t:1},
  {p:'cabeza',    s:['ca','be','za'],      t:1},
  {p:'zapato',    s:['za','pa','to'],      t:1},

  // Esdrújulas (siempre llevan tilde)
  {p:'música',    s:['mú','si','ca'],          t:0},
  {p:'pájaro',    s:['pá','ja','ro'],          t:0},
  {p:'sábado',    s:['sá','ba','do'],          t:0},
  {p:'miércoles', s:['miér','co','les'],       t:0},
  {p:'plátano',   s:['plá','ta','no'],         t:0},
  {p:'brújula',   s:['brú','ju','la'],         t:0},
  {p:'rápido',    s:['rá','pi','do'],          t:0},
  {p:'médico',    s:['mé','di','co'],          t:0},
  {p:'número',    s:['nú','me','ro'],          t:0},
  {p:'teléfono',  s:['te','lé','fo','no'],     t:1},
  {p:'mecánico',  s:['me','cá','ni','co'],     t:1},
  {p:'matemáticas',s:['ma','te','má','ti','cas'], t:2},
  {p:'república', s:['re','pú','bli','ca'],    t:1},

  // Sobresdrújulas (siempre llevan tilde)
  {p:'cuéntamelo',  s:['cuén','ta','me','lo'],          t:0},
  {p:'dígamelo',    s:['dí','ga','me','lo'],            t:0},
  {p:'devuélvemelo',s:['de','vuél','ve','me','lo'],     t:1},
  {p:'cómpramelo',  s:['cóm','pra','me','lo'],          t:0},
  {p:'explícamelo', s:['ex','plí','ca','me','lo'],      t:1},
];

// ===== UTILIDADES =====
const VOCALES = 'aeiouáéíóúAEIOUÁÉÍÓÚ';
const VOCALES_NORMALES = 'aeiouAEIOU';
const MAP_TILDE = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
const MAP_PONER_TILDE = {'a':'á','e':'é','i':'í','o':'ó','u':'ú','A':'Á','E':'É','I':'Í','O':'Ó','U':'Ú'};

function quitarTildes(str) {
  return str.split('').map(c => MAP_TILDE[c] || c).join('');
}

function clasificar(silabas, t) {
  const desdeFinal = silabas.length - 1 - t;
  if (desdeFinal === 0) return 'aguda';
  if (desdeFinal === 1) return 'llana';
  if (desdeFinal === 2) return 'esdrújula';
  return 'sobresdrújula';
}

function ultimaLetra(palabra) {
  return quitarTildes(palabra).slice(-1).toLowerCase();
}

function deberiaLlevarTilde(palabra, silabas, t) {
  const tipo = clasificar(silabas, t);
  const ult = ultimaLetra(palabra);
  const acabaEnVocalNS = 'aeiouns'.includes(ult);
  if (tipo === 'aguda') return acabaEnVocalNS;
  if (tipo === 'llana') return !acabaEnVocalNS;
  return true; // esdrújula y sobresdrújula
}

function llevaTildeReal(palabra) {
  return /[áéíóúÁÉÍÓÚ]/.test(palabra);
}

// Encuentra el índice (en la palabra) de la vocal que debe llevar la tilde
function indiceVocalTonica(palabra, silabas, t) {
  // Si la palabra ya tiene tilde, devuelve esa posición
  for (let i = 0; i < palabra.length; i++) {
    if ('áéíóúÁÉÍÓÚ'.includes(palabra[i])) return i;
  }
  // Si no, busca la vocal más fuerte de la sílaba tónica
  let inicioSilaba = 0;
  for (let i = 0; i < t; i++) inicioSilaba += silabas[i].length;
  const silabaTonica = silabas[t];

  // Buscamos la vocal abierta (a, e, o). Si hay varias, la última.
  let posicion = -1;
  for (let i = 0; i < silabaTonica.length; i++) {
    if ('aeoAEO'.includes(silabaTonica[i])) posicion = i;
  }
  // Si no hay abierta, la última vocal cerrada (i, u)
  if (posicion === -1) {
    for (let i = 0; i < silabaTonica.length; i++) {
      if ('iuIU'.includes(silabaTonica[i])) posicion = i;
    }
  }
  return inicioSilaba + posicion;
}

function explicarRegla(palabra, silabas, t) {
  const tipo = clasificar(silabas, t);
  const ult = ultimaLetra(palabra);
  const acabaEnVocalNS = 'aeiouns'.includes(ult);
  const debe = deberiaLlevarTilde(palabra, silabas, t);

  if (tipo === 'aguda') {
    if (debe) return `Es aguda y acaba en "${ult}" (vocal, n o s) → lleva tilde.`;
    return `Es aguda pero acaba en "${ult}" (no es vocal, n ni s) → no lleva tilde.`;
  }
  if (tipo === 'llana') {
    if (debe) return `Es llana y NO acaba en vocal, n ni s (acaba en "${ult}") → lleva tilde.`;
    return `Es llana y acaba en "${ult}" (vocal, n o s) → no lleva tilde.`;
  }
  if (tipo === 'esdrújula') return `Es esdrújula → SIEMPRE lleva tilde.`;
  return `Es sobresdrújula → SIEMPRE lleva tilde.`;
}

function aleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== PUNTUACIÓN =====
const Puntos = {
  data: JSON.parse(localStorage.getItem('tildes-puntos') || '{"p":0,"a":0,"f":0}'),
  guardar() { localStorage.setItem('tildes-puntos', JSON.stringify(this.data)); this.render(); },
  acertar() { this.data.p += 10; this.data.a += 1; this.guardar(); },
  fallar() { this.data.f += 1; this.guardar(); },
  reset() { this.data = {p:0,a:0,f:0}; this.guardar(); },
  render() {
    document.getElementById('puntos').textContent = this.data.p;
    document.getElementById('aciertos').textContent = this.data.a;
    document.getElementById('fallos').textContent = this.data.f;
  }
};

// ===== PANTALLAS =====
const Pantallas = {
  inicio() {
    return `
      <div class="welcome">
        <h2>¡Hola! 👋 ¿Listo para aprender?</h2>
        <p>En esta aplicación vas a practicar las <strong>reglas de acentuación</strong> con juegos divertidos. Empieza por las <strong>reglas</strong> si necesitas recordarlas, o elige un juego.</p>
        <div class="cards">
          <div class="card" data-game="reglas">
            <span class="emoji">📖</span>
            <h3>Reglas</h3>
            <p>Aprende cuándo se pone la tilde</p>
          </div>
          <div class="card" data-game="silaba">
            <span class="emoji">🔤</span>
            <h3>Sílaba tónica</h3>
            <p>Encuentra la sílaba que suena más fuerte</p>
          </div>
          <div class="card" data-game="clasifica">
            <span class="emoji">📊</span>
            <h3>Clasifica</h3>
            <p>Aguda, llana, esdrújula o sobresdrújula</p>
          </div>
          <div class="card" data-game="tilde">
            <span class="emoji">✏️</span>
            <h3>¿Lleva tilde?</h3>
            <p>Decide sí o no según las reglas</p>
          </div>
          <div class="card" data-game="pontilde">
            <span class="emoji">🎯</span>
            <h3>Pon la tilde</h3>
            <p>Coloca la tilde en la vocal correcta</p>
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

  reglas() {
    return `
      <div class="reglas-content">
        <h2>📖 Reglas de acentuación</h2>
        <div class="regla-box">
          <h3>1. ¿Qué es la sílaba tónica?</h3>
          <p>Es la sílaba que pronunciamos con <strong>más fuerza</strong>. Todas las palabras tienen una.</p>
          <div class="ejemplo">ca-<strong>RA</strong>-col → la tónica es <strong>RA</strong></div>
        </div>
        <div class="regla-box">
          <h3>2. Palabras agudas</h3>
          <p>La sílaba tónica es la <strong>última</strong>. Llevan tilde cuando acaban en <strong>vocal, "n" o "s"</strong>.</p>
          <div class="ejemplo">Con tilde: ca-<strong>MIÓN</strong>, so-<strong>FÁ</strong>, des-<strong>PUÉS</strong></div>
          <div class="ejemplo">Sin tilde: re-<strong>LOJ</strong>, can-<strong>TAR</strong>, fe-<strong>LIZ</strong></div>
        </div>
        <div class="regla-box">
          <h3>3. Palabras llanas (o graves)</h3>
          <p>La sílaba tónica es la <strong>penúltima</strong>. Llevan tilde cuando <strong>NO</strong> acaban en vocal, "n" ni "s".</p>
          <div class="ejemplo">Con tilde: <strong>ÁR</strong>-bol, <strong>LÁ</strong>-piz, <strong>FÁ</strong>-cil</div>
          <div class="ejemplo">Sin tilde: <strong>CA</strong>-sa, ven-<strong>TA</strong>-na, e-<strong>XA</strong>-men</div>
        </div>
        <div class="regla-box">
          <h3>4. Palabras esdrújulas</h3>
          <p>La sílaba tónica es la <strong>antepenúltima</strong>. <strong>SIEMPRE</strong> llevan tilde.</p>
          <div class="ejemplo"><strong>MÚ</strong>-si-ca, <strong>PÁ</strong>-ja-ro, te-<strong>LÉ</strong>-fo-no</div>
        </div>
        <div class="regla-box">
          <h3>5. Palabras sobresdrújulas</h3>
          <p>La sílaba tónica está <strong>antes</strong> de la antepenúltima. <strong>SIEMPRE</strong> llevan tilde.</p>
          <div class="ejemplo"><strong>CUÉN</strong>-ta-me-lo, <strong>DÍ</strong>-ga-me-lo</div>
        </div>
        <div class="regla-box">
          <h3>🪄 Truco para recordarlo</h3>
          <p><strong>Esdrújulas y sobresdrújulas:</strong> siempre tilde.<br>
          <strong>Agudas:</strong> tilde si acaba en vocal, n o s.<br>
          <strong>Llanas:</strong> al revés que las agudas (tilde si NO acaba en vocal, n o s).</p>
        </div>
      </div>
    `;
  },

  silaba() {
    const pal = aleatorio(PALABRAS);
    const indicesMezclados = mezclar(pal.s.map((_, i) => i));
    return `
      <div class="game-area" id="game-silaba">
        <h2>🔤 Encuentra la sílaba tónica</h2>
        <div class="instruccion">Pulsa la sílaba que se pronuncia con más fuerza</div>
        <div class="palabra-grande">${pal.p}</div>
        <div class="silabas">
          ${pal.s.map((sil, i) => `<button class="silaba-btn" data-i="${i}">${sil}</button>`).join('')}
        </div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  clasifica() {
    const pal = aleatorio(PALABRAS);
    const tipo = clasificar(pal.s, pal.t);
    const opciones = ['aguda', 'llana', 'esdrújula', 'sobresdrújula'];
    return `
      <div class="game-area" id="game-clasifica" data-correcta="${tipo}">
        <h2>📊 Clasifica la palabra</h2>
        <div class="instruccion">¿Qué tipo de palabra es?</div>
        <div class="palabra-grande">${pal.p}</div>
        <div class="silabas">
          ${pal.s.map((sil, i) => `<span class="silaba-btn" style="cursor:default;${i===pal.t?'background:#fbbf24;color:white;border-color:#f59e0b;':''}">${sil}</span>`).join('')}
        </div>
        <div class="opciones">
          ${opciones.map(o => `<button class="opcion-btn" data-op="${o}">${o.charAt(0).toUpperCase()+o.slice(1)}</button>`).join('')}
        </div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  tilde() {
    const pal = aleatorio(PALABRAS);
    const debe = deberiaLlevarTilde(pal.p, pal.s, pal.t);
    // Mostramos la palabra sin tilde para no chivar la respuesta
    const palabraSinTilde = quitarTildes(pal.p);
    return `
      <div class="game-area" id="game-tilde" data-correcta="${debe ? 'si' : 'no'}">
        <h2>✏️ ¿Lleva tilde?</h2>
        <div class="instruccion">Decide si esta palabra debe llevar tilde según las reglas</div>
        <div class="palabra-grande">${palabraSinTilde}</div>
        <div class="silabas">
          ${pal.s.map((sil, i) => {
            const silSinTilde = quitarTildes(sil);
            return `<span class="silaba-btn" style="cursor:default;${i===pal.t?'background:#fbbf24;color:white;border-color:#f59e0b;':''}">${silSinTilde}</span>`;
          }).join('')}
        </div>
        <div class="opciones" style="max-width:400px;">
          <button class="opcion-btn" data-op="si">✅ Sí, lleva tilde</button>
          <button class="opcion-btn" data-op="no">❌ No lleva tilde</button>
        </div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  pontilde() {
    // Solo palabras que llevan tilde de verdad
    const conTilde = PALABRAS.filter(p => llevaTildeReal(p.p));
    const pal = aleatorio(conTilde);
    const palabraSinTilde = quitarTildes(pal.p);
    const idxCorrecto = indiceVocalTonica(pal.p, pal.s, pal.t);

    return `
      <div class="game-area" id="game-pontilde" data-correcta="${idxCorrecto}" data-palabra="${pal.p}">
        <h2>🎯 Pon la tilde</h2>
        <div class="instruccion">Pulsa la vocal donde debe ir la tilde</div>
        <div class="letras-clickables">
          ${palabraSinTilde.split('').map((letra, i) => {
            const esVocal = VOCALES_NORMALES.includes(letra);
            return `<button class="letra-btn ${esVocal?'vocal':'consonante'}" data-i="${i}" ${esVocal?'':'disabled'}>${letra}</button>`;
          }).join('')}
        </div>
        <div class="pista">💡 La sílaba tónica es <strong>${quitarTildes(pal.s[pal.t]).toUpperCase()}</strong></div>
        <div class="feedback" id="feedback"></div>
        <div id="explicacion-box"></div>
        <div id="siguiente-box"></div>
      </div>
    `;
  },

  mezcla() {
    const juegos = ['silaba', 'clasifica', 'tilde', 'pontilde'];
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

function mostrarExplicacion(texto) {
  const box = document.getElementById('explicacion-box');
  if (box) box.innerHTML = `<div class="explicacion">📚 ${texto}</div>`;
}

function mostrarBotonSiguiente() {
  const box = document.getElementById('siguiente-box');
  if (box) {
    box.innerHTML = `<button class="btn-siguiente" id="btn-sig">Siguiente palabra ➡️</button>`;
    document.getElementById('btn-sig').addEventListener('click', siguientePregunta);
  }
}

function deshabilitarBotones(selector) {
  document.querySelectorAll(selector).forEach(b => b.disabled = true);
}

function conectarEventos() {
  // Cards del inicio
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', () => cargar(c.dataset.game));
  });

  // ===== Sílaba tónica =====
  const gameSilaba = document.getElementById('game-silaba');
  if (gameSilaba) {
    const palabraTexto = gameSilaba.querySelector('.palabra-grande').textContent.trim();
    const pal = PALABRAS.find(x => x.p === palabraTexto) || PALABRAS.find(x => quitarTildes(x.p) === quitarTildes(palabraTexto));
    document.querySelectorAll('.silaba-btn').forEach(b => {
      b.addEventListener('click', () => {
        const i = parseInt(b.dataset.i);
        if (isNaN(i)) return;
        deshabilitarBotones('.silaba-btn');
        if (i === pal.t) {
          b.classList.add('correcta');
          Puntos.acertar();
          mostrarFeedback(true, '¡Muy bien! 🎉');
        } else {
          b.classList.add('incorrecta');
          document.querySelectorAll('.silaba-btn')[pal.t].classList.add('correcta');
          Puntos.fallar();
          mostrarFeedback(false, `La sílaba tónica era "${pal.s[pal.t]}"`);
        }
        mostrarExplicacion(`La palabra "${pal.p}" es ${clasificar(pal.s, pal.t)}. ${explicarRegla(pal.p, pal.s, pal.t)}`);
        mostrarBotonSiguiente();
      });
    });
  }

  // ===== Clasifica =====
  const gameClasifica = document.getElementById('game-clasifica');
  if (gameClasifica) {
    const correcta = gameClasifica.dataset.correcta;
    const palabraTexto = gameClasifica.querySelector('.palabra-grande').textContent.trim();
    const pal = PALABRAS.find(x => x.p === palabraTexto);
    document.querySelectorAll('.opcion-btn').forEach(b => {
      b.addEventListener('click', () => {
        const op = b.dataset.op;
        deshabilitarBotones('.opcion-btn');
        if (op === correcta) {
          b.classList.add('correcta');
          Puntos.acertar();
          mostrarFeedback(true, '¡Correcto! 🎉');
        } else {
          b.classList.add('incorrecta');
          document.querySelector(`.opcion-btn[data-op="${correcta}"]`).classList.add('mostrar-correcta');
          Puntos.fallar();
          mostrarFeedback(false, `La respuesta correcta era "${correcta}"`);
        }
        mostrarExplicacion(`La sílaba tónica es la ${(pal.s.length - pal.t)}ª desde el final, así que es ${correcta}.`);
        mostrarBotonSiguiente();
      });
    });
  }

  // ===== ¿Lleva tilde? =====
  const gameTilde = document.getElementById('game-tilde');
  if (gameTilde) {
    const correcta = gameTilde.dataset.correcta;
    const palabraTexto = gameTilde.querySelector('.palabra-grande').textContent.trim();
    const pal = PALABRAS.find(x => quitarTildes(x.p) === palabraTexto);
    document.querySelectorAll('.opcion-btn').forEach(b => {
      b.addEventListener('click', () => {
        const op = b.dataset.op;
        deshabilitarBotones('.opcion-btn');
        if (op === correcta) {
          b.classList.add('correcta');
          Puntos.acertar();
          mostrarFeedback(true, `¡Bien! Se escribe "${pal.p}"`);
        } else {
          b.classList.add('incorrecta');
          document.querySelector(`.opcion-btn[data-op="${correcta}"]`).classList.add('mostrar-correcta');
          Puntos.fallar();
          mostrarFeedback(false, `Se escribe "${pal.p}"`);
        }
        mostrarExplicacion(explicarRegla(pal.p, pal.s, pal.t));
        mostrarBotonSiguiente();
      });
    });
  }

  // ===== Pon la tilde =====
  const gamePon = document.getElementById('game-pontilde');
  if (gamePon) {
    const idxCorrecto = parseInt(gamePon.dataset.correcta);
    const palabra = gamePon.dataset.palabra;
    const pal = PALABRAS.find(x => x.p === palabra);
    document.querySelectorAll('.letra-btn.vocal').forEach(b => {
      b.addEventListener('click', () => {
        const i = parseInt(b.dataset.i);
        deshabilitarBotones('.letra-btn');
        if (i === idxCorrecto) {
          b.classList.add('con-tilde');
          b.textContent = MAP_PONER_TILDE[b.textContent] || b.textContent;
          Puntos.acertar();
          mostrarFeedback(true, `¡Perfecto! Se escribe "${pal.p}" 🎉`);
        } else {
          b.classList.add('incorrecta');
          const correctaBtn = document.querySelectorAll('.letra-btn')[idxCorrecto];
          correctaBtn.classList.add('con-tilde');
          correctaBtn.textContent = MAP_PONER_TILDE[correctaBtn.textContent] || correctaBtn.textContent;
          Puntos.fallar();
          mostrarFeedback(false, `Se escribe "${pal.p}"`);
        }
        mostrarExplicacion(`${explicarRegla(pal.p, pal.s, pal.t)} La tilde va en la vocal fuerte de la sílaba tónica.`);
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
