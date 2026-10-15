import { z } from 'zod';

const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'Usa AAAA o AAAA-MM');

const archNode = z.object({ id: z.string(), store: z.boolean().optional() });

export const profileSchema = z.object({
  person: z.object({
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    jobTitle: z.string(),
    email: z.email(),
    phone: z.string(),
    city: z.string(),
    country: z.string().length(2),
    site: z.url(),
    photo: z.string().startsWith('/'),
  }),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    tattoo: z.url(),
    pins: z.url(),
    source: z.url(),
  }),
  cv: z.object({ es: z.string().startsWith('/'), en: z.string().startsWith('/') }),
  experience: z
    .array(
      z.object({
        id: z.string(),
        company: z.string(),
        url: z.url().nullable(),
        start: yearMonth,
        end: yearMonth.nullable(),
        durationMonths: z.number().int().positive().optional(),
        icon: z.enum(['argus', 'pomegranate', 'sprout', 'star', 'bolt']),
        stack: z.array(z.string()).min(1),
      }),
    )
    .min(1),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      year: z.number().int(),
      repo: z.url().nullable(),
      demo: z.url().nullable(),
      stack: z.array(z.string()).min(1),
      architecture: z.object({
        nodes: z.array(archNode).min(2),
        edges: z.array(z.tuple([z.string(), z.string()])).min(1),
      }),
    }),
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      items: z.array(
        z.object({ name: z.string().optional(), id: z.string().optional(), usedIn: z.array(z.string()).min(1) }),
      ),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      start: yearMonth,
      end: yearMonth.nullable(),
      status: z.enum(['inProgress', 'done', 'degreePending']),
    }),
  ),
  courses: z.array(z.object({ id: z.string(), issuer: z.string(), months: z.number().int().positive() })),
});

const entry = z.object({ role: z.string(), summary: z.string(), highlights: z.array(z.string()).min(1) });
const projectText = z.object({
  kind: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()).min(1),
  nodes: z.record(z.string(), z.string()),
});

export const dictionarySchema = z.object({
  meta: z.object({ title: z.string(), description: z.string().max(170), ogAlt: z.string() }),
  sections: z.object({
    experience: z.string(),
    projects: z.string(),
    skills: z.string(),
    about: z.string(),
    contact: z.string(),
  }),
  nav: z.object({
    experience: z.string(),
    projects: z.string(),
    skills: z.string(),
    about: z.string(),
    contact: z.string(),
    home: z.string(),
  }),
  ui: z.object({
    skip: z.string(),
    menuOpen: z.string(),
    menuClose: z.string(),
    themeLight: z.string(),
    themeDark: z.string(),
    themeToggle: z.string(),
    language: z.string(),
    languageLabel: z.string(),
    present: z.string(),
    months: z.string(),
    external: z.string(),
  }),
  hero: z.object({
    lead: z.string(),
    ctaContact: z.string(),
    ctaCv: z.string(),
    trailLabel: z.string(),
    next: z.string(),
  }),
  experience: z.object({
    title: z.string(),
    meta: z.string(),
    more: z.string(),
    less: z.string(),
    icons: z.record(z.string(), z.string()),
    items: z.record(z.string(), entry),
  }),
  projects: z.object({
    title: z.string(),
    meta: z.string(),
    repo: z.string(),
    demo: z.string(),
    architecture: z.string(),
    flowTo: z.string(),
    items: z.record(z.string(), projectText),
  }),
  skills: z.object({
    title: z.string(),
    meta: z.string(),
    usedIn: z.string(),
    groups: z.record(z.string(), z.string()),
    labels: z.record(z.string(), z.string()),
  }),
  about: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    photoAlt: z.string(),
    languagesTitle: z.string(),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
  }),
  education: z.object({
    title: z.string(),
    degreesTitle: z.string(),
    coursesTitle: z.string(),
    status: z.object({ inProgress: z.string(), done: z.string(), degreePending: z.string() }),
    items: z.record(z.string(), z.string()),
    courses: z.record(z.string(), z.string()),
  }),
  contact: z.object({
    title: z.string(),
    lead: z.string(),
    direct: z.string(),
    copy: z.string(),
    copied: z.string(),
    form: z.object({
      name: z.string(),
      email: z.string(),
      reason: z.string(),
      reasons: z.object({ job: z.string(), freelance: z.string(), other: z.string() }),
      message: z.string(),
      messageHint: z.string(),
      honeypot: z.string(),
      submit: z.string(),
      sending: z.string(),
      success: z.string(),
      sendAnother: z.string(),
    }),
    errors: z.object({
      required: z.string(),
      nameLength: z.string(),
      email: z.string(),
      messageShort: z.string(),
      messageLong: z.string(),
      rateLimited: z.string(),
      network: z.string(),
      server: z.string(),
    }),
  }),
  cv: z.object({
    title: z.string(),
    summary: z.string(),
    headings: z.object({
      summary: z.string(),
      experience: z.string(),
      projects: z.string(),
      skills: z.string(),
      education: z.string(),
      courses: z.string(),
      languages: z.string(),
    }),
  }),
  footer: z.object({ rights: z.string(), source: z.string() }),
  notFound: z.object({ title: z.string(), body: z.string(), back: z.string() }),
});

export type Profile = z.infer<typeof profileSchema>;
export type Dictionary = z.infer<typeof dictionarySchema>;
