(function(root){
'use strict';
const V=root.Veshte||(typeof require==='function'?require('./engine.js'):{});
const overlap=V.overlap,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const titles=['Çatı Bahçeleri','Fısıltı Kuyusu','İp Ustası Kanyonu','Kristal Dağın İçinden','Kayıp Köprü Atölyesi','Saat Kulesi Asansörü','Rüzgâr Postası','Havuzun Altındaki Anahtar','Ritim Kapıları','Üç Fenerin Şifresi','Yuva Kurtarma Ekibi','Büyük Keşif Zirvesi'];
const missions=['Bahçe anahtarını bul, merdivenle çatıya çık.','Kuyunun dibine in, anahtarı al; merdivenle geri dön.','İpi topla. Altın halkaya yaklaşınca E ile fırlat, ↑ ile tırman.','Kazmayı bul; çatlak kayaya yaklaş ve E tuşunu basılı tut.','Üç tahta topla. Köprü kolunda E ile köprüyü tamamla.','Hareketli asansöre bin, kulenin üstündeki anahtarı al.','Yukarı üfleyen rüzgârla süzül, üç posta pulunu topla.','Havuz çevresinden aşağı in; anahtarı bul, ip ile dışarı çık.','Işık yeşilken kapılardan geç; üç rozeti topla.','Fenerleri 1 → 2 → 3 sırasıyla E ile yak.','Merdiven, ip ve kazmayla üç yavruyu yuvalarına götür.','Kuyu, tünel ve asansörü aş; üç kristalle zirve portalını aç.'];
const rect=(x,y,w,h=24)=>({x,y,w,h});
function buildLevel(slot=0,profile={}){
 const id=profile.order?.[slot]??slot,random=rng((profile.seed||1)+id*991),variant=Math.floor(random()*4);
 const l={index:slot,template:id,variant,title:titles[id],mission:missions[id],world:Math.floor(id/2),width:1800,height:1000,gravity:id===6?1100:1700,grounds:[],platforms:[],ladders:[],anchors:[],rocks:[],bridges:[],switches:[],lifts:[],winds:[],doors:[],items:[],enemies:[],cheeses:[],foods:[],required:1,goal:rect(1600,300,65,100),spawn:{x:60,y:354},checkpoint:rect(60,350,25,60),spring:null};
 const ground=(...a)=>l.grounds.push(rect(...a)),platform=(...a)=>l.platforms.push(rect(...a)),ladder=(x,top,bottom)=>l.ladders.push(rect(x,top,42,bottom-top)),anchor=(x,y,bottom)=>l.anchors.push({x,y,bottom,attached:false}),item=(x,y,kind='key')=>l.items.push({...rect(x,y,28,28),kind,taken:false}),rock=(x,y,w,h)=>l.rocks.push({...rect(x,y,w,h),hp:1.1,broken:false}),lift=(x,y,to)=>l.lifts.push({...rect(x,y,120,20),base:y,to,phase:random()*Math.PI*2}),sw=(x,y,n=0)=>l.switches.push({...rect(x,y,34,42),n,on:false});
 switch(id){
 case 0:ground(0,410,540,600);ground(540,240,900,770);ground(1440,340,360,670);ladder(460,205,410);item(260+variant*30,370);platform(160,330,110);platform(290,270,100);l.goal=rect(1630,240,65,100);break;
 case 1:ground(0,310,450,700);ground(450,850,650,160);ground(1100,310,700,700);ladder(480,280,850);ladder(1040,280,850);item(760+variant*30,810);l.spawn.y=254;l.goal=rect(1590,210,65,100);l.height=1100;break;
 case 2:ground(0,600,650,410);ground(650,210,1150,800);anchor(600,170,600);item(250,560,'rope');item(920+variant*60,170);l.spawn.y=544;l.goal=rect(1640,110,65,100);break;
 case 3:ground(0,410,1800,600);ground(620,0,220,215);rock(620,215,220,195);item(300,370,'pick');item(1050+variant*50,370);platform(1170,320,120);platform(1350,250,140);l.goal=rect(1620,310,65,100);break;
 case 4:ground(0,410,650,600);ground(1180,410,620,600);l.bridges.push({...rect(650,410,530,24),open:false});item(180,370,'wood');item(340,290,'wood');item(500,370,'wood');platform(290,330,140);sw(580,368);l.required=3;l.goal=rect(1600,310,65,100);break;
 case 5:ground(0,800,1800,210);platform(0,410,390);platform(700,215,410);platform(1370,410,430);lift(440,760,205);lift(1170,760,385);item(900+variant*30,175);ladder(330,390,800);l.goal=rect(1620,310,65,100);break;
 case 6:ground(0,730,1800,280);platform(0,470,340);platform(620,310,240);platform(1120,170,240);platform(1530,290,270);l.winds=[rect(330,120,290,610),rect(860,30,260,700),rect(1360,120,170,610)];item(700,270,'stamp');item(1210,130,'stamp');item(1600,250,'stamp');l.required=3;l.spawn.y=414;l.goal=rect(1680,190,65,100);break;
 case 7:ground(0,300,400,710);ground(400,740,800,270);ground(1200,300,600,710);platform(660,530,220);ladder(690,500,740);ladder(420,270,740);anchor(1150,250,740);item(560,700,'rope');item(760+variant*15,490);l.spawn.y=244;l.goal=rect(1640,200,65,100);break;
 case 8:ground(0,410,1800,600);[510,900,1300].forEach((x,i)=>{l.doors.push({...rect(x,50,35,360),phase:i*1.3,open:false});item(x+110,370,'badge');});l.required=3;platform(210,320,150);l.goal=rect(1650,310,65,100);break;
 case 9:ground(0,650,1800,360);platform(0,410,420);platform(650,270,380);platform(1230,410,570);ladder(460,240,650);ladder(1130,380,650);sw(300,368,1);sw(800,228,2);sw(1370,368,3);l.required=0;l.goal=rect(1650,310,65,100);break;
 case 10:ground(0,700,1800,310);platform(0,410,400);platform(680,230,370);platform(1320,400,480);ladder(390,380,700);anchor(620,190,700);item(180,370,'rope');item(480,660,'pick');item(780,190,'friend');ground(1050,0,160,480);rock(1050,480,160,220);item(960,660,'friend');item(1500,360,'friend');ladder(1260,370,700);l.required=3;l.goal=rect(1630,300,65,100);break;
 case 11:l.width=2200;l.height=1150;ground(0,370,360,780);ground(360,900,1840,250);platform(1000,480,330);platform(1750,200,450);ladder(380,340,900);item(180,330,'pick');item(540,860,'rope');item(680,860,'crystal');ground(800,0,140,620);rock(800,620,140,280);anchor(970,440,900);item(1130,440,'crystal');lift(1490,875,180);item(1870,160,'crystal');l.required=3;l.spawn.y=314;l.goal=rect(2070,100,65,100);break;
 }
 // Small landings let players rest at the top of a climb before crossing.
 for(const s of l.ladders)l.platforms.push(rect(s.x-10,s.y,90,16));for(const a of l.anchors)l.platforms.push(rect(a.x-40,a.y,90,16));
 // Optional ledges, foods and patrols vary without moving essential route supports.
 const floor=l.grounds.filter(g=>g.h>100);for(let i=0;i<12;i++){const g=floor[i%floor.length],x=g.x+45+((i*137+variant*53)%Math.max(50,g.w-100));l.cheeses.push({...rect(x,g.y-40,22,22),taken:false});}
 for(let i=0;i<2;i++){const g=floor[i%floor.length];l.foods.push({...rect(g.x+Math.min(g.w-90,210+i*70),g.y-36,26,28),kind:i?'speed':'spinach',taken:false});}
 if(id!==8&&id!==9){const g=floor[floor.length-1];for(let i=0;i<1+variant%2;i++){const x=g.x+Math.min(g.w-140,300+i*130);l.enemies.push({...rect(x,g.y-28,36,28),baseY:g.y-28,min:g.x+100,max:g.x+g.w-100,vx:45+i*20,motion:['walk','hop','float'][(id+i+variant)%3]});}}
 l.checkpoint=rect(l.spawn.x,l.spawn.y-10,24,60);for(const f of l.items)if(f.kind==='rope'||f.kind==='pick')f.x+=variant*4;
 l.season=Math.floor(random()*4);l.variantHue=(variant-1)*12;l.reward=id===2?'rope':id===3?'pick':null;return l;
}
const oldClean=V.cleanSave;
function newSeed(){return Math.floor(Math.random()*0x7fffffff)+1;}
function cleanSave(raw){const s=oldClean(raw),r=raw||{};s.seed=Number.isSafeInteger(r.seed)&&r.seed>0?r.seed:newSeed();s.order=Array.isArray(r.order)&&r.order.length===12&&new Set(r.order).size===12&&r.order.every(n=>Number.isInteger(n)&&n>=0&&n<12)?[...r.order]:shuffle(Array.from({length:12},(_,i)=>i),rng(s.seed));s.audio={music:clamp(Number.isFinite(r.audio?.music)?r.audio.music:.5,0,1),effects:clamp(Number.isFinite(r.audio?.effects)?r.audio.effects:.7,0,1),ambient:clamp(Number.isFinite(r.audio?.ambient)?r.audio.ambient:.4,0,1)};s.age=['4-6','7-9','10-12','13+'].includes(r.age)?r.age:'';s.mastered=Array.from({length:12},(_,i)=>r.mastered?.[i]===true);s.tools={rope:r.tools?.rope===true,pick:r.tools?.pick===true};s.seen=Array.isArray(r.seen)?[...new Set(r.seen.filter(n=>typeof n==='string'&&/^[rp]-\d+$/.test(n)))].slice(-1000):[];s.recentAnswers=Array.isArray(r.recentAnswers)?r.recentAnswers.filter(n=>typeof n==='string').slice(-15):[];return s;}
function rank(s){return (s.mastered||[]).filter(Boolean).length;}
function mergeSave(a,b){a=cleanSave(a);b=cleanSave(b);if(a.seed!==b.seed)return cleanSave({...a,mastered:a.mastered.map((v,i)=>v||b.mastered[i]),seen:[...a.seen,...b.seen],tools:{rope:a.tools.rope||b.tools.rope,pick:a.tools.pick||b.tools.pick}});return cleanSave({...a,unlocked:Math.max(a.unlocked,b.unlocked),best:a.best.map((v,i)=>Math.max(v,b.best[i])),completed:a.completed.map((v,i)=>v||b.completed[i]),mastered:a.mastered.map((v,i)=>v||b.mastered[i]),seen:[...a.seen,...b.seen],tools:{rope:a.tools.rope||b.tools.rope,pick:a.tools.pick||b.tools.pick}});}
function newRun(s){s=cleanSave(s);const seed=newSeed();const random=rng(seed);let order;do{order=shuffle(Array.from({length:12},(_,i)=>i),random);}while(order.some((id,i)=>id===s.order[i]));return cleanSave({...s,seed,order,unlocked:0,best:[],completed:[]});}
class Game{
 constructor(index=0,character='bagujik',profile={}){this.character=character;this.profile=profile;this.load(index);}
 load(index){this.level=buildLevel(index,this.profile);this.player={...this.level.spawn,w:34,h:46,vx:0,vy:0,grounded:false,facing:1};this.time=0;this.lives=this.profile.age==='4-6'?5:3;this.maxLives=this.lives;this.collected=0;this.checkpoint=false;this.respawn={...this.level.spawn};this.won=false;this.over=false;this.gatePending=false;this.invulnerable=0;this.coyote=0;this.buffer=0;this.jumpHeld=false;this.actionHeld=false;this.events=[];this.power={spinach:0,speed:0};this.inventory={rope:!!this.profile.tools?.rope,pick:!!this.profile.tools?.pick};this.tokens=0;this.wood=0;this.switchCount=0;this.notice=this.level.mission;this.mining=null;this.ropeThrow=0;this.lastSafe=0;this.swing=0;this.shield=rank(this.profile)>=5;}
 emit(t){this.events.push(t);}
 finishGate(){if(this.gatePending){this.gatePending=false;this.won=true;this.emit('win');}}
 hurt(){if(this.invulnerable>0||this.over)return;if(this.shield){this.shield=false;this.invulnerable=2;return;}this.lives--;this.emit('hurt');if(this.lives<=0){this.over=true;return;}Object.assign(this.player,this.respawn,{vx:0,vy:0,grounded:false});this.invulnerable=2;}
 ready(){return this.tokens>=this.level.required&&(this.level.template!==9||this.switchCount===3)&&(this.level.template!==4||this.level.bridges.every(b=>b.open));}
 step(dt,input={}){
 if(this.won||this.over||this.gatePending)return;dt=Math.min(dt,1/30);this.time+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);this.ropeThrow=Math.max(0,this.ropeThrow-dt);
 const p=this.player,l=this.level,r=rank(this.profile);this.coyote=p.grounded?.12:Math.max(0,this.coyote-dt);this.buffer=Math.max(0,this.buffer-dt);if(input.jump&&!this.jumpHeld)this.buffer=.14;if(!input.jump&&this.jumpHeld&&p.vy<-260)p.vy=-260;this.jumpHeld=!!input.jump;
 const action=!!input.action&&!this.actionHeld;this.actionHeld=!!input.action;this.mining=null;
 for(const f of l.items)if(!f.taken&&overlap(p,f)){f.taken=true;if(f.kind==='rope'||f.kind==='pick')this.inventory[f.kind]=true;else{this.tokens++;if(f.kind==='wood')this.wood++;}this.notice=f.kind==='rope'?'İp çantanda! Altın halka yakınında E, sonra ↑.':f.kind==='pick'?'Kazma çantanda! Çatlak kayada E basılı tut.':'Görev nesnesi: '+this.tokens+' / '+l.required;this.emit('cheese');}
 for(const a of l.anchors)if(action&&this.inventory.rope&&Math.abs(p.x+17-a.x)<145&&p.y+p.h>a.y&&p.y<a.bottom+40){a.attached=true;this.ropeThrow=.7;this.notice='İp bağlandı! İpe yaklaş, ↑ / ↓ ile tırman.';this.emit('checkpoint');}
 for(const rock of l.rocks)if(!rock.broken&&this.inventory.pick&&input.action&&overlap({x:p.x-30,y:p.y-5,w:p.w+60,h:p.h+10},rock)){rock.hp-=dt*(r>=3?1.3:1);this.mining=rock;if(rock.hp<=0){rock.broken=true;this.emit('stomp');this.notice='Tünel açıldı!';}}
 if(action)for(const s of l.switches)if(Math.abs(p.x-s.x)<65&&Math.abs(p.y-s.y)<65){if(l.template===4){if(this.wood===3){l.bridges.forEach(b=>b.open=true);s.on=true;this.notice='Köprü tamamlandı!';}else this.notice='Önce üç tahtayı topla.';}else if(!s.on){if(s.n===this.switchCount+1){s.on=true;this.switchCount++;this.notice='Fener '+s.n+' yandı.';}else this.notice='Fenerleri 1 → 2 → 3 sırasıyla yak.';}}
 for(const s of l.lifts){const old=s.y;s.y=s.to+(s.base-s.to)*(.5+.5*Math.cos(this.time*.65+s.phase));s.dy=s.y-old;if(p.grounded&&Math.abs(p.y+p.h-old)<3&&p.x+p.w>s.x&&p.x<s.x+s.w)p.y+=s.dy;}
 for(const d of l.doors)d.open=Math.sin(this.time*(this.profile.age==='4-6'?.6:1)+d.phase)>-.2;
 const dir=(input.right?1:0)-(input.left?1:0);if(dir)p.facing=dir;this.power.spinach=Math.max(0,this.power.spinach-dt);this.power.speed=Math.max(0,this.power.speed-dt);const speed=(this.character==='cinar'?285:260)*(r>=1?1.08:1)*(this.power.speed>0?1.3:1);p.vx+=clamp(dir*speed-p.vx,-1900*dt,1900*dt);
 const climbables=[...l.ladders,...l.anchors.filter(a=>a.attached).map(a=>rect(a.x-21,a.y,42,a.bottom-a.y+10))];const climbing=climbables.find(s=>p.x+p.w>s.x&&p.x<s.x+s.w&&p.y+p.h>=s.y-4&&p.y<s.y+s.h);
 p.climbing=!!climbing&&!!(input.up||input.down);if(p.climbing){p.vy=(input.down?150:-175);this.buffer=0;}else{if(this.buffer>0&&(this.coyote>0||climbing)){p.vy=(this.character==='kermit'?-680:-650)*(r>=3?1.05:1);p.grounded=false;this.coyote=0;this.buffer=0;this.emit('jump');}p.vy=Math.min(850,p.vy+l.gravity*dt);}
 for(const w of l.winds)if(overlap(p,w))p.vy=Math.max(-370,p.vy-2900*dt);
 const solids=[...l.grounds,...l.rocks.filter(s=>!s.broken),...l.doors.filter(s=>!s.open&&!overlap(p,s))];const oneWay=[...l.platforms,...l.lifts,...l.bridges.filter(b=>b.open)];
 p.x+=p.vx*dt;for(const s of solids)if(overlap(p,s)){p.x=p.vx>0?s.x-p.w:s.x+s.w;p.vx=0;}p.x=clamp(p.x,0,l.width-p.w);const oldY=p.y,oldBottom=p.y+p.h;p.y+=p.vy*dt;p.grounded=false;
 for(const s of solids)if(overlap(p,s)){if(p.vy>=0){p.y=s.y-p.h;p.vy=0;p.grounded=true;}else{p.y=s.y+s.h;p.vy=0;}}
 for(const s of oneWay)if(p.vy>=0&&oldBottom<=s.y+Math.abs(s.dy||0)+3&&p.y+p.h>=s.y&&p.x+p.w>s.x&&p.x<s.x+s.w&&!input.down){p.y=s.y-p.h;p.vy=0;p.grounded=true;}
 if(p.climbing&&input.up&&p.y+p.h<=climbing.y+8){p.y=climbing.y-p.h;p.vy=-180;}
 if(p.grounded&&this.time-this.lastSafe>2&&p.x>this.respawn.x+240){this.respawn={x:p.x,y:p.y-2};this.lastSafe=this.time;this.checkpoint=true;this.emit('checkpoint');}
 for(const e of l.enemies){if(e.asleep)continue;e.x+=e.vx*dt;if(e.x<e.min||e.x>e.max){e.x=clamp(e.x,e.min,e.max);e.vx*=-1;}e.y=e.baseY-(e.motion==='hop'?Math.abs(Math.sin(this.time*2.4))*65:e.motion==='float'?55+Math.sin(this.time*1.8)*30:0);if(overlap(p,e)){if(this.power.spinach>0||p.vy>0&&oldBottom<=e.y+13){e.asleep=true;p.vy=-360;this.emit('stomp');}else this.hurt();}}
 for(const c of l.cheeses)if(!c.taken&&overlap(p,c)){c.taken=true;this.collected++;this.emit('cheese');}for(const f of l.foods)if(!f.taken&&overlap(p,f)){f.taken=true;this.power[f.kind]=f.kind==='spinach'?10:8;this.emit('power');}
 if(p.y>l.height){this.invulnerable=0;this.hurt();}if(overlap(p,l.goal)){if(this.ready()){this.gatePending=true;this.emit('gate');}else this.notice=l.template===9?'Önce üç feneri sırayla yak.':'Portal için görev nesneleri: '+this.tokens+' / '+l.required;}
 this.swing=dir&&p.grounded?Math.sin(this.time*16):Math.sin(this.time*3)*.12;
 }
}
Object.assign(V,{Game,buildLevel,cleanSave,mergeSave,newRun,rank,rng,shuffle,titles,missions});
if(typeof module!=='undefined')module.exports=V;
})(typeof window!=='undefined'?window:globalThis);
