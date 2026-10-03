const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ring = '<svg class="metric-ring" viewBox="0 0 200 75" preserveAspectRatio="none" aria-hidden="true"><path d="M 188 29 C 202 60, 171 74, 90 69 C 13 65, -3 48, 8 25 C 19 3, 131 -4, 178 17 C 193 22, 196 43, 179 56"/></svg>';
  const workflow = '<div class="workflow-study"><span>the decision stays human</span><div class="workflow-line"><span>Source &amp; intake</span><i>↓</i></div><div class="workflow-line"><span>Writer + independent grader</span><i>↓</i></div><div class="workflow-line"><span>Recruiter sign-off</span><i>✓</i></div><small>Editorial workflow drawing</small></div>';
export function projectMarkup(PROJECTS, SKETCHES) {
    return PROJECTS.map((p, index) => {
      const sketch = SKETCHES[p.id];
      return `<article class="project-row" id="project-${p.id}" aria-labelledby="title-${p.id}">
        <div class="project-identity"><span class="project-number">${String(index + 1).padStart(2,'0')} / ${escapeHTML(p.sector)}</span><h3 class="project-name" id="title-${p.id}">${escapeHTML(p.name)}</h3><p class="project-meta">${escapeHTML(p.geography)}<br>${escapeHTML(p.period)}</p><p class="project-role">${escapeHTML(p.role)}</p><a class="case-open" href="/work/${p.id}/"><span>Read case</span><span class="arrow-relay" aria-hidden="true"><i>↗</i><i>↗</i></span></a></div>
        <div class="project-summary"><p class="project-headline">${escapeHTML(p.headline)}</p><div class="metric ${p.id==='surface'||p.id==='bredge'?'word-metric':''}">${escapeHTML(p.id==='surface'?'Sign-off':p.id==='bredge'?'3 ways':p.metric)}${ring}</div><p class="metric-label">${escapeHTML(p.metricLabel)}</p></div>
        <div class="project-visual">${sketch ? `<div class="sketch-pair"><img src="/img/${sketch}-sketch.jpg" alt="Modern drawn interpretation of ${escapeHTML(p.name)}’s supplied product screenshot" loading="lazy"><img class="shot-colour" src="/img/${sketch}.jpg" alt="${escapeHTML(p.shots.find(s=>s[0]===sketch)?.[1]||p.shots[0][1])}" loading="lazy"></div><div class="visual-controls"><button type="button" class="colour-toggle" aria-pressed="false">Show colour ↗</button><button type="button" class="zoom-thumb" data-zoom="${p.id}" aria-label="View ${escapeHTML(p.name)} images larger">View larger +</button></div><span class="visual-caption">Modern screenshot study → supplied product image</span>` : workflow}</div>
      </article>`;
    }).join('');
  }
