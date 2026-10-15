import { notFound } from 'next/navigation';

// cualquier ruta bajo /es o /en que no exista cae en el 404 del idioma
export default function CatchAll() {
  notFound();
}
