/* Source copy is adapted from the two supplied Claude drafts and the existing site.
   The cost models and unproven recruiter throughput claims are deliberately omitted. */
const PROJECTS = [
  {
    id: 'etap', name: 'ETAP', sector: 'Insurance', geography: 'Nigeria & Ghana', period: '2022 to 2024', role: 'Senior Operations Manager',
    headline: 'Found a business market in the data, launched the product, then helped take the company into Ghana.',
    capability: 'Find the market inside the data, then build the operating path to reach it.',
    diagnosis: 'Analytics and customer conversations showed that business customers needed a product of their own.',
    design: 'Helped construct the proposition, pricing and demo process. Redesigned claims handoffs and the first enterprise operating workflow.',
    build: 'Launched ETAP for Business with the team, fronted the launch videos and onboarded the first customers. Supported the operating work for expansion into Ghana.',
    result: 'The existing case records a 57% reduction in claims turnaround. The supplied draft records the Ghana launch in October 2024.',
    metric: '57%', metricLabel: 'reported reduction in claims turnaround',
    sourceNote: 'Contribution and claims figure appear in the existing website copy. Ghana launch detail comes from the supplied draft.',
    link: ['Visit ETAP', 'https://etapinsure.com'],
    shots: [['etap-1', 'ETAP for Business proposition and fleet product'], ['etap-2', 'Driver behaviour scoring'], ['etap-3', 'Driver management and rewards']],
    featuredShot: 'etap-1', hotspot: [88.3, 61.6],
    art: {file: 'ambassadors.jpg', title: 'The Ambassadors', artist: 'Hans Holbein the Younger', date: '1533', institution: 'National Gallery, London', alt: 'Two men beside globes, books and instruments in Holbein’s The Ambassadors', connection: 'Instruments for reading the world sit between two people whose work crossed borders.'}
  },
  {
    id: 'idara', name: 'Idara', sector: 'Registration & compliance', geography: 'Nigeria & Ghana', period: '2024 to 2026', role: 'Product and operations leadership',
    headline: 'Reworked an early MVP into a registration and compliance platform.',
    capability: 'Rebuild a first version that is struggling, and organise the team around the new service.',
    diagnosis: 'Chose to rebuild the early MVP rather than continue patching it.',
    design: 'Led the product and service team. Brought fulfilment in house and established a written procedure for each service.',
    build: 'Led the site and platform rebuild with the team on NestJS, Next.js and PostgreSQL, including the Corporate Affairs Commission integration.',
    result: 'The supplied draft reports that a first order covers its acquisition cost on average, with 3.2× return on ad spend on first orders. It also records expansion into Ghana.',
    metric: '3.2×', metricLabel: 'first-order ROAS reported in the supplied case',
    sourceNote: 'The contribution, unit economics and expansion details are supplied case copy. The reporting period and metric definitions need confirmation before publication.',
    link: ['Visit Idara', 'https://goidara.com'],
    shots: [['idara-3', 'Idara compliance dashboard, shown in the supplied studio presentation'], ['idara-1', 'Idara registration and compliance proposition'], ['idara-2', 'Registration services in Nigeria and Ghana']],
    featuredShot: 'idara-3', hotspot: [79.4, 68.8],
    art: {file: 'tax.jpg', title: 'The Tax Collectors', artist: 'Marinus van Reymerswaele', date: '1540s', institution: 'Musée du Louvre, Paris', alt: 'Two officials with a ledger and coins in The Tax Collectors', connection: 'The ledger makes the work of recording, checking and fulfilling obligations visible.'}
  },
  {
    id: 'surface', name: 'Surface Talent', sector: 'Recruitment', geography: 'United Kingdom', period: '2026', role: 'System design and implementation',
    headline: 'Built a recruitment workflow with evidence checks and human sign-off.',
    capability: 'Build a system that carries repetitive work while keeping consequential decisions with a person.',
    diagnosis: 'Recruitment work was spread across intake, candidate records, evaluation and shortlist preparation.',
    design: 'Kept one system of record. Separated the writer from the grader and retained human approval for shortlists.',
    build: 'Built the intake and evaluation workflow, with source coverage checks and a structured handover for the recruiter.',
    result: 'The draft demonstrates the workflow and its review boundaries. The ten-person workload comparison in the supplied draft is a design ambition, not a measured result, and is omitted here.',
    metric: 'Human sign-off', metricLabel: 'retained at the shortlist decision',
    sourceNote: 'No private candidate data is shown. This diagram is an editorial explanation of the proposed workflow, not a product screenshot or proof of recruiter throughput.',
    link: null, shots: [], featuredShot: null, hotspot: [45, 69.8],
    art: {file: 'engraving.jpg', title: 'The Invention of Copper Engraving', artist: 'Theodoor Galle after Jan van der Straet', date: 'circa 1591', institution: 'Art Institute of Chicago', alt: 'Engravers and a printing press working together in a print workshop', connection: 'A workshop gives each step a distinct job. This is a contemporary analogy for a system with separate responsibilities.'}
  },
  {
    id: 'honeycoin', name: 'HoneyCoin', sector: 'Payments', geography: 'Kenya', period: '2024 to 2026', role: 'Fractional delivery leadership · with Rvysion',
    headline: 'Ran the fractional team rebuilding the payments apps, with Rvysion.',
    capability: 'Connect designers, illustrators and engineers across a product’s development.',
    diagnosis: 'Audited where enterprise users lost time in transaction and account flows.',
    design: 'Coordinated the illustrators, brand and product designers, and engineers across the workstreams.',
    build: 'Led delivery of the peer-app redesign and B2B platform on a shared design system. The work was produced with the Rvysion team.',
    result: 'Rvysion’s published case reports 35% faster transaction completion and 20% higher B2B retention. These are attributed project outcomes, not an individual claim of authorship.',
    metric: '35%', metricLabel: 'faster transactions, as reported by Rvysion',
    sourceNote: 'Outcome attribution stays with the linked Rvysion case. The supplied screenshots are studio presentation assets.',
    link: ['Read the Rvysion case', 'https://www.rvysion.co/case-studies/honeycoin-product'],
    shots: [['honey-1', 'HoneyCoin B2B wallet interface, presented on a laptop'], ['honey-2', 'Wallet and transfer flows'], ['honey-3', 'HoneyCoin brand work']],
    featuredShot: 'honey-1', hotspot: [36.2, 50.5],
    art: {file: 'moneylender.jpg', title: 'The Moneylender and His Wife', artist: 'Quentin Matsys', date: '1514', institution: 'Musée du Louvre, Paris', alt: 'A man weighs coins while his wife sits beside him with a book', connection: 'The balance offers a visual connection to checking and moving value between people.'}
  },
  {
    id: 'rvysion', name: 'Rvysion', sector: 'Design & venture studio', geography: 'Client work & internal ventures', period: '2024 onward', role: 'Strategy & Operations · Co-founder',
    headline: 'Designed how a studio serves clients and builds its own products.',
    capability: 'Design how a studio allocates people and attention across client work and its own ventures.',
    diagnosis: 'Client work and internal products drew on the same cross-functional team.',
    design: 'Set management rhythms, resource allocation and cash-flow controls across the documented 32-person studio.',
    build: 'Connected commercial development with delivery and venture evaluation. Rayna UI is one example of the studio’s internal product work.',
    result: 'The existing case records 35% client-base growth, 22% more revenue opportunities and 12% lower operating expenses.',
    metric: '+35%', metricLabel: 'client-base growth recorded in the existing case',
    sourceNote: 'These figures are existing website case claims. Rayna UI images demonstrate one internal product rather than the entire Rvysion portfolio.',
    link: ['Visit Rvysion', 'https://rvysion.co'],
    shots: [['rayna-1', 'Rayna UI identity, an internal Rvysion product'], ['rayna-2', 'Rayna UI product presentation']],
    featuredShot: 'rayna-2', hotspot: [91.2, 54.4],
    art: {file: 'baptism.jpg', title: 'The Baptism of Christ', artist: 'Andrea del Verrocchio and Leonardo da Vinci', date: 'circa 1470 to 1475', institution: 'Uffizi, Florence', alt: 'John baptises Christ while two angels kneel beside the river', connection: 'The supplied reference pairs the work of a Renaissance workshop with the work of a contemporary studio.'}
  },
  {
    id: 'bredge', name: 'The Bredge', sector: 'Embedded data services', geography: 'US clients', period: 'Current venture work', role: 'Strategy & Operations',
    headline: 'Built the operating model for a data team companies can plug into.',
    capability: 'Turn a specialist service into an offer, a delivery model and a repeatable operating process.',
    diagnosis: 'Growing companies needed a senior data capability with a clear entry point and dependable delivery.',
    design: 'Connected the positioning, service architecture and three ways to engage: an embedded team, a scoped project, or a diagnostic and roadmap.',
    build: 'Shaped delivery standards, technology and go-to-market around work that fits into the client’s operating environment.',
    result: 'The visible evidence is the proposition and service model. The supplied estimate for twelve in-house roles is omitted until its basis and client scope are confirmed.',
    metric: '3 ways to engage', metricLabel: 'embedded team · project · diagnostic',
    sourceNote: 'The images show service marketing. They do not demonstrate a private reconciliation system or independently establish the supplied staffing and cost estimates.',
    link: ['Visit The Bredge', 'https://thebredge.com'],
    shots: [['bredge-1', 'The Bredge service proposition'], ['bredge-2', 'Service marketing for fragmented business systems'], ['bredge-3', 'Reporting and client-service proposition']],
    featuredShot: 'bredge-1', hotspot: [26.1, 68.1],
    art: {file: 'proportion.jpg', title: 'De Divina Proportione', artist: 'Luca Pacioli, with solids after drawings by Leonardo da Vinci', date: '1509', institution: 'Art Institute of Chicago', alt: 'Two geometric solids on the pages of an open printed book', connection: 'A complex shape is made legible through an explicit structure. The pairing is an editorial analogy.'}
  }
];

const ARTWORKS = [
  {file: 'athens.jpg', title: 'The School of Athens', artist: 'Raphael', date: '1509 to 1511', institution: 'Stanza della Segnatura, Vatican', alt: 'Philosophers gathered under a sequence of monumental arches'},
  {file: 'leonardo.jpg', title: 'Study of Brunelleschi’s hoist', artist: 'Leonardo da Vinci', date: 'circa 1478 to 1480', institution: 'Codex Atlanticus, Biblioteca Ambrosiana, Milan', alt: 'A pen drawing of a hoist, with gears, shafts and a crank'},
  {file: 'jerome.jpg', title: 'Saint Jerome in His Study', artist: 'Albrecht Dürer', date: '1514', institution: 'Art Institute of Chicago', alt: 'Saint Jerome writes at a desk in a study lit through its windows'},
  {file: 'renaissance-architecture.webp', title: 'Architecture Study containing Details of One or Several Buildings', artist: 'Anonymous Italian artist', date: 'circa 1490 to 1510', institution: 'The Metropolitan Museum of Art', source: 'https://www.metmuseum.org/art/collection/search/342291', alt: 'Architectural details drawn with ink and washes'},
  {file: 'durer-melencolia-hero.webp', title: 'Melencolia I', artist: 'Albrecht Dürer', date: '1514', institution: 'The Metropolitan Museum of Art', source: 'https://www.metmuseum.org/art/collection/search/336228', alt: 'Dürer’s engraving of a figure surrounded by tools and geometric objects'},
  ...PROJECTS.map(project => project.art)
];
