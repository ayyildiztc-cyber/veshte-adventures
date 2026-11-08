(function(root){
'use strict';
const V=root.Veshte||(typeof require==='function'?require('./expedition.js'):{}),Base=V.Game,oldBuild=V.buildLevel,oldClean=V.cleanSave,oldNew=V.newRun,oldMerge=V.mergeSave;
const box=(x,y,w=28,h=28)=>({x,y,w,h}),near=(p,s,d=65)=>Math.abs(p.x+p.w/2-s.x-s.w/2)<d&&Math.abs(p.y+p.h-s.y-s.h)<70;
const roles=[{name:'Oyun bekçisi',icon:'👮',color:'#527e9a',style:'chase',text:'Yakınında seni takip eder; sınırda dönüp devriyeye devam eder.'},{name:'Site müdürü',icon:'🧑‍💼',color:'#8872a0',style:'throw',text:'İki yöne dönüp kâğıt uyarı kartları atar. Zıplayıp kaçabilir veya yumuşak top ile mola verdirebilirsin.'},{name:'Yönetim görevlisi',icon:'🦺',color:'#c59548',style:'patrol',text:'İleri geri dolaşır ve geçiş yolunu daraltır.'},{name:'Oyun bakkalı',icon:'🧑‍🍳',color:'#9e7150',style:'throw',text:'Parkurda yuvarlanan boş paketler yollar. Mama tezgâhındaki bakkal ise elmaslarını mamayla değiştirir.'}];
const rewards=[['🫙','Su matarası','water'],['💎','Mama bütçesi','diamonds'],['🛡','Yumuşak koruyucu','shield'],['🦺','Görünürlük yeleği','calm'],['🧣','Yuva örtüsü','blanket'],['🚦','Dikkat düdüğü','traffic'],['🧤','Toplama eldiveni','glove'],['🚿','Sulama kabı','water'],['🤝','Komşuluk rozeti','calm'],['🏠','Kış bakım paketi','care'],['🌟','Fener yıldızı','star'],['🏆','İyilik Feneri kupası','trophy']];
const quests=[
 {name:'Temiz bir başlangıç',intro:'Sedir’in eski posta kutusunda bir mektup var: “2001’in hazinesi on iki iyilikle uyanır.” İlk işaret, yere saçılmış kâğıtların altında saklı.',task:'Üç çöpü topla, geri dönüşüm kutusuna E ile bırak.',done:'Bahçe temizlendi; ilk işaret parladı. Mektup şimdi susamış bir kediyi gösteriyor.',type:'trash'},
 {name:'Bir kap su',intro:'İkinci işaret bir pati biçiminde. Ceren, boş su kabının yanında bekleyen kediyi fark etti. Önce temiz su bulmalıyız.',task:'Çeşmede E ile su doldur; kedinin kabında E ile suyu bırak.',done:'Kedinin su kabı doldu. Patilerin izi bizi mama tezgâhına götürüyor.',type:'water'},
 {name:'Paylaşınca çoğalan hazine',intro:'Pamuk gizli işaretin yanında miyavlıyor. Bulduğun elmaslar yalnız puan değil: kediler için mamaya dönüşebilir.',task:'Üç elması topla. Bakkalda E ile mama al; mama kabına E ile koy.',done:'Kediler mamaya kavuştu. Bakkal, bir komşumuzun poşetlerini taşımakta zorlandığını söylüyor.',type:'feed'},
 {name:'Komşuya uzanan pati',intro:'Yaşlı komşumuz Neriman Hanım yardım isteğini kabul ediyor. Poşetini kapısına götürmek, dördüncü işareti açacak.',task:'Poşeti al; komşunun yanında E ile teslim et.',done:'Poşet güvenle ulaştı. Komşumuz bize havuz yolundaki kurallar levhasını tarif ediyor.',type:'elder'},
 {name:'Havuz kenarında sakin adımlar',intro:'Havuzun kenarı kaygan olabilir. Beşinci işaret hızlı olana değil, dikkatli olana görünüyor.',task:'Mavi havuz alanını Shift / Yavaş tuşunu basılı tutarak yürü. Sonunda levhada E ile kuralı onayla.',done:'Havuz çevresini koşmadan geçtin. Hava soğuyor; sıradaki işaret kış bahçesinden geliyor.',type:'pool'},
 {name:'Kışta bir sıcak yuva',intro:'Kar başlamış. Sokaktaki kedilerin kuru, korunaklı bir yuvaya; temiz suya ve mamaya ihtiyacı var. Bu bölümde üç işi birlikte yapacağız.',task:'Örtü ve elmasları al; çeşmeden su doldur. Tezgahtan mama al; yuvayı hazırla, su ve mama kaplarını doldur.',done:'Kış yuvası hazır, su ve mama tamam. Altıncı işaret bizi araç yolunun karşısına çağırıyor.',type:'winter'},
 {name:'Önce dur, sonra geç',intro:'Çınar karşı kaldırımda bir iz buldu. Fakat araç yolu oyun parkuru değildir: durmalı, iki yana bakmalı ve güvenli zamanı beklemeliyiz.',task:'Yolun önündeki DUR levhasında E ile bak. Işık yeşilken yaya geçidini geç.',done:'Güvenli geçiş tamam. Yol kenarında geri dönüştürülebilecek parçalar parlıyor.',type:'traffic'},
 {name:'Bahçenin ikinci şansı',intro:'Rüzgâr kâğıtları bahçeye taşımış. Kaptan Pengu, temiz bir çevrede herkesin rahatça oynayabileceğini hatırlatıyor.',task:'Üç çöpü topla, kutuya E ile bırak. Eldiven ödülün varsa G ile yakın çöpleri topla.',done:'Bahçe yeniden temiz. Sekizinci işaret, kurumaya başlayan çiçeklerin yanında.',type:'trash'},
 {name:'Canlanan çiçekler',intro:'Haritadaki yeşil çizgiler, susamış çiçeklere uzanıyor. Sulama kabını kullanıp bahçeye can verebiliriz.',task:'Çeşmede su al veya önceki bölüm ödülünü G ile kullan. Saksıda E ile sula.',done:'Çiçekler canlandı. Komşuluk rozetiyle son teslimat için yola çıkıyoruz.',type:'garden'},
 {name:'Kapıyı nazikçe çal',intro:'Bir komşumuzun unuttuğu alışveriş çantası bulundu. Önce haber verecek, sonra çantayı kapısında teslim edeceğiz.',task:'Çantayı al; komşunun yanında E ile teslim et. Kapıda koşmadan yaklaş.',done:'Çanta sahibine ulaştı. Son soğuk gece için kedi yuvalarını yeniden kontrol etmeliyiz.',type:'elder'},
 {name:'Son soğuk gece',intro:'On birinci işaret kar altında parlıyor. Önceki bölümde kazanılan bakım paketi, kedilerin sıcak yuvasına yardım edebilir.',task:'Kuru yuva, temiz su ve mama görevlerini tamamla. G ile bakım paketini açabilirsin.',done:'Kediler güvende. Bütün izler, 2001 Sitesi’ndeki İyilik Feneri’nin yerini gösteriyor!',type:'winter'},
 {name:'2001’in gerçek hazinesi',intro:'On bir iyilik işareti birleşti. Son parkuru aş, komşuluk sorusunu çöz ve feneri yak. Hazineyi herkes birlikte kullanacak.',task:'Parkurun nesnelerini topla; fenerin yanında E ile son işareti yerleştir.',done:'Tebrikler! İyilik Feneri yandı. 2001’in hazinesi; temiz bahçe, güvenli yollar, dayanışma ve kediler için sıcak bir yaşam köşesiymiş. Bunu birlikte kurdunuz!',type:'final'}
];
function decorate(l,profile={}){
 if(l.template===0){l.width=1200;l.height=1500;l.spawn={x:60,y:1234};l.grounds=[box(0,1280,1200,220)];l.platforms=[];l.ladders=[];l.anchors=[];for(let i=0;i<5;i++){const y=1060-i*220;l.platforms.push(box(80,y,1040,22));l.ladders.push(box(i%2?820:300,y,42,220));}l.items=[{...box(560,580,28,28),kind:'key',taken:false}];l.goal=box(1010,80,65,100);l.building={x:70,y:110,w:1060,h:1170};l.title='Sedir’in Katları ve Çatısı';l.mission='Zeminden başlayıp beş katı tırman; üçüncü kattaki anahtarla çatı portalını aç.';}
 if(l.template===5)l.building={x:330,y:160,w:1100,h:640};
 l.quest=quests[l.index];if(l.quest.type==='winter')l.season=3;
 l.enemies=[];l.agents=[];l.supplies=[];l.stations=[];l.cars=[];
 const sy=l.spawn.y+46,gy=l.goal.y+l.goal.h,sx=l.spawn.x,goalx=l.goal.x;
 const supply=(x,y,kind)=>l.supplies.push({...box(x,y-28),kind,taken:false});
 const station=(x,y,kind,label)=>l.stations.push({...box(x,y-48,38,48),kind,label});
 // Shared service landing keeps task stations supported in every shuffled layout.
// The exit has its own clear landing, beyond all existing route geometry.
const exitX=Math.max(l.width,...[...l.grounds,...l.platforms,...l.items].map(s=>s.x+s.w))+140;
l.goal.x=exitX;l.width=exitX+l.goal.w+160;
l.exitLane=box(exitX-100,l.goal.y-100,265,l.goal.h+100);
l.platforms.push(box(Math.max(0,goalx-330),gy,l.width-Math.max(0,goalx-330),16));
const q=l.quest.type;const sourceX=sx+50;
 if(['water','garden','winter'].includes(q))station(sourceX,sy,'tap','Çeşme · E');
 if(['feed','winter'].includes(q)){[110,190,270].forEach(dx=>supply(sx+dx,sy,'diamond'));station(goalx-220,gy,'shop','Mama · 3 💎 · E');station(goalx-80,gy,'foodBowl','Mama kabı · E');}
 if(q==='winter'){supply(sx+230,sy-85,'blanket');l.platforms.push(box(sx+190,sy-45,100,14));station(goalx-150,gy,'shelter','Kuru yuva · E');}
 if(q==='water'||q==='winter')station(goalx-20,gy,'waterBowl','Su kabı · E');
 if(q==='garden')station(goalx-90,gy,'plant','Çiçekler · E');
 if(q==='trash'){[80,170,260].forEach(dx=>supply(sx+dx,sy,'trash'));station(goalx-80,gy,'bin','Geri dönüşüm · E');}
 if(q==='elder'){supply(sx+100,sy,'parcel');station(goalx-90,gy,'elder','Komşumuz · E');}
 if(q==='pool'){l.pool=box(goalx-230,gy-12,200,12);station(goalx-20,gy,'poolSign','Yürüyüş kuralı · E');}
 if(q==='traffic'){l.road=box(sx+130,sy-10,170,10);station(sx+65,sy,'look','DUR · Bak · E');l.cars.push({...box(sx+160,sy-28,50,28),min:sx+130,max:sx+280,vx:115});}
 if(q==='final')station(goalx-90,gy,'beacon','İyilik Feneri · E');
 supply(sx+15,sy-65,'foam'); // A small hop earns the first three throws.
 supply(Math.max(30,goalx-300),gy,'heart');
 const surfaces=[...l.grounds,...l.platforms].filter(s=>s.y>=150&&s.w>=140);const used=[...l.items,...l.supplies,...l.stations];const points=[];
 for(const s of surfaces)for(const rise of [32,112])for(let x=s.x+45;x<s.x+s.w-40&&x<exitX-150;x+=95){const p=box(x,s.y-rise,24,24);if(!used.some(a=>Math.hypot(a.x-p.x,a.y-p.y)<78)&&!points.some(a=>Math.hypot(a.x-p.x,a.y-p.y)<78))points.push(p);}
 const candidates=V.shuffle(points,V.rng((profile.seed||1)+l.index*237));l.foods=[];l.cheeses=[];
 for(let i=0;i<Math.min(14,candidates.length);i++){const p=candidates[i];if(i<2)l.foods.push({...p,kind:i?'speed':'spinach',taken:false});else l.cheeses.push({...p,taken:false});}
 // Patrols stay on a support and away from spawn/quest stations.
 const supports=[...l.grounds,...l.platforms].filter(s=>s.y>100&&s.w>400&&Math.abs(s.y-sy)>80);
 if(!supports.length)supports.push(...l.grounds.filter(s=>s.w>600));
 supports.slice(0,2).forEach((s,i)=>{const min=s.x+150,max=Math.min(s.x+s.w-70,goalx-350);if(max-min<100)return;const type=(l.template+i)%4;l.agents.push({...box(min+50,s.y-46,32,46),type,min,max,baseY:s.y-46,vx:i?-65:65,facing:1,stun:0,shotAt:1.5+i});});
 return l;
}
function cleanSave(raw){const s=oldClean(raw),r=raw||{};s.reward=Number.isInteger(r.reward)&&r.reward>=0&&r.reward<=11?r.reward:-1;s.difficulty=r.difficulty==='hard'?'hard':'normal';s.civicDone=Array.from({length:12},(_,i)=>r.civicDone?.[i]===true);return s;}
class Game extends Base{
 load(i){super.load(i);decorate(this.level,this.profile);Object.assign(this.player,this.level.spawn);this.respawn={...this.level.spawn};this.lives=this.maxLives=3;this.projectiles=[];this.bag={foam:0,diamond:0,water:0,food:0,blanket:0,trash:0,parcel:0};this.civic={};this.fireHeld=false;this.giftHeld=false;this.giftUsed=false;this.slowTimer=0;this.gift=i>0&&this.profile.civicDone?.[i-1]?rewards[i-1]:null;this.notice=this.level.quest.task;this.walkDistance=0;this.looked=false;this.wasOnLeft=true;}
 hurt(){const before=this.lives;super.hurt();if(this.over&&before>0){Object.assign(this.player,this.level.spawn,{vx:0,vy:0});this.notice='Üç can bitti. Bu bölüm baştan başlayacak; tamamlanan duraklar korunur.';}}
 civicReady(){const q=this.level.quest.type;return q==='winter'?this.civic.shelter&&this.civic.water&&this.civic.feed:q==='feed'?this.civic.feed:q==='water'||q==='garden'?this.civic.water:q==='trash'?this.civic.trash:q==='elder'?this.civic.elder:q==='pool'?this.civic.pool:q==='traffic'?this.civic.traffic:this.civic.final;}
 ready(){return super.ready()&&!!this.civicReady();}
 remaining(){
 const l=this.level,b=this.bag,c=this.civic,steps=[];
 if(this.tokens<l.required)steps.push('Parkur nesnelerini bul: '+this.tokens+'/'+l.required+' (peynirler ayrı puandır).');
 if(l.template===4&&l.bridges.some(x=>!x.open))steps.push('Üç tahtayla köprü kolunda E tuşuna bas.');
 if(l.template===9&&this.switchCount<3)steps.push('Fenerleri sırayla yak: '+this.switchCount+'/3. Yakınında E tuşuna bas.');
 const q=l.quest.type;
 if((q==='feed'||q==='winter')&&!c.feed)steps.push(b.food?'Mama kabına yaklaş ve E tuşuna bas.':b.diamond>=3?'Bakkalın mama tezgâhında E tuşuna bas; ardından mama kabına götür.':'Mama için elmas topla: '+b.diamond+'/3.');
 if(['water','garden','winter'].includes(q)&&!c.water)steps.push(b.water?(q==='garden'?'Saksıya':'Su kabına')+' yaklaş ve E tuşuna bas.':'Çeşmeye yaklaş ve E ile su doldur.');
 if(q==='winter'&&!c.shelter)steps.push(b.blanket?'Kuru yuvaya yaklaş ve E ile örtüyü bırak.':'Kuru yuva örtüsünü bul.');
 if(q==='trash'&&!c.trash)steps.push(b.trash>=3?'Geri dönüşüm kutusunda E ile çöpleri bırak.':'Çöp topla: '+b.trash+'/3.');
 if(q==='elder'&&!c.elder)steps.push(b.parcel?'Komşunun yanında E ile poşeti teslim et.':'Komşunun poşetini bul.');
 if(q==='pool'&&!c.pool)steps.push(this.walkDistance>=100?'Havuz levhasında E tuşuna bas.':'Mavi alanda Yavaş / Shift ile yürü: '+Math.min(100,Math.floor(this.walkDistance))+'/100.');
 if(q==='traffic'&&!c.traffic)steps.push(this.looked?'Yeşil ışıkta yaya geçidinin sağ tarafına geç.':'DUR levhasında E ile iki yana bak.');
 if(q==='final'&&!c.final)steps.push(this.profile.civicDone.slice(0,11).every(Boolean)?'İyilik Feneri yanında E tuşuna bas.':'Haritadaki önceki komşuluk görevlerini tamamla.');
 return steps;
 }
 useGift(){if(!this.gift||this.giftUsed)return;this.giftUsed=true;const kind=this.gift[2];if(kind==='water')this.bag.water++;if(kind==='diamonds')this.bag.diamond+=3;if(kind==='shield')this.shield=true;if(kind==='calm'||kind==='traffic'){this.slowTimer=12;this.level.agents.forEach(a=>a.stun=12);}if(kind==='blanket')this.bag.blanket++;if(kind==='glove'){for(const s of this.level.supplies)if(s.kind==='trash'&&!s.taken&&Math.hypot(s.x-this.player.x,s.y-this.player.y)<330){s.taken=true;this.bag.trash++;}}if(kind==='care'){this.bag.blanket++;this.bag.food++;this.bag.water++;}if(kind==='star'){this.shield=true;this.lives=Math.min(3,this.lives+1);}this.notice=this.gift[1]+' kullanıldı.';this.emit('power');}
 interact(s,input){const b=this.bag,c=this.civic;
 if(s.kind==='tap'){b.water=1;this.notice='Matara temiz suyla doldu.';}
 if(s.kind==='shop'){if(c.feed)this.notice='Mama görevi zaten tamamlandı.';else if(b.food)this.notice='Mama çantanda. Mama kabına götür.';else if(b.diamond>=3){b.diamond-=3;b.food++;this.notice='Üç elmas karşılığında bir mama paketi aldın.';}else this.notice='Mama için üç elmas gerekiyor.';}
 if(s.kind==='foodBowl'&&!c.feed){if(b.food){b.food--;c.feed=true;this.notice='Kedilerin mama kabı doldu.';}else this.notice='Önce bakkaldan mama al.';}
 if(['waterBowl','plant'].includes(s.kind)&&!c.water){if(b.water){b.water--;c.water=true;this.notice=s.kind==='plant'?'Çiçekleri suladın.':'Temiz su kedilerin kabında.';}else this.notice='Çeşmeden su doldur veya matara ödülünü kullan.';}
 if(s.kind==='shelter'&&!c.shelter){if(b.blanket){b.blanket--;c.shelter=true;this.notice='Kediler için kuru, rüzgârdan korunaklı yuva hazır.';}else this.notice='Önce kuru yuva örtüsünü bul.';}
 if(s.kind==='bin'&&!c.trash){if(b.trash>=3){b.trash-=3;c.trash=true;this.notice='Üç çöp geri dönüşüm kutusunda. Bahçe temiz!';}else this.notice='Üç çöpü de topla.';}
 if(s.kind==='elder'&&!c.elder){if(b.parcel){b.parcel--;c.elder=true;this.notice='İzin isteyip poşeti teslim ettin. Teşekkür ederim!';}else this.notice='Komşumuzun poşetini bul.';}
 if(s.kind==='poolSign'){if(this.walkDistance>=100){c.pool=true;this.notice='Havuz çevresinde koşmadan yürüdün. Kural tamam!';}else this.notice='Mavi alanı Shift / Yavaş ile en az 100 adım birimi yürü.';}
 if(s.kind==='look'){this.looked=true;this.wasOnLeft=true;this.notice='İki yana baktın. Yeşil ışıkta geç; araçları izle.';}
 if(s.kind==='beacon'){if(this.profile.civicDone.slice(0,11).every(Boolean)){c.final=true;this.notice='Son işaret yerleşti. Portal bilmecelerini çöz ve feneri yak!';}else this.notice='Fener için önceki 11 komşuluk görevini de tamamla. Haritada bekleyen görevleri görebilirsin.';}
 this.emit('checkpoint');
 }
 step(dt,input={}){
 if(this.won||this.over||this.gatePending)return;dt=Math.min(dt,1/30);const p=this.player,l=this.level,action=input.action&&!this.actionHeld,fire=input.fire&&!this.fireHeld;this.fireHeld=!!input.fire;
 if(input.gift&&!this.giftHeld)this.useGift();this.giftHeld=!!input.gift;this.slowTimer=Math.max(0,this.slowTimer-dt);
 for(const s of l.supplies)if(!s.taken&&V.overlap(p,s)){if(s.kind==='heart'){if(this.lives>=3)continue;this.lives++;this.notice='Zor parkur ödülü: bir can kazandın!';}else if(s.kind==='foam'){this.bag.foam+=3;this.notice='Üç yumuşak top: F ile at. Iskalarsan geri gelmez.';}else this.bag[s.kind]++;s.taken=true;this.emit('cheese');}
 if(action){const done={foodBowl:'feed',waterBowl:'water',plant:'water',shelter:'shelter',bin:'trash',elder:'elder',poolSign:'pool',beacon:'final'};const stations=l.stations.filter(s=>near(p,s,72)&&!this.civic[done[s.kind]]).sort((a,b)=>Math.abs(p.x+p.w/2-a.x-a.w/2)-Math.abs(p.x+p.w/2-b.x-b.w/2));if(stations.length)this.interact(stations[0],input);}
 if(fire){if(this.bag.foam>0){this.bag.foam--;this.projectiles.push({...box(p.x+17,p.y+14,12,12),vx:p.facing*390,vy:-90,owner:'player',life:1.6});this.emit('throw');}else this.notice='Atacak top kalmadı. Mavi top paketlerini topla.';}
 const wasX=p.x;super.step(dt,input);if(input.walk){p.x=wasX+(p.x-wasX)*.45;p.vx*=.45;}if(this.over)return;
 if(l.pool&&V.overlap({...p,y:p.y+p.h-12,h:18},l.pool)){if(input.walk)this.walkDistance+=Math.abs(p.x-wasX);else if(Math.abs(p.x-wasX)>1&&this.walkDistance<100)this.walkDistance=0;}
 if(l.road){const green=this.slowTimer>0||Math.sin(this.time*.8)>0;l.road.green=green;if(p.x<l.road.x)this.wasOnLeft=true;if(p.x>l.road.x+l.road.w&&this.wasOnLeft){if(this.looked&&green){this.civic.traffic=true;this.notice='Durup baktın, güvenle karşıya geçtin.';}else this.notice='Geçişi tamamlamak için DUR levhasına dön, bak ve yeşili bekle.';this.wasOnLeft=false;this.looked=false;}for(const car of l.cars){if(!green){car.x+=car.vx*dt;if(car.x>car.max||car.x<car.min){car.vx*=-1;car.x=Math.max(car.min,Math.min(car.max,car.x));}}if(!green&&V.overlap(p,car))this.hurt();}}
 for(const a of l.agents){a.stun=Math.max(0,a.stun-dt);if(a.stun)continue;const role=roles[a.type],close=!this.hidden&&Math.abs(p.y-a.y)<90&&Math.abs(p.x-a.x)<350;if(!this.hidden&&!input.walk&&Math.abs(p.vx)>40&&Math.abs(p.x-a.x)<500&&Math.abs(p.y-a.y)<90)a.heard=p.x;if(role.style==='chase'&&close)a.vx=Math.sign(p.x-a.x)*105;else if(role.style==='chase'&&Number.isFinite(a.heard)&&Math.abs(a.heard-a.x)>20)a.vx=Math.sign(a.heard-a.x)*65;if(role.style==='throw'&&close){a.facing=p.x>a.x?1:-1;if(this.time>=a.shotAt){const dx=p.x-a.x,dy=p.y-a.y,len=Math.max(1,Math.hypot(dx,dy));this.projectiles.push({...box(a.x+16,a.y+15,13,10),vx:dx/len*175,vy:dy/len*175-45,owner:'agent',life:2.8});a.shotAt=this.time+2.8;}}a.x+=a.vx*dt;if(a.x<a.min||a.x>a.max){a.x=Math.max(a.min,Math.min(a.max,a.x));a.vx*=-1;}if(a.vx)a.facing=Math.sign(a.vx);if(!this.hidden&&V.overlap(p,a)){if(this.power.spinach>0){a.stun=5;this.emit('stomp');}else this.hurt();}}
 for(const b of this.projectiles){b.x+=b.vx*dt;b.y+=b.vy*dt;b.vy+=180*dt;b.life-=dt;if(b.owner==='player'){for(const a of l.agents)if(!a.stun&&V.overlap(b,a)){a.stun=5;b.life=0;this.emit('stomp');break;}}else if(V.overlap(b,p)){b.life=0;this.hurt();}if([...l.grounds,...l.rocks.filter(r=>!r.broken)].some(s=>V.overlap(b,s)))b.life=0;}
 this.projectiles=this.projectiles.filter(b=>b.life>0);
 if(V.overlap(p,l.goal)&&!this.civicReady())this.notice='Komşuluk görevi tamamlanmalı: '+l.quest.task;
 }
}
function mergeSave(a,b){const result=cleanSave(oldMerge(a,b)),left=cleanSave(a),right=cleanSave(b);const same=left.seed===right.seed&&JSON.stringify(left.order)===JSON.stringify(right.order);result.civicDone=left.civicDone.map((v,i)=>v||(same&&right.civicDone[i]));result.reward=same?Math.max(left.reward,right.reward):left.reward;return result;}
function award(save,game){save.civicDone[game.level.index]=true;if(game.level.index>save.reward)save.reward=game.level.index;}
Object.assign(V,{Game,buildLevel:(i,p)=>decorate(oldBuild(i,p),p),cleanSave,mergeSave,newRun:s=>{const n=cleanSave(oldNew(s));n.reward=-1;n.civicDone.fill(false);return n;},community:{roles,rewards,quests,award,decorate}});
if(typeof module!=='undefined')module.exports=V;
})(typeof window!=='undefined'?window:globalThis);
