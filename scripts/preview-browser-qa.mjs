#!/usr/bin/env node
/**
 * Public, read-only HTTPS Cloudflare preview browser QA.
 * A Github Actions/Linux runner can independently catch issues hidden by the
 * local Mac's intermittent Chromium TLS transport. Never submits contact forms.
 */
import { chromium } from '@playwright/test';
import axe from 'axe-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const site = process.env.PREVIEW_URL;
const sha = process.env.EXPECTED_SHA;
if (!site || !sha) throw new Error('Set PREVIEW_URL and EXPECTED_SHA');
const url = new URL(site);
if (url.protocol !== 'https:' ||
    !/(?:^|\.)workers\.dev$|(?:^|\.)pages\.dev$/.test(url.hostname) ||
    url.pathname !== '/' || url.search || url.hash || url.username || url.password)
  throw new Error('Browser QA requires a canonical HTTPS Cloudflare preview root');
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('EXPECTED_SHA must be a full release SHA');

const base = url.origin;
const output = resolve(process.env.QA_OUTPUT_DIR || 'qa-artifacts');
await mkdir(output, { recursive: true });
const profiles = [
  { name:'desktop', width:1440, height:900, full:true },
  { name:'mobile', width:390, height:844, full:true, touch:true },
  { name:'tablet', width:768, height:1024 },
  { name:'laptop', width:1280, height:720 },
  { name:'wide', width:1728, height:1117 },
];
const allRoutes = [
  '/', '/about.html', '/work.html', '/library.html', '/press.html', '/notes.html',
  '/resume.html', '/work-surface-talent.html', '/work-etap.html', '/work-idara.html',
  '/work-honeycoin.html', '/work-rvysion.html', '/work-the-bredge.html'
];
const primaryRoutes = ['/', '/work-surface-talent.html','/about.html','/library.html','/press.html','/notes.html'];
const errors = [], observations = [], screenshots = [];
const record = (gate, route, profile, message) => errors.push({gate,route,profile,message:String(message).slice(0,360)});
const screenshot = async (page, name) => {
  const filename = join(output, name + '.png');
  await page.screenshot({path:filename,animations:'disabled',fullPage:false});
  screenshots.push(filename);
};
async function checkA11y(page, route, profile) {
  await page.addScriptTag({content:axe.source});
  const a = await page.evaluate(async () => window.axe.run(document,{
    runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}
  }));
  for (const issue of a.violations)
    record('accessibility',route,profile,issue.id + ': ' + issue.help + ': ' +
      issue.nodes.slice(0,2).map(n => n.target.join(' ')).join(' / '));
  return {passes:a.passes.length,violations:a.violations.length,incomplete:a.incomplete.length};
}
async function checkRoute(browser, profile, route) {
  const context = await browser.newContext({
    viewport:{width:profile.width,height:profile.height},
    reducedMotion:'reduce', hasTouch:profile.touch||false,
    isMobile:profile.touch||false, deviceScaleFactor:1
  });
  const page = await context.newPage();
  const firstPartyFailures=[],jsErrors=[],consoleErrors=[];
  page.on('requestfailed', request => {
    if (request.url().startsWith(base+'/') && !request.url().endsWith('.mp4'))
      firstPartyFailures.push(request.url() + ' ' + (request.failure()?.errorText || 'request failed'));
  });
  page.on('pageerror', error => jsErrors.push(error.message));
  page.on('console', msg => { if (msg.type()==='error')consoleErrors.push(msg.text()); });
  try {
    const response = await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(400);
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => {
      const doc=document.documentElement, h1=document.querySelector('h1');
      const h1Rect=h1?.getBoundingClientRect();
      return {
        title:document.title, h1Count:document.querySelectorAll('h1').length,
        mainCount:document.querySelectorAll('main').length,
        pageScrollWidth:doc.scrollWidth, clientWidth:doc.clientWidth,
        headingVisible:!!h1Rect && h1Rect.left >= -2 && h1Rect.right <= doc.clientWidth+2,
        brokenImages:[...document.images].filter(x => x.complete && x.naturalWidth === 0).map(x=>x.currentSrc||x.src),
        bodyTextLength:document.querySelector('main')?.textContent?.trim().length||0,
      };
    });
    if (response.status()!==200)record('HTTP',route,profile.name,'HTTP '+response.status());
    if (response.headers()['x-deploy-sha']!==sha)
      record('release-provenance',route,profile.name,'Unexpected deployed SHA');
    if (!/noindex/i.test(response.headers()['x-robots-tag']||''))
      record('preview-indexing',route,profile.name,'Preview missing noindex response header');
    if (new URL(page.url()).origin!==base)
      record('redirect',route,profile.name,'Navigated off preview origin');
    if (state.h1Count!==1 || state.mainCount!==1)
      record('semantics',route,profile.name,'Expected one H1 and one main landmark');
    if (!state.headingVisible)record('layout',route,profile.name,'H1 overflows viewport horizontally');
    if (state.pageScrollWidth>state.clientWidth+2)
      record('responsive',route,profile.name,'Horizontal page overflow '+state.pageScrollWidth+'/'+state.clientWidth);
    if (state.bodyTextLength < 100)record('content',route,profile.name,'Insufficient server-rendered main text');
    for(const source of state.brokenImages)
      record('media',route,profile.name,'Broken rendered image: '+source);
    const accessibility =
      (profile.name==='desktop'||profile.name==='mobile') && primaryRoutes.includes(route)
        ? await checkA11y(page,route,profile.name):null;
    if (route==='/' && ['desktop','mobile'].includes(profile.name))
      await screenshot(page,profile.name+'-home');
    if (route==='/work-surface-talent.html' && ['desktop','mobile'].includes(profile.name))
      await screenshot(page,profile.name+'-surface-talent');
    // Record requests after font, images, script, and a11y have had time to settle.
    for(const failure of firstPartyFailures)record('network',route,profile.name,failure);
    for(const jsError of jsErrors)record('javascript',route,profile.name,jsError);
    observations.push({route,profile:profile.name,status:response.status(),sha:response.headers()['x-deploy-sha'],
      ...state,accessibility,requestFailures:firstPartyFailures.length,
      scriptErrors:jsErrors.length,consoleErrors:consoleErrors.slice(0,5)});
  } catch(e) {
    record('browser-navigation',route,profile.name,e.message);
  } finally {
    await context.close();
  }
}
async function interactionChecks(browser) {
  {
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const page=await context.newPage();
    try{
      await page.goto(base+'/',{waitUntil:'domcontentloaded'});
      const toggle=page.locator('button.menu-btn:visible').first();
      await toggle.click({timeout:7000});
      if(await toggle.getAttribute('aria-expanded')!=='true')record('mobile-menu','/','mobile','Menu did not open');
      await page.locator('nav[aria-label="Site"] a[href*="about"]').first().click({timeout:7000});
      await page.waitForURL(/about\.html/, {timeout:14000});
    }catch(e){record('mobile-menu','/','mobile',e.message)}
    try{
      await page.goto(base+'/work-surface-talent.html',{waitUntil:'domcontentloaded'});
      const sketch=page.locator('figure.sketch').first();
      await sketch.scrollIntoViewIfNeeded();
      await sketch.focus();
      const before=await sketch.evaluate(el=>({focus:document.activeElement===el,left:el.scrollLeft,range:el.scrollWidth-el.clientWidth}));
      if(!before.focus || before.range<=0)record('diagram-focus','/work-surface-talent.html','mobile','Scrollable diagram not focusable');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(350);
      const after=await sketch.evaluate(el=>el.scrollLeft);
      if(after<=before.left)record('diagram-keyboard','/work-surface-talent.html','mobile','ArrowRight did not scroll focused diagram');
    }catch(e){record('diagram','/work-surface-talent.html','mobile',e.message)}
    await context.close();
  }
  {
    const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
    const page=await context.newPage();
    try{
      await page.goto(base+'/',{waitUntil:'domcontentloaded'});
      const visible=page.locator('button[data-letter="hello"]:visible').first();
      await visible.click({timeout:7000});
      const dialog=page.locator('dialog.letter');
      if (!(await dialog.evaluate(x=>x.open)))record('contact-open','/','desktop','Contact dialog did not open');
      await dialog.locator('button[data-close]').first().click({timeout:7000});
      if (await dialog.evaluate(x=>x.open))record('contact-close','/','desktop','Contact dialog did not close');
      // Do not submit the form or create any real third-party records.
    }catch(e){record('contact','/','desktop',e.message)}
    try{
      const missing=await page.goto(base+'/qa-nonexistent-resource-20261015',{waitUntil:'domcontentloaded'});
      if(missing.status()!==404)record('not-found','/qa-nonexistent-resource-20261015','desktop','Expected real HTTP 404');
      await page.goto(base+'/index.html',{waitUntil:'domcontentloaded'});
      if(page.url()!==base+'/')record('redirect','/index.html','desktop','Expected canonical home redirect');
    }catch(e){record('navigation','/','desktop',e.message)}
    await context.close();
  }
}
const browser=await chromium.launch({headless:true});
try {
 for(const profile of profiles) {
   const routes=profile.full?allRoutes:primaryRoutes;
   for(const route of routes)await checkRoute(browser,profile,route);
   console.log('QA_PROFILE',profile.name,'checked',routes.length,'failures',errors.length);
 }
 await interactionChecks(browser);
} finally { await browser.close(); }
const report={preview:base,sha,testedAt:new Date().toISOString(),browser:'Playwright Chromium on CI Linux',
  checks:observations.length,profiles:profiles.map(({name,width,height})=>({name,width,height})),
  passed:errors.length===0,errors,observations,screenshots};
await writeFile(join(output,'browser-qa.json'),JSON.stringify(report,null,2)+'\n');
console.log('BROWSER_QA',JSON.stringify({passed:report.passed,checks:report.checks,issues:errors.length,
  issueSamples:errors.slice(0,8),screenshots:screenshots.length}));
if(errors.length)process.exitCode=1;
