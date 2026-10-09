import { works } from './works.js';
import { identity } from './site.js';

export const origin = 'https://chukadele.com';
// One registry for head metadata and static card copy; visible page prose is separate.
const page = (title, description, slug, heading, lines, picture, imageAlt, version = 1) => ({
  title: title.replaceAll('Chuka Dele-Oyeleru', identity.brand), description,
  contextualTitle: title, contextualDescription: description,
  image: `/og/${slug}-v${version}.jpg`, imageType: 'image/jpeg', imageWidth: 1200, imageHeight: 630,
  imageAlt, card: { heading, lines, picture },
});
export const pages = {
  '/': page('Chuka Dele-Oyeleru | Strategy & Operations',
    'Strategy and operations, based in Manchester. I diagnose problems, design how work should run, and build what it needs. Explore my work.',
    'home', 'Chuka Dele-Oyeleru', ['Strategy & Operations'], 'p-speaking',
    'Chuka Dele-Oyeleru smiling in a light grey suit, in natural colour, with Strategy & Operations and chukadele.com.', 2),
  '/about.html': page('About | Chuka Dele-Oyeleru',
    'Chuka Dele-Oyeleru’s path from quantity surveying to strategy and operations, and his approach to ownership, building for use and improving from evidence.',
    'about', 'About Chuka', ['Strategy & Operations'], 'portrait-mono',
    'About Chuka Dele-Oyeleru, with his seated studio portrait.'),
  '/work.html': page('Selected Work | Chuka Dele-Oyeleru',
    'Explore Chuka Dele-Oyeleru’s strategy, operations, product and delivery work across ETAP, Idara, Surface Talent, HoneyCoin, Rvysion and The Bredge.',
    'work', 'Selected work', ['Strategy & Operations'], 'weighing-mono',
    'Selected work by Chuka Dele-Oyeleru, with The Moneylender and His Wife.'),
  '/library.html': page('Library | Chuka Dele-Oyeleru',
    'Books, essays, talks and listening kept within reach by Chuka Dele-Oyeleru, with personal notes on the ideas he returns to.',
    'library', 'The library', ['Books, essays, talks & listening'], 'pacioli',
    'Chuka Dele-Oyeleru’s library, with geometric solids from De Divina Proportione.'),
  '/notes.html': page('Notes | Chuka Dele-Oyeleru',
    'Working notes by Chuka Dele-Oyeleru on strategy and operations.',
    'notes', 'Working notes', ['Strategy & Operations'], 'hoist',
    'Working notes by Chuka Dele-Oyeleru, with Leonardo’s studies of a hoist.'),
  '/press.html': page('Press & Speaking | Chuka Dele-Oyeleru',
    'Speaking topics, biographies and downloadable portraits of Chuka Dele-Oyeleru for introductions, programmes and bylines.',
    'press', 'Press & speaking', ['Biographies, portraits & topics'], 'portrait-press-mono',
    'Press and speaking: Chuka Dele-Oyeleru, with his studio portrait in a light grey suit.'),
  '/resume.html': page('CV | Chuka Dele-Oyeleru',
    'Chuka Dele-Oyeleru’s strategy and operations experience, roles and training, with a downloadable PDF CV.',
    'resume', 'Curriculum vitae', ['Strategy & Operations'], 'ledger',
    'Chuka Dele-Oyeleru’s CV, with a detail from The Tax Collectors.'),
  '/work-etap.html': page('ETAP: Commercial & Operating Capacity | Chuka Dele-Oyeleru',
    'Chuka Dele-Oyeleru’s work at ETAP: building the enterprise channel, redesigning claims handoffs and supporting expansion into Ghana.',
    'etap', 'ETAP', ['Enterprise channel', 'Claims flow & expansion'], 'etap-1',
    'ETAP: Chuka Dele-Oyeleru’s enterprise channel, claims flow and expansion work, with an ETAP product screenshot.'),
  '/work-idara.html': page('Idara: Product & Operations | Chuka Dele-Oyeleru',
    'Through Rvysion, Chuka Dele-Oyeleru led Idara’s product and service team through a rebuild of its registration and compliance platform.',
    'idara', 'Idara', ['Product & service team leadership', 'Platform rebuild through Rvysion'], 'idara-3',
    'Idara: product and service team leadership by Chuka Dele-Oyeleru through Rvysion, with an Idara platform screenshot.'),
  '/work-surface-talent.html': page('Surface Talent: MBA Internship | Chuka Dele-Oyeleru',
    'During an MBA internship at Surface Talent, Chuka Dele-Oyeleru built the operating foundation: role and candidate evidence, assessment, intake and handover.',
    'surface-talent', 'Surface Talent', ['MBA internship', 'Building the operating foundation'], 'surface-1',
    'Surface Talent: Chuka Dele-Oyeleru’s MBA internship building the operating foundation, with a role setup screenshot.'),
  '/work-honeycoin.html': page('HoneyCoin: Delivery Leadership | Chuka Dele-Oyeleru',
    'Through Rvysion, Chuka Dele-Oyeleru led delivery of HoneyCoin’s peer app redesign and business platform across design and engineering.',
    'honeycoin', 'HoneyCoin', ['Delivery leadership through Rvysion', 'Peer app & business platform'], 'honey-1',
    'HoneyCoin: delivery leadership by Chuka Dele-Oyeleru through Rvysion, with a HoneyCoin product screenshot.'),
  '/work-rvysion.html': page('Rvysion: Strategy & Operations | Chuka Dele-Oyeleru',
    'As Rvysion co-founder, Chuka Dele-Oyeleru designed commercial and operating systems connecting client delivery, resource allocation and venture building.',
    'rvysion', 'Rvysion', ['Co-founder · Strategy & Operations', 'Commercial & operating systems'], 'rayna-1',
    'Rvysion: commercial and operating systems by co-founder Chuka Dele-Oyeleru, with a supplied studio project screenshot.'),
  '/work-the-bredge.html': page('The Bredge: Operating Model | Chuka Dele-Oyeleru',
    'Chuka Dele-Oyeleru is building The Bredge’s operating model, shaping the offer, service architecture and go-to-market for an embedded data partner.',
    'the-bredge', 'The Bredge', ['Building the operating model', 'Offer, service & go-to-market'], 'bredge-1',
    'The Bredge: operating model work by Chuka Dele-Oyeleru, with a supplied project screenshot.'),
};

// Draft reuses the approved portrait share image; it has its own page copy.
pages['/playground.html'] = {
  ...pages['/'],
  title: 'Playground Draft | Chuka Dele',
  contextualTitle: 'Playground Draft | Chuka Dele-Oyeleru',
  description: 'Two classic-inspired games with portal routes and charged-brick chains, alongside selected Rvysion studio motion with authorship credits.',
  contextualDescription: 'Two classic-inspired games with portal routes and charged-brick chains, alongside selected Rvysion studio motion with authorship credits.',
  noindex: true,
};

// Safe for an inline script, including future copy containing closing script tags.
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, char =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

export function structuredData(path, identity) {
  const metadata = pages[path];
  if (!metadata) return null;
  const personId = `${origin}/#person`;
  const websiteId = `${origin}/#website`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': personId, name: identity.fullName, alternateName: [identity.brand, identity.name], url: `${origin}/`,
        jobTitle: 'Strategy & Operations', image: `${origin}/press/chuka-dele-oyeleru-speaking.jpg`, sameAs: [identity.linkedin] },
      { '@type': 'WebSite', '@id': websiteId, name: identity.brand, url: `${origin}/`,
        inLanguage: 'en-GB', publisher: { '@id': personId } },
      { '@type': path === '/about.html' ? 'ProfilePage' : 'WebPage', '@id': `${origin}${path}#webpage`,
        url: `${origin}${path}`, name: metadata.title, description: metadata.description,
        inLanguage: 'en-GB', isPartOf: { '@id': websiteId },
        ...(path === '/about.html' ? { mainEntity: { '@id': personId } } : { about: { '@id': personId } }) },
    ],
  };
}
export const indexablePaths = Object.keys(pages).filter(path => path !== '/notes.html' && !pages[path].noindex);
export function canonicalPath(path) {
  if (path === '/' || path === '/index.html') return '/';
  return path.endsWith('.html') ? path : `${path.replace(/\/$/, '')}.html`;
}
export const redirects = {
  '/index.html': '/',
  '/index': '/',
  '/speaking': '/press.html',
  '/speaking.html': '/press.html',
  '/work/bredge': '/work-the-bredge.html',
  ...Object.fromEntries(Object.keys(pages).filter(p => p !== '/').map(p => [p.slice(0, -5), p])),
  ...Object.fromEntries(works.map(w => [`/work/${w.id}`, `/work-${w.id}.html`])),
};
