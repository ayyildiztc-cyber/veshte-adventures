(function(root){
'use strict';
const V=root.Veshte||(typeof require==='function'?require('./community.js'):{}),Base=V.Game,oldClean=V.cleanSave,oldMerge=V.mergeSave,oldNew=V.newRun,oldAward=V.community.award;
const clues=['Posta kutusundaki mektup: Hazine, paylaştıkça büyür.','Eski fotoğraf: İlk komşular aynı ağacın gölgesinde buluşmuş.','Pati izi: Haritadaki küçük kaplar bir beslenme rotasıymış.','Teşekkür kartı: Güven, küçük yardımlarla kurulur.','Mavi işaret: Dikkatli adımlar herkesi korur.','Örtü parçası: Sıcaklık yalnız güneşten gelmez.','Çizgili taş: Yol, karşıya güvenle geçince tamamlanır.','Geri dönüşüm damgası: Atık sandığın şey yeniden işe yarar.','Kurumuş tohum: Biraz özenle yeniden yeşerebilirim.','Eski kapı tokmağı: Önce izin, sonra yardım.','On bir yıldızlı not: Son anahtar bir eşya değil, dayanışmadır.','Fenerin içindeki yazı: 2001’in hazinesi, birlikte güzelleştirdiğimiz yerdir.'];
const abilities={bagujik:['🔧','Tamir asansörü','E ile motoru onar; hareketli platformla balkona çık.'],ceren:['🤝','Komşu merdiveni','E ile komşudan izin iste; balkon merdiveni açılsın.'],cinar:['🔎','Gizli basamaklar','E ile çevreyi gözle; gizli basamakları ve görev işaretlerini gör.'],kermit:['🐾','Havalandırma geçidi','E ile dar geçitten balkona ulaş.'],pengu:['🌬','Rüzgâr bacası','E ile bacayı aç; yukarı üfleyen hava seni balkona taşısın.']};
const recipes={ladder:{name:'İpli merdiven',needs:{plank:1,string:1}},shelter:{name:'Yuva kiti',needs:{box:1,cloth:1}},decoy:{name:'Sesli dikkat kutusu',needs:{box:1,string:1}}};
function cleanSave(raw){const s=oldClean(raw),r=raw||{};s.restored=Array.from({length:12},(_,i)=>r.restored?.[i]===true||s.civicDone[i]);s.diary=Array.from({length:12},(_,i)=>r.diary?.[i]===true||s.civicDone[i]);s.family=r.family===true;s.largeControls=r.largeControls!==false;s.narrate=r.narrate===true;return s;}
function mergeSave(a,b){const l=cleanSave(a),r=cleanSave(b),s=cleanSave(oldMerge(l,r));s.restored=l.restored.map((x,i)=>x||r.restored[i]);s.diary=l.diary.map((x,i)=>x||r.diary[i]);s.family=l.family;s.largeControls=l.largeControls;s.narrate=l.narrate;return s;}
class Game extends Base{
 load(i){super.load(i);const l=this.level,x=l.spawn.x,y=l.spawn.y+56;this.materials={plank:0,string:0,box:0,cloth:0};this.crafted=0;this.decoy=null;this.scout=false;this.talkTarget=null;this.talkHeld=false;this.hidden=false;this.easy=this.profile.family===true;
 l.workshop={x:x+5,y:y-48,w:36,h:48};l.heroRoute={x:x+55,y:y-48,w:36,h:48,used:false,bonus:false,top:y-145,bx:x+255};l.materials=['plank','string','box','cloth'].map((kind,j)=>({x:x+110+j*58,y:y-65-(j%2)*30,w:22,h:22,kind,taken:false}));l.hiding=[...l.agents.map(a=>({x:a.min+25,y:a.y-12,w:75,h:60}))];l.platforms.push({x:x+240,y:y-145,w:115,h:18});this.notice+=' · H: karakter yolu · C: atölye · Q: konuş.';
 }
 activateRoute(){const r=this.level.heroRoute,p=this.player;if(r.used||Math.hypot(p.x-r.x,p.y-r.y)>90)return false;r.used=true;const l=this.level,y=l.spawn.y+56;
 if(this.character==='bagujik')l.lifts.push({x:r.bx,y:y-18,w:100,h:18,base:y-18,to:r.top,phase:0});
 if(this.character==='ceren')l.ladders.push({x:r.bx+20,y:r.top,w:42,h:y-r.top});
 if(this.character==='cinar'){this.scout=true;[1,2,3].forEach(n=>l.platforms.push({x:r.x+60*n,y:y-48*n,w:75,h:12}));}
 if(this.character==='kermit')Object.assign(p,{x:r.bx+20,y:r.top-p.h,vx:0,vy:0});
 if(this.character==='pengu')l.winds.push({x:r.bx-25,y:r.top-90,w:140,h:y-r.top+90,force:950});
 this.notice=abilities[this.character][1]+' açıldı. Balkondaki yıldız üç elmas verir.';this.emit('power');return true;
 }
 craft(kind){const r=recipes[kind];if(!r||Object.entries(r.needs).some(([k,n])=>this.materials[k]<n)){this.notice='Gerekli malzemeleri topla; atölye çantasında eksikler yazıyor.';return false;}const p=this.player,l=this.level;
 if(kind==='ladder'){const platform={x:p.x-20,y:p.y+p.h-160,w:100,h:14};if([...l.grounds,...l.rocks.filter(x=>!x.broken)].some(x=>V.overlap(platform,x))){this.notice='Burada yukarıdaki yol kapalı. Merdiveni açık bir yerde kur.';return false;}l.ladders.push({x:p.x,y:platform.y,w:42,h:160});l.platforms.push(platform);}
 if(kind==='shelter'){this.bag.blanket++;this.shield=true;}
 if(kind==='decoy')this.decoy={x:p.x+p.facing*110,y:p.y,time:10};
 for(const[k,n]of Object.entries(r.needs))this.materials[k]-=n;this.crafted++;this.notice=r.name+' hazır!';this.emit('power');return true;
 }
 talk(correct){if(!this.talkTarget)return;if(correct){this.talkTarget.stun=14;this.notice='Nazikçe anlaştınız. Görevli geçmen için mola verdi.';}else this.notice='Önce dinle, izin iste ve güvenli yolu seç. Yeniden konuşabilirsin.';this.talkTarget=null;}
 step(dt,input={}){if(this.won||this.over||this.gatePending)return;const l=this.level,p=this.player;this.easy=this.profile.family===true;this.hidden=!!input.walk&&l.hiding.some(s=>V.overlap(p,s));
 if(input.hero&&!this.heroHeld)this.activateRoute();this.heroHeld=!!input.hero;
 if(input.talk&&!this.talkHeld){const a=l.agents.find(a=>Math.hypot(a.x-p.x,a.y-p.y)<100&&!a.stun);if(a){this.talkTarget=a;this.emit('talk');}else this.notice='Q ile konuşmak için görevliye yaklaş.';}this.talkHeld=!!input.talk;
 for(const s of l.materials)if(!s.taken&&V.overlap(p,s)){s.taken=true;this.materials[s.kind]++;this.emit('cheese');this.notice='Atölye malzemesi toplandı. C ile çantanı aç.';}
 const r=l.heroRoute;if(r.used&&!r.bonus&&Math.hypot(p.x-(r.bx+40),p.y-(r.top-46))<50){r.bonus=true;this.bag.diamond+=3;this.notice='Karakter yolu tamam! Üç bonus elmas kazandın.';this.emit('power');}
 if(this.decoy){this.decoy.time-=dt;if(this.decoy.time<=0)this.decoy=null;else for(const a of l.agents)if(Math.abs(a.y-this.decoy.y)<90){a.stun=Math.max(a.stun,.08);a.x=Math.max(a.min,Math.min(a.max,a.x+Math.sign(this.decoy.x-a.x)*65*dt));a.facing=Math.sign(this.decoy.x-a.x)||1;}}
 const factor=this.easy?.72:1;super.step(dt*factor,input);if(this.hidden)this.notice='Saklandın. Shift / Yavaş basılıyken görevli seni fark etmiyor.';
 }
 hurt(){super.hurt();if(this.easy&&this.invulnerable>0)this.invulnerable=Math.max(this.invulnerable,4);}
}
V.community.award=function(s,g){oldAward(s,g);s.restored[g.level.index]=true;s.diary[g.level.index]=true;};
Object.assign(V,{Game,cleanSave,mergeSave,newRun:s=>{const n=cleanSave(oldNew(s));n.restored=cleanSave(s).restored;n.diary=cleanSave(s).diary;n.family=s.family;n.largeControls=s.largeControls;n.narrate=s.narrate;return n;},living:{clues,abilities,recipes}});
if(typeof module!=='undefined')module.exports=V;
})(typeof window!=='undefined'?window:globalThis);
