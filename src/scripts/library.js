// Enhance the server-rendered notes in place: one reading path, no copied HTML.
export function initLibrary(box, onPull = () => {}) {
  const books = [...box.querySelectorAll('[data-book]')];
  const home = box.querySelector('[data-library-home]');
  const notes = [...home.querySelectorAll('[data-library-note]')];
  const idle = home.querySelector('[data-library-idle]');
  const drawer = box.querySelector('[data-library-drawer]');
  if (!drawer.showModal) return; // The ordinary anchors and all notes still work.
  const reading = drawer.querySelector('[data-library-reading]');
  const close = drawer.querySelector('[data-library-close]');
  const mobile = matchMedia('(hover: none), (max-width: 820px)');
  let current = null, intent = 0, restoring = false, lock = null, readingTop = 0;
  const panel = book => document.getElementById(book.getAttribute('aria-controls'));
  const focus = element => {
    restoring = true;
    element?.focus({ preventScroll: true });
    restoring = false;
  };
  const lockScroll = () => {
    if (lock) return;
    lock = { x: window.scrollX, y: window.scrollY, style: document.body.getAttribute('style') };
    Object.assign(document.body.style, { position: 'fixed', top: `-${lock.y}px`, left: `-${lock.x}px`, width: '100%' });
  };
  const unlockScroll = () => {
    if (!lock) return;
    const saved = lock;
    lock = null;
    if (saved.style === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', saved.style);
    window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
  };
  const present = () => {
    if (!current) return;
    const note = panel(current);
    if (mobile.matches) {
      reading.append(note);
      drawer.setAttribute('aria-labelledby', `${note.id}-title`);
      lockScroll();
      if (!drawer.open) drawer.showModal();
      reading.scrollTop = readingTop;
      focus(close);
    } else {
      const active = document.activeElement;
      const wasOpen = drawer.open;
      if (wasOpen) {
        readingTop = reading.scrollTop;
        restoring = true;
        drawer.close();
        restoring = false;
      }
      home.append(note);
      unlockScroll();
      if (wasOpen) focus(note.contains(active) ? active : note.querySelector('h2'));
    }
  };
  const reset = (restoreFocus = false) => {
    clearTimeout(intent);
    const origin = current;
    current = null;
    if (drawer.open) {
      restoring = true;
      drawer.close();
      restoring = false;
    }
    notes.forEach(note => { note.hidden = true; home.append(note); });
    books.forEach(book => { book.classList.remove('on'); book.setAttribute('aria-expanded', 'false'); });
    idle.hidden = false;
    box.classList.remove('has');
    readingTop = 0;
    unlockScroll();
    if (restoreFocus) focus(origin);
  };
  const select = book => {
    clearTimeout(intent);
    if (current !== book) {
      notes.forEach(note => { note.hidden = true; });
      books.forEach(item => { item.classList.toggle('on', item === book); item.setAttribute('aria-expanded', String(item === book)); });
      current = book;
      readingTop = 0;
      panel(book).hidden = false;
      idle.hidden = true;
      box.classList.add('has');
      onPull(panel(book), mobile.matches);
    }
    present();
  };
  books.forEach(book => {
    book.setAttribute('role', 'button');
    book.addEventListener('pointerenter', event => {
      if (mobile.matches || event.pointerType !== 'mouse') return;
      clearTimeout(intent);
      intent = setTimeout(() => select(book), 130);
    });
    book.addEventListener('pointerleave', () => clearTimeout(intent));
    book.addEventListener('focus', () => { if (!restoring && !mobile.matches) select(book); });
    book.addEventListener('click', event => {
      event.preventDefault();
      select(book);
      if (!mobile.matches && event.detail === 0) focus(panel(book).querySelector('.btn'));
    });
    book.addEventListener('keydown', event => {
      if (event.key !== ' ') return;
      event.preventDefault();
      book.click();
    });
  });
  notes.forEach(note => {
    const back = note.querySelector('[data-pback]');
    back.hidden = false;
    back.addEventListener('click', () => reset(true));
  });
  close.addEventListener('click', () => reset(true));
  drawer.addEventListener('cancel', event => { event.preventDefault(); reset(true); });
  drawer.addEventListener('close', () => { if (!drawer.open && mobile.matches && current) reset(true); });
  let backdropDown = false;
  const outside = event => {
    const rect = drawer.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  drawer.addEventListener('pointerdown', event => { backdropDown = event.target === drawer && outside(event); });
  drawer.addEventListener('click', event => {
    if (backdropDown && event.target === drawer && outside(event)) reset(true);
    backdropDown = false;
  });
  // showModal supplies inertness; explicit wrapping keeps Tab inside the reading controls.
  drawer.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...drawer.querySelectorAll('button, a[href]')].filter(element => !element.closest('[hidden]'));
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); focus(last); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); focus(first); }
  });
  box.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !drawer.open && current) { event.preventDefault(); reset(true); }
  });
  mobile.addEventListener('change', () => { clearTimeout(intent); present(); });
  box.classList.add('library-enhanced');
  reset();
}
