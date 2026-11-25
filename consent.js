/* Einwilligungsbaustein (Cookie-Hinweis).
   Die Website setzt derzeit keine Cookies und lädt keine fremden Dienste.
   Deshalb ist SERVICES leer und der Hinweis erscheint nicht.
   Erst wenn ein einwilligungspflichtiger Dienst eingebunden wird (z. B. Video, Karte, Statistik),
   hier eintragen. Inhalte solcher Dienste nur über das Attribut data-consent="<id>" laden:
   <script type="text/plain" data-consent="statistik" src="..."></script> oder
   <iframe data-consent="video" data-src="..."></iframe>
   Vorschau des Hinweises ohne eingetragene Dienste: Seite mit ?cookie-vorschau aufrufen. */
(function(){
 const SERVICES=[
  // {id:'video',name:'YouTube-Videos',text:'Videos werden erst nach Ihrer Zustimmung von YouTube (Google) geladen.'},
 ];
 const KEY='cj-consent-v1';
 const preview=new URLSearchParams(location.search).has('cookie-vorschau');
 const list=SERVICES.length?SERVICES:(preview?[{id:'beispiel',name:'Beispieldienst',text:'Nur zur Vorschau. Derzeit ist kein Dienst eingebunden.'}]:[]);
 if(!list.length)return;
 function read(){try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}}
 function save(v){if(preview)return;try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
 function apply(v){if(!v)return;document.querySelectorAll('[data-consent]').forEach(el=>{if(!v[el.dataset.consent]||el.dataset.consentDone)return;el.dataset.consentDone='1';if(el.tagName==='SCRIPT'){const s=document.createElement('script');[...el.attributes].forEach(a=>{if(a.name!=='type')s.setAttribute(a.name,a.value)});s.text=el.text;el.replaceWith(s)}else if(el.dataset.src){el.src=el.dataset.src}})}
 function open(){
  document.querySelector('.consent')?.remove();
  const current=read()||{};
  const box=document.createElement('section');
  box.className='consent';box.setAttribute('role','dialog');box.setAttribute('aria-labelledby','consent-title');
  box.innerHTML='<h2 id="consent-title">Ihre Auswahl zu externen Diensten</h2><p>Einige Inhalte dieser Website stammen von Drittanbietern. Sie werden erst geladen, wenn Sie zustimmen. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Fuß der Seite ändern. Mehr dazu im <a href="datenschutz.html">Datenschutz</a>.</p><fieldset><legend class="visually-hidden">Dienste</legend>'+list.map(s=>'<label><input type="checkbox" name="'+s.id+'"'+(current[s.id]?' checked':'')+'><span><strong>'+s.name+'</strong>'+s.text+'</span></label>').join('')+'</fieldset><div class="consent-actions"><button type="button" class="button" data-c="all">Alle zulassen</button><button type="button" class="button ghost" data-c="none">Nur notwendige</button><button type="button" class="consent-link" data-c="save">Auswahl speichern</button></div>';
  document.body.appendChild(box);
  box.querySelector('button').focus();
  box.addEventListener('click',e=>{const c=e.target.closest('[data-c]')?.dataset.c;if(!c)return;const v={};list.forEach(s=>{v[s.id]=c==='all'?true:c==='none'?false:box.querySelector('input[name="'+s.id+'"]').checked});save(v);apply(v);box.remove()});
 }
 const foot=document.querySelector('.footer-bottom span:last-child');
 if(foot){const b=document.createElement('button');b.type='button';b.className='consent-footer';b.textContent='Cookie-Einstellungen';b.addEventListener('click',open);foot.appendChild(b)}
 const stored=read();
 if(stored&&!preview)apply(stored);else open();
})();
