export const identity = { brand: 'Chuka Dele', fullName: 'Chukwuka Dele-Oyeleru' };

export const site = {
  ...identity,
  name: 'Chuka Dele-Oyeleru',
  role: 'Strategy and operations',
  greeting: 'Chuka',
  // where the letter form posts to. leave empty to open the visitor's own email instead. a form service or a small worker that accepts JSON will do.
  formEndpoint: '',
  // one plain line on what you are open to, shown on the home page and the CV. left empty, nothing is shown. e.g. 'Strategy and operations roles from September 2027, UK'
  openTo: '',
  reply: 'I reply within 24 hours.',
  email: 'write@chukadele.com',
  linkedin: 'https://www.linkedin.com/in/chuka1',
  nav: [
    ['Work', 'work.html'],
    ['About', 'about.html'],
    ['Library', 'library.html'],
    ['Notes', 'notes.html'],
    ['Press', 'press.html'],
    ['CV', 'resume.html'],
  ],
  // every page, for the foot of each page, so nothing is hidden
  all: [['Home', 'index.html'], ['Work', 'work.html'], ['About', 'about.html'], ['Library', 'library.html'], ['Notes', 'notes.html'], ['Press', 'press.html'], ['CV', 'resume.html']],
};

// people: [x%, y%, half-width%, half-height% of the picture, swing (rad), speed, phase, bob px, scribble px, breathing, redraw key]
export const pictures = {
  study: {
    base: 'jerome-mono', top: 'jerome-tint', fx: 0.5, fy: 0.45, rad: 0.11, afterColour: true,
    seeds: [[0.63, 0.5, 0.12]], patches: [[0.2, 0.4, 0.16], [0.6, 0.85, 0.2], [0.85, 0.3, 0.14]],
    people: [
      [63, 48.6, 4.8, 5.4, 0.03, 1.3, 0, 0.5],
      [60.8, 54.2, 2.3, 1.6, 0, 10, 0, 0, 2.4],
      [58, 84.5, 24, 8.5, 0, 0.75, 0, 0, 0, 0.03, 'lion'],
      [28.5, 84, 9.5, 4.6, 0, 1.25, 2, 0, 0, 0.04],
      [86, 25, 7.5, 8, 0.03, 0.6, 0.5, 0],
    ],
    // the lion, redrawn: it opens its eyes now and then
    redraws: { lion: [{ src: 'img/lion-open.webp', every: 9, hold: 2.4, at: 3 }] },
  },
  // the foot of the home page: cropped to the man writing at his block. everyone else is out of focus until touched; he sharpens as you scroll to him
  writers: {
    base: 'athens-mono', top: 'athens-color', view: [0.1, 0.3, 0.8, 1], fx: 0.3, fy: 0.5, rad: 0.1,
    blur: 9, touch: false, focus: [0.46, 0.89, 0.03, 0.085], afterColour: true,
    ink: [0.4755, 0.9085, 0.4885, 0.918], // his sheet: lines of ink appear on it as the hand crosses
    people: [
      [46.4, 90.3, 1.7, 1.5, 0, 12.5, 1.4, 0, 5],
    ],
  },
};
