/* Case copy follows the supplied design references and existing portfolio. */
const PROJECTS = [
  {
    "id": "etap",
    "name": "ETAP",
    "sector": "Insurance",
    "geography": "Nigeria & Ghana",
    "period": "2022 to 2024",
    "role": "Senior Operations Manager",
    "headline": "Found a business market in the data, launched the product, then helped take the company into Ghana.",
    "diagnosis": "Analytics and customer conversations showed that business customers needed a product of their own.",
    "design": "Helped construct the proposition, pricing and demo process. Redesigned claims handoffs and the first enterprise operating workflow.",
    "build": "Launched ETAP for Business with the team, fronted the launch videos and onboarded the first customers. Supported the operating work for expansion into Ghana.",
    "result": "The existing case records a 57% reduction in claims turnaround. The supplied draft records the Ghana launch in October 2024.",
    "metric": "57%",
    "metricLabel": "reported reduction in claims turnaround",
    "sourceNote": "Claims turnaround: existing portfolio case. Ghana launch: owner-supplied case.",
    "link": [
      "Visit ETAP",
      "https://etapinsure.com"
    ],
    "shots": [
      [
        "etap-1",
        "ETAP for Business proposition and fleet product"
      ],
      [
        "etap-2",
        "Driver behaviour scoring"
      ],
      [
        "etap-3",
        "Driver management and rewards"
      ]
    ],
    "featuredShot": "etap-1"
  },
  {
    "id": "idara",
    "name": "Idara",
    "sector": "Registration & compliance",
    "geography": "Nigeria & Ghana",
    "period": "2024 to 2026",
    "role": "Product and operations leadership",
    "headline": "Reworked an early MVP into a registration and compliance platform.",
    "diagnosis": "Chose to rebuild the early MVP rather than continue patching it.",
    "design": "Led the product and service team. Brought fulfilment in house and established a written procedure for each service.",
    "build": "Led the site and platform rebuild with the team on NestJS, Next.js and PostgreSQL, including the Corporate Affairs Commission integration.",
    "result": "The supplied case records 3.2× first-order return on ad spend and expansion into Ghana.",
    "metric": "3.2×",
    "metricLabel": "first-order ROAS reported in the supplied case",
    "sourceNote": "3.2× first-order ROAS is attributed to the owner-supplied case.",
    "link": [
      "Visit Idara",
      "https://goidara.com"
    ],
    "shots": [
      [
        "idara-3",
        "Idara compliance dashboard, shown in the supplied studio presentation"
      ],
      [
        "idara-1",
        "Idara registration and compliance proposition"
      ],
      [
        "idara-2",
        "Registration services in Nigeria and Ghana"
      ]
    ],
    "featuredShot": "idara-3"
  },
  {
    "id": "surface",
    "name": "Surface Talent",
    "sector": "Recruitment",
    "geography": "United Kingdom",
    "period": "2026",
    "role": "System design and implementation",
    "headline": "Built a recruitment workflow with evidence checks and human sign-off.",
    "diagnosis": "Recruitment work was spread across intake, candidate records, evaluation and shortlist preparation.",
    "design": "Kept one system of record. Separated the writer from the grader and retained human approval for shortlists.",
    "build": "Built the intake and evaluation workflow, with source coverage checks and a structured handover for the recruiter.",
    "result": "Built an intake and evaluation workflow with source checks and recruiter handover. Throughput has not been measured.",
    "metric": "Human sign-off",
    "metricLabel": "retained at the shortlist decision",
    "sourceNote": "The workflow drawing is an editorial explanation of responsibilities. It is not a product screenshot or measured throughput evidence.",
    "link": null,
    "shots": [],
    "featuredShot": null
  },
  {
    "id": "honeycoin",
    "name": "HoneyCoin",
    "sector": "Payments",
    "geography": "Kenya",
    "period": "2024 to 2026",
    "role": "Fractional delivery leadership · with Rvysion",
    "headline": "Ran the fractional team rebuilding the payments apps, with Rvysion.",
    "diagnosis": "Audited where enterprise users lost time in transaction and account flows.",
    "design": "Coordinated the illustrators, brand and product designers, and engineers across the workstreams.",
    "build": "Led delivery of the peer-app redesign and B2B platform on a shared design system. The work was produced with the Rvysion team.",
    "result": "Rvysion’s published case reports 35% faster transaction completion and 20% higher B2B retention. These are attributed project outcomes, not an individual claim of authorship.",
    "metric": "35%",
    "metricLabel": "faster transactions, as reported by Rvysion",
    "sourceNote": "Outcome attribution stays with the linked Rvysion case. The supplied screenshots are studio presentation assets.",
    "link": [
      "Read the Rvysion case",
      "https://www.rvysion.co/case-studies/honeycoin-product"
    ],
    "shots": [
      [
        "honey-1",
        "HoneyCoin B2B wallet interface, presented on a laptop"
      ],
      [
        "honey-2",
        "Wallet and transfer flows"
      ],
      [
        "honey-3",
        "HoneyCoin brand work"
      ]
    ],
    "featuredShot": "honey-1"
  },
  {
    "id": "rvysion",
    "name": "Rvysion",
    "sector": "Design & venture studio",
    "geography": "Client work & internal ventures",
    "period": "2024 onward",
    "role": "Strategy & Operations · Co-founder",
    "headline": "Designed how a studio serves clients and builds its own products.",
    "diagnosis": "Client work and internal products drew on the same cross-functional team.",
    "design": "Set management rhythms, resource allocation and cash-flow controls across the documented 32-person studio.",
    "build": "Connected commercial development with delivery and venture evaluation. Rayna UI is one example of the studio’s internal product work.",
    "result": "The existing case records 35% client-base growth, 22% more revenue opportunities and 12% lower operating expenses.",
    "metric": "+35%",
    "metricLabel": "client-base growth recorded in the existing case",
    "sourceNote": "Outcomes are recorded in the existing portfolio case. Rayna UI is an internal studio product.",
    "link": [
      "Visit Rvysion",
      "https://rvysion.co"
    ],
    "shots": [
      [
        "rayna-1",
        "Rayna UI identity, an internal Rvysion product"
      ],
      [
        "rayna-2",
        "Rayna UI product presentation"
      ]
    ],
    "featuredShot": "rayna-2"
  },
  {
    "id": "bredge",
    "name": "The Bredge",
    "sector": "Embedded data services",
    "geography": "US clients",
    "period": "Current venture work",
    "role": "Strategy & Operations",
    "headline": "Built the operating model for a data team companies can plug into.",
    "diagnosis": "Growing companies needed a senior data capability with a clear entry point and dependable delivery.",
    "design": "Connected the positioning, service architecture and three ways to engage: an embedded team, a scoped project, or a diagnostic and roadmap.",
    "build": "Shaped delivery standards, technology and go-to-market around work that fits into the client’s operating environment.",
    "result": "The visible evidence is the proposition and service model: an embedded team, a scoped project, or a diagnostic and roadmap.",
    "metric": "3 ways to engage",
    "metricLabel": "embedded team · project · diagnostic",
    "sourceNote": "The supplied images show the service proposition and marketing. The three engagement types describe the offer, not a measured client outcome.",
    "link": [
      "Visit The Bredge",
      "https://thebredge.com"
    ],
    "shots": [
      [
        "bredge-1",
        "The Bredge service proposition"
      ],
      [
        "bredge-2",
        "Service marketing for fragmented business systems"
      ],
      [
        "bredge-3",
        "Reporting and client-service proposition"
      ]
    ],
    "featuredShot": "bredge-1"
  }
];
const SKETCHES = {etap:'etap-1', idara:'idara-3', honeycoin:'honey-1', rvysion:'rayna-2', bredge:'bredge-1'};
const ART = [
{file:'athens-color.jpg', title:'The School of Athens', artist:'Raphael', date:'1509 to 1511', credit:'Stanza della Segnatura, Vatican', note:'The red drawing is a modern tracing supplied with this draft, not Raphael’s original preparatory work.'},
{file:'hoist-neg.jpg', title:'Study of Brunelleschi’s hoist', artist:'Leonardo da Vinci', date:'circa 1478 to 1480', credit:'Codex Atlanticus, Biblioteca Ambrosiana, Milan', note:'The supplied negative treatment is a modern interpretation of the historical drawing.'},
{file:'jerome-neg.jpg', title:'Saint Jerome in His Study', artist:'Albrecht Dürer', date:'1514', credit:'Historical engraving; supplied negative treatment', note:'A modern treatment of Dürer’s engraving, supplied in the design reference.'},
{file:'pacioli.jpg', title:'De Divina Proportione', artist:'Luca Pacioli, with solids after Leonardo da Vinci', date:'1509', credit:'Historical illustrated book; supplied reference image', note:'An editorial connection between geometry and the structure of work.'}
];
