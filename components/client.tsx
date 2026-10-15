'use client';

import { useEffect, useRef, useState } from 'react';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* títulos que se decodifican al entrar en pantalla e íconos que se dibujan al aparecer */
const GL = '{}[]<>/=+*#%&$@01';
function decode(el: HTMLElement) {
  const txt = el.dataset.text ?? el.textContent ?? '';
  el.dataset.text = txt;
  if (reduced()) return;
  const start = performance.now(), dur = 700;
  const tick = (now: number) => {
    const k = Math.min(1, (now - start) / dur), n = Math.floor(txt.length * k);
    el.textContent = txt.slice(0, n) + [...txt.slice(n)].map((c) => (c === ' ' ? ' ' : GL[Math.floor(Math.random() * GL.length)])).join('');
    if (k < 1) requestAnimationFrame(tick);
    else el.textContent = txt;
  };
  requestAnimationFrame(tick);
}

export function Reveal() {
  useEffect(() => {
    const titles = new IntersectionObserver(
      (es) => es.forEach((en) => {
        if (!en.isIntersecting) return;
        titles.unobserve(en.target);
        decode(en.target as HTMLElement);
      }),
      { threshold: 0.6 },
    );
    const icons = new IntersectionObserver(
      (es) => es.forEach((en) => {
        if (!en.isIntersecting) return;
        icons.unobserve(en.target);
        en.target.classList.add('drawn');
      }),
      { threshold: 0.35 },
    );
    document.querySelectorAll('.dec').forEach((h) => titles.observe(h));
    document.querySelectorAll('.log>li').forEach((li) => icons.observe(li));
    return () => {
      titles.disconnect();
      icons.disconnect();
    };
  }, []);
  return null;
}

// logros que no caben a la vista: se muestran bajo demanda
export function Highlights({ shown, rest, more, less }: { shown: string[]; rest: string[]; more: string; less: string }) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!open || reduced()) return;
    listRef.current?.querySelectorAll('.extra').forEach((li, i) =>
      li.animate([{ opacity: 0, transform: 'translateX(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: i * 50, fill: 'backwards' }),
    );
  }, [open]);
  return (
    <>
      <ul className="hl" ref={listRef}>
        {shown.map((h) => <li key={h}>{h}</li>)}
        {rest.map((h) => (
          <li key={h} className="extra" hidden={!open}>
            {h}
          </li>
        ))}
      </ul>
      {rest.length > 0 && (
        <button className="more" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? less : more}
        </button>
      )}
    </>
  );
}

export function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [status, setStatus] = useState('');
  const codeRef = useRef<HTMLElement>(null);
  const select = () => {
    if (!codeRef.current) return;
    const r = document.createRange();
    r.selectNodeContents(codeRef.current);
    const s = getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
  };
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(''), 2400);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <>
      <div className="mail">
        <code ref={codeRef}>{email}</code>
        <button
          className="tbtn"
          type="button"
          onClick={() => {
            if (!navigator.clipboard) return select();
            navigator.clipboard.writeText(email).then(() => setStatus(copied), select);
          }}
        >
          {copy}
        </button>
      </div>
      <span className="fstatus" aria-live="polite">
        {status}
      </span>
    </>
  );
}
