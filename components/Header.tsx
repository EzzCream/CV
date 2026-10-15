'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Dictionary } from '@/content/schema';
import type { Locale } from '@/lib/content';

export type NavKey = 'about' | 'experience' | 'projects' | 'skills' | 'contact';
const NAV_ORDER: NavKey[] = ['about', 'experience', 'projects', 'skills', 'contact'];

type Props = {
  locale: Locale;
  other: Locale;
  ui: Dictionary['ui'];
  nav: Dictionary['nav'];
  sections: Dictionary['sections'];
  otherSections: Dictionary['sections'];
};

const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

function currentTheme(): 'dark' | 'light' {
  const t = document.documentElement.getAttribute('data-theme');
  if (t === 'dark' || t === 'light') return t;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribeTheme(onChange: () => void) {
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const mo = new MutationObserver(onChange);
  mq.addEventListener('change', onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    mq.removeEventListener('change', onChange);
    mo.disconnect();
  };
}

export function Header({ locale, other, ui, nav, sections, otherSections }: Props) {
  // el tema real solo se conoce en el navegador (script de arranque o preferencia del sistema)
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<NavKey | null>(null);
  const [solid, setSolid] = useState(false);
  const linksRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(() => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {}
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(apply);
    else apply();
  }, []);

  // la barra sigue la sección visible, recorriendo las secciones en el orden real de la página
  useEffect(() => {
    let ticking = false;
    const spy = () => {
      let cur: NavKey | null = null;
      for (const k of NAV_ORDER) {
        const el = document.getElementById(sections[k]);
        if (el && el.getBoundingClientRect().top <= 120) cur = k;
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact';
      setCurrent(cur);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        spy();
        ticking = false;
      });
    };
    spy();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', spy);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', spy);
    };
  }, [sections]);

  // el indicador rojo se desliza bajo el enlace activo
  useEffect(() => {
    const ind = indRef.current, links = linksRef.current;
    if (!ind || !links) return;
    const place = () => {
      const active = current ? links.querySelector<HTMLAnchorElement>(`a[href="#${sections[current]}"]`) : null;
      if (!active) return void (ind.style.opacity = '0');
      ind.style.width = `${active.offsetWidth}px`;
      ind.style.transform = `translateX(${active.offsetLeft}px)`;
      ind.style.opacity = '1';
    };
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [current, sections]);

  // fondo sólido al salir del hero; el margen cubre el desfase de scroll-padding (64px) al saltar a una sección
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const io = new IntersectionObserver((es) => setSolid(!(es[0]?.isIntersecting ?? true)), { rootMargin: '-80px 0px 0px 0px', threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      menuRef.current?.focus();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  // al cambiar de idioma se conserva la sección donde estaba
  const langHref = `/${other}${current ? `#${otherSections[current]}` : ''}`;
  const themeLabel = theme === 'dark' ? ui.themeLight : ui.themeDark;
  const links = NAV_ORDER.map((k) => (
    <a key={k} href={`#${sections[k]}`} aria-current={current === k ? 'true' : undefined} onClick={() => setOpen(false)}>
      {nav[k]}
    </a>
  ));

  return (
    <>
      <a className="skip" href="#main">
        {ui.skip}
      </a>
      <header className={solid ? 'top solid' : 'top'}>
        <div className="wrap">
          <a className="brand" href="#top">
            oscar.rodriguez<span className="sr">, {nav.home}</span>
            <i aria-hidden="true" />
          </a>
          <nav ref={linksRef} className="links" aria-label={locale === 'es' ? 'Principal' : 'Main'}>
            {links}
            <span ref={indRef} className="ind" aria-hidden="true" />
          </nav>
          <div className="tools desk">
            <a className="tbtn" href={langHref} hrefLang={other} lang={other} aria-label={ui.languageLabel}>
              {other.toUpperCase()}
            </a>
            <button className="tbtn" type="button" onClick={toggleTheme} aria-label={theme ? themeLabel : ui.themeToggle}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
          </div>
          <button
            ref={menuRef}
            className="tbtn menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="sheet"
            aria-label={open ? ui.menuClose : ui.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </header>
      <div ref={sheetRef} className="sheet" id="sheet" hidden={!open}>
        {links}
        <div className="tools">
          <a className="tbtn" href={langHref} hrefLang={other} lang={other}>
            {ui.language}
          </a>
          <button className="tbtn" type="button" onClick={toggleTheme}>
            {ui.themeToggle}
          </button>
        </div>
      </div>
    </>
  );
}
