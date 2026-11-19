/* Ajouts du 15/11/2026 : profil (emoji + position), trajets validés, demande d'ajout de mosquée,
   page mosquée (QR code : dons + covoiturage + horaires), bandeau et notification avant la prière.
   Chargé AVANT le script de index.html : seules des fonctions et constantes sont définies ici.
   Prototype : tout reste sur le téléphone (localStorage). Rien n'est envoyé à un serveur. */

/* ---------- profil : pseudo, emoji, position ---------- */
// Emojis SANS visage ni yeux (objets, nature, symboles) : demande de Kevin.
const PROFILE_EMOJIS=['🚗','🚙','🚐','🛵','🚲','🕌','🌙','⭐','✨','📿','📖','🌴','🌿','🍃','🌳','🌵','🌹','🌸','💎','🧭','⛰️','🌊','☀️','⚽','🏀','🎒','☕','🔑','🧱','💡'];
let _prof;
const getProfile=()=>_prof||(_prof=store.get('profile',{pseudo:'',emoji:'',share:false,at:0,prayNotif:false}));
const saveProfile=()=>{store.set('profile',_prof);refreshMeMarker();if(typeof renderMeBtn==='function')renderMeBtn()};
const myEmoji=()=>getProfile().emoji||'🚗';
const myName=()=>getProfile().pseudo||t('me');
const hasMyPos=()=>getProfile().share&&getProfile().at>0;

function profileHtml(){
 const P=getProfile(),mins=P.at?Math.max(0,Math.round((Date.now()-P.at)/60000)):null;
 return `<div class="card"><h2 style="margin-bottom:4px">${t('profTitle')}</h2><p class="small" style="margin-bottom:12px">${t('profHint')}</p>
  <label>${t('pseudo')}</label><input class="field" id="pfName" maxlength="20" value="${esc(P.pseudo)}" placeholder="${esc(t('pseudoPh'))}">
  <label>${t('pickEmoji')}</label><div class="emojis">${PROFILE_EMOJIS.map(e=>`<button class="emo ${P.emoji===e?'on':''}" data-emo="${e}" aria-pressed="${P.emoji===e}">${e}</button>`).join('')}</div>
  <div class="set"><div class="grow"><b>${t('sharePos')}</b><div class="small">${t('sharePosD')}</div></div><button class="sw ${P.share?'on':''}" id="pfShare" role="switch" aria-checked="${!!P.share}" aria-label="${esc(t('sharePos'))}"></button></div>
  ${P.share?`<div class="row" style="margin-top:12px"><div class="emk big">${esc(myEmoji())}</div><div class="grow"><b>${esc(myName())}</b><div class="small">${P.at?t('posAge',{n:mins}):t('posNone')}</div></div></div>
  <div class="row" style="margin-top:12px;gap:8px"><button class="btn" id="pfPos">${t('posUpdate')}</button><button class="btn ghost" id="pfMap">${t('posSee')}</button></div>`:''}
  <p class="small" style="margin-top:12px">${t('posPrivacy')}</p></div>`;
}
function prayerPrefsHtml(){
 const P=getProfile();
 return `<div class="card"><h2 style="margin-bottom:4px">${t('myPrayerTimes')}</h2><p class="small" style="margin-bottom:8px">${t('myPrayerTimesD')}</p>
  <select id="pfPm"><option value="0">${t('cityTlse')}</option>${MOSQUEES.map(m=>`<option value="${m.id}" ${m.id===prayMosque?'selected':''}>${esc(m.nom)}</option>`).join('')}</select>
  <div class="set" style="border:0;padding-top:4px"><div class="grow"><b>${t('prayNotif')}</b><div class="small">${t('prayNotifD')}</div></div><button class="sw ${P.prayNotif?'on':''}" id="pfNotif" role="switch" aria-checked="${!!P.prayNotif}" aria-label="${esc(t('prayNotif'))}"></button></div>
  <div class="row" style="gap:8px;margin-top:8px"><button class="btn ghost" id="pfTestBan">${t('testBanner')}</button><button class="btn ghost" id="pfTestNot">${t('testNotif')}</button></div>
  <p class="small" style="margin-top:12px">${t('notifLimit')}</p></div>`;
}
function bindProfile(){
 const P=getProfile(),body=$('#accountBody');
 const n=$('#pfName');if(n)n.onchange=()=>{P.pseudo=n.value.trim().slice(0,20);saveProfile();toast(t('saved'))};
 body.querySelectorAll('[data-emo]').forEach(b=>b.onclick=()=>{P.emoji=b.dataset.emo;saveProfile();renderAccount()});
 const sh=$('#pfShare');if(sh)sh.onclick=()=>{P.share=!P.share;if(!P.share)P.at=0;saveProfile();renderAccount();if(P.share)locateMe()};
 const up=$('#pfPos');if(up)up.onclick=locateMe;
 const sm=$('#pfMap');if(sm)sm.onclick=()=>{go('map');setTimeout(()=>{if(map)map.flyTo([pos.lat,pos.lng],15,{duration:.6})},120)};
 const pm=$('#pfPm');if(pm)pm.onchange=()=>{prayMosque=+pm.value;store.set('pm',prayMosque);fillPm();loadTimes();toast(t('saved'))};
 const no=$('#pfNotif');if(no)no.onclick=async()=>{
  if(!P.prayNotif){const ok=await askNotifPermission();if(!ok)return toast(t('notifRefused'))}
  P.prayNotif=!P.prayNotif;saveProfile();renderAccount();
 };
 const tb=$('#pfTestBan');if(tb)tb.onclick=()=>{_banTest=Date.now()+60000;go('rappels');checkPrayerTime()};
 const tn=$('#pfTestNot');if(tn)tn.onclick=async()=>{const ok=await askNotifPermission();if(!ok)return toast(t('notifRefused'));showPrayNotif(nextPrayer().k,15,true)};
}
function locateMe(){
 if(!navigator.geolocation)return toast(t('posNo'));
 navigator.geolocation.getCurrentPosition(p=>{
  pos={lat:p.coords.latitude,lng:p.coords.longitude};store.set('pos',pos);hasFix=true;
  const P=getProfile();P.at=Date.now();saveProfile();renderCards();if(cur==='account')renderAccount();toast(t('posOk'));
 },()=>toast(t('posNo')),{enableHighAccuracy:true,maximumAge:10000,timeout:15000});
}
function meIcon(){
 return hasMyPos()&&getProfile().emoji
  ?L.divIcon({className:'',html:`<div class="emk">${esc(myEmoji())}</div>`,iconSize:[46,46],iconAnchor:[23,23]})
  :L.divIcon({className:'',html:'<div class="me"><i></i></div>',iconSize:[22,22]});
}
function refreshMeMarker(){if(window.L&&userMk)userMk.setIcon(meIcon())}

/* ---------- trajets : proposer / chercher, valider, tableau commun ---------- */
// Trajets FICTIFS d'autres fidèles (démo) pour remplir le tableau. dx/dy : décalage depuis la mosquée (km).
const DEMO_TRIPS=[
 {id:'d1',pseudo:'Yacine',emoji:'🚙',g:'brother',kind:'offer',m:1,p:'isha',day:'today',time:'19:05',seats:3,dx:-1.6,dy:1.1},
 {id:'d2',pseudo:'Samir',emoji:'🌙',g:'brother',kind:'seek',m:1,p:'isha',day:'today',time:'19:00',dx:-0.9,dy:1.6},
 {id:'d3',pseudo:'Ilyes',emoji:'🛵',g:'brother',kind:'offer',m:3,p:'jumua',day:'tomorrow',time:'12:40',seats:2,dx:1.2,dy:0.7},
 {id:'d4',pseudo:'Bilal',emoji:'📿',g:'brother',kind:'seek',m:2,p:'fajr',day:'tomorrow',time:'06:35',dx:0.8,dy:-1.2},
 {id:'d5',pseudo:'Amina',emoji:'🌸',g:'sister',kind:'offer',m:1,p:'isha',day:'today',time:'19:10',seats:2,dx:-1.2,dy:-0.8},
 {id:'d6',pseudo:'Khadija',emoji:'🌿',g:'sister',kind:'seek',m:3,p:'dhuhr',day:'tomorrow',time:'12:45',dx:1.5,dy:1.0},
 {id:'d7',pseudo:'Maryam',emoji:'⭐',g:'sister',kind:'seek',m:5,p:'maghrib',day:'today',time:'17:20',dx:-0.6,dy:0.9}
];
const demoTrip=d=>{const m=mq(d.m),k=1/111;return{...d,demo:true,from:{lat:m.lat+d.dy*k,lng:m.lng+d.dx*k/Math.cos(m.lat*Math.PI/180)},status:'validated'}};
let _trips;
const myTrips=()=>_trips||(_trips=store.get('trips',[]).filter(x=>x&&mq(x.m)));
const saveTrips=()=>store.set('trips',_trips);
const allTrips=()=>DEMO_TRIPS.map(demoTrip).concat(myTrips().filter(x=>x.status==='validated').map(x=>({...x,pseudo:myName(),emoji:myEmoji(),mine:true})));
let rdvView='board',boardMosque=0;
const dayLabel=d=>t(d==='tomorrow'?'tomorrow':'today');
const kmFromMe=p=>p&&p.lat?fmtKm(dist(pos,p)):'';

function tripCard(x,opts){
 const m=mq(x.m),seats=x.kind==='offer'&&x.seats?' · '+t('seatsN',{n:x.seats}):'';
 return `<div class="card trip ${x.kind}" data-trip="${x.id}"><div class="row"><div class="emk">${esc(x.emoji||'🚗')}</div>
  <div class="grow"><b>${esc(x.pseudo||t('me'))}</b>${x.demo?` <span class="small">${t('demoTag')}</span>`:''}${x.mine?` <span class="small">· ${t('mine')}</span>`:''}
  <div class="small">${esc(m.nom)}</div><div class="small">${esc(rdvTargetLabel(x.p))} · ${dayLabel(x.day)} ${esc(x.time)}${seats}</div>
  ${x.from&&!x.mine?`<div class="small">${t('departNear',{d:kmFromMe(x.from)})}</div>`:''}</div>
  <span class="tag ${x.kind}">${t(x.kind==='offer'?'tagOffer':'tagSeek')}</span></div>
  <div class="row" style="gap:8px;margin-top:10px">${opts.mine
   ?`<button class="btn ghost sm" data-tmap="${x.id}">${t('posSee')}</button><button class="btn ghost sm" data-tdel="${x.id}">${t('cancelTrip')}</button>`
   :`<button class="btn sm" data-tcontact="${x.id}">${t(x.kind==='offer'?'askSeat':'offerRide')}</button><button class="btn ghost sm" data-tmap="${x.id}">${t('posSee')}</button>`}</div></div>`;
}
function renderRdv(){
 const g=getGender();
 $('#genderBox').innerHTML=genderBarHtml();
 $('#newRdv').style.display='none';
 const box=$('#rdvList');
 if(!g){box.innerHTML='';return}
 const views=[['board','vBoard'],['mine','vMine'],['msgs','vMsgs']];
 let h=`<div class="row" style="gap:8px;margin-bottom:12px"><button class="btn" data-new="offer">${t('newOffer')}</button><button class="btn ghost" data-new="seek">${t('newSeek')}</button></div>
 <div class="seg">${views.map(([k,l])=>`<button class="${rdvView===k?'on':''}" data-view="${k}">${t(l)}</button>`).join('')}</div>`;
 if(rdvView==='board'){
  const L=allTrips().filter(x=>x.g===g&&(!boardMosque||x.m===boardMosque));
  h+=`<select id="bMosque" aria-label="${esc(t('lMosque'))}"><option value="0">${t('allMosques')}</option>${MOSQUEES.map(m=>`<option value="${m.id}" ${m.id===boardMosque?'selected':''}>${esc(m.nom)}</option>`).join('')}</select>`;
  const sec=(kind,title)=>{const l=L.filter(x=>x.kind===kind);return `<h2 class="sec">${title} <span class="small">(${l.length})</span></h2>`+(l.length?l.map(x=>tripCard(x,{mine:x.mine})).join(''):`<p class="muted" style="margin:0 0 12px">${t('noneYet')}</p>`)};
  h+=sec('offer',t('theyOffer'))+sec('seek',t('theySeek'));
  h+=`<p class="small">${t('boardNote')}</p>`;
 }else if(rdvView==='mine'){
  const L=myTrips().filter(x=>x.g===g&&x.status==='validated');
  h+=L.length?L.map(x=>tripCard({...x,pseudo:myName(),emoji:myEmoji(),mine:true},{mine:true})).join(''):`<p class="muted" style="text-align:center;margin-top:24px">${t('noMyTrips')}</p>`;
 }else{
  const list=rdvs.filter(r=>r.g===g);
  h+=list.length?list.map(r=>`<div class="card" data-id="${r.id}"><div class="row"><div class="emk">${esc(r.emoji||'🚗')}</div><div class="grow"><b>${esc(r.who||mq(r.m).nom)}</b><div class="small">${esc(mq(r.m).nom)} · ${esc(rdvTargetLabel(r.p))}</div></div></div>
  <div style="margin-top:8px">${r.msgs.map(m=>`<div class="bubble ${m.from}">${m.place?t(m.k,{place:t('pl_'+m.place)}):t(m.k)}</div>`).join('')}</div>
  <div class="chips">${PRESETS.map(p=>`<button class="chip" data-p="${p}">${t(p)}</button>`).join('')}</div>
  <div class="small" style="margin-top:10px">${t('meetHint')}</div><div class="chips" style="margin-top:6px">${MEET_PLACES.map(pl=>`<button class="chip" data-p="meet" data-place="${pl}">${t('meet',{place:t('pl_'+pl)})}</button>`).join('')}</div></div>`).join(''):`<p class="muted" style="text-align:center;margin-top:24px">${t('noRdv')}</p>`;
 }
 box.innerHTML=h;
 const bm=$('#bMosque');if(bm)bm.onchange=()=>{boardMosque=+bm.value;renderRdv()};
}
function onRdvClick(e){
 const v=e.target.closest('[data-view]');if(v){rdvView=v.dataset.view;return renderRdv()}
 const nw=e.target.closest('[data-new]');if(nw)return newTripSheet(boardMosque||null,null,nw.dataset.new);
 const c=e.target.closest('[data-tcontact]');if(c)return contactTrip(c.dataset.tcontact);
 const mp=e.target.closest('[data-tmap]');if(mp)return showTripOnMap(mp.dataset.tmap);
 const d=e.target.closest('[data-tdel]');if(d){const old=myTrips().slice();_trips=old.filter(x=>String(x.id)!==d.dataset.tdel);saveTrips();renderRdv();
  return toast(t('tripCancelled'),{action:()=>{_trips=old;saveTrips();if(cur==='rdv')renderRdv()}})}
 const chip=e.target.closest('.chip[data-p]');
 if(chip){const r=rdvs.find(x=>x.id===+chip.closest('.card').dataset.id);if(!r)return;const msg={from:'me',k:chip.dataset.p};if(chip.dataset.place&&MEET_PLACES.includes(chip.dataset.place))msg.place=chip.dataset.place;r.msgs.push(msg);store.set('rdvs',rdvs);renderRdv()}
}
function contactTrip(id){
 const x=allTrips().find(y=>String(y.id)===String(id));if(!x)return;
 if(!getAccount())return needAccount();
 let r=rdvs.find(y=>y.trip===String(id));
 if(!r){r={id:Date.now(),trip:String(id),m:x.m,p:x.p,g:x.g,kind:x.kind==='offer'?'seek':'offer',who:x.pseudo,emoji:x.emoji,msgs:[{from:'me',k:x.kind==='offer'?'askSeatMsg':'offerRideMsg'}]};rdvs.unshift(r);store.set('rdvs',rdvs)}
 rdvView='msgs';renderRdv();toast(t('contactSent',{n:x.pseudo}));
}
let tripMk=null;
function showTripOnMap(id){
 const x=allTrips().find(y=>String(y.id)===String(id));if(!x||!x.from)return toast(t('posNone'));
 go('map');
 setTimeout(()=>{if(!map)return;if(tripMk)map.removeLayer(tripMk);
  tripMk=L.marker([x.from.lat,x.from.lng],{icon:L.divIcon({className:'',html:`<div class="emk">${esc(x.emoji||'🚗')}</div><div class="emkName">${esc(x.pseudo||t('me'))}</div>`,iconSize:[46,46],iconAnchor:[23,23]}),zIndexOffset:950}).addTo(map);
  const m=mq(x.m);map.fitBounds(L.latLngBounds([[x.from.lat,x.from.lng],[m.lat,m.lng]]),{paddingTopLeft:[40,60],paddingBottomRight:[40,260],maxZoom:15});
 },120);
}
function needAccount(){
 $('#sheet').innerHTML=`<h2>${t('needAccount')}</h2><p class="muted" style="margin:8px 0 16px">${t('needAccountD')}</p><button class="btn" id="naGo">${t('account')}</button><div style="height:8px"></div><button class="btn ghost" id="naX">${t('cancel')}</button>`;
 $('#sheet').classList.add('on');$('#naGo').onclick=()=>go('account');$('#naX').onclick=()=>$('#sheet').classList.remove('on');
}
let _draft=null;
function newTripSheet(preMosque,preTarget,preKind){
 const g=getGender();
 if(!g){_pendingRdv=[preMosque,preTarget];
  $('#sheet').innerHTML=`<h2>${t('newRdv')}</h2><p class="muted" style="margin:8px 0 12px">${t('pickGender')}</p>${genderChips()}<button class="btn ghost" id="rcl">${t('cancel')}</button>`;
  $('#sheet').classList.add('on');$('#rcl').onclick=()=>$('#sheet').classList.remove('on');return}
 if(!getAccount())return needAccount();
 const mosques=MOSQUEES.concat(allCours().some(c=>c.m===99)?[DEMO]:[]);
 const d=_draft&&!preMosque?_draft:{kind:preKind||'offer',m:preMosque||mosques[0].id,p:preTarget||'',day:'today',time:'',seats:3};
 if(preKind)d.kind=preKind;
 $('#sheet').innerHTML=`<h2>${t(d.kind==='offer'?'newOffer':'newSeek')}</h2><p class="small" style="margin-bottom:8px">${g==='sister'?t('womenOnly'):t('menOnly')}</p>
 <div class="chips" style="margin:0 0 12px"><button class="chip ${d.kind==='offer'?'on':''}" data-k="offer">${t('offer')}</button><button class="chip ${d.kind==='seek'?'on':''}" data-k="seek">${t('seek')}</button></div>
 <label>${t('lMosque')}</label><select id="rm">${mosques.map(m=>`<option value="${m.id}" ${m.id===d.m?'selected':''}>${esc(m.nom)}</option>`).join('')}</select>
 <label>${t('forWhat')}</label><select id="rp"></select>
 <label>${t('when')}</label><div class="chips" style="margin:6px 0 8px"><button class="chip ${d.day==='today'?'on':''}" data-day="today">${t('today')}</button><button class="chip ${d.day==='tomorrow'?'on':''}" data-day="tomorrow">${t('tomorrow')}</button></div>
 <label>${t('departTime')}</label><input class="field" id="rt" type="time" value="${esc(d.time)}">
 <div id="seatsBox" ${d.kind==='offer'?'':'hidden'}><label>${t('seats')}</label><div class="chips" style="margin:6px 0 12px">${[1,2,3,4].map(n=>`<button class="chip ${d.seats===n?'on':''}" data-seat="${n}">${n}</button>`).join('')}</div></div>
 <div class="card row" style="margin-top:4px"><div class="emk">${esc(myEmoji())}</div><div class="grow"><b>${t('departPoint')}</b><div class="small" id="rFrom">${hasMyPos()?t('departFrom',{d:kmFromMe(mq(d.m))}):t('departNoPos')}</div></div>${hasMyPos()?'':`<button class="chip" id="rPos">${t('usePos')}</button>`}</div>
 <button class="btn" id="rok">${t('continue')}</button><div style="height:8px"></div><button class="btn ghost" id="rcl">${t('cancel')}</button>`;
 const defTime=p=>{const k=String(p);return KEYS.includes(k)&&horaires[k]?addMin(horaires[k],-20):(k==='jumua'?'12:40':'')};
 const fillTargets=sel=>{$('#rp').innerHTML=rdvTargets(+$('#rm').value,g).map(o=>`<option value="${o.v}" ${o.v===sel?'selected':''}>${esc(o.label)}</option>`).join('');if(!$('#rt').value)$('#rt').value=defTime($('#rp').value)};
 fillTargets(d.p);
 $('#rm').onchange=()=>{d.m=+$('#rm').value;fillTargets()};
 $('#rp').onchange=()=>{$('#rt').value=defTime($('#rp').value)};
 $('#sheet').classList.add('on');
 $$('#sheet [data-k]').forEach(b=>b.onclick=()=>{d.kind=b.dataset.k;$$('#sheet [data-k]').forEach(x=>x.classList.toggle('on',x===b));$('#seatsBox').hidden=d.kind!=='offer';$('#sheet h2').textContent=t(d.kind==='offer'?'newOffer':'newSeek')});
 $$('#sheet [data-day]').forEach(b=>b.onclick=()=>{d.day=b.dataset.day;$$('#sheet [data-day]').forEach(x=>x.classList.toggle('on',x===b))});
 $$('#sheet [data-seat]').forEach(b=>b.onclick=()=>{d.seats=+b.dataset.seat;$$('#sheet [data-seat]').forEach(x=>x.classList.toggle('on',x===b))});
 const rp=$('#rPos');if(rp)rp.onclick=()=>{const P=getProfile();P.share=true;saveProfile();_draft=collect();locateMe();setTimeout(()=>{if($('#rFrom'))newTripSheet(null,null,null)},2500)};
 const collect=()=>({kind:d.kind,m:+$('#rm').value,p:$('#rp').value,day:d.day,time:$('#rt').value,seats:d.seats});
 $('#rcl').onclick=()=>{_draft=null;$('#sheet').classList.remove('on')};
 $('#rok').onclick=()=>{
  const x=collect();
  if(!/^\d{2}:\d{2}$/.test(x.time))return fieldErr('#rt',t('needTime'));
  if(!hasMyPos())return toast(t('needPos'));
  _draft=x;confirmTripSheet(x);
 };
}
function confirmTripSheet(x){
 const m=mq(x.m),g=getGender();
 $('#sheet').innerHTML=`<h2 style="margin-bottom:12px">${t('confirmTitle')}</h2>
 <div class="card"><div class="row"><div class="emk big">${esc(myEmoji())}</div><div class="grow"><b>${esc(myName())}</b><div class="small">${t(x.kind==='offer'?'tagOffer':'tagSeek')}</div></div></div>
 <div class="recap"><div><span>${t('lMosque')}</span><b>${esc(m.nom)}</b></div><div><span>${t('forWhat')}</span><b>${esc(rdvTargetLabel(x.p))}</b></div>
 <div><span>${t('when')}</span><b>${dayLabel(x.day)} · ${esc(x.time)}</b></div>${x.kind==='offer'?`<div><span>${t('seats')}</span><b>${x.seats}</b></div>`:''}
 <div><span>${t('departPoint')}</span><b>${t('departFrom',{d:kmFromMe(m)})}</b></div></div></div>
 <p class="small" style="margin-bottom:12px">${t('confirmNote')}</p>
 <button class="btn" id="tOk">${t('validateTrip')}</button><div style="height:8px"></div><button class="btn ghost" id="tEdit">${t('edit')}</button>`;
 $('#tEdit').onclick=()=>newTripSheet(null,null,null);
 $('#tOk').onclick=()=>{
  myTrips().unshift({id:'t'+Date.now(),...x,g,from:{lat:pos.lat,lng:pos.lng},status:'validated',created:Date.now()});saveTrips();
  _draft=null;$('#sheet').classList.remove('on');rdvView='board';boardMosque=0;go('rdv');toast(t('tripValidated'));
 };
}

/* ---------- demander l'ajout de sa mosquée ---------- */
let _joins;
const joinReqs=()=>_joins||(_joins=store.get('joinReqs',[]));
const JOIN_ROLES=['jrManager','jrImam','jrVolunteer','jrOther'];
function renderJoin(){
 const L=joinReqs();
 $('#joinBody').innerHTML=`<div class="card"><h2 style="margin-bottom:4px">${t('joinTitle')}</h2><p class="small">${t('joinIntro')}</p></div>
 <label>${t('jName')}</label><input class="field" id="jName" maxlength="80" placeholder="${esc(t('jNamePh'))}">
 <label>${t('jAddr')}</label><input class="field" id="jAddr" maxlength="160" placeholder="${esc(t('jAddrPh'))}">
 <label>${t('jCity')}</label><input class="field" id="jCity" maxlength="60">
 <label>${t('jWho')}</label><input class="field" id="jWho" maxlength="60" autocomplete="name">
 <label>${t('jRole')}</label><select id="jRole">${JOIN_ROLES.map(k=>`<option value="${k}">${t(k)}</option>`).join('')}</select>
 <label>${t('jContact')}</label><input class="field" id="jContact" maxlength="120" dir="ltr" placeholder="${esc(t('jContactPh'))}">
 <label class="row" style="gap:10px;margin:4px 0 16px;align-items:flex-start"><input type="checkbox" id="jOk" style="width:22px;height:22px;flex:none;margin-top:2px"><span>${t('jConfirm')}</span></label>
 <button class="btn" id="jSend">${t('jSend')}</button><p class="small" style="margin-top:12px">${t('jNote')}</p>
 ${L.length?`<h2 class="sec">${t('jMine')}</h2>`+L.map(r=>`<div class="card"><b>${esc(r.name)}</b><div class="small">${esc(r.city)} · ${new Date(r.at).toLocaleDateString(lang)}</div><span class="tag pending">${t('jPending')}</span></div>`).join(''):''}`;
 $('#jSend').onclick=()=>{
  const v=id=>$(id).value.trim(),r={name:v('#jName'),addr:v('#jAddr'),city:v('#jCity'),who:v('#jWho'),role:$('#jRole').value,contact:v('#jContact')};
  const miss=[['name','#jName'],['addr','#jAddr'],['city','#jCity'],['who','#jWho']].find(([k])=>!r[k]);
  if(miss)return fieldErr(miss[1],t('jRequired'));
  if(!(validEmail(r.contact)||validPhone(r.contact)))return fieldErr('#jContact',t('jBadContact'));
  if(!JOIN_ROLES.includes(r.role))return;
  if(!$('#jOk').checked)return fieldErr('#jOk',t('jNeedOk'));
  joinReqs().unshift({...r,at:Date.now(),status:'pending'});store.set('joinReqs',_joins);toast(t('jSent'));renderJoin();
 };
}

/* ---------- page mosquée (ouverte par le QR code) : dons, covoiturage, horaires ---------- */
let pageMosque=1;
const donLink=id=>store.get('don_'+id,'')||(mq(id)&&mq(id).don)||'';
const mosqueUrl=id=>location.href.split('#')[0]+'#mosquee='+id;
function renderMosquePage(){
 const m=mq(pageMosque);if(!m)return;
 const don=donLink(m.id),isM=role==='mosquee',n=allTrips().filter(x=>x.m===m.id&&x.g===getGender()).length;
 const links=(m.site?`<a href="${esc(m.site)}" target="_blank" rel="noopener">${t('site')}</a>`:'')+(typeof MAWAQIT!=='undefined'&&MAWAQIT[m.id]?`<a href="https://mawaqit.net/en/m/${MAWAQIT[m.id].slug}" target="_blank" rel="noopener">Mawaqit</a>`:'');
 // horaires du jour directement sur la page (plus besoin de passer par une tuile)
 const T=timesFor(m),nk=nextOf(T.h).k;
 const today=`<div class="card times mtimes"><h2 style="margin:0 0 6px">${t('todayTimes')}</h2>${KEYS.map(k=>`<div class="${k===nk?'cur':''}"><span>${t(k)}</span><span dir="ltr">${T.h[k]}${T.iq?` <span class="small">· ${t('iqama')} ${T.iq[k]}</span>`:''}</span></div>`).join('')}${T.jumua?`<div><span>${t('jumua')}</span><span dir="ltr">${T.jumua}</span></div>`:`<div class="small" style="border:0;display:block">${t('jumuaUnknown')}</div>`}</div>`;
 $('#mosqueBody').innerHTML=`<div class="mhero" style="background-color:${m.color}"><div class="ico" style="background:rgba(255,255,255,.2)">${I.dome}</div><h2>${esc(m.nom)}</h2><div class="mheroTx">${esc(m.adr||'')}</div><div class="mheroTx" style="margin-top:2px">${m.lat?fmtKm(dist(pos,m))+(hasFix?'':' '+t('fromCenterShort')):''}</div></div>
 ${links?`<div class="mlinks">${links}</div>`:''}${today}
 <div class="mgrid">
  <button class="mtile" id="mpTimes"><div class="ico" style="background:${m.color}">${I.prayers}</div><b>${t('prayers')}</b><div class="small">${t('timesD2')}</div></button>
  <button class="mtile" id="mpRoute"><div class="ico" style="background:${m.color}">${I.map}</div><b>${t('route')}</b><div class="small">${t('routeD')}</div></button>
  <button class="mtile" id="mpCov"><div class="ico" style="background:${m.color}">${I.car}</div><b>${t('carpool')}</b><div class="small">${getGender()?t('tripsN',{n}):t('carpoolD')}</div></button>
  <button class="mtile" id="mpDon"><div class="ico" style="background:${m.color}">${ICON_HEART}</div><b>${t('donate')}</b><div class="small">${don?t('donateD'):t('donNone')}</div></button>
 </div>
 ${isM?`<div class="card"><h2 style="margin-bottom:4px">${t('donSetTitle')}</h2><p class="small" style="margin-bottom:8px">${t('donSetD')}</p><input class="field" id="mpDonUrl" dir="ltr" inputmode="url" value="${esc(don)}" placeholder="https://"><button class="btn" id="mpDonSave">${t('save')}</button></div>`:''}
 <p class="small">${t('src_'+m.src)}</p>`;
 $('#mpDon').onclick=()=>{if(don)window.open(don,'_blank','noopener');else toast(t('donNone'))};
 $('#mpCov').onclick=()=>{boardMosque=m.id;rdvView='board';go('rdv')};
 $('#mpTimes').onclick=()=>showMosqueTimes(m.id); // affiche ses horaires SANS remplacer la mosquée enregistrée
 $('#mpRoute').onclick=()=>{go('map');setTimeout(()=>{selectMosque(m.id);showRoute(m.id)},150)};
 const sv=$('#mpDonSave');if(sv)sv.onclick=()=>{const u=$('#mpDonUrl').value.trim();if(u&&!/^https:\/\/[^\s<>"]+\.[^\s<>"]+$/.test(u))return toast(t('donBad'));store.set('don_'+m.id,u);toast(t('saved'));renderMosquePage()};
}
function openMosquePage(id){if(!mq(id))return;pageMosque=id;go('mosque')}
function readHash(){const h=/#mosquee=(\d+)/.exec(location.hash);if(h&&mq(+h[1])&&+h[1]!==99){openMosquePage(+h[1]);return true}return false}

/* ---------- avant la prière : bandeau sur les vidéos + notification « mode avion » ---------- */
let _banTest=0,_banHidden=null,_notified=null; // lu au premier usage (store n'existe pas encore au chargement)
const PRAY_LEAD=15; // minutes avant l'adhan
function nextPrayer(){
 const now=new Date(),c=now.getHours()*60+now.getMinutes(),mins=h=>{const[a,b]=h.split(':');return +a*60+ +b};
 let k=KEYS.find(x=>horaires[x]&&mins(horaires[x])>c),diff;
 if(k)diff=mins(horaires[k])-c;else{k='fajr';diff=1440-c+mins(horaires.fajr)}
 return{k,diff,at:horaires[k]};
}
function checkPrayerTime(){
 const b=$('#prayBanner');if(!b)return;
 let{k,diff,at}=nextPrayer();const test=_banTest>Date.now();
 if(test){diff=14}
 const P=getProfile(),key=dayKey()+'_'+k;
 const show=test||(diff>0&&diff<=PRAY_LEAD&&_banHidden!==key);
 if(show){
  // « J'y vais » ferme le bandeau (on ne renvoie pas plus loin dans l'appli : le but est d'en sortir)
  // déjà affiché pour cette prière : on met juste à jour les minutes (sinon le bouton est recréé et le focus perdu)
  if(b.dataset.key===key&&b.classList.contains('on')&&$('#pbGo'))b.querySelector('b').textContent=t('banTitle',{p:t(k),n:diff});
  else{
   b.dataset.key=key;
   b.innerHTML=`<div class="pbIco">${I.dome}</div><div class="grow"><b>${t('banTitle',{p:t(k),n:diff})}</b><div>${t('banText')}</div></div><button id="pbGo">${t('banGo')}</button>`;
   b.classList.add('on');$('#pbGo').onclick=()=>{_banTest=0;_banHidden=key;b.classList.remove('on');toast(t('banBye'))};
  }
 }else{b.classList.remove('on');b.dataset.key=''}
 // notification « mode avion » : une seule fois par prière et par jour
 if(!_notified)_notified=store.get('notified',{});
 if(!test&&P.prayNotif&&diff>0&&diff<=PRAY_LEAD&&!_notified[key]){_notified={[key]:1};store.set('notified',_notified);showPrayNotif(k,diff)}
}
async function askNotifPermission(){
 if(!('Notification' in window))return false;
 if(Notification.permission==='granted')return true;
 if(Notification.permission==='denied')return false;
 try{return (await Notification.requestPermission())==='granted'}catch(e){return false}
}
async function showPrayNotif(k,n,test){
 if(!('Notification' in window)||Notification.permission!=='granted')return;
 const title=t('notifTitle',{p:t(k),n}),body=t('notifBody'),opt={body,tag:'priere-'+k,icon:undefined,renotify:true};
 try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg){await reg.showNotification(title,opt);return}}catch(e){}
 try{new Notification(title,opt)}catch(e){if(test)toast(t('notifRefused'))}
}
function initFeatures2(){
 if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
 $('#rdvList').onclick=onRdvClick;
 window.addEventListener('hashchange',readHash);
 setInterval(checkPrayerTime,20000);
}
