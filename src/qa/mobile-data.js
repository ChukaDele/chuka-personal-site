import { works } from '../data/works.js';
import { site } from '../data/site.js';

// Synthetic display data only. Never imported by a public page or client script.
const names = ['Aleksandra Wiśniewska-Kowalczyk', 'Benachrichtigungseinstellungen', 'Đặng Thị Ngọc Hân', 'J'];
const worstWorks = names.map((name, index) => ({
  id: works[index].id,
  name,
  line: 'Preview fixture for long authored text, narrow columns and enlarged text settings.',
  title: 'Preview fixture: reviewing Benachrichtigungseinstellungen with Đặng Thị Ngọc Hân',
  role: 'Strategy and operations — preview display data',
  // roleFull intentionally absent: compact rows must fall back to role.
  when: '2022 to 2026',
  where: 'Manchester, United Kingdom; Thành phố Hồ Chí Minh, Việt Nam',
  fig: ['0', '1', '1,284', '100%'][index],
  lab: 'Preview item count or percentage; not an authored outcome',
}));
const contact = {
  email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
  // reply intentionally absent: no empty line should render.
};

export const scenarios = {
  demo: { label: 'Demo data', works, contact: site },
  worst: { label: 'Worst case', works: worstWorks, contact },
  empty: { label: 'Zero works', works: [], contact },
  one: { label: 'One work', works: worstWorks.slice(0, 1), contact },
};
