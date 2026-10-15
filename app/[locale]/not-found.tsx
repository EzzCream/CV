import Link from 'next/link';
import { getDictionary } from '@/lib/content';

// se muestra para rutas inexistentes dentro de /es o /en
export default function NotFound() {
  const es = getDictionary('es'), en = getDictionary('en');
  return (
    <main id="main" className="nf">
      <p className="mono">404</p>
      <h1 className="h2">{es.notFound.title}</h1>
      <p>{es.notFound.body}</p>
      <Link className="btn pri" href="/es">
        {es.notFound.back}
      </Link>
      <p lang="en" className="nf-en">
        {en.notFound.title} | <Link href="/en">{en.notFound.back}</Link>
      </p>
    </main>
  );
}
