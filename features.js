/* Fonctions ajoutées : couleurs par section, série de prières, rappels vidéo, compte, partage.
   Chargé AVANT le script de index.html : seules des fonctions sont définies ici (elles utilisent
   $, t, store, esc, mq, MOSQUEES, toast… au moment de l'appel, pas au chargement).
   Prototype : données fictives, rien n'est envoyé, aucune base de données. */

/* ---------- couleurs par section (comme Snap : une couleur par fonction) ---------- */
const SECTION_COLORS={
 map:['#0B8F7A','#08705F'],      // vert : carte
 prayers:['#0A7EA4','#07627F'],  // turquoise : prières
 rappels:['#7B3FB5','#62308F'],  // violet : vidéos
 stories:['#C2610C','#9C4C09'],  // orange : actualités des mosquées
 rdv:['#2F6FE4','#2556B6'],      // bleu : messages / covoiturage
 more:['#4A5A6A','#38454F']
};
function applySectionColor(tab){
 const c=SECTION_COLORS[tab]||SECTION_COLORS.map,r=document.documentElement.style;
 r.setProperty('--brand',c[0]);r.setProperty('--brand-d',c[1]);
 const m=document.querySelector('meta[name=theme-color]');if(m)m.content=c[0];
}

/* ---------- icônes ---------- */
// Personne, mains levées à hauteur des épaules (takbir). Il n'existe pas d'émoji équivalent : icône à faire redessiner.
const ICON_TAKBIR='<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M12 7v8M12 15l-2.5 6M12 15l2.5 6M10 8.5 6 11V7M14 8.5 18 11V7"/></svg>';
const ICON_RAP='<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="4"/><path d="m10 9 5 3-5 3z"/></svg>';
const ICON_USER='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5"/></svg>';
const ICON_HEART='<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>';
const ICON_CMT='<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
const ICON_SHARE='<svg viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3M7 8l5-5 5 5"/></svg>';

/* ---------- série de prières (la « flamme ») ---------- */
const STREAK_MIN=1; // prières déclarées nécessaires pour valider un jour. RÈGLE PROVISOIRE, à confirmer par Kevin/Aziz.
const MILESTONES=[3,7,14,30,100];
const dayKey=d=>{const x=d||new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
let _prayed=null;
const prayedMap=()=>_prayed||(_prayed=store.get('prayed',{}));
const PRAYED_KEYS=['fajr','dhuhr','asr','maghrib','isha'];
function streakCount(){
 const P=prayedMap(),d=new Date();let n=0;
 if((P[dayKey(d)]||[]).length<STREAK_MIN)d.setDate(d.getDate()-1); // la série ne casse qu'à la fin de la journée
 while((P[dayKey(d)]||[]).length>=STREAK_MIN){n++;d.setDate(d.getDate()-1)}
 return n;
}
function renderStreakBadge(){
 const b=$('#streakBtn');if(!b)return;
 b.innerHTML=ICON_TAKBIR+'<b>'+streakCount()+'</b>';
 b.setAttribute('aria-label',t('serieBadge')+' : '+streakCount());
}
function renderSerie(){
 const box=$('#serieBox');if(!box)return;
 const P=prayedMap(),today=P[dayKey()]||[],n=streakCount();
 const dots=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ok=(P[dayKey(d)]||[]).length>=STREAK_MIN;return '<i class="dot '+(ok?'on':'')+'" title="'+dayKey(d)+'"></i>'}).join('');
 box.innerHTML=`<div class="card serie"><div class="row"><div class="flame">${ICON_TAKBIR}</div><div class="grow"><h2>${t('serie')}</h2><div class="muted">${n?t('serieDays',{n}):t('serieStart')}</div></div></div>
 <div class="dots">${dots}</div><div class="small" style="margin:12px 0 8px">${t('serieToday')}</div>
 <div class="chips" style="margin:0">${PRAYED_KEYS.map(k=>`<button class="chip ${today.includes(k)?'on':''}" data-pr="${k}" aria-pressed="${today.includes(k)}">${t(k)}</button>`).join('')}</div>
 <p class="small" style="margin-top:10px">${t('serieNote',{n:STREAK_MIN})}</p></div>`;
}
function togglePrayed(k){
 const P=prayedMap(),key=dayKey(),before=streakCount();
 const L=P[key]||[],i=L.indexOf(k);
 if(i>=0)L.splice(i,1);else L.push(k);
 if(L.length)P[key]=L;else delete P[key];
 store.set('prayed',P);
 const after=streakCount();
 if(after>before&&MILESTONES.includes(after))toast(t('serieMile',{n:after}));
 renderSerie();renderStreakBadge();
}

/* ---------- rappels vidéo (flux vertical à swiper) ---------- */
// Vidéos FICTIVES : aucun média réel n'est lu. Les vraies vidéos viendront des mosquées autorisées (droits écrits)
// ou d'un lecteur officiel intégré ; jamais de copie de TikTok/YouTube sans accord.
const RAPPELS=[
 {id:'v1',m:1,type:'short',dur:'0:30',q:'rq1',s:'rs1'},
 {id:'v2',m:3,type:'short',dur:'0:42',q:'rq2',s:'rs2'},
 {id:'v3',m:6,type:'short',dur:'0:25',q:'rq3',s:'rs3'},
 {id:'v4',m:2,type:'long',dur:'12:10',q:'rq4',s:'rs4'},
 {id:'v5',m:5,type:'long',dur:'18:45',q:'rq5',s:'rs5'},
 {id:'v6',m:1,type:'live',dur:'',q:'rqLive',s:'rsLive'}
];
const REACTIONS=['cm0','cm1','cm2','cm3','cm4','cm5'];
let rapFilter='short',_rap=null;
const rapState=()=>_rap||(_rap=store.get('rap',{likes:{},cmts:{}}));
function renderRappels(){
 const tabs=$('#rapTabs'),feed=$('#feed');if(!tabs||!feed)return;
 tabs.innerHTML=[['short','fShort'],['long','fLong'],['live','fLive']].map(([k,l])=>`<button class="chip ${rapFilter===k?'on':''}" data-f="${k}">${t(l)}</button>`).join('');
 const S=rapState(),list=RAPPELS.filter(r=>r.type===rapFilter);
 feed.scrollTop=0;
 feed.innerHTML=list.length?list.map(r=>{
  const m=mq(r.m),liked=!!S.likes[r.id],nc=(S.cmts[r.id]||[]).length;
  return `<article class="clip" data-id="${r.id}" style="background:linear-gradient(165deg,${m.color},#101418 85%)">
   <span class="demoTag">${t('demoTag')}</span>${r.type==='live'?`<span class="liveBadge">${t('live')}</span>`:''}
   <button class="playBig" data-play aria-label="play">▶</button>
   <div class="clipBody"><div class="who">${esc(m.nom)}${r.dur?` · ${r.dur}`:''}</div><p class="quote">${t(r.q)}</p><div class="small" style="color:#fff;opacity:.85">${t(r.s)}</div></div>
   <div class="rail">
    <button class="railBtn ${liked?'on':''}" data-like aria-label="${t('like')}" aria-pressed="${liked}">${ICON_HEART}${liked?'<span>1</span>':''}</button>
    <button class="railBtn" data-cmt aria-label="${t('react')}">${ICON_CMT}${nc?`<span>${nc}</span>`:''}</button>
    <button class="railBtn" data-share aria-label="${t('shareBtn')}">${ICON_SHARE}</button>
   </div><div class="prog"><i></i></div></article>`}).join(''):`<div class="clip empty"><p>${t('noLive')}</p></div>`;
}
function playSim(clip){
 const bar=clip.querySelector('.prog i'),btn=clip.querySelector('.playBig'),on=!clip.classList.contains('playing');
 clip.classList.toggle('playing',on);btn.textContent=on?'❚❚':'▶';
 bar.style.transition=on?'width 20s linear':'none';bar.style.width=on?'100%':'0';
 if(on)toast(t('playSim'));
}
function reactSheet(id){
 const S=rapState(),mine=S.cmts[id]||[];
 $('#sheet').innerHTML=`<h2 style="margin-bottom:6px">${t('react')}</h2><p class="small" style="margin-bottom:12px">${t('reactHint')}</p>
 <div class="chips" style="margin:0 0 12px">${REACTIONS.map(k=>`<button class="chip" data-cm="${k}">${t(k)}</button>`).join('')}</div>
 ${mine.map(k=>`<div class="bubble me">${t(k)}</div>`).join('')}<div style="height:8px"></div><button class="btn ghost" id="cmx">${t('close')}</button>`;
 $('#sheet').classList.add('on');$('#sheet').dataset.clip=id;$('#cmx').onclick=()=>$('#sheet').classList.remove('on');
}
async function shareClip(id){
 const r=RAPPELS.find(x=>x.id===id),m=mq(r.m),text='« '+t(r.q)+' » — '+m.nom,url=location.href.split('#')[0];
 if(navigator.share){try{await navigator.share({title:'Masdjid',text,url});return}catch(e){if(e&&e.name==='AbortError')return}}
 window.open('https://wa.me/?text='+encodeURIComponent(text+' '+url),'_blank','noopener');
}
function initRappels(){
 $('#serieBox').onclick=e=>{const b=e.target.closest('[data-pr]');if(b)togglePrayed(b.dataset.pr)};
 $('#rapTabs').onclick=e=>{const b=e.target.closest('[data-f]');if(b){rapFilter=b.dataset.f;renderRappels()}};
 $('#feed').onclick=e=>{
  const c=e.target.closest('.clip');if(!c||!c.dataset.id)return;const id=c.dataset.id;
  if(e.target.closest('[data-play]'))return playSim(c);
  if(e.target.closest('[data-like]')){const S=rapState();if(S.likes[id])delete S.likes[id];else S.likes[id]=1;store.set('rap',S);return renderRappelsKeep(id)}
  if(e.target.closest('[data-cmt]'))return reactSheet(id);
  if(e.target.closest('[data-share]'))return shareClip(id);
 };
 $('#sheet').addEventListener('click',e=>{
  const b=e.target.closest('[data-cm]');if(!b)return;const id=$('#sheet').dataset.clip,S=rapState();
  (S.cmts[id]=S.cmts[id]||[]).push(b.dataset.cm);store.set('rap',S);reactSheet(id);renderRappelsKeep(id);
 });
}
function renderRappelsKeep(id){const f=$('#feed'),y=f.scrollTop;renderRappels();f.scrollTop=y}

/* ---------- compte : e-mail OU téléphone (maquette locale, rien n'est envoyé) ---------- */
let _acc;
const getAccount=()=>_acc===undefined?(_acc=store.get('account',null)):_acc;
const validEmail=v=>/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v);
const validPhone=v=>/^\+?[0-9 .\-]{9,18}$/.test(v)&&v.replace(/\D/g,'').length>=9;
const maskContact=a=>a.kind==='email'?a.value.replace(/^(.).*(@.*)$/,'$1•••$2'):a.value.replace(/\d(?=\d{2})/g,'•');
let acKind='email';
function renderAccount(){
 const a=getAccount(),body=$('#accountBody');if(!body)return;
 if(a){
  body.innerHTML=`<div class="card row"><div class="ico" style="width:56px;height:56px">${ICON_USER}</div><div class="grow"><h2>${t('acHello')}</h2><div class="muted" dir="ltr">${esc(maskContact(a))}</div></div></div>
  <button class="btn ghost" id="acOut">${t('acOut')}</button><p class="small" style="margin-top:12px">${t('acNote')}</p>`;
  $('#acOut').onclick=()=>{_acc=null;store.set('account',null);renderAccount()};return;
 }
 body.innerHTML=`<label>${t('acKind')}</label><div class="chips" style="margin:6px 0 12px"><button class="chip ${acKind==='email'?'on':''}" data-ak="email">${t('acEmail')}</button><button class="chip ${acKind==='phone'?'on':''}" data-ak="phone">${t('acPhone')}</button></div>
 <input class="field" id="acVal" dir="ltr" autocomplete="${acKind==='email'?'email':'tel'}" inputmode="${acKind==='email'?'email':'tel'}" placeholder="${esc(t('acPh_'+acKind))}">
 <button class="btn" id="acOk">${t('acCreate')}</button><p class="small" style="margin-top:12px">${t('acNote')}</p>`;
 body.querySelectorAll('[data-ak]').forEach(b=>b.onclick=()=>{acKind=b.dataset.ak;renderAccount()});
 $('#acOk').onclick=()=>{
  const v=$('#acVal').value.trim();
  if(!(acKind==='email'?validEmail(v):validPhone(v)))return toast(t('acBad'));
  _acc={kind:acKind,value:v};store.set('account',_acc);toast(t('acSaved'));renderAccount();
 };
}

/* ---------- covoiturage : formule « Rendez-vous à [lieu] pour aller à la mosquée » ---------- */
const MEET_PLACES=['entry','parking','bus'];

/* ---------- covoiturage séparé : les sœurs avec les sœurs, les frères avec les frères ---------- */
// Maquette : le choix est déclaratif et stocké sur le téléphone. La vraie version devra le contrôler côté serveur
// (et prévoir une vérification, sinon rien n'empêche de déclarer l'autre genre).
let _gender;
const getGender=()=>_gender===undefined?(_gender=store.get('gender',null)):_gender;
function genderChips(){
 const g=getGender();
 return `<div class="chips" style="margin:0 0 16px"><button class="chip ${g==='brother'?'on':''}" data-g="brother" aria-pressed="${g==='brother'}">${t('brother')}</button><button class="chip ${g==='sister'?'on':''}" data-g="sister" aria-pressed="${g==='sister'}">${t('sister')}</button></div>`;
}
function genderBarHtml(){
 const g=getGender();
 return `<div class="card"><div class="small" style="margin-bottom:8px">${t('iAm')}</div>${genderChips()}<p class="small">${g==='sister'?t('womenOnly'):g==='brother'?t('menOnly'):t('pickGender')}</p><p class="small" style="margin-top:6px">${t('genderNote')}</p></div>`;
}
let _pendingRdv=null;
function setGender(g){
 if(g!=='brother'&&g!=='sister')return;
 _gender=g;store.set('gender',g);
 if(cur==='rdv')renderRdv();
}
function initGender(){
 const h=e=>{
  const b=e.target.closest('[data-g]');if(!b)return;
  setGender(b.dataset.g);
  if($('#sheet').classList.contains('on')&&!$('#rm')){const p=_pendingRdv||[];_pendingRdv=null;newRdvSheet(p[0],p[1])}
 };
 $('#genderBox').onclick=h;$('#sheet').addEventListener('click',h);
}

/* ---------- cours des mosquées (+ covoiturage pour aller aux cours) ---------- */
// Cours de DÉMONSTRATION attachés à la « mosquée démo » uniquement : aucun horaire inventé pour une vraie mosquée.
// d : 1 = lundi … 7 = dimanche ; a : 'all' | 'men' | 'women'
const COURS_DEMO=[
 {id:'cd1',m:99,d:3,h:'20:30',k:'cTitle1',a:'men'},
 {id:'cd2',m:99,d:6,h:'14:00',k:'cTitle2',a:'women'},
 {id:'cd3',m:99,d:2,h:'19:00',k:'cTitle3',a:'all'}
];
let _cours;
const myCours=()=>_cours||(_cours=store.get('cours99',[]));
const allCours=()=>COURS_DEMO.concat(myCours().map(c=>({...c,m:99})));
const dayName=d=>{try{return new Date(2024,0,d).toLocaleDateString(lang,{weekday:'long'})}catch(e){return String(d)}}; // 1er janv. 2024 = lundi
const courseTitle=c=>c.title||t(c.k);
const audLabel=a=>t(a==='men'?'audMen':a==='women'?'audWomen':'audAll');
const courseAllowed=(c,g)=>c.a==='all'||(c.a==='men'&&g==='brother')||(c.a==='women'&&g==='sister');
const courseLabel=c=>courseTitle(c)+' — '+dayName(c.d)+' '+c.h;
function rdvTargets(mid,g){
 const out=PRAYERS.map(p=>({v:p,label:t(p)}));
 allCours().filter(c=>c.m===mid&&courseAllowed(c,g)).forEach(c=>out.push({v:'course:'+c.id,label:t('courseOpt')+' : '+courseLabel(c)}));
 return out;
}
function rdvTargetLabel(p){
 if(String(p).startsWith('course:')){const c=allCours().find(x=>x.id===p.slice(7));return t('courseOpt')+(c?' : '+courseLabel(c):'')}
 return t(p);
}
function renderCours(){
 const body=$('#coursBody');if(!body)return;
 const isM=role==='mosquee',list=allCours().slice().sort((x,y)=>x.d-y.d||x.h.localeCompare(y.h)),byM={};
 list.forEach(c=>(byM[c.m]=byM[c.m]||[]).push(c));
 let h=`<p class="small" style="margin-bottom:12px">${t('coursNote')}</p>`;
 h+=Object.keys(byM).map(mid=>`<div class="card"><h2 style="margin-bottom:4px">${esc(mq(+mid).nom)} <span class="small">${t('demoTag')}</span></h2>${byM[mid].map(c=>`<div class="set"><div class="grow"><b>${esc(courseTitle(c))}</b><div class="small">${esc(dayName(c.d))} · ${c.h} · ${audLabel(c.a)}</div></div>${isM&&String(c.id).startsWith('u')?`<button class="chip" data-cdel="${c.id}" aria-label="${t('delCours')}">×</button>`:''}<button class="chip" data-cc="${c.id}" data-cmos="${mid}">${t('carpool')}</button></div>`).join('')}</div>`).join('');
 h+=`<div class="card"><div class="small">${t('coursEmpty')}</div></div>`;
 if(isM)h+=`<div class="card"><h2 style="margin-bottom:8px">${t('addCours')}</h2><input class="field" id="cTitle" maxlength="60" placeholder="${esc(t('cPh'))}"><select id="cDay">${[1,2,3,4,5,6,7].map(d=>`<option value="${d}">${esc(dayName(d))}</option>`).join('')}</select><input class="field" id="cTime" type="time" value="20:00"><select id="cAud"><option value="all">${t('audAll')}</option><option value="men">${t('audMen')}</option><option value="women">${t('audWomen')}</option></select><button class="btn" id="cAdd">${t('addCours')}</button></div>`;
 body.innerHTML=h;
}
function initCours(){
 $('#coursBody').onclick=e=>{
  const c=e.target.closest('[data-cc]');
  if(c){_pendingRdv=[+c.dataset.cmos,'course:'+c.dataset.cc];return newRdvSheet(_pendingRdv[0],_pendingRdv[1])}
  const d=e.target.closest('[data-cdel]');
  if(d){const L=myCours().filter(x=>x.id!==d.dataset.cdel);_cours=L;store.set('cours99',L);return renderCours()}
  if(e.target.closest('#cAdd')){
   const title=$('#cTitle').value.trim(),h=$('#cTime').value,day=+$('#cDay').value,a=$('#cAud').value;
   if(!title||title.length>60||!/^\d{2}:\d{2}$/.test(h)||!(day>=1&&day<=7)||!['all','men','women'].includes(a))return toast(t('cBad'));
   const L=myCours().concat([{id:'u'+Date.now(),d:day,h,a,title}]);_cours=L;store.set('cours99',L);toast(t('cAdded'));renderCours();
  }
 };
}
