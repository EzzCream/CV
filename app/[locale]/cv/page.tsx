import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, profile as P } from '@/lib/content';
import { cvBody, cvDisplay } from '@/lib/fonts';
import { fill, formatRange } from '@/lib/format';

type Props = { params: Promise<{ locale: string }> };

// versión imprimible del CV: de aquí sale el PDF (npm run cv:pdf). No se indexa.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).cv.title, robots: { index: false, follow: false } };
}

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export default async function CvPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const D = getDictionary(locale), H = D.cv.headings;
  const range = (s: string, e: string | null, m?: number) => formatRange(locale, D, s, e, m);

  return (
    <main className={`cv ${cvBody.variable} ${cvDisplay.variable}`}>
      <header className="cv-head">
        <h1>{P.person.fullName}</h1>
        <p className="cv-role">{P.person.jobTitle}</p>
        <p className="cv-contact">
          <a href={`mailto:${P.person.email}`}>{P.person.email}</a>
          <span>{P.person.phone}</span>
          <span>{P.person.city}</span>
          <a href={P.person.site}>{bare(P.person.site)}</a>
          <a href={P.links.github}>{bare(P.links.github)}</a>
          <a href={P.links.linkedin}>LinkedIn</a>
        </p>
      </header>

      <section>
        <h2>{H.summary}</h2>
        <p>{D.cv.summary}</p>
      </section>

      <section>
        <h2>{H.experience}</h2>
        {P.experience.map((e) => {
          const t = D.experience.items[e.id];
          if (!t) return null;
          return (
            <article key={e.id} className="cv-item">
              <div className="cv-row">
                <h3>
                  {t.role} | {e.company}
                </h3>
                <span className="cv-date">{range(e.start, e.end, e.durationMonths)}</span>
              </div>
              {t.summary && <p className="cv-sum">{t.summary}</p>}
              <ul>
                {t.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="cv-stack">{e.stack.join(', ')}</p>
            </article>
          );
        })}
      </section>

      <section>
        <h2>{H.projects}</h2>
        {P.projects.map((pr) => {
          const t = D.projects.items[pr.id];
          if (!t) return null;
          return (
            <article key={pr.id} className="cv-item">
              <div className="cv-row">
                <h3>
                  {pr.name} | {t.kind}
                </h3>
                <span className="cv-date">{pr.year}</span>
              </div>
              <p className="cv-sum">
                {t.summary}
                {pr.repo && (
                  <>
                    {' '}
                    <a href={pr.repo}>{bare(pr.repo)}</a>
                  </>
                )}
              </p>
              <p className="cv-stack">{pr.stack.join(', ')}</p>
            </article>
          );
        })}
      </section>

      <section>
        <h2>{H.skills}</h2>
        <dl className="cv-skills">
          {P.skills.map((g) => (
            <div key={g.id}>
              <dt>{D.skills.groups[g.id]}</dt>
              <dd>{g.items.map((it) => it.name ?? (it.id ? D.skills.labels[it.id] : '')).join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cv-keep">
        <h2>{H.education}</h2>
        <ul className="cv-plain">
          {P.education.map((e) => (
            <li key={e.id}>
              <b>{D.education.items[e.id]}</b>, {e.institution}, {range(e.start, e.end)}, {D.education.status[e.status]}
            </li>
          ))}
        </ul>
      </section>

      <section className="cv-keep">
        <h2>{H.courses}</h2>
        <ul className="cv-plain">
          {P.courses.map((c) => (
            <li key={c.id}>
              {D.education.courses[c.id]}, {c.issuer}, {fill(D.ui.months, { count: c.months })}
            </li>
          ))}
        </ul>
      </section>

      <section className="cv-keep">
        <h2>{H.languages}</h2>
        <ul className="cv-plain">
          {D.about.languages.map((l) => (
            <li key={l.name}>
              <b>{l.name}</b> - {l.level}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
