(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const artPath = file => `assets/art/${file}`;
  const shotPath = file => `assets/shots/${file}.jpg`;
  const DIRECTIONS = {
    study: {name:'Study', description:'A quiet introduction, an interactive painting, and a direct six-project index.'},
    workshop: {name:'Workshop', description:'A machinery drawing introduces the work. Open a capability to see the decisions, team and product behind it.'},
    evening: {name:'Evening', description:'Complete artworks sit beside contemporary project stories, followed by the actual product evidence.'}
  };
  const METHODS = [
    {name:'Diagnose', title:'Find the constraint.', text:'Read the environment, speak to the people doing the work, and identify the problem that matters. The first decision is what needs to change.'},
    {name:'Design', title:'Give the work a shape.', text:'Connect the proposition, ownership and workflow. Decide what each person or system is responsible for, and what evidence will show progress.'},
    {name:'Build', title:'Make the first version work.', text:'Turn the plan into a product, process or service with the people who will deliver it. Test the full path before adding complexity.'},
    {name:'Result', title:'Check what changed.', text:'Look at outcomes and the limits of the evidence. Keep what works, repair the weak points, and make the useful parts repeatable.'}
  ];
  const STORAGE_KEY = 'chuka-design-playground-v1';
  const directions = Object.keys(DIRECTIONS);
  let savedState;
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch { /* Storage is optional, including when the draft is opened as a file. */ }
  const queryDirection = new URLSearchParams(location.search).get('direction');
  let state = DraftState.restore(savedState,queryDirection,directions);
  const deviceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let selectedProject = 'etap';
  let methodStage = 0;
  let revealObserver;
  let toastTimer;
  let entryFrame;
  let entryTimer;
  const focusReturn = new Map();
  let gallery = [];
  let galleryIndex = 0;
  const isReduced = () => state.motion === 'reduced' || deviceMotion.matches;
  const directionFor = part => state.mix ? state.picks[part] || state.direction : state.direction;
  const persist = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Play remains available without storage. */ } };
  const arrow = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5"/></svg>';
  const relay = `<span class="arrow-relay" aria-hidden="true">${arrow}${arrow}</span>`;
  const action = (label, attributes) => `<button class="fill-button" type="button" ${attributes}><span>${esc(label)}</span>${relay}</button>`;
  const linkAction = (label, url, external = false) => `<a class="fill-button" href="${esc(url)}"${external ? ' target="_blank" rel="noopener"' : ''}><span>${esc(label)}${external ? '<span class="sr-only"> (opens another tab)</span>' : ''}</span>${relay}</a>`;
  const sectionStart = (id, kind, variant) => `<section id="${id}" class="section ${kind} ${kind}--${variant} section--${variant}"><div class="section-inner">`;
  const sectionEnd = '</div></section>';
  const artCaption = artwork => `${artwork.artist}, ${artwork.title}, ${artwork.date}. ${artwork.institution}.`;
  const artFigure = (artwork, className = '', eager = false, markers = false) => `<figure class="art-figure ${className}"><div class="art-image"><button class="image-button" type="button" data-art="${esc(artwork.file)}" aria-label="View ${esc(artwork.title)} in full"><img src="${artPath(artwork.file)}" alt="${esc(artwork.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}></button>${markers ? `<div class="markers" id="project-markers">${PROJECTS.map((project,index) => `<button type="button" class="marker" data-case="${project.id}" style="--x:${project.hotspot[0]}%;--y:${project.hotspot[1]}%" aria-label="Open ${esc(project.name)} project story">${String(index+1).padStart(2,'0')}</button>`).join('')}</div>` : ''}</div><figcaption><strong>${esc(artwork.artist)}, <i>${esc(artwork.title)}</i>, ${esc(artwork.date)}</strong><span>${esc(artwork.institution)}</span></figcaption>${markers ? '<div class="marker-tools"><p>Project markers are a contemporary navigation layer. You can also use the work index below.</p><button type="button" id="toggle-markers" aria-pressed="true">Hide markers</button></div>' : ''}</figure>`;
  const stageList = project => `<dl class="stages"><div><dt>Diagnose</dt><dd>${esc(project.diagnosis)}</dd></div><div><dt>Design</dt><dd>${esc(project.design)}</dd></div><div><dt>Build</dt><dd>${esc(project.build)}</dd></div><div><dt>Result</dt><dd>${esc(project.result)}</dd></div></dl>`;
  const metric = project => `<div class="metric"><strong>${esc(project.metric)}</strong><span>${esc(project.metricLabel)}</span></div>`;
  const flowDiagram = () => '<div class="flow-diagram" role="img" aria-label="An editorial diagram of intake, a shared record, separate writer and grader, and human shortlist approval"><p class="flow-heading eyebrow">Workflow structure</p><div class="flow-nodes"><div class="flow-node">Intake<small>Source evidence</small></div><div class="flow-node">One record<small>Traceable changes</small></div><div class="flow-node">Writer &amp; grader<small>Separate responsibilities</small></div><div class="flow-node">Human approval<small>Shortlist sign-off</small></div></div><p class="flow-caption">Editorial explanation. Private candidate records and evaluation materials are not shown.</p></div>';
  const shotFigure = (project, shot, className = '') => `<figure class="${className}"><button type="button" class="image-button" data-gallery="${project.id}" data-shot="${esc(shot[0])}" aria-label="View ${esc(shot[1])} in full"><img src="${shotPath(shot[0])}" alt="${esc(shot[1])}" loading="lazy" width="1280" height="800"></button><figcaption>${esc(shot[1])}</figcaption></figure>`;
  const projectMedia = project => project.shots.length ? shotFigure(project, project.shots.find(shot => shot[0] === project.featuredShot) || project.shots[0], 'feature-media') : flowDiagram();
  const projectLinks = project => `<div class="project-actions">${action('Read the story', `data-case="${project.id}"`)}${project.link ? `<a class="text-link" href="${esc(project.link[1])}" target="_blank" rel="noopener">${esc(project.link[0])} ↗<span class="sr-only"> (opens another tab)</span></a>` : ''}</div>`;

  function heroStudy() {
    return `${sectionStart('top','hero','study')}<div class="hero-grid"><div class="hero-copy"><p class="eyebrow">Strategy &amp; Operations<br>From diagnosis through delivery</p><h1>I diagnose the problem, design how the work should run, and build what it needs.</h1><p>Across products, teams and services, I connect the idea to the work that makes it real.</p>${linkAction('Explore the work','#work')}</div>${artFigure(ARTWORKS[0],'',true,true)}</div>${sectionEnd}`;
  }
  function heroWorkshop() {
    return `${sectionStart('top','hero','workshop')}<div class="hero-copy"><p class="eyebrow">Chuka Dele-Oyeleru · Strategy &amp; Operations</p><h1>Strategy and operations, from diagnosis through delivery.</h1></div><div class="workshop-hero-grid">${artFigure(ARTWORKS[1],'',true)}<div class="workshop-side"><p>I diagnose the problem, design how the work should run, and build what it needs.</p><svg class="annotation-line" viewBox="0 0 300 60" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M2 4C54 56 146 14 279 48M267 35l13 14-19 2"/></svg><p class="eyebrow">A drawing of a machine.<br>A way to think through a system.</p>${linkAction('Explore the work','#work')}</div></div>${sectionEnd}`;
  }
  function heroEvening() {
    return `${sectionStart('top','hero','evening')}<div class="hero-grid"><div class="hero-copy"><p class="eyebrow">Strategy &amp; Operations</p><h1>I diagnose, design and build the systems behind growing companies.</h1><p>From the commercial question to the product, process and team that can carry it.</p>${linkAction('Explore the work','#work')}<figure class="evening-painting"><button type="button" class="image-button" data-art="athens.jpg" aria-label="View The School of Athens in full"><img src="${artPath('athens.jpg')}" alt="Raphael’s School of Athens" loading="lazy"></button><figcaption>Raphael, <i>The School of Athens</i>, 1509 to 1511</figcaption></figure></div>${artFigure(ARTWORKS[2],'',true)}</div>${sectionEnd}`;
  }
  const projectSummary = project => `<p class="eyebrow">${esc(project.sector)} · ${esc(project.geography)}</p><h3>${esc(project.name)}</h3><p class="project-lead">${esc(project.headline)}</p><p class="role-line">My role: ${esc(project.role)}</p><dl class="brief-stages"><div><dt>The problem</dt><dd>${esc(project.diagnosis)}</dd></div><div><dt>The design</dt><dd>${esc(project.design)}</dd></div><div><dt>The work</dt><dd>${esc(project.build)}</dd></div></dl>${projectMedia(project)}${metric(project)}${projectLinks(project)}`;
  function workStudy() {
    const current = PROJECTS.find(project => project.id === selectedProject);
    return `${sectionStart('work','work','study')}<div class="section-head"><h2>Selected work</h2><p class="eyebrow">Six projects · My contribution</p></div><div class="study-index"><div class="project-index" role="group" aria-label="Choose a project">${PROJECTS.map((project,index) => `<button type="button" data-select-project="${project.id}" aria-pressed="${project.id === selectedProject}" aria-controls="featured-project"><span>${String(index+1).padStart(2,'0')}</span><div><strong>${esc(project.name)}</strong><small>${esc(project.sector)}</small></div></button>`).join('')}</div><article class="featured-project" id="featured-project" aria-label="Selected project">${projectSummary(current)}</article></div>${sectionEnd}`;
  }
  function workWorkshop() {
    return `${sectionStart('work','work','workshop')}<div class="section-head"><h2>What I can do, with the work behind it.</h2><p class="eyebrow">Open a capability</p></div><div class="capability-list">${PROJECTS.map((project,index) => `<details id="work-${project.id}"${project.id === 'idara' ? ' open' : ''}><summary><span>${String(index+1).padStart(2,'0')}</span><strong>${esc(project.name)}</strong><span class="capability">${esc(project.capability)}</span><span class="plus" aria-hidden="true"></span></summary><div class="capability-body"><div class="capability-copy"><p class="eyebrow">${esc(project.sector)} · ${esc(project.geography)}</p><p class="project-lead">${esc(project.headline)}</p><p class="role-line">My role: ${esc(project.role)}</p>${stageList(project)}${metric(project)}${projectLinks(project)}</div><div>${projectMedia(project)}${project.shots.length > 1 ? `<div class="mini-gallery">${project.shots.filter(shot => shot[0] !== project.featuredShot).map(shot => shotFigure(project,shot)).join('')}</div>` : ''}</div></div></details>`).join('')}</div>${sectionEnd}`;
  }
  function workEvening() {
    return `${sectionStart('work','work','evening')}<div class="section-head"><h2>Work, in context.</h2><p class="eyebrow">Six project stories</p></div><div class="evening-intro"><p>The artwork offers a way into each story. The contribution and product evidence carry the account of the work.</p><nav class="evening-index" aria-label="Project index">${PROJECTS.map(project => `<a href="#work-${project.id}">${esc(project.name)}</a>`).join('')}</nav></div>${PROJECTS.map((project,index) => `<article class="commission reveal-target" id="work-${project.id}"><header class="commission-header"><span>${String(index+1).padStart(2,'0')}</span><h3>${esc(project.name)}</h3><p class="eyebrow">${esc(project.sector)} · ${esc(project.geography)}</p></header><div class="commission-grid"><div class="commission-art">${artFigure(project.art)}<p class="role-line">${esc(project.art.connection)}</p></div><div class="commission-copy"><p class="project-lead">${esc(project.headline)}</p><p class="role-line">My role: ${esc(project.role)}</p><p class="commission-diagnosis">${esc(project.diagnosis)} ${esc(project.design)}</p>${metric(project)}${projectLinks(project)}</div></div>${project.shots.length ? `<div class="evidence-strip">${project.shots.map(shot => shotFigure(project,shot)).join('')}</div>` : flowDiagram()}</article>`).join('')}${sectionEnd}`;
  }
  function method(variant) {
    const artwork = variant === 'workshop' ? ARTWORKS[1] : variant === 'evening' ? PROJECTS[5].art : ARTWORKS[3];
    const current = METHODS[methodStage];
    return `${sectionStart('method','method',variant)}<div class="section-head"><h2>How the work takes shape.</h2><p class="eyebrow">A method, applied to the problem</p></div><div class="method-grid"><figure class="method-drawing"><button type="button" class="image-button" data-art="${artwork.file}" aria-label="View ${esc(artwork.title)} in full"><img src="${artPath(artwork.file)}" alt="${esc(artwork.alt)}" loading="lazy"></button><figcaption>${esc(artCaption(artwork))}<br>The four stages are a contemporary interpretation, separate from the historical drawing.</figcaption></figure><div><div class="method-tabs" role="tablist" aria-label="Method stages">${METHODS.map((stage,index) => `<button type="button" role="tab" id="method-tab-${index}" data-method-stage="${index}" aria-controls="method-panel" aria-selected="${index === methodStage}" tabindex="${index === methodStage ? '0' : '-1'}"><span>${String(index+1).padStart(2,'0')}</span>${stage.name}</button>`).join('')}</div><div class="method-panel" id="method-panel" role="tabpanel" aria-labelledby="method-tab-${methodStage}" tabindex="0"><h3>${current.title}</h3><p>${current.text}</p></div><div class="method-progress" aria-hidden="true" style="--progress:${(methodStage+1)/4}"></div></div></div>${sectionEnd}`;
  }
  function aboutContact() {
    const variant = state.mix ? directionFor('method') : state.direction;
    return `${sectionStart('about','about-contact',variant)}<div class="about-contact-grid"><div class="about-copy"><p class="eyebrow">About the practice</p><h2>Ideas need an operating path.</h2><p>I work across strategy, operations and delivery. These projects show how I connect commercial questions to products, services, workflows and the people who run them.</p><div class="about-links"><a class="text-link" href="https://chukadele.com/about" target="_blank" rel="noopener">Read the profile ↗</a><a class="text-link" href="https://chukadele.com/resume" target="_blank" rel="noopener">Read the résumé ↗</a><a class="text-link" href="https://chukadele.com/notes" target="_blank" rel="noopener">Notes ↗</a></div></div><div class="contact-copy" id="contact"><p class="eyebrow">Start a conversation</p><h3>Have something that needs building?</h3><p>Tell me what you are trying to make work, where it is getting stuck, and what a useful outcome would look like.</p>${linkAction('Write to me on LinkedIn','https://www.linkedin.com/in/chuka1',true)}</div></div>${sectionEnd}`;
  }
  const heroes = {study:heroStudy,workshop:heroWorkshop,evening:heroEvening};
  const works = {study:workStudy,workshop:workWorkshop,evening:workEvening};
  function render() {
    revealObserver?.disconnect();
    $('#main').innerHTML = `${heroes[directionFor('hero')]()}${works[directionFor('work')]()}${method(directionFor('method'))}${aboutContact()}`;
    document.body.dataset.direction = state.direction;
    updateMotion();
    updateControls();
    observeReveals();
  }
  function updateMotion() {
    document.documentElement.dataset.motion = isReduced() ? 'reduced' : 'auto';
    $('#replay-entry').disabled = isReduced();
    $('#replay-entry').title = isReduced() ? 'Entrance motion is off for the current motion preference.' : 'Replay the brief Dürer-inspired entrance.';
    if (isReduced()) finishEntry();
  }
  function observeReveals() {
    if (isReduced() || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(item => { if (item.isIntersecting) { item.target.classList.add('visible'); revealObserver.unobserve(item.target); } });
    },{rootMargin:'0px 0px 80px',threshold:.04});
    document.querySelectorAll('.reveal-target').forEach(element => {element.classList.add('reveal');revealObserver.observe(element);});
  }
  function updateControls() {
    $('#direction-name').textContent = state.mix ? 'Your mix' : DIRECTIONS[state.direction].name;
    $('#direction-description').textContent = state.mix ? 'Playing the saved sections together. Any unsaved section uses the last chosen direction.' : DIRECTIONS[state.direction].description;
    document.querySelectorAll('[data-direction]').forEach(button => button.setAttribute('aria-pressed', !state.mix && button.dataset.direction === state.direction));
    $('#motion-setting').value = state.motion;
    $('#draft-note').value = state.note;
    $('#saved-sections').innerHTML = Object.entries(state.picks).map(([part,direction]) => `<div><dt>${part[0].toUpperCase()+part.slice(1)}</dt><dd>${direction ? DIRECTIONS[direction].name : 'Not saved yet'}</dd></div>`).join('');
    $('#saved-count').textContent = `${Object.values(state.picks).filter(Boolean).length} / 3`;
    $('#try-mix').disabled = !Object.values(state.picks).some(Boolean);
    document.querySelectorAll('[data-save]').forEach(button => { button.dataset.saved = String(state.picks[button.dataset.save] === directionFor(button.dataset.save)); });
  }
  function announce(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'),2400);
  }
  function chooseDirection(direction) {
    if (!directions.includes(direction)) return;
    state.direction = direction;state.mix = false;persist();render();
    try { history.replaceState(null,'',DraftState.urlFor(location.href,direction)); } catch { /* file previews can restrict history. */ }
    window.scrollTo({top:0,behavior:'instant'});
  }
  function openDialog(id, opener) {
    const dialog = $(`#${id}`);
    focusReturn.set(id,opener || document.activeElement);
    dialog.showModal();
  }
  function openCase(id,opener) {
    const project = PROJECTS.find(item => item.id === id);
    if (!project) return;
    $('#case-content').innerHTML = `<p class="eyebrow">${esc(project.sector)} · ${esc(project.geography)}</p><h2 id="case-title">${esc(project.name)}</h2><p class="case-lead">${esc(project.headline)}</p><div class="case-meta"><span>My role: ${esc(project.role)}</span><span>${esc(project.period)}</span></div>${stageList(project)}${metric(project)}${project.shots.length ? `<div class="case-gallery">${project.shots.map(shot => shotFigure(project,shot)).join('')}</div>` : flowDiagram()}<div class="project-actions">${project.link ? linkAction(project.link[0],project.link[1],true) : '<p class="eyebrow">Private workflow · An editorial diagram is shown above</p>'}</div><p class="case-art-credit">Artwork pairing: <button class="text-link" type="button" data-art="${project.art.file}" style="background:transparent;padding:0">${esc(project.art.artist)}, <i>${esc(project.art.title)}</i></button></p><p class="case-source">Draft evidence note: ${esc(project.sourceNote)}</p>`;
    openDialog('case-dialog',opener);
    $('#case-dialog').scrollTop = 0;
  }
  function showGallery() {
    const image = gallery[galleryIndex];
    $('#lightbox-image').src = image.src;$('#lightbox-image').alt = image.caption;
    $('#lightbox-caption').textContent = image.caption;
    $('#lightbox-position').textContent = gallery.length > 1 ? `${galleryIndex+1} / ${gallery.length}` : 'Full artwork';
    $('#previous-image').hidden = gallery.length < 2;$('#next-image').hidden = gallery.length < 2;
  }
  function openGallery(projectId,shotId,opener) {
    const project = PROJECTS.find(item => item.id === projectId);
    if (!project?.shots.length) return;
    gallery = project.shots.map(shot => ({src:shotPath(shot[0]),caption:`${project.name}: ${shot[1]}`}));
    galleryIndex = Math.max(0,project.shots.findIndex(shot => shot[0] === shotId));
    showGallery();openDialog('lightbox',opener);
  }
  function openArt(file,opener) {
    const artwork = ARTWORKS.find(item => item.file === file);
    if (!artwork) return;
    gallery = [{src:artPath(artwork.file),caption:artCaption(artwork)}];galleryIndex = 0;
    showGallery();openDialog('lightbox',opener);
  }
  function changeGallery(delta) { galleryIndex = (galleryIndex+delta+gallery.length)%gallery.length;showGallery(); }
  function setMethodStage(index,focus = false) {
    if (index < 0 || index >= METHODS.length) return;
    methodStage = index;
    document.querySelectorAll('[data-method-stage]').forEach(button => {const selected = Number(button.dataset.methodStage) === index;button.setAttribute('aria-selected',selected);button.tabIndex = selected ? 0 : -1;});
    $('#method-panel').innerHTML = `<h3>${METHODS[index].title}</h3><p>${METHODS[index].text}</p>`;
    $('#method-panel').setAttribute('aria-labelledby',`method-tab-${index}`);
    $('.method-progress').style.setProperty('--progress',(index+1)/4);
    if (focus) $(`#method-tab-${index}`).focus();
  }
  function credits() {
    $('#credits-content').innerHTML = '<p>The historical images and their attribution metadata were supplied with the Claude drafts. The two Met assets come from the existing website’s documented Open Access sources. Each pairing is an editorial analogy. Leonardo’s hoist is a separate work and is not a preparatory drawing for Raphael’s painting.</p><ul>'+ARTWORKS.map(artwork => `<li><strong>${esc(artwork.artist)}, <i>${esc(artwork.title)}</i>, ${esc(artwork.date)}</strong><small>${esc(artwork.institution)}${artwork.source ? ` · <a href="${esc(artwork.source)}" target="_blank" rel="noopener">Museum source ↗</a>` : ' · Supplied draft attribution'}</small></li>`).join('')+'</ul>';
  }
  function exportChoices() {
    const output = {artifact:'Chuka design playground',version:1,exportedAt:new Date().toISOString(),direction:state.direction,playingSavedMix:state.mix,sections:state.picks,motion:state.motion,notes:state.note};
    const url = URL.createObjectURL(new Blob([JSON.stringify(output,null,2)+'\n'],{type:'application/json'}));
    const anchor = document.createElement('a');anchor.href = url;anchor.download = 'chuka-design-choices.json';document.body.append(anchor);anchor.click();anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    announce('Choices exported. Share the JSON file with your feedback.');
  }
  function finishEntry() {
    cancelAnimationFrame(entryFrame);clearTimeout(entryTimer);$('#entry').hidden = true;$('#entry').classList.remove('exit');
  }
  function replayEntry() {
    if (isReduced()) return;
    finishEntry();
    const svg = $('#entry-solid');svg.replaceChildren();
    const diagonal = [1,1,1].map(value => value/Math.sqrt(3));
    const points = Array.from({length:8},(_,index) => {const point = [(index&1)-.5,((index>>1)&1)-.5,((index>>2)&1)-.5];const stretch = .55*point.reduce((sum,value,axis) => sum+value*diagonal[axis],0);return point.map((value,axis) => value+diagonal[axis]*stretch);});
    const cut = (a,b) => points[a].map((value,axis) => value+(points[b][axis]-value)*.38);
    const edges = [];
    for(let a=0;a<8;a++) for(let bit=0;bit<3;bit++) {const b = a^(1<<bit);if(b<a)continue;edges.push([(a===0||a===7)?cut(a,b):points[a],(b===0||b===7)?cut(b,a):points[b]]);}
    [[0,1,2],[0,2,4],[0,4,1],[7,6,5],[7,5,3],[7,3,6]].forEach(([corner,a,b]) => edges.push([cut(corner,a),cut(corner,b)]));
    const paths = edges.map(() => {const path = document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('pathLength','1');path.setAttribute('stroke-dasharray','1');svg.append(path);return path;});
    $('#entry').hidden = false;
    const start = performance.now();
    function frame(now) {
      const elapsed = now-start,progress = Math.min(elapsed/640,1),yaw = .6+elapsed*.0014;
      const rotate = point => {const x = Math.cos(yaw)*point[0]+Math.sin(yaw)*point[2],z = -Math.sin(yaw)*point[0]+Math.cos(yaw)*point[2];return [x,-(Math.cos(-.45)*point[1]-Math.sin(-.45)*z)];};
      edges.forEach((edge,index) => {const a = rotate(edge[0]),b = rotate(edge[1]);paths[index].setAttribute('d',`M${a[0].toFixed(3)} ${a[1].toFixed(3)}L${b[0].toFixed(3)} ${b[1].toFixed(3)}`);paths[index].setAttribute('stroke-dashoffset',1-Math.min(Math.max(progress*edges.length*1.3-index,0),1));});
      if(elapsed<900) entryFrame = requestAnimationFrame(frame);else {$('#entry').classList.add('exit');entryTimer = setTimeout(finishEntry,180);}
    }
    entryFrame = requestAnimationFrame(frame);
  }

  document.addEventListener('click',event => {
    const button = event.target.closest('button');
    if(!button)return;
    if(button.dataset.direction){chooseDirection(button.dataset.direction);return;}
    if(button.dataset.case){openCase(button.dataset.case,button);return;}
    if(button.dataset.art){openArt(button.dataset.art,button);return;}
    if(button.dataset.gallery){openGallery(button.dataset.gallery,button.dataset.shot,button);return;}
    if(button.dataset.closeDialog){$(`#${button.dataset.closeDialog}`).close();return;}
    if(button.dataset.selectProject){selectedProject = button.dataset.selectProject;document.querySelectorAll('[data-select-project]').forEach(item => item.setAttribute('aria-pressed',item.dataset.selectProject === selectedProject));$('#featured-project').innerHTML = projectSummary(PROJECTS.find(item => item.id === selectedProject));return;}
    if(button.dataset.methodStage !== undefined){setMethodStage(Number(button.dataset.methodStage));return;}
    if(button.dataset.save){const part = button.dataset.save;state.picks[part] = directionFor(part);persist();updateControls();announce(`${part[0].toUpperCase()+part.slice(1)} saved from ${DIRECTIONS[state.picks[part]].name}.`);return;}
    if(button.hasAttribute('data-open-credits')){credits();openDialog('credits-dialog',button);return;}
    if(button.id === 'close-controls'){$('#draft-controls').open = false;$('#draft-controls summary').focus();return;}
    if(button.id === 'replay-entry'){replayEntry();return;}
    if(button.id === 'previous-image'){changeGallery(-1);return;}
    if(button.id === 'next-image'){changeGallery(1);return;}
    if(button.id === 'toggle-markers'){const visible = button.getAttribute('aria-pressed') !== 'true';button.setAttribute('aria-pressed',visible);button.textContent = visible?'Hide markers':'Show markers';$('#project-markers').hidden = !visible;return;}
    if(button.id === 'try-mix'){state.mix = true;persist();try {history.replaceState(null,'',DraftState.urlFor(location.href,null));} catch { /* Storage still preserves the mix if file history is unavailable. */ }render();window.scrollTo({top:0,behavior:'instant'});announce('Playing your saved mix. Choose a direction to return to one layout.');return;}
    if(button.id === 'export-choices'){exportChoices();return;}
    if(button.id === 'reset-choices'){state.picks = {hero:null,work:null,method:null};state.note = '';state.mix = false;persist();render();announce('Saved sections and notes cleared.');}
  });
  $('#motion-setting').addEventListener('change',event => {state.motion = event.target.value;persist();updateMotion();document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));});
  $('#draft-note').addEventListener('input',event => {state.note = event.target.value.slice(0,2000);persist();});
  deviceMotion.addEventListener('change',updateMotion);
  document.addEventListener('keydown',event => {
    document.documentElement.classList.add('keyboard-mode');
    if($('#lightbox').open && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')){event.preventDefault();changeGallery(event.key === 'ArrowRight'?1:-1);return;}
    const tab = event.target.closest('[data-method-stage]');
    if(tab && ['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){event.preventDefault();const index = Number(tab.dataset.methodStage);setMethodStage(event.key==='Home'?0:event.key==='End'?METHODS.length-1:(index+(event.key==='ArrowRight'?1:METHODS.length-1))%METHODS.length,true);}
  });
  document.addEventListener('pointerdown',() => document.documentElement.classList.remove('keyboard-mode'));
  document.addEventListener('pointerover',event => {
    const button = event.target.closest('.fill-button');
    if(!button || button.contains(event.relatedTarget))return;
    const rect = button.getBoundingClientRect(),x = event.clientX-rect.left,y = event.clientY-rect.top;
    button.style.setProperty('--fill-x',`${x}px`);button.style.setProperty('--fill-y',`${y}px`);
    button.style.setProperty('--diameter',`${2*Math.max(Math.hypot(x,y),Math.hypot(rect.width-x,y),Math.hypot(x,rect.height-y),Math.hypot(rect.width-x,rect.height-y))}px`);
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click',event => {if(event.target !== dialog)return;const rect = dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
    dialog.addEventListener('close',() => {const opener = focusReturn.get(dialog.id);if(opener?.isConnected)opener.focus({preventScroll:true});focusReturn.delete(dialog.id);});
  });
  render();
  try {const seen = sessionStorage.getItem('chuka-playground-entry-seen');sessionStorage.setItem('chuka-playground-entry-seen','1');if(!seen)replayEntry();} catch { /* Do not repeat the entrance when session storage is unavailable. */ }
})();
