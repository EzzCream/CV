/* Rastro de código. Dos capas independientes:
   - hero: vive dentro del hero y se mueve con él. Fuerza completa, comportamientos automáticos,
     dibujos de código e inversión del nombre (mix-blend-mode en el CSS).
   - cursor: capa fija detrás del contenido. Solo el rastro del mouse fuera del hero, sutil. */

const GLYPHS = '{}[]()<>/\\=+-*;:._|&%$#@!?0123456789ABCDEFabcdefx';
const SNIPPETS = ['const oscar = new Dev()', 'git push origin main', 'npm run build', 'fn main() { }', 'SELECT * FROM proyectos;', 'await fetch("/api")', 'cargo build --release', 'import React from "react"', '0xC0FFEE', 'docker compose up', 'terraform apply', 'console.log("hola")', 'uvicorn main:app', '<Oscar />'];
const R = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T;
const rndGlyph = () => GLYPHS.charCodeAt(Math.floor(Math.random() * GLYPHS.length));

type Colors = { ink: string; paper: string; red: string };
type Point = { x: number; y: number };
type FieldOptions = { decay: number; spread: number; blocks: boolean; maxAlpha: number; caret: boolean };

class Field {
  W = 0;
  H = 0;
  cs = 16;
  cols = 0;
  rows = 0;
  e = new Float32Array(0);
  nx = new Float32Array(0);
  gl = new Uint8Array(0);
  forced = new Uint8Array(0);
  tint = new Uint8Array(0);
  awake = false;
  head: Point | null = null;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private opt: FieldOptions,
    private font: string,
    private colors: () => Colors,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 2d no disponible');
    this.ctx = ctx;
  }

  resize(w: number, h: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = w;
    this.H = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cs = w < 600 ? 13 : 16;
    this.cols = Math.ceil(w / this.cs);
    this.rows = Math.ceil(h / this.cs);
    const n = this.cols * this.rows;
    this.e = new Float32Array(n);
    this.nx = new Float32Array(n);
    this.gl = new Uint8Array(n);
    this.forced = new Uint8Array(n);
    this.tint = new Uint8Array(n);
    for (let i = 0; i < n; i++) this.gl[i] = rndGlyph();
    this.ctx.clearRect(0, 0, w, h);
  }

  inject(x: number, y: number, r: number, amt: number) {
    const cs = this.cs, cx = x / cs, cy = y / cs, rr = r / cs, e = this.e;
    const j0 = Math.max(0, Math.floor(cy - rr)), j1 = Math.min(this.rows - 1, Math.ceil(cy + rr));
    const i0 = Math.max(0, Math.floor(cx - rr)), i1 = Math.min(this.cols - 1, Math.ceil(cx + rr));
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++) {
        const d = Math.hypot(i - cx, j - cy);
        if (d > rr) continue;
        const k = j * this.cols + i;
        e[k] = Math.min(1.25, (e[k] ?? 0) + amt * (1 - d / rr) * (0.75 + Math.random() * 0.5));
      }
    this.awake = true;
  }

  line(x0: number, y0: number, x1: number, y1: number, r: number, amt: number) {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / this.cs));
    for (let s = 1; s <= steps; s++) this.inject(x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps, r, amt);
  }

  cell(i: number, j: number, amt: number, ch?: number, red = false) {
    if (i < 0 || j < 0 || i >= this.cols || j >= this.rows) return;
    const k = j * this.cols + i;
    this.e[k] = Math.min(1.25, Math.max(this.e[k] ?? 0, amt));
    if (ch) {
      this.forced[k] = ch;
      this.tint[k] = red ? 1 : 0;
    }
    this.awake = true;
  }

  // devuelve la energía total; con cero, la capa se duerme
  step(): number {
    const { e, nx, cols, rows } = this, { decay, spread } = this.opt;
    let total = 0;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i, v = e[k] ?? 0;
        const n = (i > 0 ? e[k - 1]! : 0) + (i < cols - 1 ? e[k + 1]! : 0) + (j > 0 ? e[k - cols]! : 0) + (j < rows - 1 ? e[k + cols]! : 0);
        const out = (v + spread * (n / 4 - v)) * decay - 0.0012;
        const val = out > 0 ? out : 0;
        nx[k] = val;
        total += val;
      }
    this.e = nx;
    this.nx = e;
    return total;
  }

  draw(now: number) {
    const { e, gl, forced, tint, cs, cols, rows, ctx, opt } = this, col = this.colors();
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.font = `600 ${(cs * 0.74).toFixed(1)}px ${this.font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i, v = e[k] ?? 0;
        if (v < 0.06) continue;
        if (v < 0.14) {
          forced[k] = 0;
          tint[k] = 0;
        }
        if (!forced[k] && Math.random() < v * 0.1) gl[k] = rndGlyph();
        const x = i * cs, y = j * cs, red = tint[k] === 1, ch = String.fromCharCode(forced[k] || gl[k] || 32);
        if (opt.blocks && v > 0.5) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = red ? col.red : col.ink;
          ctx.fillRect(x, y, cs, cs);
          ctx.globalAlpha = 0.55 + Math.min(0.45, v - 0.5);
          ctx.fillStyle = red ? '#fff' : col.paper;
        } else {
          ctx.globalAlpha = Math.min(opt.maxAlpha, v * 2.1);
          ctx.fillStyle = red ? col.red : col.ink;
        }
        ctx.fillText(ch, x + cs / 2, y + cs / 2 + 1);
      }
    ctx.globalAlpha = 1;
    if (opt.caret && this.head && Math.floor(now / 420) % 2 === 0) {
      ctx.fillStyle = col.red;
      ctx.fillRect(Math.floor(this.head.x / cs) * cs, Math.floor(this.head.y / cs) * cs, cs * 0.6, cs);
    }
  }

  clear() {
    this.e.fill(0);
    this.forced.fill(0);
    this.tint.fill(0);
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.awake = false;
  }
}

/* comportamientos automáticos del hero: uno a la vez (a veces dos), con pausas */
type Agent =
  | { kind: 'walker'; x: number; y: number; tx: number; ty: number; sp: number; until: number }
  | { kind: 'circuit'; i: number; j: number; d: [number, number]; left: number; acc: number; rate: number }
  | { kind: 'scan'; v: boolean; p: number; end: number; sp: number; acc: number }
  | { kind: 'pulse'; x: number; y: number; r: number; max: number }
  | { kind: 'type'; t: string; i: number; j: number; n: number; acc: number; rate: number }
  | { kind: 'drop'; i: number; j: number; end: number; acc: number; rate: number };

const KINDS = ['type', 'type', 'type', 'circuit', 'circuit', 'walker', 'pulse', 'scan', 'drop'] as const;
const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function createAgents(f: Field) {
  let list: Agent[] = [];
  let nextSpawn = 0;
  const ci = () => Math.floor(R(2, f.cols - 2)), cj = () => Math.floor(R(2, f.rows - 2));

  function spawn(now: number) {
    const kind = pick(KINDS);
    if (kind === 'walker') list.push({ kind, x: R(0, f.W), y: R(0, f.H), tx: R(0, f.W), ty: R(0, f.H), sp: R(2, 3.5), until: now + R(2200, 3800) });
    if (kind === 'circuit') list.push({ kind, i: ci(), j: cj(), d: pick(DIRS), left: Math.floor(R(25, 55)), acc: 0, rate: R(0.35, 0.6) });
    if (kind === 'scan') {
      const v = Math.random() < 0.5;
      list.push({ kind, v, p: 0, end: v ? f.cols : f.rows, sp: R(0.35, 0.6), acc: 0 });
    }
    if (kind === 'pulse') list.push({ kind, x: R(f.W * 0.45, f.W * 0.9), y: R(f.H * 0.2, f.H * 0.8), r: 8, max: R(70, 150) });
    if (kind === 'type') {
      const t = pick(SNIPPETS);
      list.push({ kind, t, i: Math.floor(R(1, Math.max(2, f.cols - t.length - 1))), j: cj(), n: 0, acc: 0, rate: R(0.22, 0.32) });
    }
    if (kind === 'drop') list.push({ kind, i: ci(), j: Math.floor(R(0, f.rows * 0.3)), end: Math.floor(R(f.rows * 0.45, f.rows * 0.8)), acc: 0, rate: R(0.3, 0.5) });
  }

  function update(now: number, allowSpawn: boolean): Point | null {
    let head: Point | null = null;
    if (allowSpawn && now > nextSpawn && list.length < (Math.random() < 0.25 ? 2 : 1)) {
      spawn(now);
      nextSpawn = now + R(1600, 3200);
    }
    list = list.filter((g) => {
      switch (g.kind) {
        case 'walker': {
          const dx = g.tx - g.x, dy = g.ty - g.y, d = Math.hypot(dx, dy) || 1;
          if (d < 20) {
            g.tx = R(0, f.W);
            g.ty = R(0, f.H);
          }
          g.x += (dx / d) * g.sp;
          g.y += (dy / d) * g.sp;
          f.inject(g.x, g.y, 18, 0.45);
          head = { x: g.x, y: g.y };
          return now <= g.until;
        }
        case 'circuit':
          g.acc += g.rate;
          while (g.acc >= 1 && g.left > 0) {
            g.acc -= 1;
            g.left--;
            if (Math.random() < 0.09) g.d = g.d[0] ? [0, Math.random() < 0.5 ? 1 : -1] : [Math.random() < 0.5 ? 1 : -1, 0];
            g.i += g.d[0];
            g.j += g.d[1];
            if (g.i < 0 || g.j < 0 || g.i >= f.cols || g.j >= f.rows) {
              g.left = 0;
              break;
            }
            f.cell(g.i, g.j, 0.95);
          }
          return g.left > 0;
        case 'scan':
          g.acc += g.sp;
          while (g.acc >= 1) {
            g.acc -= 1;
            const n = g.v ? f.rows : f.cols;
            for (let q = 0; q < n; q++) if (Math.random() < 0.3) (g.v ? f.cell(g.p, q, R(0.25, 0.55)) : f.cell(q, g.p, R(0.25, 0.55)));
            g.p++;
          }
          return g.p < g.end;
        case 'pulse':
          for (let t = 0; t < Math.PI * 2; t += 0.18) f.inject(g.x + Math.cos(t) * g.r, g.y + Math.sin(t) * g.r, 8, 0.32);
          g.r += 2.6;
          return g.r <= g.max;
        case 'type':
          g.acc += g.rate;
          while (g.acc >= 1 && g.n < g.t.length) {
            g.acc -= 1;
            const ch = g.t.charCodeAt(g.n);
            if (ch !== 32) f.cell(g.i + g.n, g.j, 1.2, ch);
            g.n++;
          }
          head = { x: (g.i + g.n) * f.cs, y: g.j * f.cs + f.cs / 2 };
          return g.n < g.t.length;
        case 'drop':
          g.acc += g.rate;
          while (g.acc >= 1) {
            g.acc -= 1;
            f.cell(g.i, g.j, 1.1);
            g.j++;
          }
          return g.j < g.end;
      }
    });
    return head;
  }

  return { update, clear: () => void (list = []) };
}

/* dibujos de código: se arman celda por celda en el área derecha, se sostienen y se disuelven.
   Cada forma se dibuja en un lienzo de 100x100; lo pintado es tinta, destination-out abre huecos. */
type Shape = (g: CanvasRenderingContext2D, displayFont: string) => void;
const SHAPES: Record<string, Shape> = {
  michi(g) {
    g.beginPath(); g.ellipse(50, 60, 34, 29, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(20, 46); g.lineTo(25, 10); g.lineTo(46, 34); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(80, 46); g.lineTo(75, 10); g.lineTo(54, 34); g.closePath(); g.fill();
    g.globalCompositeOperation = 'destination-out';
    g.beginPath(); g.ellipse(38, 57, 5, 8, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(62, 57, 5, 8, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(45, 70); g.lineTo(55, 70); g.lineTo(50, 76); g.closePath(); g.fill();
    g.lineWidth = 2.6;
    g.beginPath(); g.moveTo(16, 66); g.lineTo(34, 70); g.moveTo(16, 76); g.lineTo(34, 74); g.moveTo(84, 66); g.lineTo(66, 70); g.moveTo(84, 76); g.lineTo(66, 74); g.stroke();
  },
  cafe(g) {
    g.beginPath(); g.roundRect(16, 40, 54, 48, 7); g.fill();
    g.beginPath(); g.arc(72, 62, 15, 0, Math.PI * 2); g.fill();
    g.lineWidth = 6; g.lineCap = 'round';
    for (const x of [30, 43, 56]) { g.beginPath(); g.moveTo(x, 32); g.bezierCurveTo(x - 7, 25, x + 7, 18, x, 8); g.stroke(); }
    g.globalCompositeOperation = 'destination-out';
    g.beginPath(); g.arc(72, 62, 7.5, 0, Math.PI * 2); g.fill();
    g.fillRect(22, 46, 42, 5);
  },
  heart(g) {
    g.beginPath(); g.moveTo(50, 90); g.bezierCurveTo(12, 66, 6, 40, 24, 27); g.bezierCurveTo(36, 19, 47, 26, 50, 35); g.bezierCurveTo(53, 26, 64, 19, 76, 27); g.bezierCurveTo(94, 40, 88, 66, 50, 90); g.fill();
    g.globalCompositeOperation = 'destination-out';
    g.beginPath(); g.ellipse(32, 40, 5, 9, -0.5, 0, Math.PI * 2); g.fill();
  },
  eva02(g, displayFont) {
    // "02" en serif pesada y condensada, con aire entre los dígitos para que se lean a baja resolución
    g.font = `700 96px ${displayFont}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const [d, x] of [['0', 27], ['2', 73]] as const) { g.save(); g.translate(x, 54); g.scale(0.78, 1.08); g.fillText(d, 0, 0); g.restore(); }
  },
  code(g) {
    g.lineWidth = 9; g.lineCap = 'square'; g.lineJoin = 'miter';
    g.beginPath(); g.moveTo(30, 26); g.lineTo(8, 50); g.lineTo(30, 74); g.stroke();
    g.beginPath(); g.moveTo(70, 26); g.lineTo(92, 50); g.lineTo(70, 74); g.stroke();
    g.beginPath(); g.moveTo(58, 18); g.lineTo(42, 82); g.stroke();
  },
};
const DRAW_ORDER = ['michi', 'heart', 'cafe', 'code', 'eva02'] as const;
const DRAW_WORDS: Record<(typeof DRAW_ORDER)[number], string> = { michi: 'MIAU', heart: '<3', cafe: 'CAFE', code: '{}</>', eva02: 'EVA' };
const DRAW_RED = new Set<string>(['eva02']);

type Cell = { i: number; j: number; o: number; broken?: boolean };
type Region = { i0: number; j0: number; cols: number; rows: number };
type Drawing = { name: string; cells: Cell[]; holes: { i: number; j: number }[]; built: number; phase: 'build' | 'hold'; t: number; word: string };

export type TrailOptions = {
  hero: HTMLElement;
  heroCanvas: HTMLCanvasElement;
  drawArea: HTMLElement | null;
  pageCanvas: HTMLCanvasElement;
  trailFont: string;
  displayFont: string;
};

export function startTrail(o: TrailOptions): () => void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const font = `${o.trailFont}, ui-monospace, monospace`;
  const displayFont = `${o.displayFont}, Georgia, "Times New Roman", serif`;
  let col: Colors = { ink: '#0C0E10', paper: '#E5E7E6', red: '#B5121B' };
  const readColors = () => {
    const s = getComputedStyle(document.documentElement);
    col = { ink: s.getPropertyValue('--ink').trim(), paper: s.getPropertyValue('--paper').trim(), red: s.getPropertyValue('--red').trim() };
  };
  const colors = () => col;

  const { hero } = o;
  const heroField = new Field(o.heroCanvas, { decay: 0.9915, spread: 0.16, blocks: true, maxAlpha: 1, caret: true }, font, colors);
  const pageField = new Field(o.pageCanvas, { decay: 0.966, spread: 0.12, blocks: false, maxAlpha: 0.62, caret: false }, font, colors);
  const agents = createAgents(heroField);

  let raf = 0, running = false, t0 = 0, ambient = 0, heroVisible = true, destroyed = false;
  // puntero en coordenadas de pantalla; null cuando no hay mouse en la ventana
  let ptr: Point | null = null, lastHero: Point | null = null, lastPage: Point | null = null, lastMoveHero = 0, overHero = false;
  let lastVW = 0, lastVH = 0, resizeT = 0;
  const timers: number[] = [];

  function sizeHero(force: boolean) {
    const r = hero.getBoundingClientRect(), w = Math.round(r.width), h = Math.round(r.height);
    if (!force && w === heroField.W && Math.abs(h - heroField.H) < 120) return;
    heroField.resize(w, h);
    agents.clear();
  }
  function sizePage(force: boolean) {
    const w = innerWidth, h = innerHeight;
    // la barra del navegador móvil cambia la altura al hacer scroll: no reiniciar por eso
    if (!force && w === lastVW && Math.abs(h - lastVH) < 120) return;
    lastVW = w;
    lastVH = h;
    pageField.resize(w, h);
  }

  /* ---- dibujos ---- */
  let region: Region | null = null, drawing: Drawing | null = null, drawIdx = 0, nextDrawAt = 0;
  function measureRegion() {
    if (!o.drawArea) return void (region = null);
    const a = o.drawArea.getBoundingClientRect(), h = hero.getBoundingClientRect(), cs = heroField.cs;
    region = {
      i0: Math.ceil((a.left - h.left) / cs),
      j0: Math.ceil((a.top - h.top) / cs),
      cols: Math.max(8, Math.floor(a.width / cs)),
      rows: Math.max(8, Math.floor(a.height / cs)),
    };
    drawing = null;
  }
  function maskFor(name: string, reg: Region) {
    const { cols, rows } = reg, side = Math.min(cols, rows);
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const g = off.getContext('2d', { willReadFrequently: true });
    if (!g) return { cells: [], holes: [] };
    g.fillStyle = '#000';
    g.strokeStyle = '#000';
    g.translate((cols - side) / 2, (rows - side) / 2);
    g.scale(side / 100, side / 100);
    SHAPES[name]?.(g, displayFont);
    const d = g.getImageData(0, 0, cols, rows).data;
    const on = (i: number, j: number) => (d[(j * cols + i) * 4 + 3] ?? 0) > 110;
    const cells: Cell[] = [], holes: { i: number; j: number }[] = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (on(i, j)) cells.push({ i, j, o: j + Math.random() * 4 });
    cells.sort((p, q) => p.o - q.o);
    for (let j = 0; j < rows; j++) {
      let first = -1, last = -1;
      for (let i = 0; i < cols; i++) if (on(i, j)) { if (first < 0) first = i; last = i; }
      for (let i = first + 1; i < last; i++) if (!on(i, j)) holes.push({ i, j });
    }
    return { cells, holes };
  }
  function updateDrawing(now: number) {
    if (!region || reduce) return;
    const reg = region, f = heroField;
    if (!drawing) {
      if (now < nextDrawAt) return;
      const name = DRAW_ORDER[drawIdx++ % DRAW_ORDER.length]!;
      drawing = { name, ...maskFor(name, reg), built: 0, phase: 'build', t: now, word: DRAW_WORDS[name] };
    }
    const dr = drawing, w = dr.word, red = DRAW_RED.has(dr.name);
    const index = (c: { i: number; j: number }) => (reg.j0 + c.j) * f.cols + reg.i0 + c.i;
    // la difusión rellenaría los huecos (ojos, asa, contornos): se mantienen claros mientras el dibujo vive
    const keepHoles = () => {
      for (const h of dr.holes) {
        const k = index(h);
        if ((f.e[k] ?? 0) > 0.3) f.e[k] = 0.3;
        f.forced[k] = 0;
        f.tint[k] = 0;
      }
    };
    const put = (c: Cell) => f.cell(reg.i0 + c.i, reg.j0 + c.j, 1.1, w.charCodeAt((c.i + c.j) % w.length), red);
    if (dr.phase === 'build') {
      const n = Math.max(2, Math.ceil(dr.cells.length / 50));
      for (let k = 0; k < n && dr.built < dr.cells.length; k++) put(dr.cells[dr.built++]!);
      for (let k = 0; k < dr.built; k++) {
        const c = dr.cells[k]!;
        if ((f.e[index(c)] ?? 0) < 0.9) put(c);
      }
      keepHoles();
      if (dr.built >= dr.cells.length) {
        dr.phase = 'hold';
        dr.t = now;
      }
    } else {
      // se sostiene, salvo donde pasa el mouse: ahí se desarma
      const head = f.head;
      for (const c of dr.cells) {
        const gi = reg.i0 + c.i, gj = reg.j0 + c.j;
        if (head && overHero && Math.hypot(gi - head.x / f.cs, gj - head.y / f.cs) < 3.2) {
          c.broken = true;
          continue;
        }
        if (!c.broken && (f.e[gj * f.cols + gi] ?? 0) < 0.9) put(c);
      }
      keepHoles();
      if (now - dr.t > 3200) {
        drawing = null;
        nextDrawAt = now + 1500;
      }
    }
  }

  /* ---- puntero ---- */
  function isOverHero(x: number, y: number) {
    if (!heroVisible) return false;
    const r = hero.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }
  // dibuja en la capa que corresponde según dónde esté el puntero
  function paintAt(x: number, y: number, fromScroll: boolean) {
    overHero = isOverHero(x, y);
    if (overHero) {
      const r = hero.getBoundingClientRect(), hx = x - r.left, hy = y - r.top;
      const d = lastHero ? Math.hypot(hx - lastHero.x, hy - lastHero.y) : Infinity;
      if (lastHero && d < 240) heroField.line(lastHero.x, lastHero.y, hx, hy, 18 + Math.min(d, 60) * 0.6, fromScroll ? 0.5 : 0.68);
      else heroField.inject(hx, hy, 18, 0.5);
      lastHero = { x: hx, y: hy };
      lastPage = null;
      heroField.head = { x: hx, y: hy };
      lastMoveHero = performance.now();
    } else {
      heroField.head = null;
      lastHero = null;
      if (!finePointer || reduce) return;
      const d = lastPage ? Math.hypot(x - lastPage.x, y - lastPage.y) : Infinity;
      if (lastPage && d < 240) pageField.line(lastPage.x, lastPage.y, x, y, 14 + Math.min(d, 50) * 0.4, 0.7);
      else if (fromScroll) pageField.inject(x, y, 16, 0.5);
      lastPage = { x, y };
    }
    wake();
  }
  const onMove = (ev: PointerEvent) => {
    ptr = { x: ev.clientX, y: ev.clientY };
    paintAt(ptr.x, ptr.y, false);
  };
  const reset = () => {
    ptr = null;
    lastHero = lastPage = null;
    heroField.head = null;
    overHero = false;
  };
  const onOut = (ev: PointerEvent) => {
    if (!ev.relatedTarget) reset();
  };
  // con el mouse quieto y la página moviéndose, el rastro sigue saliendo justo debajo del cursor
  const onScroll = () => {
    if (ptr) paintAt(ptr.x, ptr.y, true);
  };
  const onResize = () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(() => {
      sizeHero(false);
      sizePage(false);
      measureRegion();
    }, 150);
  };
  const onVisible = () => {
    if (!document.hidden) wake();
  };
  const onColors = () => {
    readColors();
    if (reduce) settle();
    wake();
  };

  function burst() {
    const W = heroField.W, H = heroField.H, m = Math.min(W, H);
    heroField.inject(W * 0.24, H * 0.52, m * 0.42, 1.25);
    timers.push(window.setTimeout(() => running && heroField.inject(W * 0.42, H * 0.46, m * 0.3, 1), 220));
    timers.push(window.setTimeout(() => running && heroField.inject(W * 0.12, H * 0.6, m * 0.22, 0.9), 420));
  }
  // con movimiento reducido: una sola imagen fija del rastro
  function settle() {
    heroField.clear();
    heroField.inject(heroField.W * 0.24, heroField.H * 0.52, Math.min(heroField.W, heroField.H) * 0.42, 1.25);
    for (let i = 0; i < 220; i++) heroField.step();
    heroField.draw(0);
  }

  function wake() {
    if (running && !raf) raf = requestAnimationFrame(frame);
  }
  function frame(now: number) {
    raf = 0;
    if (!running || document.hidden) return;
    let busy = false;
    if (heroVisible) {
      const idle = !overHero && now - lastMoveHero > 1400 && now - t0 > 1200;
      const head = agents.update(now, idle);
      if (idle) heroField.head = head;
      updateDrawing(now);
      if (++ambient % 150 === 0) heroField.inject(heroField.W * (0.5 + Math.random() * 0.45), Math.random() * heroField.H, 12 + Math.random() * 16, 0.5);
      heroField.step();
      heroField.draw(now);
      busy = true;
    }
    if (pageField.awake) {
      const total = pageField.step();
      pageField.draw(now);
      if (total < 0.5) pageField.clear();
      else busy = true;
    }
    if (busy) raf = requestAnimationFrame(frame);
  }

  const heroIO = new IntersectionObserver((es) => {
    heroVisible = es[0]?.isIntersecting ?? true;
    if (heroVisible) wake();
  });
  const themeMO = new MutationObserver(onColors);
  const scheme = matchMedia('(prefers-color-scheme: dark)');

  readColors();
  sizeHero(true);
  sizePage(true);
  measureRegion();
  nextDrawAt = performance.now() + 900;

  const go = () => {
    if (destroyed) return;
    themeMO.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    scheme.addEventListener('change', onColors);
    if (reduce) return settle();
    running = true;
    t0 = performance.now();
    burst();
    heroIO.observe(hero);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerout', onOut, { passive: true });
    addEventListener('blur', reset);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisible);
    wake();
  };
  // el canvas no espera a la fuente: se carga antes de pintar el primer cuadro
  Promise.all([document.fonts.load(`600 14px ${o.trailFont}`), document.fonts.load(`700 96px ${o.displayFont}`)]).then(go, go);

  return () => {
    destroyed = true;
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(resizeT);
    timers.forEach(clearTimeout);
    heroIO.disconnect();
    themeMO.disconnect();
    scheme.removeEventListener('change', onColors);
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerout', onOut);
    removeEventListener('blur', reset);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisible);
  };
}
