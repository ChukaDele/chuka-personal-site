/* One Underdrawing page, three optional endings. No framework or network dependency. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = 'chuka-underdrawing-lab:v1';
  const endings = ['poster-wall', 'archive', 'workbench'];
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(key) || '{}'); } catch { /* Local files and private browsing may restrict storage. */ }
  const query = new URL(location.href).searchParams.get('ending');
  const state = {
    ending: endings.includes(query) ? query : endings.includes(stored.ending) ? stored.ending : 'poster-wall',
    motion: stored.motion === 'reduced' ? 'reduced' : 'system',
    positions: stored.positions && typeof stored.positions === 'object' ? stored.positions : {},
    note: typeof stored.note === 'string' ? stored.note.slice(0, 180) : '',
    marks: Array.isArray(stored.marks) ? stored.marks.slice(0,80).filter(line=>Array.isArray(line)) : []
  };
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* The draft remains usable without persistence. */ } }
  const deviceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionReduced = () => state.motion === 'reduced' || deviceMotion.matches || document.documentElement.classList.contains('keyboard-mode');
  function setMotion() { document.documentElement.classList.toggle('reduced-motion', state.motion === 'reduced'); $('#motion-mode').value = state.motion; }
  document.addEventListener('keydown', event => { if (event.key === 'Tab' || event.key.startsWith('Arrow')) document.documentElement.classList.add('keyboard-mode'); });
  document.addEventListener('pointerdown', () => document.documentElement.classList.remove('keyboard-mode'), {passive:true});
  $('#motion-mode').addEventListener('change', event => { state.motion = event.target.value; setMotion(); save(); });
  setMotion();

  const ring = '<svg class="metric-ring" viewBox="0 0 200 75" preserveAspectRatio="none" aria-hidden="true"><path d="M 188 29 C 202 60, 171 74, 90 69 C 13 65, -3 48, 8 25 C 19 3, 131 -4, 178 17 C 193 22, 196 43, 179 56"/></svg>';
  const workflow = '<div class="workflow-study"><span>the decision stays human</span><div class="workflow-line"><span>Source &amp; intake</span><i>↓</i></div><div class="workflow-line"><span>Writer + independent grader</span><i>↓</i></div><div class="workflow-line"><span>Recruiter sign-off</span><i>✓</i></div><small>Editorial workflow drawing</small></div>';
  function renderProjects() {
    $('#project-list').innerHTML = PROJECTS.map((p, index) => {
      const sketch = SKETCHES[p.id];
      return `<article class="project-row" id="project-${p.id}" aria-labelledby="title-${p.id}">
        <div class="project-identity"><span class="project-number">${String(index + 1).padStart(2,'0')} / ${escapeHTML(p.sector)}</span><h3 class="project-name" id="title-${p.id}">${escapeHTML(p.name)}</h3><p class="project-meta">${escapeHTML(p.geography)}<br>${escapeHTML(p.period)}</p><p class="project-role">${escapeHTML(p.role)}</p><button type="button" class="case-open" data-case="${p.id}"><span>Read case</span><span class="arrow-relay" aria-hidden="true"><i>↗</i><i>↗</i></span></button></div>
        <div class="project-summary"><p class="project-headline">${escapeHTML(p.headline)}</p><div class="metric ${p.id==='surface'||p.id==='bredge'?'word-metric':''}">${escapeHTML(p.id==='surface'?'Sign-off':p.id==='bredge'?'3 ways':p.metric)}${ring}</div><p class="metric-label">${escapeHTML(p.metricLabel)}</p></div>
        <div class="project-visual">${sketch ? `<div class="sketch-pair"><img src="img/${sketch}-sketch.jpg" alt="Modern drawn interpretation of ${escapeHTML(p.name)}’s supplied product screenshot" loading="lazy"><img class="shot-colour" src="img/${sketch}.jpg" alt="${escapeHTML(p.shots.find(s=>s[0]===sketch)?.[1]||p.shots[0][1])}" loading="lazy"></div><div class="visual-controls"><button type="button" class="colour-toggle" aria-pressed="false">Show colour ↗</button><button type="button" class="zoom-thumb" data-zoom="${p.id}" aria-label="View ${escapeHTML(p.name)} images larger">View larger +</button></div><span class="visual-caption">Modern screenshot study → supplied product image</span>` : workflow}</div>
      </article>`;
    }).join('');
  }
  renderProjects();

  const dialogOpeners = new Map();
  function openDialog(id, opener) {
    const dialog = document.getElementById(id);
    dialogOpeners.set(id, opener || document.activeElement);
    if (!dialog.open) dialog.showModal();
    $('.dialog-close', dialog).focus({preventScroll:true});
  }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      const opener = dialogOpeners.get(dialog.id);
      if (opener?.isConnected) opener.focus({preventScroll:true});
      if (!$$('dialog[open]').length) document.body.style.overflow = '';
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  function openCase(id, opener) {
    const p = PROJECTS.find(project => project.id === id); if (!p) return;
    $('#case-content').innerHTML = `<p class="eyebrow">${escapeHTML(p.sector)} · ${escapeHTML(p.geography)}</p><h2 id="case-title">${escapeHTML(p.name)}</h2><p class="case-subtitle">${escapeHTML(p.headline)}</p><p class="case-role">My contribution: ${escapeHTML(p.role)}<br><span>${escapeHTML(p.period)}</span></p><div class="case-stages">${[['Diagnosis',p.diagnosis],['Design',p.design],['Build',p.build],['Result',p.result]].map(([title,copy])=>`<section><h3>${title}</h3><p>${escapeHTML(copy)}</p></section>`).join('')}</div><p class="source-note">${escapeHTML(p.sourceNote)}</p>${p.shots.length ? `<div class="case-gallery" aria-label="${escapeHTML(p.name)} gallery">${p.shots.map(([file,caption],i)=>`<button type="button" class="gallery-image" data-gallery="${p.id}" data-image-index="${i}"><img src="img/${file}.jpg" alt="${escapeHTML(caption)}" loading="lazy"><span>${escapeHTML(caption)} <b aria-hidden="true">+</b></span></button>`).join('')}</div>` : `<div class="case-gallery">${workflow}</div>`}${p.link ? `<a class="fill-button case-visit" href="${p.link[1]}" target="_blank" rel="noopener"><span>${escapeHTML(p.link[0])}</span><span aria-hidden="true">↗</span></a>` : ''}`;
    document.body.style.overflow = 'hidden';
    openDialog('case-dialog', opener);
  }
  let gallery = [], imageIndex = 0;
  function showImage() {
    if (!gallery.length) return;
    const [src, caption] = gallery[imageIndex];
    $('#lightbox-image').src = src; $('#lightbox-image').alt = caption;
    $('#image-caption').textContent = caption;
    $('#image-count').textContent = `${imageIndex + 1} / ${gallery.length}`;
    $('#image-prev').hidden = $('#image-next').hidden = gallery.length < 2;
  }
  function openImages(images, index, opener) { gallery = images; imageIndex = Math.max(0, Math.min(index, images.length-1)); showImage(); document.body.style.overflow = 'hidden'; openDialog('image-dialog',opener); }
  function shiftImage(step) { imageIndex = (imageIndex + step + gallery.length) % gallery.length; showImage(); }
  $('#image-prev').addEventListener('click',()=>shiftImage(-1));
  $('#image-next').addEventListener('click',()=>shiftImage(1));
  $('#image-dialog').addEventListener('keydown',event=>{ if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();shiftImage(event.key==='ArrowLeft'?-1:1);} });

  function openArt(index, opener) {
    const art = ART[index] || ART[0];
    $('#object-content').innerHTML = `<p class="eyebrow">From the supplied art references</p><h2 id="object-title">${escapeHTML(art.title)}</h2><p class="object-copy">${escapeHTML(art.artist)}, ${escapeHTML(art.date)}. ${escapeHTML(art.credit)}.</p><button class="gallery-image" type="button" data-art-zoom="${index}"><img class="object-art" src="img/${art.file}" alt="${escapeHTML(art.title)}"><span>Look closer <b aria-hidden="true">+</b></span></button><p class="source-note">${escapeHTML(art.note)}</p>${index===0 ? `<div class="art-register">${ART.slice(1).map(a=>`<p><strong>${escapeHTML(a.title)}</strong>${escapeHTML(a.artist)} · ${escapeHTML(a.date)}<br>${escapeHTML(a.note)}</p>`).join('')}<p>Product screenshots and their modern drawn treatments are supplied design assets. Case descriptions are adapted from the supplied drafts and existing portfolio. Open each case for its contribution and outcome attribution.</p></div>` : ''}`;
    document.body.style.overflow = 'hidden'; openDialog('object-dialog',opener);
  }
  function openMethod(opener) {
    $('#object-content').innerHTML = `<p class="eyebrow">A note from the workbench</p><h2 id="object-title">A product needs<br>an operating shape.</h2><p class="object-copy">A proposition becomes useful through the work around it: responsibilities, handoffs, fulfilment and the decisions people can make.</p><p class="object-copy">Idara is one example. Its case connects a platform rebuild with bringing fulfilment in house and writing procedures for the services.</p><button type="button" class="case-open" data-case="idara">Read the Idara case <span aria-hidden="true">↗</span></button>`;
    document.body.style.overflow='hidden';openDialog('object-dialog',opener);
  }
  function openIndex(opener) {
    $('#object-content').innerHTML = `<p class="eyebrow">The case archive</p><h2 id="object-title">Six folders,<br>six kinds of work.</h2><div class="dialog-case-links">${PROJECTS.map(p=>`<button type="button" data-case="${p.id}"><span>${escapeHTML(p.name)}<small class="object-kind">${escapeHTML(p.role)}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`;
    document.body.style.overflow='hidden';openDialog('object-dialog',opener);
  }

  const papers = {
    'poster-wall': [
      {id:'jerome',label:'Study print',angle:-5,width:295,mobile:165,kind:'art-tall',body:'<img src="img/jerome-neg.jpg" alt="A supplied negative treatment of Dürer’s Saint Jerome engraving" loading="lazy"><span class="paper-title">A room for concentrated work.</span><small class="paper-source">Albrecht Dürer · 1514 · modern treatment</small>',action:'data-open-art="2"',open:'Open the print',desktop:[.05,.12],phone:[.06,.035]},
      {id:'type',label:'Type specimen',angle:4,width:245,mobile:150,kind:'type-paper',body:'<div class="type-composition">Draw the<br>operating<br><em>shape.</em><small>Strategy &amp; Operations<br>Chukwuka Dele-Oyeleru</small></div>',action:'data-method',open:'A note on the work',desktop:[.47,.055],phone:[.94,.09]},
      {id:'etap',label:'Product evidence',angle:-3,width:320,mobile:165,kind:'paper-wide',body:'<img src="img/etap-3.jpg" alt="ETAP driver management and rewards screenshot" loading="lazy"><span class="paper-title">The product around the operating work.</span><small class="paper-source">ETAP · supplied project image</small>',action:'data-case="etap"',open:'Read ETAP',desktop:[.92,.56],phone:[.07,.60]},
      {id:'pacioli',label:'Geometry study',angle:6,width:270,mobile:150,kind:'paper-wide',body:'<img src="img/pacioli.jpg" alt="Geometric solids from De Divina Proportione" loading="lazy"><span class="paper-title">Making a complicated shape legible.</span><small class="paper-source">Luca Pacioli · 1509</small>',action:'data-open-art="3"',open:'Open the study',desktop:[.88,.05],phone:[.94,.53]},
      {id:'note',label:'Loose note',angle:-4,width:240,mobile:153,kind:'note-paper',body:'<div class="note-message">The interesting part is often the handoff.<span class="paper-stamp">Who picks it up next?</span></div>',action:'data-method',open:'Follow the note',desktop:[.40,.79],phone:[.48,.95]}
    ],
    workbench: [
      {id:'hoist',label:'Mechanism study',angle:-5,width:310,mobile:170,kind:'workbench-card',body:'<img src="img/hoist-neg.jpg" alt="Leonardo da Vinci’s hoist study in the supplied modern negative treatment" loading="lazy"><span class="paper-title">A mechanism drawn so it can be understood.</span><small class="paper-source">Leonardo da Vinci · modern treatment</small>',action:'data-open-art="1"',open:'Open the drawing',desktop:[.04,.15],phone:[.03,.05]},
      {id:'sequence',label:'Working sequence',angle:4,width:240,mobile:148,kind:'workbench-card',body:'<div class="scrap-line">Observe.</div><div class="scrap-line">Draw the handoffs.</div><div class="scrap-line">Build with people.</div><div class="scrap-line">Check what changed.</div><div class="pencil-rule"></div>',action:'data-method',open:'Open the method note',desktop:[.45,.04],phone:[.98,.12]},
      {id:'honey',label:'Studio fragment',angle:3,width:295,mobile:170,kind:'workbench-card',body:'<img src="img/honey-3.jpg" alt="HoneyCoin brand work supplied in the studio case" loading="lazy"><span class="paper-title">One part of a shared delivery.</span><small class="paper-source">HoneyCoin · with Rvysion</small>',action:'data-case="honeycoin"',open:'Read HoneyCoin',desktop:[.92,.40],phone:[.05,.59]},
      {id:'chalk',label:'Your drawing sheet',angle:-5,width:240,mobile:148,kind:'note-paper',body:'<span class="editor-label">Make a small mark. Mouse, pen or touch.</span><canvas id="chalk-canvas" width="600" height="390" aria-label="Your red chalk drawing sheet. You can also add a loop with the button below."></canvas><button type="button" class="text-button chalk-loop" data-chalk-loop>Add a loop ↗</button>',action:'data-chalk-clear',open:'Clear the sheet',desktop:[.35,.81],phone:[.95,.56]},
      {id:'your-note',label:'Your loose note',angle:3,width:265,mobile:170,kind:'note-paper',body:'<label class="editor-label" for="visitor-note">Leave a thought for yourself. Saved in this browser.</label><textarea class="note-editor" id="visitor-note" maxlength="180" placeholder="What would you keep?" aria-label="Your private draft note"></textarea>',action:'data-note-clear',open:'Clear your note',desktop:[.82,.92],phone:[.52,.97]}
    ]
  };
  const endingCopy = {
    'poster-wall': ['The poster wall.','A few things from the studio, pinned loosely. Move them around or open one.','There’s a loose print waiting at the end ↓','Follow the prints to a small poster wall ↓'],
    archive: ['A small archive.','Pull out a folder, a print or a notebook. Each one opens something from the work.','There’s a small archive waiting at the end ↓','Six folders and a few art studies, further down ↓'],
    workbench: ['On the workbench.','Drawings, product fragments and a note of your own. Rearrange the pieces as you think.','A few loose scraps are waiting at the end ↓','There’s a place to leave yourself a note below ↓']
  };
  let board = null, activeDrag = null, boardObserver = null;
  function renderArchive() {
    return `<div class="archive-shelf"><button type="button" class="archive-object" data-case-index><div class="archive-folder"><small>Selected work / 01 to 06</small><span>The cases</span></div><span class="object-label">Open the six folders <span aria-hidden="true">↗</span></span><small class="object-kind">Projects &amp; contributions</small></button><button type="button" class="archive-object" data-open-art="3"><img class="archive-print" src="img/pacioli.jpg" alt="Geometry study from De Divina Proportione" loading="lazy"><span class="object-label">The geometry study <span aria-hidden="true">↗</span></span><small class="object-kind">Luca Pacioli · 1509</small></button><button type="button" class="archive-object" data-method><div class="archive-book">An operating<br>shape.<small>Notes from the work</small></div><span class="object-label">Open the notebook <span aria-hidden="true">↗</span></span><small class="object-kind">Method &amp; an Idara example</small></button><button type="button" class="archive-object" data-open-art="2"><img class="archive-print" src="img/jerome-neg.jpg" alt="Modern treatment of Dürer’s Saint Jerome in His Study" loading="lazy"><span class="object-label">A room for the work <span aria-hidden="true">↗</span></span><small class="object-kind">Dürer · modern treatment</small></button><button type="button" class="archive-object" data-case="honeycoin"><div class="archive-folder" style="background:#b9bbaa"><small>Payments / with Rvysion</small><span>A shared<br>delivery</span></div><span class="object-label">Open HoneyCoin <span aria-hidden="true">↗</span></span><small class="object-kind">Delivery &amp; product evidence</small></button><a class="archive-object" href="https://chukadele.com/resume" target="_blank" rel="noopener"><div class="archive-card"><span class="hand">the longer<br>version ↗</span><small>Chukwuka Dele-Oyeleru<br>Strategy &amp; Operations</small></div><span class="object-label">Read the résumé <span aria-hidden="true">↗</span></span><small class="object-kind">Experience &amp; context</small></a></div><p class="archive-instructions">Everything here is open to look at.</p>`;
  }
  function renderStudio() {
    if (activeDrag) finishDrag(true);
    boardObserver?.disconnect(); board = null;
    document.body.dataset.ending = state.ending;
    const copy = endingCopy[state.ending];
    $('#studio-title').textContent = copy[0]; $('#studio-description').textContent = copy[1];
    $('#hero-teaser').textContent = copy[2]; $('#work-teaser').textContent = copy[3];
    $$('[data-ending-link]').forEach(link => { if(link.dataset.endingLink===state.ending)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current'); });
    const dragging = state.ending !== 'archive';
    $('.studio-tools').hidden = !dragging;
    if(!dragging){$('#studio-content').innerHTML=renderArchive();return;}
    const list = papers[state.ending];
    $('#studio-content').innerHTML = `<div class="paper-board ${state.ending==='workbench'?'workbench-board':''}" role="group" aria-label="${state.ending==='workbench'?'Rearrangeable workbench':'Draggable poster wall'}"><span class="paper-board-label" aria-hidden="true">${state.ending==='workbench'?'leave a little room to think':'pins are optional'}</span>${list.map(p=>`<article class="paper ${p.kind}" data-paper="${p.id}" style="--paper-width:${p.width}px;--mobile-width:${p.mobile}px;--small-width:${Math.min(p.mobile,148)}px;--angle:${p.angle}deg"><button class="drag-handle" type="button" data-drag="${p.id}" aria-label="Move ${p.label}. Arrow keys move it. Escape restores its starting position."><span>${p.label}</span><span aria-hidden="true">↔ ↕</span></button><div class="paper-body">${p.body}<button type="button" class="paper-open" ${p.action}><span>${p.open}</span><span aria-hidden="true">↗</span></button></div></article>`).join('')}</div>`;
    board = $('.paper-board');
    placePapers();
    boardObserver = new ResizeObserver(()=>{ if(!activeDrag)placePapers(); }); boardObserver.observe(board);
    if($('#visitor-note')) { $('#visitor-note').value=state.note; $('#visitor-note').addEventListener('input',e=>{state.note=e.target.value;save();}); }
    setupChalk();
  }
  function paperData(id) { return papers[state.ending]?.find(p=>p.id===id); }
  function setPaperPosition(element, x, y) {
    const data = paperData(element.dataset.paper);
    const point = boundPaper(x,y,element.offsetWidth,element.offsetHeight,board.clientWidth,board.clientHeight,data.angle);
    element.style.setProperty('--px',`${point.x}px`); element.style.setProperty('--py',`${point.y}px`);
    element.dataset.x=point.x; element.dataset.y=point.y; return point;
  }
  function positionFor(data) {
    const saved = state.positions[state.ending]?.[data.id];
    if(saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return [saved.x,saved.y];
    return innerWidth <= 700 ? data.phone : data.desktop;
  }
  function placePapers() {
    if(!board)return;
    $$('[data-paper]',board).forEach(element=>{const data=paperData(element.dataset.paper);const [x,y]=positionFor(data);setPaperPosition(element,x*Math.max(0,board.clientWidth-element.offsetWidth),y*Math.max(0,board.clientHeight-element.offsetHeight));});
  }
  function rememberPosition(element) {
    state.positions[state.ending] ||= {};
    state.positions[state.ending][element.dataset.paper] = {x:Number(element.dataset.x)/Math.max(1,board.clientWidth-element.offsetWidth),y:Number(element.dataset.y)/Math.max(1,board.clientHeight-element.offsetHeight)};
    save();
  }
  function announce(message) { $('#board-status').textContent=message; }
  function finishDrag(cancelled=false) {
    if(!activeDrag)return;
    const {element,handle,pointer,startX,startY}=activeDrag;
    if(cancelled) setPaperPosition(element,startX,startY); else rememberPosition(element);
    element.classList.remove('is-dragging');
    activeDrag=null;
    if(handle.hasPointerCapture(pointer))handle.releasePointerCapture(pointer);
    announce(`${paperData(element.dataset.paper)?.label||'Paper'} ${cancelled?'put back':'placed'}.`);
  }
  document.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('[data-drag]');if(!handle||!board||event.button!==0)return;
    event.preventDefault();
    const element=handle.closest('[data-paper]');
    const startX=Number(element.dataset.x),startY=Number(element.dataset.y);
    activeDrag={element,handle,pointer:event.pointerId,startX,startY,clientX:event.clientX,clientY:event.clientY};
    handle.setPointerCapture(event.pointerId);element.classList.add('is-dragging');
  });
  document.addEventListener('pointermove',event=>{
    if(!activeDrag||activeDrag.pointer!==event.pointerId)return;
    setPaperPosition(activeDrag.element,activeDrag.startX+event.clientX-activeDrag.clientX,activeDrag.startY+event.clientY-activeDrag.clientY);
  });
  document.addEventListener('pointerup',event=>{if(activeDrag?.pointer===event.pointerId)finishDrag();});
  document.addEventListener('pointercancel',event=>{if(activeDrag?.pointer===event.pointerId)finishDrag(true);});
  document.addEventListener('lostpointercapture',event=>{if(activeDrag?.pointer===event.pointerId)finishDrag(true);});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&activeDrag){event.preventDefault();finishDrag(true);return;}
    const handle=event.target.closest('[data-drag]');if(!handle||!board)return;
    const element=handle.closest('[data-paper]');
    if(event.key==='Escape'){
      if(element.dataset.keyboardX!==undefined){setPaperPosition(element,Number(element.dataset.keyboardX),Number(element.dataset.keyboardY));rememberPosition(element);delete element.dataset.keyboardX;delete element.dataset.keyboardY;announce(`${paperData(element.dataset.paper).label} put back.`);}return;
    }
    const steps={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(!steps[event.key])return;event.preventDefault();
    if(element.dataset.keyboardX===undefined){element.dataset.keyboardX=element.dataset.x;element.dataset.keyboardY=element.dataset.y;}
    const distance=event.shiftKey?30:10;const [dx,dy]=steps[event.key];
    setPaperPosition(element,Number(element.dataset.x)+dx*distance,Number(element.dataset.y)+dy*distance);rememberPosition(element);
    announce(`${paperData(element.dataset.paper).label} moved. Escape puts it back.`);
  });
  document.addEventListener('focusout',event=>{if(event.target.matches('[data-drag]')){const element=event.target.closest('[data-paper]');delete element.dataset.keyboardX;delete element.dataset.keyboardY;}});
  $('#board-reset').addEventListener('click',()=>{state.positions[state.ending]={};save();placePapers();announce('The original arrangement is restored.');});
  $('#board-arrange').addEventListener('click',()=>{
    if(!board)return;
    const columns=innerWidth<=700?2:3, gap=innerWidth<=700?15:25;
    const elements=$$('[data-paper]',board);const rows=Math.ceil(elements.length/columns);const rowHeight=(board.clientHeight-gap*2)/rows;
    elements.forEach((element,index)=>{const column=index%columns,row=Math.floor(index/columns);const cell=board.clientWidth/columns;setPaperPosition(element,column*cell+(cell-element.offsetWidth)/2,row*rowHeight+gap);rememberPosition(element);});
    announce('The papers are arranged in rows.');
  });
  $('#draft-reset').addEventListener('click',()=>{state.positions={};state.note='';state.marks=[];state.motion='system';save();setMotion();renderStudio();resetPainting();});
  document.addEventListener('click',event=>{
    const target=event.target.closest('button,a');if(!target)return;
    if(target.dataset.closeDialog){document.getElementById(target.dataset.closeDialog).close();return;}
    if(target.hasAttribute('data-ending-link')){
      event.preventDefault();state.ending=target.dataset.endingLink;save();
      const url=new URL(location.href);url.searchParams.set('ending',state.ending);url.hash='studio';history.replaceState(null,'',url);renderStudio();$('#studio').scrollIntoView({behavior:motionReduced()?'instant':'smooth',block:'start'});return;
    }
    if(target.dataset.case){openCase(target.dataset.case,target);return;}
    if(target.dataset.zoom||target.dataset.gallery){const id=target.dataset.zoom||target.dataset.gallery;const p=PROJECTS.find(p=>p.id===id);const index=target.dataset.zoom?Math.max(0,p.shots.findIndex(s=>s[0]===SKETCHES[id])):Number(target.dataset.imageIndex);openImages(p.shots.map(([file,caption])=>[`img/${file}.jpg`,caption]),index,target);return;}
    if(target.classList.contains('colour-toggle')){const visual=target.closest('.project-visual');const colour=!visual.classList.contains('is-colour');visual.classList.toggle('is-colour',colour);target.setAttribute('aria-pressed',String(colour));target.textContent=colour?'Show drawing ↺':'Show colour ↗';return;}
    if(target.hasAttribute('data-open-art')){openArt(Number(target.dataset.openArt),target);return;}
    if(target.hasAttribute('data-art-zoom')){const a=ART[Number(target.dataset.artZoom)];openImages([[`img/${a.file}`,`${a.artist}, ${a.title}. ${a.note}`]],0,target);return;}
    if(target.hasAttribute('data-method')){openMethod(target);return;}
    if(target.hasAttribute('data-case-index')){openIndex(target);return;}
    if(target.hasAttribute('data-note-clear')){state.note='';if($('#visitor-note'))$('#visitor-note').value='';save();announce('Your note is cleared.');}
    if(target.hasAttribute('data-chalk-clear')){state.marks=[];drawChalk();save();announce('Your drawing sheet is cleared.');}
    if(target.hasAttribute('data-chalk-loop')){const loop=[];for(let i=0;i<=60;i++){const a=i*Math.PI*2/60;loop.push([.5+Math.cos(a)*.29,.5+Math.sin(a)*.31]);}state.marks.push(loop);drawChalk();save();announce('A red loop is added to your sheet.');}
  });

  function drawChalk() {
    const sheet=$('#chalk-canvas');if(!sheet)return;const ctx=sheet.getContext('2d');
    ctx.clearRect(0,0,sheet.width,sheet.height);ctx.lineWidth=3;ctx.strokeStyle='#a23f2a';ctx.lineCap='round';ctx.lineJoin='round';
    state.marks.forEach(line=>{ctx.beginPath();line.forEach(([x,y],i)=>{if(!Number.isFinite(x)||!Number.isFinite(y))return;if(i===0)ctx.moveTo(x*sheet.width,y*sheet.height);else ctx.lineTo(x*sheet.width,y*sheet.height);});ctx.stroke();});
  }
  function setupChalk() {
    const sheet=$('#chalk-canvas');if(!sheet)return;let stroke=null;drawChalk();
    function point(event){const r=sheet.getBoundingClientRect();return [Math.min(1,Math.max(0,(event.clientX-r.left)/r.width)),Math.min(1,Math.max(0,(event.clientY-r.top)/r.height))];}
    sheet.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();stroke=[point(event)];state.marks.push(stroke);if(state.marks.length>80)state.marks.shift();sheet.setPointerCapture(event.pointerId);drawChalk();});
    sheet.addEventListener('pointermove',event=>{if(!stroke||!sheet.hasPointerCapture(event.pointerId))return;if(stroke.length<700){stroke.push(point(event));drawChalk();}});
    const end=()=>{if(stroke){stroke=null;save();announce('Your mark is saved in this browser.');}};
    sheet.addEventListener('pointerup',end);sheet.addEventListener('pointercancel',end);sheet.addEventListener('lostpointercapture',end);
  }

  // Paint into a source-sized mask. The drawing survives viewport resizing.
  const canvas=$('#fresco'),context=canvas.getContext('2d');
  const mask=document.createElement('canvas'),layer=document.createElement('canvas');
  mask.width=layer.width=1800;mask.height=layer.height=1021;
  const maskContext=mask.getContext('2d'),layerContext=layer.getContext('2d');
  const drawing=new Image(),colour=new Image();
  let paintReady=false,paintFrame=0,paintState='drawing';
  function drawPainting(){
    paintFrame=0;if(!paintReady||!context)return;
    const rect=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    // Match the mobile artwork crop to its fallback image rather than stretching the fresco.
    const scale=Math.max(width/1800,height/1021),x=(width-1800*scale)/2,y=(height-1021*scale)/2;
    context.clearRect(0,0,width,height);context.drawImage(drawing,x,y,1800*scale,1021*scale);
    layerContext.globalCompositeOperation='source-over';layerContext.clearRect(0,0,1800,1021);layerContext.drawImage(colour,0,0,1800,1021);
    layerContext.globalCompositeOperation='destination-in';layerContext.drawImage(mask,0,0);
    context.drawImage(layer,x,y,1800*scale,1021*scale);
  }
  function requestPaint(){if(!paintFrame)paintFrame=requestAnimationFrame(drawPainting);}
  function paintAt(event){
    if(!paintReady||paintState==='complete')return;
    const rect=canvas.getBoundingClientRect();const scale=Math.max(rect.width/1800,rect.height/1021);
    const x=(event.clientX-rect.left-(rect.width-1800*scale)/2)/scale,y=(event.clientY-rect.top-(rect.height-1021*scale)/2)/scale;
    const radius=125;const gradient=maskContext.createRadialGradient(x,y,radius*.25,x,y,radius);gradient.addColorStop(0,'rgba(0,0,0,1)');gradient.addColorStop(1,'rgba(0,0,0,0)');
    maskContext.fillStyle=gradient;maskContext.beginPath();maskContext.arc(x,y,radius,0,Math.PI*2);maskContext.fill();requestPaint();
    if(paintState==='drawing'){$('#paint-status').textContent='A patch of colour at a time.';paintState='painting';}
  }
  function resetPainting(){maskContext.clearRect(0,0,1800,1021);paintState='drawing';$('#paint-status').textContent='Move a pointer or tap to add colour.';requestPaint();}
  $('#paint-complete').addEventListener('click',()=>{maskContext.fillStyle='#000';maskContext.fillRect(0,0,1800,1021);paintState='complete';$('#paint-status').textContent='The whole fresco, in colour.';drawPainting();});
  $('#paint-reset').addEventListener('click',resetPainting);
  canvas.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')paintAt(event);},{passive:true});
  canvas.addEventListener('pointerdown',paintAt,{passive:true});
  Promise.all([new Promise((resolve,reject)=>{drawing.onload=resolve;drawing.onerror=reject;drawing.src='img/athens-sinopia.jpg';}),new Promise((resolve,reject)=>{colour.onload=resolve;colour.onerror=reject;colour.src='img/athens-color.jpg';})]).then(()=>{paintReady=true;drawPainting();}).catch(()=>{$('#paint-status').textContent='The drawing is available below.';$('#paint-complete').disabled=true;$('#paint-reset').disabled=true;});
  new ResizeObserver(requestPaint).observe(canvas);
  renderStudio();save();
})();
