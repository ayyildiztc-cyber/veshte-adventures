(function(root){
'use strict';
const V=root.Veshte||(typeof require==='function'?require('./living.js'):{}),Base=V.Game,oldClean=V.cleanSave,oldMerge=V.mergeSave,oldNew=V.newRun;
const chapters=[
 ['Peynir Mahallesi','Sedir’den yükselen sinyal','#f3c86a','#e5efce'],['Akıllı Telefon Dünyası','Kayıp bildirimler','#7ec9c6','#d9eef2'],['Peynir Tatil Kasabası','Kıyıdaki kavanoz','#e9b979','#e4f3ee'],['Peynir Otel','Gizemli oda anahtarı','#d9a8ba','#eee3ed'],['Peynir Rezidans Kenti','Çatıların şifresi','#a9b5d9','#e3e8f4'],['Buzlu Peynir Bahçesi','Sıcak bir iyilik','#a3d8e2','#e1f1f6'],['Misket Limu Adası','Yumurtanın sırrı','#c3dd81','#eef3d5'],['Siber Peynir Merkezi','Kayıp devre','#a2a6dd','#e8e4f7'],['UFO Gözlemevi','Gökyüzündeki misafirler','#b8acd7','#e5dfef'],['Peynir Tatil Kenti','Birlikte açılan hazine','#efc17e','#fff0d5']
];
const specs=[
 ['Sedir Meydanı',0,0,'jar'],['Komşu Çeşmesi',1,1,'lime'],['Uygulama Köprüsü',4,2,'computer'],['Bildirim Kulesi',5,3,'package'],['Sahil Tüneli',7,4,'jar'],['Tatil İskelesi',2,8,'lime'],['Otel Lobisi',3,3,'ice'],['Çatı Restoranı',0,2,'package'],['Rezidans Asansörü',5,0,'computer'],['Rüzgâr Terası',6,1,'lime'],['Kar Bahçesi',1,5,'ice'],['Sıcak Yuva',10,10,'ice'],['Limon Korusu',2,8,'lime'],['Sürpriz Atölyesi',4,7,'package'],['Devre Tüneli',3,6,'computer'],['Şifre Fenerleri',9,3,'computer'],['Yıldız Postası',6,5,'jar'],['UFO Geçidi',8,2,'ice'],['Tatil Kenti Yolu',10,9,'package'],['Birlik Feneri',11,11,'jar']
];
const stops=specs.map((s,i)=>({id:i,chapter:Math.floor(i/2),name:s[0],template:s[1],quest:s[2],special:s[3],theme:chapters[Math.floor(i/2)]}));
const items={jar:['🫙','Soru kavanozu','Kavanozu aç'],lime:['🍋','Misket limonu','Misket limonunu ye'],egg:['🥚','Sürpriz yumurta','Yumurtayı aç'],chocolate:['🍫','Sürpriz çikolata','Çikolatayı ye'],package:['🎁','Çoklu ödül paketi','Paketi aç'],ice:['🧊','Kırılabilir buz','Buzu kır'],cookie:['🥠','Şans kurabiyesi','Kurabiyeyi ye'],yogurt:['🍓','Danone Süprix · çilekli yoğurt','Yoğurdu ye'],computer:['💻','Siber bulmaca bilgisayarı','Bilgisayarı aç']};
function campaign(raw){const c=raw||{},done=Array.from({length:20},(_,i)=>c.completed?.[i]===true);let unlocked=0;while(unlocked<19&&done[unlocked])unlocked++;return {version:1,completed:done,best:Array.from({length:20},(_,i)=>Math.min(99,Math.max(0,Number(c.best?.[i])||0))),unlocked,slot:Math.min(unlocked,Math.max(0,Math.floor(Number(c.slot)||0)))};}
function cleanSave(raw){const s=oldClean(raw);s.adventure3d=campaign(raw?.adventure3d);return s;}
function mergeSave(a,b){const s=cleanSave(oldMerge(a,b)),x=campaign(a?.adventure3d),y=campaign(a?.seed===b?.seed?b?.adventure3d:null);s.adventure3d=campaign({...x,completed:x.completed.map((v,i)=>v||y.completed[i]),best:x.best.map((v,i)=>Math.max(v,y.best[i]))});return s;}
class Game extends Base{
 load(slot){const d=stops[Math.max(0,Math.min(19,slot))],profile=this.profile;this.profile={...profile,order:[...profile.order]};this.profile.order[d.quest]=d.template;super.load(d.quest);this.profile=profile;this.slot=d.id;const l=this.level;l.index=d.id;l.title=d.name;l.chapter=d.chapter;l.theme=d.theme;l.quest={...V.community.quests[d.quest]};this.gift=d.id&&profile.adventure3d?.completed[d.id-1]?V.community.rewards[(d.id-1)%11]:null;
 // Readable, separate service stations on the supported exit landing.
 const service=l.stations.filter(s=>!['tap','look'].includes(s.kind));const origin=l.goal.x-540;service.forEach((s,i)=>s.x=origin+i*105);
 if(l.pool){l.pool.x=origin-60;const sign=l.stations.find(s=>s.kind==='poolSign');sign.x=l.pool.x+l.pool.w+30;}
 const x=l.goal.x-155,y=l.goal.y+l.goal.h;l.special={x,y:y-40,w:34,h:40,kind:d.special,opened:false};l.cheeses=l.cheeses.filter(c=>Math.abs(c.x-x)>65);l.foods=l.foods.filter(c=>Math.abs(c.x-x)>65);
 const sx=l.spawn.x,sy=l.spawn.y+46;l.tunnel={x:sx+390,y:sy-48,w:44,h:48,toX:sx+100,toY:sy-46,used:false};const supports=[...l.grounds,...l.platforms].filter(s=>s.w>=220&&s.y>sy+100);const low=supports[0];if(low){l.tunnel.x=low.x+70;l.tunnel.y=low.y-48;}else{l.tunnel.x=sx+120;l.tunnel.y=sy-48;l.tunnel.toX=sx+400;l.tunnel.toY=sy-46;l.platforms.push({x:sx+350,y:sy,w:120,h:16});}
 const landing=[...l.grounds,...l.platforms].filter(r=>l.tunnel.toX+34>r.x&&l.tunnel.toX<r.x+r.w&&r.y>=l.tunnel.toY+40).sort((a,b)=>a.y-b.y)[0];if(landing)l.tunnel.toY=landing.y-46;
 this.pendingQuestion=null;this.civicAnnounced=false;this.hintHeld=false;this.superTime=0;this.bubble='Merhaba! '+l.quest.task;this.bubbleTime=8;this.hintTarget=null;this.hintTime=0;this.specialHeld=false;
 l.agents.forEach((a,i)=>{a.type=4+(d.chapter+i)%3;a.baseY=a.y;});
 this.notice=l.quest.task;
 }
 say(text){this.notice=text;this.bubble=text;this.bubbleTime=7;}
 interact(s,input={}){if(s.kind==='beacon'){if(this.profile.adventure3d.completed.slice(0,19).every(Boolean)){this.civic.final=true;this.say('20 durağın iyilikleri birleşti. Birlik Feneri hazır!');}else this.say('Haritadaki önceki durakları tamamlayalım.');return;}super.interact(s,input);this.say(this.notice);}
 remaining(){const a=super.remaining();if(this.level.quest.type==='final'&&!this.civic.final){a[a.length-1]=this.profile.adventure3d.completed.slice(0,19).every(Boolean)?'Birlik Feneri yanında E ile son işareti bırak.':'Haritadaki önceki 19 durağı tamamla.';}return a;}
 target(){const l=this.level,b=this.bag,c=this.civic,q=l.quest.type;const st=k=>l.stations.find(s=>s.kind===k),supply=k=>l.supplies.find(s=>s.kind===k&&!s.taken);let t;
 if(q==='trash'&&!c.trash)t=b.trash>=3?st('bin'):supply('trash');
 if(['water','garden','winter'].includes(q)&&!c.water)t=b.water?st(q==='garden'?'plant':'waterBowl'):st('tap');
 if(['feed','winter'].includes(q)&&!c.feed&&!t)t=b.food?st('foodBowl'):b.diamond>=3?st('shop'):supply('diamond');
 if(q==='winter'&&!c.shelter&&!t)t=b.blanket?st('shelter'):supply('blanket');
 if(q==='elder'&&!c.elder)t=b.parcel?st('elder'):supply('parcel');
 if(q==='pool'&&!c.pool)t=this.walkDistance>=100?st('poolSign'):l.pool;
 if(q==='traffic'&&!c.traffic)t=this.looked?l.road:st('look');
 if(q==='final'&&!c.final)t=st('beacon');
 if(!t&&!this.inventory.rope)t=l.items.find(i=>!i.taken&&i.kind==='rope');if(!t&&!this.inventory.pick)t=l.items.find(i=>!i.taken&&i.kind==='pick');if(!t&&this.tokens<l.required)t=l.items.find(i=>!i.taken&&!['rope','pick'].includes(i.kind));
 if(!t&&l.template===9)t=l.switches.find(s=>!s.on);
 if(!t&&l.template===4&&l.bridges.some(s=>!s.open))t=l.switches[0];
 return t||l.goal;
 }
 hint(){this.hintTarget=this.target();this.hintTime=12;const t=this.hintTarget,p=this.player,dir=t.x>p.x+55?'sağda →':t.x<p.x-55?'solda ←':'hemen yanında',vertical=t.y<p.y-90?'; yukarı çık':t.y>p.y+90?'; aşağı in':'';const names={tap:'Çeşmede E ile su doldur.',waterBowl:'Suyu kaba E ile bırak.',foodBowl:'Mamayı kaba E ile bırak.',shop:'Üç elmasla E tuşuna basıp mama al.',bin:'Üç çöpü kutuya E ile bırak.',shelter:'Örtüyü yuvaya E ile bırak.',elder:'Poşeti komşuna E ile teslim et.',plant:'E ile çiçeği sula.',poolSign:'E ile yürüyüşü tamamla.',look:'DUR levhasında E ile bak.',beacon:'E ile Birlik Feneri’ni yak.',trash:'İşaretli çöpü yürüyerek al.',parcel:'Poşeti yürüyerek al ve komşuna taşı.',diamond:'İşaretli elması al; mama için üç tane gerekiyor.',blanket:'Yukarıdaki örtüyü al; zıplayarak ulaşabilirsin.'};let text=names[t.kind];if(t===this.level.pool)text='Mavi alanda Yavaş / Shift basılı en az 100 birim yürü.';if(t===this.level.road)text='Yeşil ışıkta yolun sağ tarafına geç.';if(t===this.level.goal)text='Görevler tamam. Işıklı portala gir.';this.say((text||this.remaining()[0]||'İşarete yaklaş.')+' Hedef '+dir+vertical+'. Sarı işareti izle.');return this.hintTarget;}
 nearby(){const p=this.player,l=this.level,near=s=>s&&Math.abs(p.x+p.w/2-s.x-s.w/2)<72&&Math.abs(p.y+p.h-s.y-s.h)<70;const done={foodBowl:'feed',waterBowl:'water',plant:'water',shelter:'shelter',bin:'trash',elder:'elder',poolSign:'pool',beacon:'final'};const choices=l.stations.filter(s=>near(s)&&!this.civic[done[s.kind]]&&!(s.kind==='shop'&&(this.bag.food||this.civic.feed)));if(!l.special.opened&&near(l.special))choices.push(l.special);if(near(l.tunnel))choices.push(l.tunnel);choices.sort((a,b)=>Math.abs(p.x+p.w/2-a.x-a.w/2)-Math.abs(p.x+p.w/2-b.x-b.w/2));return choices[0]||null;}
 use(){const s=this.nearby();if(!s){this.say('Bir eşya veya görev noktasına yaklaş. I ile hedefi bulabilirsin.');return false;}if(s===this.level.special)return this.special();if(s===this.level.tunnel){Object.assign(this.player,{x:s.toX,y:s.toY,vx:0,vy:0});s.used=true;this.say('Mini tünelden geçtin. Görev eşyaların çantanda.');this.emit('power');return true;}this.interact(s);return true;}
 special(){const s=this.level.special;if(s.opened||this.pendingQuestion)return false;const change=k=>{s.kind=k;this.emit('power');};switch(s.kind){case 'jar':case 'computer':this.pendingQuestion=s.kind;this.emit('question');return true;case 'lime':change('egg');this.say('Misket limonundan sürpriz yumurta çıktı! E ile aç.');break;case 'egg':change('chocolate');this.say('Yumurtanın içinde çikolata var. E ile ye.');break;case 'chocolate':this.superTime=25;this.power.spinach=25;this.power.speed=25;this.shield=true;change('package');this.say('Çoklu süper progüç! Hız, koruma ve güçlü dokunuş. Paketi de aç!');break;case 'package':this.bag.foam+=5;this.bag.diamond+=3;this.bag.water++;this.lives=Math.min(3,this.lives+1);s.opened=true;this.say('Paket: 5 top, 3 elmas, 1 su ve bir can!');break;case 'ice':change('cookie');this.say('Buz kırıldı! Şans kurabiyesini E ile ye.');break;case 'cookie':change('yogurt');this.say('Şans kurabiyesi: İyilik paylaştıkça büyür! Süprix sürprizi çıktı.');break;case 'yogurt':this.superTime=30;this.power.speed=30;this.power.spinach=30;this.shield=true;s.opened=true;this.say('Çilekli süper süper progüç! 30 saniye hız ve koruma.');break;}return true;}
 answerSpecial(correct){if(!this.pendingQuestion)return false;if(!correct){this.say('Bir daha düşün. İpucu isteyebilirsin.');return false;}this.pendingQuestion=null;this.level.special.kind='package';this.say('Şifre çözüldü! Çoklu ödül paketini E ile aç.');this.emit('power');return true;}
 step(dt,input={}){if(this.won||this.over||this.gatePending||this.pendingQuestion)return;this.superTime=Math.max(0,this.superTime-dt);this.hintTime=Math.max(0,this.hintTime-dt);this.bubbleTime=Math.max(0,this.bubbleTime-dt);if(input.hint&&!this.hintHeld)this.hint();this.hintHeld=!!input.hint;
 const action=input.action&&!this.specialHeld;this.specialHeld=!!input.action;const n=this.nearby();if(action&&n)this.use();const adjusted=n?{...input,action:false}:input;
 for(const a of this.level.agents)if(a.type===6)a.y=a.baseY+Math.sin(this.time*2)*20;
 super.step(dt,adjusted);
 if(this.hintTime>0)this.hintTarget=this.target();
 if(this.civicReady()&&!this.civicAnnounced){this.civicAnnounced=true;this.say('Komşuluk görevi tamamlandı ✓ '+(this.tokens<this.level.required?'Şimdi parkur nesnesini bul.':'Portala ilerle!'));}
 }
}
const extras=[{name:'İskelet nöbetçi',icon:'💀',color:'#e5dbbb',style:'patrol',text:'Kemik kostümlü oyuncu; ileri geri devriye gezer.'},{name:'Uzaylı Poop',icon:'👾',color:'#aa78c9',style:'chase',text:'Zıpır uzaylı yaklaştığında takip eder.'},{name:'UFO ekibi',icon:'🛸',color:'#68babb',style:'throw',text:'Uçar, yön değiştirir ve ışık topları gönderir.'}];
V.community.roles.splice(4,3,...extras);
V.cleanSave=cleanSave;V.mergeSave=mergeSave;V.newRun=s=>({...oldNew(s),adventure3d:campaign(s?.adventure3d)});
root.VeshteAdventure={Game,stops,chapters,items,campaign,cleanSave,mergeSave};if(typeof module!=='undefined')module.exports=root.VeshteAdventure;
})(typeof window!=='undefined'?window:globalThis);
