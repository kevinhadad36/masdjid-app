/* Calcul des horaires de prière SUR LE TÉLÉPHONE (sans connexion), même méthode que l'API Aladhan.
   Algorithme astronomique classique (PrayTimes.org, licence LGPL) : position du soleil, angle de l'aube
   (Fajr) et de la nuit (Isha), Asr = ombre ×1 (école chafiite / malikite, comme l'API par défaut).
   Sert de secours quand l'API ne répond pas : l'appli n'affiche JAMAIS d'horaires inventés. */
const PT=(()=>{
 const d2r=Math.PI/180,r2d=180/Math.PI;
 const sin=x=>Math.sin(x*d2r),cos=x=>Math.cos(x*d2r),tan=x=>Math.tan(x*d2r);
 const asin=x=>Math.asin(x)*r2d,acos=x=>Math.acos(x)*r2d,atan2=(y,x)=>Math.atan2(y,x)*r2d,acot=x=>Math.atan(1/x)*r2d;
 const fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};
 const julian=(y,m,d)=>{if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5};
 function sun(jd){
  const D=jd-2451545,g=fix(357.529+.98560028*D,360),q=fix(280.459+.98564736*D,360);
  const L=fix(q+1.915*sin(g)+.02*sin(2*g),360),e=23.439-.00000036*D;
  const RA=fix(atan2(cos(e)*sin(L),cos(L))/15,24);
  return{decl:asin(sin(e)*sin(L)),eqt:q/15-RA};
 }
 // date : objet Date (jour local) ; o : {fajr, isha} angles en degrés ; renvoie {fajr,sunrise,dhuhr,asr,maghrib,isha} en "HH:MM"
 function times(date,lat,lng,o){
  const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
  const jd=julian(y,m,d)-lng/(15*24);
  const tz=-new Date(y,m-1,d,12).getTimezoneOffset()/60; // heure d'été / d'hiver du jour demandé
  const mid=t=>fix(12-sun(jd+t).eqt,24);
  const ang=(a,t,ccw)=>{const s=sun(jd+t),n=mid(t),x=(-sin(a)-sin(s.decl)*sin(lat))/(cos(s.decl)*cos(lat));const h=acos(Math.max(-1,Math.min(1,x)))/15;return n+(ccw?-h:h)};
  const asr=(f,t)=>{const s=sun(jd+t);return ang(-acot(f+tan(Math.abs(lat-s.decl))),t)};
  let T={fajr:5,sunrise:6,dhuhr:12,asr:13,sunset:18,isha:18};
  for(let i=0;i<2;i++){const p=k=>T[k]/24;T={fajr:ang(o.fajr,p('fajr'),true),sunrise:ang(.833,p('sunrise'),true),dhuhr:mid(p('dhuhr')),asr:asr(1,p('asr')),sunset:ang(.833,p('sunset')),isha:ang(o.isha,p('isha'))}}
  const out={};
  for(const k in T){let h=T[k]+tz-lng/15+(o.tune&&o.tune[k]||0)/60;h=fix(h+.5/60,24);const H=Math.floor(h),M=Math.floor((h-H)*60);out[k]=String(H).padStart(2,'0')+':'+String(M).padStart(2,'0')}
  out.maghrib=out.sunset;
  if(o.tune&&o.tune.maghrib){const[a,b]=out.sunset.split(':').map(Number),t=a*60+b+o.tune.maghrib;out.maghrib=String(Math.floor(t/60)%24).padStart(2,'0')+':'+String(t%60).padStart(2,'0')}
  return out;
 }
 // méthodes utilisées par l'appli (identiques aux paramètres envoyés à l'API)
 const METHODS={
  france12:{fajr:12,isha:12},                          // UOIF / France 12° (API method=12)
  mirail:{fajr:15,isha:15,tune:{dhuhr:1,maghrib:5}}     // site de la mosquée du Mirail : 15°/15°, Dhuhr +1, Maghrib +5
 };
 return{times,METHODS};
})();
if(typeof module!=='undefined')module.exports=PT;
