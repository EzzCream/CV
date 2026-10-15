// flechas dibujadas en SVG: el texto de la página solo lleva caracteres de teclado
export function ArrowOut() {
  return (
    <svg className="ico" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 9 L9 3 M4.5 3 H9 V7.5" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg className="ico" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 1.5 V10 M2.5 6.5 L6 10 L9.5 6.5" />
    </svg>
  );
}
