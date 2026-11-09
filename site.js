const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#navigation');toggle?.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));toggle.setAttribute('aria-label',expanded?'Menü öffnen':'Menü schließen');nav.classList.toggle('open',!expanded)});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open')}});const context=new URLSearchParams(location.search).get('anliegen');const subjects={spenden:'Frage zu Spende oder Spendenbescheinigung',idee:'Eigene Förderidee – erstes Gespräch',cooktastic:'Cooktastic unterstützen','house-of-hope':'House of Hope and Glory unterstützen',foerdern:'Ein bestehendes Projekt fördern','don-bosco-sachsen':'Don Bosco Sachsen unterstützen'};const mail=document.querySelector('#contact-mail');if(mail&&subjects[context])mail.href='mailto:info@chance-jugend.de?subject='+encodeURIComponent(subjects[context]);
// Explore project details through hover, keyboard focus, click or touch.
const explorer=document.querySelector('.map-explorer');
if(explorer){
 const defaultEntries={
  praxis:{image:'assets/cooktastic-3.jpg',alt:'Ein Cooktastic-Teilnehmer arbeitet mit frischen Zutaten in der Küche',title:'In der Küche lernen',text:'Handgriffe üben, Zutaten verarbeiten und das Gelernte anwenden: Praktische Arbeit ist Teil der Ausbildung bei Cooktastic.',href:'#ausbildung',link:'Mehr zur Ausbildung ↗'},
  ausbildung:{image:'assets/cooktastic-2.jpg',alt:'Ein junger Koch beim Projekt Cooktastic',title:'Ausbildung mit Anschluss',text:'Auf Theorie und Praxis folgt eine Phase bei Partnerbetrieben. Dort können die Teilnehmenden ihre Fähigkeiten vertiefen und Kontakte knüpfen.',href:'#perspektive',link:'Die berufliche Perspektive ansehen ↗'},
  perspektive:{image:'assets/cooktastic-1.jpg',alt:'Ein junger Koch im Restaurant beim Projekt Cooktastic',title:'Den nächsten Schritt ermöglichen',text:'Sie möchten berufliche Chancen fördern? Im Gespräch klären wir, welche Unterstützung das Projekt aktuell braucht.',href:'kontakt.html?anliegen=cooktastic',link:'Über Cooktastic sprechen ↗'}
 };
 const mapData=document.querySelector('#map-data');
 const entries=mapData?JSON.parse(mapData.textContent):defaultEntries;
 const points=[...document.querySelectorAll('[data-map-point]')];
 const intro=explorer.querySelector('.map-intro');
 const detail=explorer.querySelector('.map-detail');
 const image=explorer.querySelector('#map-detail-image');
 const title=explorer.querySelector('#map-detail-title');
 const text=explorer.querySelector('#map-detail-text');
 const link=explorer.querySelector('#map-detail-link');
 let active=null,suppressFocus=false;
 function placeDetail(){
  if(!active||!matchMedia('(min-width:801px)').matches){explorer.style.top='';return;}
  const mountain=explorer.closest('.mountain').getBoundingClientRect();
  const header=document.querySelector('.header').getBoundingClientRect();
  const desired=Math.max(6,header.bottom+14-mountain.top);
  explorer.style.top=Math.min(desired,Math.max(6,mountain.height-explorer.offsetHeight-12))+'px';
 }
 window.addEventListener('scroll',placeDetail,{passive:true});
 window.addEventListener('resize',placeDetail);

 function show(point){const entry=entries[point.dataset.mapPoint];if(!entry)return;active=point;points.forEach(p=>p.setAttribute('aria-expanded',String(p===point)));image.src=entry.image;image.alt=entry.alt;title.textContent=entry.title;text.textContent=entry.text;link.href=entry.href;link.textContent=entry.link;intro.hidden=true;detail.hidden=false;placeDetail();}
 function close(restoreFocus){const previous=active;active=null;points.forEach(p=>p.setAttribute('aria-expanded','false'));detail.hidden=true;intro.hidden=false;explorer.style.top='';if(restoreFocus&&previous){suppressFocus=true;previous.focus();suppressFocus=false;}}
 points.forEach(point=>{point.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&active!==point)show(point)});point.addEventListener('focus',()=>{if(!suppressFocus)show(point)});point.addEventListener('click',()=>{show(point);if(matchMedia('(max-width:800px)').matches)explorer.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});});
 explorer.querySelector('.map-close').addEventListener('click',()=>close(true));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();close(true);}});
}

const filters=[...document.querySelectorAll('[data-filter]')];
filters.forEach(button=>button.addEventListener('click',()=>{
 const region=button.dataset.filter;
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-region]').forEach(item=>item.hidden=region!=='alle'&&item.dataset.region!==region);
 const count=[...document.querySelectorAll('.selected-projects .project-card')].filter(c=>!c.hidden).length;
 const directoryCount=[...document.querySelectorAll('.project-directory li')].filter(c=>!c.hidden).length;
 document.querySelector('#filter-status').textContent=count+(count===1?' Projektgeschichte · ':' Projektgeschichten · ')+directoryCount+' Einträge im Verzeichnis';
 document.querySelector('.filter-empty').hidden=count!==0;
}));

const copyIban=document.querySelector('#copy-iban');
copyIban?.addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{
  await navigator.clipboard.writeText('DE29770500000302378716');
  status.textContent='Die IBAN wurde kopiert.';
 }catch{
  status.textContent='Bitte markieren und kopieren Sie die IBAN oben.';
 }
});
