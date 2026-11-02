(function(root){
'use strict';
const worlds=[
 {name:'Peynir Tatil Kasabası',icon:'🧀',sky:'#d4eddf',far:'#a8cdb1',ground:'#628d57',accent:'#f3ce62',guide:'Ceren',story:'Tatil kasabasının pikniği için peynir toplayalım. Işıklı kapıya ulaş!',levels:['İlk patiler','Piknik yolu']},
 {name:'Macera Adası',icon:'🌴',sky:'#c7e9ed',far:'#8cc9bc',ground:'#3b8b73',accent:'#f4ba75',guide:'Kaptan Pengu',story:'Ada yolları küçük boşluklarla dolu. Zıplayarak karşıya geç, keşif bayrağını bul!',levels:['Kıyı keşfi','Saklı koy']},
 {name:'Peynir Arcade',icon:'🕹️',sky:'#292945',far:'#444064',ground:'#7762ac',accent:'#edb2e6',guide:'Kermit',story:'Miyav! Peynir Arcade ışıldıyor. Gezinen pofudukların üstüne zıplayınca uyurlar.',levels:['Işıklı salon','Yıldız makinesi']},
 {name:'VR Rüya',icon:'✦',sky:'#333758',far:'#62628d',ground:'#7385b9',accent:'#9ce1d8',guide:'Bagujik',story:'Rüyada yerçekimi daha hafif. Uzun zıplayışlarla kristal yolun sonuna ulaş!',levels:['Bulut adımları','Rüya köprüsü']},
 {name:'Penguteam Stadyumu',icon:'⚽',sky:'#d8e9dc',far:'#94bca7',ground:'#4e8864',accent:'#e9ce78',guide:'Çınar',story:'Penguteam sahaya çıkıyor! Sarı yaylı minderler seni daha yükseğe taşıyacak.',levels:['Isınma turu','Dostluk kupası']},
 {name:'Bebek Yuva',icon:'🍼',sky:'#f2e2d5',far:'#d1bcb5',ground:'#a88479',accent:'#eab59c',guide:'Ceren',story:'22 yavru grubu yuvada bizi bekliyor. Peynirleri topla, sıcacık yuvaya ulaş!',levels:['Yumuşak patikalar','Yuvaya dönüş']}
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function buildLevel(index){
 const world=Math.floor(index/2),hard=index%2,width=3200+hard*240;
 const grounds=[{x:0,y:410,w:710,h:180},{x:810,y:410,w:780,h:180},{x:1690,y:410,w:710,h:180},{x:2500,y:410,w:width-2500,h:180}];
 const platforms=[{x:260,y:322,w:130,h:22},{x:480,y:260,w:130,h:22},{x:720,y:334,w:100,h:22},{x:1000,y:322,w:150,h:22},{x:1250,y:252,w:150,h:22},{x:1600,y:325,w:100,h:22},{x:1850,y:320,w:145,h:22},{x:2080,y:252,w:145,h:22},{x:2410,y:330,w:100,h:22},{x:2680,y:320,w:155,h:22}];
 const cheeses=[{x:180,y:370},{x:320,y:285},{x:540,y:223},{x:760,y:296},{x:1060,y:285},{x:1320,y:215},{x:1530,y:370},{x:1650,y:288},{x:1910,y:283},{x:2140,y:215},{x:2460,y:293},{x:2750,y:283}].map(c=>({...c,w:22,h:22,taken:false}));
 const enemies=[{x:1100,y:382,w:36,h:28,min:940,max:1470,vx:55+index*3},{x:2000,y:382,w:36,h:28,min:1760,max:2320,vx:-65-index*3}];
 if(hard)enemies.push({x:2830,y:382,w:36,h:28,min:2600,max:width-240,vx:70});
 enemies.forEach((e,i)=>{e.motion=i===0?'walk':(index%2?'float':'hop');});
 const foods=[{x:440,y:374,w:26,h:28,kind:'spinach',taken:false},{x:1740,y:374,w:26,h:28,kind:'speed',taken:false}];
 return {index,world,width,grounds,platforms,cheeses,enemies,foods,goal:{x:width-170,y:310,w:65,h:100},checkpoint:{x:1500,y:350,w:28,h:60},spring:world===4?{x:1800,y:398,w:54,h:12}:null,gravity:world===3?1050:1700};
}
class Game{
 constructor(index=0,character="bagujik"){this.character=character;this.load(index)}
 load(index){this.level=buildLevel(index);this.player={x:70,y:350,w:34,h:46,vx:0,vy:0,grounded:false,facing:1};this.time=0;this.lives=3;this.collected=0;this.checkpoint=false;this.won=false;this.over=false;this.invulnerable=0;this.coyote=0;this.buffer=0;this.jumpHeld=false;this.events=[];this.power={spinach:0,speed:0};this.gatePending=false;}
 emit(type){this.events.push(type)}
 finishGate(){if(!this.gatePending)return;this.gatePending=false;this.won=true;this.emit('win');}
 hurt(){if(this.invulnerable>0||this.over)return;this.lives--;this.emit('hurt');if(this.lives<=0){this.over=true;return;}Object.assign(this.player,{x:this.checkpoint?1510:70,y:340,vx:0,vy:0,grounded:false});this.invulnerable=this.character==='pengu'?2.5:1.8;}
 step(dt,input={}){
  if(this.won||this.over||this.gatePending)return;dt=Math.min(dt,1/30);this.time+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);
  const p=this.player,l=this.level;this.coyote=p.grounded?.1:Math.max(0,this.coyote-dt);this.buffer=Math.max(0,this.buffer-dt);
  if(input.jump&&!this.jumpHeld)this.buffer=.13;
  if(!input.jump&&this.jumpHeld&&p.vy<-260)p.vy=-260;
  this.jumpHeld=!!input.jump;
  const dir=(input.right?1:0)-(input.left?1:0);if(dir)p.facing=dir;
  this.power.spinach=Math.max(0,this.power.spinach-dt);this.power.speed=Math.max(0,this.power.speed-dt);
  const target=dir*(this.character==='cinar'?290:270)*(this.power.speed>0?1.35:1);const accel=p.grounded?2100:1400;p.vx+=clamp(target-p.vx,-accel*dt,accel*dt);
  if(this.buffer>0&&this.coyote>0){p.vy=this.character==='kermit'?-690:-650;p.grounded=false;this.coyote=0;this.buffer=0;this.emit('jump');}
  const solids=[...l.grounds,...l.platforms];p.x+=p.vx*dt;
  for(const s of solids)if(overlap(p,s)){p.x=p.vx>0?s.x-p.w:s.x+s.w;p.vx=0;}
  p.x=clamp(p.x,0,l.width-p.w);const oldBottom=p.y+p.h;p.vy=Math.min(900,p.vy+l.gravity*dt);p.y+=p.vy*dt;p.grounded=false;
  for(const s of solids)if(overlap(p,s)){if(p.vy>=0){p.y=s.y-p.h;p.vy=0;p.grounded=true;}else{p.y=s.y+s.h;p.vy=0;}}
  if(l.spring&&p.grounded&&p.x+p.w>l.spring.x&&p.x<l.spring.x+l.spring.w){p.vy=-850;p.grounded=false;this.emit('jump');}
  for(const e of l.enemies){if(e.asleep)continue;e.x+=e.vx*dt;if(e.motion==='hop')e.y=382-Math.abs(Math.sin(this.time*2.8))*65;if(e.motion==='float')e.y=330+Math.sin(this.time*2.2)*42;if(e.x<e.min||e.x>e.max){e.x=clamp(e.x,e.min,e.max);e.vx*=-1;}if(overlap(p,e)){if(this.power.spinach>0){e.asleep=true;this.emit('stomp');}else if(p.vy>0&&oldBottom<=e.y+12){e.asleep=true;p.vy=-440;this.emit('stomp');}else this.hurt();}}
  for(const c of l.cheeses)if(!c.taken&&overlap(p,c)){c.taken=true;this.collected++;this.emit('cheese');}
  if(!this.checkpoint&&p.x>l.checkpoint.x){this.checkpoint=true;this.emit('checkpoint');}
  if(p.y>600){this.invulnerable=0;this.hurt();}
  for(const f of l.foods)if(!f.taken&&overlap(p,f)){f.taken=true;this.power[f.kind]=f.kind==='spinach'?10:8;this.emit('power');}
  if(overlap(p,l.goal)){this.gatePending=true;this.emit('gate');}
 }
}
function cleanSave(raw){const r=raw&&typeof raw==='object'?raw:{};return {version:1,nickname:typeof r.nickname==='string'?r.nickname.replace(/[<>\x00-\x1f]/g,'').slice(0,20):'Gezgin',unlocked:clamp(Math.floor(Number(r.unlocked)||0),0,11),best:Array.from({length:12},(_,i)=>clamp(Math.floor(Number(r.best?.[i])||0),0,12)),completed:Array.from({length:12},(_,i)=>r.completed?.[i]===true),character:['bagujik','ceren','cinar','kermit','pengu'].includes(r.character)?r.character:'bagujik',sound:r.sound===true};}
function mergeSave(a,b){a=cleanSave(a);b=cleanSave(b);return cleanSave({...a,unlocked:Math.max(a.unlocked,b.unlocked),best:a.best.map((v,i)=>Math.max(v,b.best[i])),completed:a.completed.map((v,i)=>v||b.completed[i])});}
function stars(best,done){return done?1+(best>=6?1:0)+(best===12?1:0):0;}
const api={worlds,buildLevel,Game,cleanSave,mergeSave,stars,overlap};if(typeof module!=='undefined')module.exports=api;else root.Veshte=api;
})(typeof window!=='undefined'?window:globalThis);
