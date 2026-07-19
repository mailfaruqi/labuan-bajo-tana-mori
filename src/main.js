import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
if(!mapboxgl.accessToken) console.error('Missing VITE_MAPBOX_TOKEN. Copy .env.example to .env.');
const LABUAN_BAJO=[119.8877,-8.4964],GOLO_MORI=[119.8214,-8.6946],MOLO=[119.80474,-8.63325],
      CUMBI=[119.843780,-8.594402],   // the bend residents asked the road to pass through
      ADAT=[119.8702993,-8.5502594];  // sacred tree standing in the planned alignment, Nanganae

const map=new mapboxgl.Map({container:'map',style:'mapbox://styles/mapbox/satellite-v9',
  center:[119.845,-8.60],zoom:9.6,pitch:58,bearing:-10,
  attributionControl:{compact:true},interactive:false,maxPitch:82});
map.on('style.load',()=>{try{map.setFog({'range':[1.5,14],'color':'#12161d','high-color':'#243040',
  'horizon-blend':0.08,'space-color':'#05070b','star-intensity':0.05});}catch(_){}});

function framePad(overlay,flip){const w=innerWidth,h=innerHeight;
  if(w<1000)return{top:Math.round(h*0.5),bottom:0,left:0,right:0};
  const rail=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rail'))||190;
  const card=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card'))||390;
  if(overlay)return{top:0,bottom:0,left:Math.round(rail+w*0.20),right:Math.round(card+w*0.10)};
  return flip?{top:0,bottom:0,left:Math.round(rail+card),right:0}
             :{top:0,bottom:0,left:0,right:Math.round(card+60)};}

const BEATS={
 'intro' :{ch:'Introduction',center:[119.845,-8.60],zoom:9.6,pitch:58,bearing:-10,dur:2600},
 'bajo'  :{ch:'Introduction',center:[119.8790,-8.4990],zoom:13.6,pitch:64,bearing:-22,dur:3200,
           shots:[['photos/bajo-1.jpeg','Padar Island. Courtesy of the author.'],
                  ['photos/bajo-2.jpeg','Labuan Bajo. Courtesy of the author.']]},
 'before':{ch:'Before',center:[119.845,-8.60],zoom:10.1,pitch:60,bearing:-16,dur:3200,journey:'mud',
           shots:[['photos/before-mud.jpg','The old track in the wet season. Courtesy: national roads agency']]},
 'molo'  :{ch:'Before',center:[119.8010,-8.6180],zoom:12.7,pitch:78,bearing:-24,dur:3800,journey:'sea',
           shots:[['photos/molo-crossing.jpg','The crossing. Courtesy: dymnflo']]},
 'crossing':{ch:'Before',center:[119.8250,-8.5850],zoom:10.9,pitch:32,bearing:-8,dur:3400,
           journey:'sea',desat:true,stage:'crossing'},
 'transport':{ch:'The villages',center:[119.8160,-8.6760],zoom:12.2,pitch:34,bearing:0,dur:3400,
           desat:true,stage:'transport'},
 'built' :{ch:'Introduction',center:[119.845,-8.60],zoom:10.3,pitch:40,bearing:-10,dur:3400,
           draw:true,desat:true,stage:'built'},
 'claim' :{ch:'Introduction',center:[119.8438,-8.5946],zoom:13.2,pitch:60,bearing:-6,dur:3000},
 'villages':{ch:'The villages',center:[119.845,-8.61],zoom:10.6,pitch:44,bearing:-10,dur:3200,
           desat:true,stage:'villages'},
 'dims'  :{ch:'Introduction',center:[119.845,-8.60],zoom:9.9,pitch:32,bearing:0,dur:3000,
           desat:true,stage:'dims'},
 'nang1' :{ch:'The villages',center:[119.8715,-8.5492],zoom:14.2,pitch:64,bearing:12,dur:3200},
 'nang2' :{ch:'The villages',center:[119.8715,-8.5492],zoom:14.6,pitch:66,bearing:12,dur:1800,
           stage:'section'},
 'nang3' :{ch:'The villages',center:[119.8715,-8.5492],zoom:14.8,pitch:62,bearing:12,dur:2000,
           stage:'nangdoc'},
 'adat'  :{ch:'The villages',center:ADAT,zoom:16.6,pitch:62,bearing:28,dur:3200},
 'cumbi1':{ch:'The villages',center:CUMBI,zoom:14.8,pitch:64,bearing:-5,dur:2600,approx:true},
 'cumbi2':{ch:'The villages',center:CUMBI,zoom:14.8,pitch:64,bearing:-5,dur:1600,stage:'schematic'},
 'kenari':{ch:'The villages',center:[119.8380,-8.6174],zoom:14.8,pitch:64,bearing:8,dur:3000},
 'soknar':{ch:'The villages',center:[119.8107,-8.6575],zoom:14.8,pitch:66,bearing:26,dur:3000,
           shots:[['photos/soknar-existing.jpg','Soknar before the works, the mosque at top right. Courtesy: national roads agency']]},
 'offices':{ch:'Institutions',center:[119.845,-8.60],zoom:10.2,pitch:26,bearing:0,dur:3600,
           desat:true,stage:'inst'},
 'golo1' :{ch:'The villages',center:GOLO_MORI,zoom:15.3,pitch:66,bearing:-12,dur:3400},
 'golo2' :{ch:'The villages',center:GOLO_MORI,zoom:15.7,pitch:64,bearing:-12,dur:2400,
           shots:[['photos/golomori-pipes.jpeg','Pipes across the asphalt. Courtesy of the author.']]},
 'matrix':{ch:'Findings',center:[119.845,-8.60],zoom:9.8,pitch:28,bearing:0,dur:3400,
           desat:true,stage:'matrix'},
 'close' :{ch:'Findings',center:[119.845,-8.62],zoom:10.2,pitch:62,bearing:-10,dur:3400}
};
const CHAPTERS=[['Introduction','intro'],['Before','before'],['The villages','villages'],
  ['Institutions','offices'],['Findings','matrix']];
const CHLABEL={Introduction:'Introduction',Before:'Before the road','The villages':'The villages',
  Institutions:'The institutions',Findings:'Findings'};
const rail=document.getElementById('rail');
CHAPTERS.forEach(([ch,beat])=>{const b=document.createElement('button');b.dataset.ch=ch;
  b.innerHTML='<span class="tick"></span>'+CHLABEL[ch];
  b.onclick=()=>{const el=document.querySelector('[data-beat="'+beat+'"]');
    if(el)el.scrollIntoView({behavior:'smooth',block:'center'});};rail.appendChild(b);});

/* ---------- institutions: four questions, five offices ---------- */
const IQ=['Who chose the route through the villages?','Was there compensation?',
  'Was consultation adequate?','Who is the road for?'];
const IROWS=[
 ['National roads agency',[
  ['claim','Residents asked for it','The trace was first drawn outside the settlements precisely to avoid taking houses. It was moved through them at the residents own request, for direct access to the road.'],
  ['claim','None was needed','No cash payment for land. The approach is described as social and cultural: customary ceremony, help moving houses, collective labour.'],
  ['claim','Held at village level','Consultation ran at the village office, the meeting hall and the church, with the village head, customary leaders and residents present.'],
  ['claim','Access, and the summit','Built as supporting infrastructure for the 2023 summit and to connect Golo Mori to the city.']]],
 ['District public works',[
  ['claim','They agreed, then outsiders pushed','Residents released land voluntarily. A sharp rise in land value, with pressure from outside parties, turned that into demands for payment once work had begun.'],
  ['claim','No budget, only housing aid','There was no budget line for land acquisition and socialisation said so. Housing assistance was arranged for the worst affected houses through a disaster response scheme.'],
  ['claim','Socialisation was intensive','The office says pre construction socialisation was intensive and made the absence of any compensation explicit.'],
  ['deflect','Regional access','Framed as connectivity for the district rather than for any single destination.']]],
 ['District planning',[
  ['deflect','Not our remit','Route selection and land negotiation sit with central government. This office gathers aspirations through the annual development planning forums.'],
  ['deflect','A central government matter','The agency was not involved in compensation, which it regards as central government policy.'],
  ['claim','Through planning forums','Community input is collected through the annual planning forums rather than project specific consultation.'],
  ['claim','Tourism and events growth','The 23 metre right of way is provisioned for tourism growth and a planned conference and events centre over the next ten to fifteen years.']]],
 ['Land agency',[
  ['deflect','Not recorded by us','This office registers land, not route selection.'],
  ['counter','Construction ran ahead of the paperwork','Physical work began before land administration was complete, leaving boundary legality unresolved. Certificates have not been reconciled with what the road actually took, so residents cannot use the remainder as collateral.'],
  ['deflect','Not our remit','Consultation was not run by this office.'],
  ['counter','Outside investors are buying the frontage','Most land along the corridor has transferred from local families to investors from larger cities, at prices the office calls speculative rather than fundamental.']]],
 ['Tourism zone operator',[
  ['deflect','Already fixed when we arrived','The route plan existed before the operator was involved, so it took no part in the public consultation over land.'],
  ['deflect','Not our process','Land release was handled by government, not by the operator.'],
  ['deflect','We did not run it','The operator was not the consulting party.'],
  ['claim','Without it the zone is zero','The road is treated as binary. Without it the special economic zone has no value at all; with it, development becomes possible.']]],
 ['Community advocate',[
  ['counter','Pushed through, consent manufactured','An attendance list from a village meeting that had not discussed the road was later used as evidence of agreement. Residents faced a binary choice under pressure.'],
  ['counter','None, and land status used to refuse it','No compensation was paid. As claims grew, land was declared state managed, and that status was used to refuse them even where residents held title.'],
  ['counter','No genuine two way dialogue','There was no real consultation between planning and construction. The approach was top down throughout.'],
  ['counter','The zone, not the villages','The specification went well beyond local need. Funding on this scale would have had far wider effect on the northern route that is still unsurfaced.']]]
];
(function(){
  const t=document.getElementById('imx'),d=document.getElementById('idetail');
  t.innerHTML='<tr><th class="rowh"></th>'+IQ.map(q=>'<th>'+q+'</th>').join('')+'</tr>'+
    IROWS.map(([who,cells],r)=>'<tr><th class="rowh">'+who+'</th>'+cells.map((c,i)=>
      '<td><button class="cell k-'+c[0]+'" data-r="'+r+'" data-i="'+i+'">'+c[1]+'</button></td>').join('')+'</tr>').join('');
  const KIND={claim:'the office asserts',deflect:'not our responsibility',counter:'contradicts the official account'};
  const sel=b=>{t.querySelectorAll('.cell').forEach(c=>c.classList.remove('sel'));b.classList.add('sel');
    const r=+b.dataset.r,i=+b.dataset.i,c=IROWS[r][1][i];
    d.className='detail';
    d.innerHTML='<div><b>'+IROWS[r][0]+' · '+IQ[i]+'</b><p>'+c[2]+'</p>'+
      '<p class="why">Reading: '+KIND[c[0]]+'.</p></div>';};
  t.querySelectorAll('.cell').forEach(b=>b.onclick=()=>sel(b));
  sel(t.querySelector('.cell[data-r="4"][data-i="1"]'));
})();

/* ---------- findings matrix ---------- */
const VILL=['Nanganae','Cumbi','Kenari','Soknar','Golo Mori'];
const DIMS=['Distributive','Procedural','Deliberative','Restorative','Epistemic'];
const V={good:'largely met',mixed:'partly met',poor:'not met'};
const MX={
 'Nanganae':[
  ['mixed','Access and livestock transport improved, but the raised carriageway floods the fields and the houses below it.','Gains are real, yet the burden falls on the households nearest the road.','photos/nanganae-house.jpg'],
  ['mixed','Concerns were passed through village representatives and recorded, but nothing followed.','Process existed on paper without any outcome.',''],
  ['mixed','Residents raised drainage and irrigation problems, with no influence on the outcome.','Voice without influence is not deliberation.',''],
  ['poor','No repair. Residents built their own embankments to hold the water back.','Harm was identified, acknowledged, and left to the affected to fix.',''],
  ['poor','Farmers warned that road drainage must not join the irrigation. It was joined anyway.','Expert local knowledge was available before construction and was not treated as knowledge.','photos/nanganae-irrigation.jpg']],
 'Cumbi':[
  ['poor','Some work at the zone, against sixteen houses cleared and one lot cut from 100 m to 40 m.','The heaviest burden in the corridor fell here, with the thinnest return.'],
  ['poor','An attendance list from an unrelated meeting was presented as consent, with armed personnel present at the church.','Consent was recorded rather than obtained.',''],
  ['mixed','Residents genuinely changed the route, then lost all control of the terms.','Influence was real at the start and inverted at execution.',''],
  ['poor','No land compensation. A housing grant of about Rp 20 million is disaster relief, not payment for land.','The remedy offered does not match the category of loss.',''],
  ['mixed','A sacred tree and grave sites were respected. The wider claim to ancestral land was not.','Ritual knowledge honoured, territorial claim overridden.','']],
 'Kenari':[
  ['good','Travel and trade transformed. A roadside workshop moved to the frontage and takings rose sharply.','This is the clearest case of benefit reaching residents directly.',''],
  ['poor','No inclusive socialisation. Most residents learned of the road as rumour.','Absence of process is not cured by a good outcome.',''],
  ['poor','The one village meeting was notification, not discussion of terms or compensation.','One way information does not constitute deliberation.',''],
  ['poor','Land cut by five to fifteen metres with no compensation, accepted out of exhaustion.','Acceptance after decades of isolation is not the same as agreement.',''],
  ['mixed','Concern over land status was raised and settled. Customary knowledge was not a live issue here.','Neither respected nor violated in any significant way.','']],
 'Soknar':[
  ['mixed','Sea isolation ended and residents run their own pickup service. Homes flood every wet season.','The village gained mobility and absorbed a permanent drainage failure.',''],
  ['poor','A second measurement shifted the route. Houses previously marked safe were cleared.','A changed decision was never re consulted with those it newly affected.',''],
  ['poor','Objections were made individually. One protester was driven off by neighbours who wanted the road.','Dissent was isolated rather than deliberated.',''],
  ['poor','Money was handed out privately through the village head, source undisclosed and not proportionate.','Undisclosed and unequal remedy is not restoration.',''],
  ['poor','An ancestral well was buried under the asphalt. Promised water tanks were inadequate, so residents drilled their own bore.','A working village water system was destroyed and replaced by the villagers themselves. No photographic record was made.','']],
 'Golo Mori':[
  ['mixed','The road serves the zone it was built for. About four of nine neighbourhoods received asphalt.','The destination was funded, the settlement around it only partly. No photographic record was made.',''],
  ['poor','Information was given at the village office. There was no open public forum.','Notification again in place of consultation.',''],
  ['poor','Requests to continue the asphalt beyond the zone entrance have not been answered.','Requests raised after construction have had no route to a decision.',''],
  ['poor','Self laid water pipes are crushed by traffic and repaired by residents at their own cost.','A harm created by the works is carried indefinitely by those harmed.','photos/golomori-pipes.jpeg'],
  ['good','Customary ritual was required before construction, and seventy per cent green zoning respects the sacred hill.','The strongest recognition of customary knowledge anywhere on the corridor.','']]
};
(function(){
  const t=document.getElementById('fmx'),d=document.getElementById('fdetail');
  t.innerHTML='<tr><th class="rowh"></th>'+DIMS.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+
    VILL.map(v=>'<tr><th class="rowh">'+v+'</th>'+MX[v].map((c,i)=>
      '<td><button class="cell s-'+c[0]+'" data-v="'+v+'" data-i="'+i+'"></button></td>').join('')+'</tr>').join('');
  const COL={good:'rgba(110,168,127,.3)',mixed:'rgba(217,145,63,.3)',poor:'rgba(217,99,74,.32)'};
  const sel=b=>{t.querySelectorAll('.cell').forEach(c=>c.classList.remove('sel'));b.classList.add('sel');
    const v=b.dataset.v,i=+b.dataset.i,c=MX[v][i];
    d.className='detail'+(c[3]?' haspic':'');
    d.innerHTML='<div><b>'+v+' · '+DIMS[i]+
      '<span class="verdict" style="background:'+COL[c[0]]+'">'+V[c[0]]+'</span></b>'+
      '<p>'+c[1]+'</p><p class="why">Why this reading: '+c[2]+'</p></div>'+
      (c[3]?'<img src="'+c[3]+'" alt="">':'');};
  t.querySelectorAll('.cell').forEach(b=>b.onclick=()=>sel(b));
  sel(t.querySelector('.cell[data-v="Soknar"][data-i="4"]'));
})();

/* ---------- map layers and beats ---------- */
let revealed=false,drawn=false;
function drawLine(){if(drawn||!map.getLayer('corridor'))return;drawn=true;revealed=true;
  map.setPaintProperty('corridor','line-opacity',.95);
  if(map.getLayer('corridor-case'))map.setPaintProperty('corridor-case','line-opacity',.5);
  let ok=true;try{map.setPaintProperty('corridor','line-trim-offset',[0,1]);}catch(_){ok=false;}
  if(!ok)return;const t0=performance.now(),dur=2600;
  (function s(now){const t=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-t,3);
    try{map.setPaintProperty('corridor','line-trim-offset',[0,1-e]);}catch(_){}
    if(t<1)requestAnimationFrame(s);})(t0);}
function setApprox(on){if(!map.getLayer('corridor'))return;
  map.setPaintProperty('corridor','line-dasharray',on?[2,2.2]:[1,0]);
  map.setPaintProperty('corridor','line-color',on?'#fb923c':'#f4f2ec');
  map.setPaintProperty('corridor','line-opacity',on?.75:(revealed?.95:0));}
function journey(kind){
  if(map.getLayer('mudroute'))map.setPaintProperty('mudroute','line-opacity',kind==='mud'?.9:0);
  if(map.getLayer('searoute')){
    map.setPaintProperty('searoute','line-opacity',kind==='sea'?1:(kind==='mud'?.45:0));
    map.setPaintProperty('searoute','line-width',kind==='sea'?3.4:2.6);}
  if(map.getLayer('searoute-glow'))
    map.setPaintProperty('searoute-glow','line-opacity',kind==='sea'?.55:0);}
function stage(id,on){const el=document.getElementById(id);el.classList.toggle('on',on);
  el.querySelectorAll(':scope>.wrap').forEach(w=>w.style.display=on?'block':'none');}
const STAGES=['photo','nangdoc','built','villages','crossing','transport','dims',
  'section','schematic','inst','matrix'];

// documentation strip rendered inside the active card, under the text
function shots(beat,list){
  document.querySelectorAll('.shots').forEach(n=>n.remove());
  if(!list||!list.length)return;
  const card=document.querySelector('[data-beat="'+beat+'"] .card'); if(!card)return;
  const d=document.createElement('div');
  d.className='shots n'+Math.min(list.length,2);
  d.innerHTML=list.map(([src,cap])=>
    '<figure><img src="'+src+'" alt=""><figcaption>'+cap+'</figcaption></figure>').join('');
  card.appendChild(d);
}

let photoOK={};
function showPhoto(p){
  if(!p||photoOK[p.src]===false){stage('photo',false);return false;}
  const apply=()=>{document.getElementById('photo-img').src=p.src;
    document.getElementById('photo-cap').textContent=p.cap||'';
    document.getElementById('photo-credit').textContent=p.credit||'';stage('photo',true);};
  if(photoOK[p.src]===true){apply();return true;}
  const im=new Image();im.onload=()=>{photoOK[p.src]=true;apply();};
  im.onerror=()=>{photoOK[p.src]=false;stage('photo',false);};im.src=p.src;return false;}

function go(beat){
  const b=BEATS[beat];if(!b)return;
  document.body.classList.toggle('flip',!!b.flip);
  const st=b.stage,overlay=!!st||!!b.photo;
  map.flyTo({center:b.center,zoom:b.zoom,pitch:b.pitch,bearing:b.bearing,
    duration:b.dur||2600,curve:1.4,essential:true,padding:framePad(!!st,!!b.flip)});
  STAGES.forEach(id=>{if(id!=='photo')stage(id,st===id);});
  const gotPhoto=showPhoto(b.photo);
  document.getElementById('veil').classList.toggle('on',!!st||gotPhoto);
  document.getElementById('map').classList.toggle('desat',!!b.desat);
  document.body.classList.toggle('has-stage',overlay);
  setApprox(!!b.approx);journey(b.journey);shots(beat,b.shots);
  if(b.draw)drawLine();
  document.querySelectorAll('#rail button').forEach(el=>el.classList.toggle('on',el.dataset.ch===b.ch));
}
addEventListener('resize',()=>map.resize());

function hav(a,b){const R=6371000,r=Math.PI/180;
  const la1=a[1]*r,la2=b[1]*r,dla=(b[1]-a[1])*r,dlo=(b[0]-a[0])*r;
  const h=Math.sin(dla/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dlo/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));}

let didSetup=false;
async function setup(){
  if(didSetup||!map.isStyleLoaded())return;
  didSetup=true;map.resize();
  try{
    const [road,marks]=await Promise.all([
      fetch('/data/road_bajo_golomori.geojson').then(r=>r.json()),
      fetch('/data/kampung_markers.geojson').then(r=>r.json())]);
    const co=road.features[0].geometry.coordinates;

    const mud=co.filter((_,i)=>i%70===0).map(([x,y],i)=>[x+(i%2?0.0045:-0.0035),y+0.0016]);
    map.addSource('mudroute',{type:'geojson',data:{type:'Feature',properties:{},
      geometry:{type:'LineString',coordinates:mud}}});
    map.addLayer({id:'mudroute',type:'line',source:'mudroute',
      layout:{'line-cap':'round','line-join':'round'},
      paint:{'line-color':'#c98f5e','line-width':3,'line-dasharray':[1.2,2.4],'line-opacity':0,
        'line-blur':.6,'line-opacity-transition':{duration:900}}});
    // The sea route through Selat Molo, drawn by the survey team from local knowledge.
    const sea=await fetch('/data/sea_route_molo.geojson').then(r=>r.json());
    map.addSource('searoute',{type:'geojson',data:sea});
    map.addLayer({id:'searoute-glow',type:'line',source:'searoute',
      layout:{'line-cap':'round','line-join':'round'},
      paint:{'line-color':'#bfe3f2','line-width':11,'line-opacity':0,'line-blur':7,
        'line-opacity-transition':{duration:900}}});
    map.addLayer({id:'searoute',type:'line',source:'searoute',
      layout:{'line-cap':'round','line-join':'round'},
      paint:{'line-color':'#cfeaf7','line-width':2.6,'line-dasharray':[2,2],'line-opacity':0,
        'line-opacity-transition':{duration:900},'line-width-transition':{duration:900}}});
    // named jetties and the port, carried in the same file as the route
    sea.features.filter(f=>f.geometry.type==='Point').forEach(f=>{
      const el=document.createElement('div');
      el.className='pin jetty'+(f.properties.kind==='port'?' port':'');
      el.innerHTML='<span class="dot"></span>'+f.properties.name;
      new mapboxgl.Marker({element:el,anchor:'left'}).setLngLat(f.geometry.coordinates).addTo(map);});

    map.addSource('road',{type:'geojson',data:road});
    map.addLayer({id:'corridor-case',type:'line',source:'road',
      layout:{'line-cap':'round','line-join':'round'},
      paint:{'line-color':'#08090c','line-width':7.5,'line-opacity':0,'line-blur':.5}});
    map.addLayer({id:'corridor',type:'line',source:'road',
      layout:{'line-cap':'round','line-join':'round'},
      paint:{'line-color':'#f4f2ec','line-width':3.4,'line-opacity':0}});

    const pin=(cls,label,ll)=>{const el=document.createElement('div');el.className='pin '+cls;
      el.innerHTML='<span class="dot"></span>'+label;
      new mapboxgl.Marker({element:el,anchor:'left'}).setLngLat(ll).addTo(map);};
    pin('city','Labuan Bajo',LABUAN_BAJO);
    pin('zone','Golo Mori Special Economic Zone',[119.8290,-8.6960]);
    pin('adat','Sacred tree',ADAT);
    const approx=new Set(['Cumbi','Nanganae']);
    marks.features.forEach(f=>pin(approx.has(f.properties.kampung)?'warn':'',
      f.properties.kampung,f.geometry.coordinates));

    // chainage of each village along the surveyed centreline
    const cum=[0];for(let i=1;i<co.length;i++)cum.push(cum[i-1]+hav(co[i-1],co[i]));
    const NOTE={'Nanganae':'Fields and houses below the raised road',
      'Cumbi':'Sixteen homes cleared for a straight line','Kenari':'The road is widely seen as beneficial',
      'Soknar':'A well buried, and a route shifted without notice',
      'Golo Mori':'Cleared the way themselves, then the asphalt stopped'};
    const rows=marks.features.map(f=>{const p=f.geometry.coordinates;let bi=0,bd=1e12;
      co.forEach((c,i)=>{const dd=hav(c,p);if(dd<bd){bd=dd;bi=i;}});
      return{name:f.properties.kampung,km:cum[bi]/1000};}).sort((a,b)=>a.km-b.km);
    document.getElementById('vil-rows').innerHTML=rows.map((r,i)=>
      '<div class="vrow'+(i===rows.length-1?' end':'')+'"><span class="dot"></span>'+
      '<span><b>'+r.name+'</b><small>'+(NOTE[r.name]||'')+'</small></span>'+
      '<span class="km">km '+r.km.toFixed(1)+'</span></div>').join('');
  }catch(e){console.error('data load failed',e);}
  try{
    map.addSource('mapbox-dem',{type:'raster-dem',url:'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize:512,maxzoom:14});
    map.setTerrain({source:'mapbox-dem',exaggeration:1.5});
    map.addLayer({id:'sky',type:'sky',paint:{'sky-type':'atmosphere',
      'sky-atmosphere-sun':[0,90],'sky-atmosphere-sun-intensity':4}});
  }catch(e){console.warn('terrain unavailable',e);}

  const goObs=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){
    go(en.target.dataset.beat);
    if(en.target.dataset.beat!=='intro')document.getElementById('hint').style.opacity='0';}}),
    {rootMargin:'-45% 0px -45% 0px',threshold:0});
  document.querySelectorAll('.step').forEach(s=>goObs.observe(s));
}
const inObs=new IntersectionObserver(es=>es.forEach(en=>
  en.target.classList.toggle('in',en.isIntersecting)),{rootMargin:'-25% 0px -25% 0px',threshold:0});
document.querySelectorAll('.step').forEach(s=>inObs.observe(s));
map.on('load',setup);map.on('idle',setup);
(function poll(){if(didSetup)return;try{map.resize();}catch(_){}setup();
  if(!didSetup)setTimeout(poll,300);})();
