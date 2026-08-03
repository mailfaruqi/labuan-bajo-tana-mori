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
 'after' :{ch:'Findings',center:[119.838,-8.615],zoom:10.7,pitch:52,bearing:-14,dur:3400},
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
 ['Ministry, regional infrastructure',[
  ['claim','Presidential discretion','The road sits on land under local jurisdiction. It was built by central government under presidential discretion, in order to support the 2023 summit.'],
  ['silent','Not addressed','The office did not speak to compensation.'],
  ['counter','No rule requires it','Public participation has not yet been regulated in the infrastructure planning process. There was no legal standard for the consultation to fall short of.'],
  ['claim','The summit','Central government intervention in a local road, directed at the 2023 summit.']]],
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
  ['counter','Construction ran ahead of the paperwork','Physical work began before land administration was complete, leaving boundary legality unresolved. Certificates have not been reconciled with what the road actually took, so residents cannot use the remainder as collateral. Because the sequence went wrong, paying compensation now would itself breach procedure. The window did not close, it never opened.'],
  ['deflect','Not our remit','Consultation was not run by this office.'],
  ['counter','Outside investors are buying the frontage','Most land along the corridor has transferred from local families to investors from larger cities, at prices the office calls speculative rather than fundamental. Buying began before construction started, which means the alignment was known outside government before it was known in the villages.']]],
 ['Tourism zone operator',[
  ['deflect','Already fixed when we arrived','The route plan existed before the operator was involved, so it took no part in the public consultation over land.'],
  ['deflect','Not our process','Land release was handled by government, not by the operator.'],
  ['counter','We did not run it, and we are not heard either','The operator was not the consulting party. It later warned the district that a steep rise in the assessed selling value of land was blocking further development of the zone. The district set that aside in favour of the tax revenue. Even the beneficiary gets told rather than asked.'],
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
  const KIND={claim:'the office asserts',deflect:'not our responsibility',
    counter:'contradicts the official account',silent:'not addressed by this office'};
  const sel=b=>{t.querySelectorAll('.cell').forEach(c=>c.classList.remove('sel'));b.classList.add('sel');
    const r=+b.dataset.r,i=+b.dataset.i,c=IROWS[r][1][i];
    d.className='detail';
    d.innerHTML='<div><b>'+IROWS[r][0]+' · '+IQ[i]+'</b><p>'+c[2]+'</p>'+
      '<p class="why">Reading: '+KIND[c[0]]+'.</p></div>';};
  t.querySelectorAll('.cell').forEach(b=>b.onclick=()=>sel(b));
  sel(t.querySelector('.cell[data-r="5"][data-i="1"]'));
})();

/* ---------- findings matrix ---------- */
const VILL=['Nanganae','Cumbi','Kenari','Soknar','Golo Mori'];
const DIMS=['Distributive','Procedural','Deliberative','Restorative','Epistemic'];
const V={good:'largely met',mixed:'partly met',poor:'not met',none:'no evidence recorded'};
const MX={
 'Nanganae':[
  ['mixed','Produce that took two or three days to reach Labuan Bajo now takes thirty to sixty minutes. The raised carriageway floods the houses below it and the paddy beside it, and altered boundaries have left residents unable to use their remaining land as security for a loan.','Gains are real, yet the burden falls on the households nearest the road.','photos/nanganae-house.jpg'],
  ['mixed','The reason for the road and the absence of compensation were both set out at a forum covering the affected villages. Concerns raised there about drainage and land certificates have had no follow up.','Informed at the start, then left without an answer.',''],
  ['poor','Residents raised drainage, irrigation and certificate problems. Nothing came of any of it.','Voice without influence is not deliberation.',''],
  ['mixed','Households were paid about Rp 5 million to move an elevated house, or 25 to 70 per cent of a permanent home’s value to rebuild, on the reasoning that Nanganae needed the new road less because it already had one. The flooding was never repaired, residents built their own embankments, and the promised land reconciliation has not happened.','The only village paid for its land, and paid because it had the least leverage. The harm that followed was still left where it fell.',''],
  ['poor','Farmers warned that road drainage must not join the irrigation. It was joined anyway.','Expert local knowledge was available before construction and was not treated as knowledge.','photos/nanganae-irrigation.jpg']],
 'Cumbi':[
  ['poor','Work at the zone became available. Against that, houses came down under a three day order with nothing paid for the land, and residents still pay property tax on ground the road took, because it was never removed from the assessment.','The heaviest burden in the corridor fell here, with the thinnest return.',''],
  ['mixed','The district head told residents directly that routing through the village meant no compensation. What was not communicated was the gap between the land described at the meetings and the land actually taken.','The headline consequence was stated. The detail that determined the loss was not.',''],
  ['mixed','Residents changed the route, through meetings and then through demonstrations. At the outset the plan went only to village leaders, and agreement was finally taken with armed police present, on a choice between the road through the village with no payment or no road at all.','Influence was real at the start and inverted at execution.',''],
  ['poor','No payment for land. Housing rehabilitation was offered and some residents refused it as too little. Electricity and clean water were promised in support of the land release and have not been built, and land reconciliation has not been carried out.','Residents compare this with other projects, including the airport, where money was paid.',''],
  ['none','The survey recorded no epistemic finding here.','No evidence was gathered either way, and an empty cell is more honest than an inferred one.','']],
 'Kenari':[
  ['good','Travel and trade transformed. A roadside workshop moved to the frontage and takings rose sharply, and the road is how people now reach health care and daily necessities.','This is the clearest case of benefit reaching residents directly.',''],
  ['mixed','A public hearing was held and residents were told plainly that their land was needed and that nothing would be paid for it.','The consequence was communicated before the fact, which is more than several villages received.',''],
  ['poor','The hearing did not invite all residents of the affected villages, reaching only those whose land was already marked.','Consultation that excludes part of the affected population is not inclusive deliberation.',''],
  ['poor','Land was taken with no compensation, accepted because the village needed the road after decades of mud. Land reconciliation promised by the government has not been carried out.','Acceptance after decades of isolation is not the same as agreement, and the one remedy offered has not arrived.',''],
  ['none','The survey recorded no epistemic finding here.','No evidence was gathered either way, and an empty cell is more honest than an inferred one.','']],
 'Soknar':[
  ['mixed','Two and a half hours by boat became thirty minutes by road, new beaches began drawing visitors, and residents run their own communal transport. Dozens of homes now flood because the drainage does not work.','The village gained mobility and absorbed a permanent drainage failure.',''],
  ['poor','The route was changed and houses previously marked safe were cleared, without the people newly affected being told. Some residents were never informed of the hearing at all, and the decision to build the carriageway above the houses was never communicated.','Three separate failures to inform, one of which is now flooding people’s homes.',''],
  ['poor','Objections were made individually. One protester was outvoted by neighbours who wanted the road.','Dissent was isolated rather than deliberated.',''],
  ['poor','Relocation money was paid but residents could not establish the amount, the basis or the source. Flooding complaints went to the village office and produced nothing. Land reconciliation has not been carried out.','Undisclosed and unequal remedy is not restoration.',''],
  ['poor','The well that was the village’s main source of clean water was buried under the road. The water tank supplied in its place was not enough, so residents built a new well themselves.','A working village water system was destroyed and replaced by the villagers themselves. No photographic record was made.','']],
 'Golo Mori':[
  ['mixed','A village reachable only by sea was opened, and the zone employs residents in security and cleaning with a hospitality training programme run through local schools. Land along the corridor has passed to outside investors who hold the long term gain, and residents now pay to enter Puncak Golo Mori beach.','The destination was funded and the village works in it, at the bottom of its wage scale, on ground it increasingly does not own.',''],
  ['none','The survey recorded no procedural finding here.','No evidence was gathered either way, and an empty cell is more honest than an inferred one.',''],
  ['poor','A consultation was held, but the forum existed to relay the plan rather than to discuss it.','One way communication does not constitute deliberation.',''],
  ['poor','Self laid water pipes are crushed by traffic and repaired by residents at their own cost, roughly once a month, with no government action.','A harm created by the works is carried indefinitely by those harmed.','photos/golomori-pipes.jpeg'],
  ['poor','The village had built and managed its own water network. The road was laid over it with no duct to carry it underneath.','An existing village system was known about and was not treated as something the design had to accommodate.','']]
};
(function(){
  const t=document.getElementById('fmx'),d=document.getElementById('fdetail');
  t.innerHTML='<tr><th class="rowh"></th>'+DIMS.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+
    VILL.map(v=>'<tr><th class="rowh">'+v+'</th>'+MX[v].map((c,i)=>
      '<td><button class="cell s-'+c[0]+'" data-v="'+v+'" data-i="'+i+'"></button></td>').join('')+'</tr>').join('');
  const COL={good:'rgba(110,168,127,.3)',mixed:'rgba(217,145,63,.3)',poor:'rgba(217,99,74,.32)',
    none:'rgba(255,255,255,.09)'};
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
