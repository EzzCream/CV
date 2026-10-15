import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArchDiagram } from '@/components/ArchDiagram';
import { ArrowDown, ArrowOut } from '@/components/arrows';
import { ContactForm } from '@/components/ContactForm';
import { CopyEmail, Highlights, Reveal } from '@/components/client';
import { Header } from '@/components/Header';
import { CompanyIcon } from '@/components/icons';
import { Rich } from '@/components/rich';
import { Trail } from '@/components/trail/Trail';
import { getDictionary, isLocale, otherLocale, profile as P } from '@/lib/content';
import { fill, formatRange, nameOf } from '@/lib/format';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function Index({ n, label }: { n: number; label: string }) {
  return (
    <div className="idx">
      <b>{String(n).padStart(2, '0')}</b>
      <span>{`// ${label}`}</span>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const D = getDictionary(locale), other = otherLocale(locale), S = D.sections;
  const range = (s: string, e: string | null, m?: number) => formatRange(locale, D, s, e, m);

  return (
    <>
      <Header locale={locale} other={other} ui={D.ui} nav={D.nav} sections={S} otherSections={getDictionary(other).sections} />
      <Trail />
      <main id="main">
        <div className="hero" id="top">
          <canvas id="heroTrail" className="hero-canvas" role="img" aria-label={D.hero.trailLabel} />
          <div className="hero-in">
            <div className="hero-main">
              <div className="hero-l">
                <h1 className="bl rise" style={{ '--d': 0 } as React.CSSProperties}>
                  {P.person.firstName.split(' ')[0]}
                  <span>{P.person.lastName}</span>
                </h1>
                <p className="hero-lead bl rise" style={{ '--d': 2 } as React.CSSProperties}>
                  {D.hero.lead}
                </p>
                <div className="cta rise" style={{ '--d': 3 } as React.CSSProperties}>
                  <a className="btn pri" href={`#${S.contact}`}>
                    {D.hero.ctaContact}
                  </a>
                  <a className="btn" href={P.cv[locale]} download={P.cv[locale].split('/').pop()} type="application/pdf" hrefLang={locale}>
                    {D.hero.ctaCv}
                  </a>
                </div>
              </div>
              <div className="draw-area" id="drawArea" aria-hidden="true" />
            </div>
            <div className="hero-foot">
              <a className="next bl rise" style={{ '--d': 7 } as React.CSSProperties} href={`#${S.about}`}>
                <ArrowDown /> {D.hero.next}
              </a>
            </div>
          </div>
        </div>

        <div className="wrap">
          <section className="block" id={S.about} aria-labelledby="h-ab">
            <Index n={1} label={S.about} />
            <div>
              <h2 className="h2 dec" id="h-ab">{D.about.title}</h2>
              <div className="about">
                <div>
                  {D.about.paragraphs.map((p) => (
                    <p key={p}>
                      <Rich text={p} links={P.links} />
                    </p>
                  ))}
                  <div className="langs">
                    <h3>{D.about.languagesTitle}</h3>
                    {D.about.languages.map((l) => (
                      <p key={l.name}>
                        <b>{l.name}</b> - {l.level}
                      </p>
                    ))}
                  </div>
                </div>
                <figure className="photo" style={{ margin: 0 }}>
                  <Image src={P.person.photo} alt={D.about.photoAlt} fill sizes="(max-width: 860px) 320px, 400px" />
                  <figcaption>{P.person.city}</figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section className="block" id={S.experience} aria-labelledby="h-ex">
            <Index n={2} label={S.experience} />
            <div>
              <h2 className="h2 dec" id="h-ex">{D.experience.title}</h2>
              <p className="lead-s mono">{D.experience.meta}</p>
              <ol className="log">
                {P.experience.map((e, i) => {
                  const t = D.experience.items[e.id];
                  if (!t) return null;
                  // los dos puestos recientes muestran tres logros y el stack; los anteriores, todo en corto
                  const old = i >= 2;
                  const label = D.experience.icons[e.icon] ?? e.company;
                  return (
                    <li key={e.id} className={old ? 'old' : undefined}>
                      <div className="when">
                        <CompanyIcon icon={e.icon} label={label} />
                        {i === 0 && (
                          <>
                            <b>{D.ui.present}</b>
                            <br />
                          </>
                        )}
                        {range(e.start, e.end, e.durationMonths)}
                      </div>
                      <div>
                        <h3 className="co">
                          {e.url ? (
                            <a href={e.url} {...ext}>
                              {e.company}
                            </a>
                          ) : (
                            e.company
                          )}
                          <small>{t.role}</small>
                        </h3>
                        {t.summary && <p className="sum">{t.summary}</p>}
                        <Highlights shown={old ? t.highlights : t.highlights.slice(0, 3)} rest={old ? [] : t.highlights.slice(3)} more={D.experience.more} less={D.experience.less} />
                        {!old && (
                          <ul className="tags" aria-label="Stack">
                            {e.stack.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section className="block" id={S.projects} aria-labelledby="h-pr">
            <Index n={3} label={S.projects} />
            <div>
              <h2 className="h2 dec" id="h-pr">{D.projects.title}</h2>
              <p className="lead-s mono">{D.projects.meta}</p>
              <div className="pgrid">
                {P.projects.map((pr) => {
                  const t = D.projects.items[pr.id];
                  if (!t) return null;
                  return (
                    <article className="card" key={pr.id}>
                      <header>
                        <h3>{pr.name}</h3>
                        <span className="kind">
                          {t.kind} / {pr.year}
                        </span>
                      </header>
                      <p>{t.summary}</p>
                      <div className="arch">
                        <span className="sub">{D.projects.architecture}</span>
                        <ArchDiagram project={pr} labels={t.nodes} title={D.projects.architecture} to={D.projects.flowTo} />
                      </div>
                      <ul className="hl">
                        {t.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                      <div className="foot">
                        <ul className="tags">
                          {pr.stack.slice(0, 6).map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                        {pr.repo && (
                          <a className="lnk" href={pr.repo} {...ext}>
                            {D.projects.repo} <ArrowOut />
                            <span className="sr">{D.ui.external}</span>
                          </a>
                        )}
                        {pr.demo && (
                          <a className="lnk" href={pr.demo} {...ext}>
                            {D.projects.demo} <ArrowOut />
                            <span className="sr">{D.ui.external}</span>
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="block" id={S.skills} aria-labelledby="h-sk">
            <Index n={4} label={S.skills} />
            <div>
              <h2 className="h2 dec" id="h-sk">{D.skills.title}</h2>
              <p className="lead-s mono">{D.skills.meta}</p>
              <div className="tblw">
                <table className="sk">
                  <tbody>
                    {P.skills.map((g) => (
                      <tr key={g.id}>
                        <th scope="row">{D.skills.groups[g.id]}</th>
                        <td>
                          <div className="row">
                            {g.items.map((it) => {
                              const name = it.name ?? (it.id ? D.skills.labels[it.id] : undefined) ?? '';
                              return (
                                <div key={name}>
                                  <b>{name}</b>
                                  <span>
                                    {it.usedIn.map((id) => nameOf(P, id)).join(', ')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="block" aria-labelledby="h-ed">
            <Index n={5} label={D.education.title.toLowerCase()} />
            <div>
              <h2 className="h2 dec" id="h-ed">{D.education.title}</h2>
              <div className="edu">
                <div>
                  <h3 className="sub">{D.education.degreesTitle}</h3>
                  <ul className="deg">
                    {P.education.map((e) => (
                      <li key={e.id}>
                        <b>{D.education.items[e.id]}</b>
                        <span>
                          {e.institution}, {range(e.start, e.end)}{' '}
                          <span className={e.status === 'inProgress' ? 'chip on' : 'chip'}>{D.education.status[e.status]}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="sub">{D.education.coursesTitle}</h3>
                  <ul className="crs">
                    {P.courses.map((c) => (
                      <li key={c.id}>
                        {D.education.courses[c.id]}, {c.issuer}
                        <span>{fill(D.ui.months, { count: c.months })}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="block" id={S.contact} aria-labelledby="h-co" style={{ borderBottom: 0 }}>
            <Index n={6} label={S.contact} />
            <div>
              <h2 className="h2 dec" id="h-co">{D.contact.title}</h2>
              <div className="contact">
                <div>
                  <p style={{ margin: '0 0 20px', maxWidth: '46ch' }}>{D.contact.lead}</p>
                  <div className="direct">
                    <span className="sub">{D.contact.direct}</span>
                    <CopyEmail email={P.person.email} copy={D.contact.copy} copied={D.contact.copied} />
                    <div className="socials">
                      <a className="lnk" href={P.links.linkedin} {...ext}>
                        LinkedIn <ArrowOut />
                      </a>
                      <a className="lnk" href={P.links.github} {...ext}>
                        GitHub <ArrowOut />
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <ContactForm locale={locale} form={D.contact.form} errors={D.contact.errors} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="ft">
        <div className="wrap">
          <span>{fill(D.footer.rights, { year: new Date().getFullYear() })}</span>
          <a href={P.links.source} {...ext}>
            {D.footer.source} <ArrowOut />
          </a>
        </div>
      </footer>
      <Reveal />
    </>
  );
}
