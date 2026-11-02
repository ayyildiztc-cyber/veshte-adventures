'use strict';
(()=>{
const stops=[
 {name:'Sedir Blok',sub:'S Blok · Maceranın başladığı yer',x:195,y:83,story:'Sedir’in önünde eski bir harita buldun. Ceren ilk portalın anahtarını arıyor.'},
 {name:'Fısıldayan Bahçe',sub:'Batı toplanma alanı',x:164,y:130,story:'Yaprakların arasındaki izi takip et. Ispanak kısa süreli güç verir; pofuduklara güvenle dokunabilirsin.'},
 {name:'Eski Yol Ayrımı',sub:'İç yolların kesişimi',x:130,y:193,story:'Kaptan Pengu yol ayrımında seni bekliyor. Hareket eden engelleri gözle, doğru anda zıpla.'},
 {name:'Peynir Sokağı',sub:'B Blok çevresi',x:105,y:232,story:'Kasabanın peynirleri bu yola dağılmış. Portalı bulup küçük soruyu çöz.'},
 {name:'Gizli Sandık',sub:'H Blok çevresi',x:193,y:264,story:'Bir sandık işareti! Kermit, anahtarı bulmak için sembollerin sırasını hatırlamanı istiyor.'},
 {name:'Kristal Kavşak',sub:'Doğu iç yolu',x:255,y:195,story:'Mavi kristaller rüya dünyasına açılıyor. Hız meyvesiyle kısa süre daha hızlı koşabilirsin.'},
 {name:'Rüya Geçidi',sub:'J Blok çevresi',x:278,y:237,story:'Yerçekimi hafifliyor. Uzun zıplayışlarını dikkatle zamanla; havadaki engelleri izle.'},
 {name:'Havuzun Sırrı',sub:'Plandaki yüzme havuzu',x:350,y:231,story:'Havuzun yansımasında ikinci harita parçası görünüyor. Bu bir hayal dünyası; suya girmeden portalı bul.'},
 {name:'Kaptanın Rotası',sub:'L Blok çevresi',x:350,y:192,story:'Penguteam’in yolu doğuya uzanıyor. Yaylı minderler seni yukarı taşıyacak.'},
 {name:'Dostluk Arenası',sub:'Plandaki tenis kortu',x:302,y:122,story:'Çınar’ın beceri etabına hoş geldin. Parkuru geç, sembol anahtarını aç ve takıma katıl.'},
 {name:'Yuva Bahçesi',sub:'P Blok çevresi',x:278,y:85,story:'Ceren, yavrular için son hazırlıkları yapıyor. Son bahçenin peynirlerini toplayalım.'},
 {name:'Büyük Hazine',sub:'Üst sosyal tesis alanı',x:230,y:45,story:'Hazine, birlikte tamamladığınız yolculuk! Son portal 22 yavru grubunun yuvasına açılıyor.'}
];
const characters=[['bagujik','Bagujik','🐭','Yeşil tüylü kaşif · Dengeli hareket'],['ceren','Ceren','🌸','Pembe kaşif · Bagujik ile aynı fizik'],['cinar','Çınar','⚽','Takımın koşucusu · Biraz daha hızlı'],['kermit','Kermit','🐱','Meraklı kedi · Biraz daha yüksek zıplar'],['pengu','Kaptan Pengu','🐧','Kaptan · Hasar sonrası daha uzun koruma']];
const route='195,83 195,97 158,97 164,130 128,130 130,193 105,188 105,232 132,247 193,249 193,264 214,249 252,243 255,195 257,243 278,237 289,224 320,197 350,231 341,174 350,192 355,140 315,110 302,122 286,129 265,150 241,98 278,85 265,99 241,98 230,45';
const map=document.createElement('dialog');map.id='journeyDialog';map.setAttribute('aria-labelledby','journeyTitle');
map.innerHTML=`<div class="map-heading"><div><span class="eyebrow">VESHTE • HAZİNE GÜNLÜĞÜ</span><h2 id="journeyTitle">2001 Sitesi’nin sırrı</h2></div><button id="closeMap" aria-label="Haritayı kapat">×</button></div><p class="map-intro">Her yol bir ipucu. Her portal yeni bir macera. <b>Başlangıç: Sedir Blok.</b></p><div class="map-layout"><div class="parchment"><span class="map-stamp">2001<br>SİTESİ</span><svg id="treasureMap" viewBox="0 0 430 310" role="img" aria-label="2001 Sitesi planından uyarlanan hazine haritası. Sedir S Blok başlangıçtır."><image href="site-map.svg" width="430" height="310"/><polyline points="${route}" fill="none" stroke="#884d31" stroke-width="1.6" stroke-dasharray="3 3" opacity=".65"/><g id="mapPins"></g><g transform="translate(38 45)" fill="#72583a"><path d="M0 -16L4 -3L16 0L4 3L0 16L-4 3L-16 0L-4 -3Z"/><text y="-20" text-anchor="middle" font-size="7">K</text></g></svg><span class="map-caption">Sedir’den başlayan keşif rotası • Planın yerleşimi korunmuştur</span></div><aside class="map-card"><span id="stopNumber" class="eyebrow"></span><h3 id="stopName"></h3><small id="stopPlace"></small><p id="stopStory"></p><div id="stopStars"></div><button id="enterStop" class="primary">Bu maceraya gir →</button><p class="fine">Portalın sonunda soru veya hafıza görevi seni bekler. Yanlış yaparsan ipucu alıp yeniden deneyebilirsin.</p></aside></div><div class="character-heading"><h3>Yol arkadaşını seç</h3><span>Her karakter baştan açık</span></div><div id="characters" class="character-grid"></div><div id="stopList" class="stop-list" aria-label="Haritadaki bölümler"></div><p class="map-note">Mevcut 2001 Sitesi çiziminden oyun için uyarlanmıştır. Konum takibi yapılmaz; hazine adları ve görevler kurgudur.</p>`;
document.body.append(map);
const challengeDialog=document.createElement('dialog');challengeDialog.id='challengeDialog';challengeDialog.setAttribute('aria-labelledby','challengeTitle');challengeDialog.innerHTML='<span class="eyebrow">PORTALIN ANAHTARI</span><h2 id="challengeTitle"></h2><p id="challengeText"></p><div id="challengeChoices"></div><p id="challengeFeedback" role="status"></p><button id="challengeMap">Haritaya dön</button>';document.body.append(challengeDialog);
const mapButton=document.createElement('button');mapButton.id='openMap';mapButton.textContent='🗺 Hazine haritası';document.querySelector('.top-actions').prepend(mapButton);
const power=document.createElement('span');power.id='powerStatus';power.textContent='🥬 Ispanak: güç · 🍓 Meyve: hız';document.querySelector('.game-bottom').lastElementChild.replaceWith(power);
let selected=save.unlocked,sequenceStep=0;
function showMap(index=game.level.index){playing=false;clearInput();selected=Math.min(index,save.unlocked);renderJourney();if(!map.open)map.showModal();}
function renderJourney(){
 const stop=stops[selected];$('stopNumber').textContent='BÖLÜM '+(selected+1)+' / 12';$('stopName').textContent=stop.name;$('stopPlace').textContent=stop.sub;$('stopStory').textContent=stop.story;$('stopStars').textContent=save.completed[selected]?'★'.repeat(stars(save.best[selected],true))+' · En iyi: '+save.best[selected]+' peynir':'Henüz keşfedilmedi';$('enterStop').textContent=game.level.index===selected&&game.gatePending?'Portal görevine dön →':'Bu maceraya gir →';
 $('mapPins').innerHTML=stops.map((s,i)=>`<g transform="translate(${s.x} ${s.y})"><circle r="${i===selected?9:7}" fill="${i>save.unlocked?'#ac9976':save.completed[i]?'#59734a':i===selected?'#a95436':'#f7e6b7'}" stroke="#5c482f" stroke-width="1.2"/><text text-anchor="middle" y="2.7" font-size="7" font-family="sans-serif" font-weight="bold" fill="${i>save.unlocked?'#efdfbd':save.completed[i]||i===selected?'#fff4d6':'#5c482f'}">${i>save.unlocked?'?':i+1}</text>${i===0?'<text x="-13" y="-13" text-anchor="middle" font-size="8" font-weight="bold" fill="#684124">SEDİR · S</text>':''}</g>`).join('');
 $('stopList').replaceChildren();stops.forEach((s,i)=>{const b=document.createElement('button');b.textContent=(i>save.unlocked?'🔒 ':String(i+1).padStart(2,'0')+' · ')+s.name;b.disabled=i>save.unlocked;b.className=i===selected?'selected':'';b.setAttribute('aria-pressed',String(i===selected));b.onclick=()=>{selected=i;renderJourney();};$('stopList').append(b);});
 $('characters').replaceChildren();for(const [id,name,icon,desc]of characters){const b=document.createElement('button');b.innerHTML='<span>'+icon+'</span><b>'+name+'</b><small>'+desc+'</small>';b.setAttribute('aria-pressed',String(save.character===id));b.onclick=()=>{save.character=id;game.character=id;persist();renderJourney();};$('characters').append(b);}
}
const baseSelect=selectLevel;
selectLevel=function(index){baseSelect(index);$('levelTitle').textContent=stops[game.level.index].name;showMap(game.level.index);};
$('openMap').onclick=()=>showMap();$('closeMap').onclick=()=>map.close();$('enterStop').onclick=()=>{map.close();if(game.level.index!==selected||game.won||game.over)baseSelect(selected);$('levelTitle').textContent=stops[selected].name;start();};
$('next').onclick=()=>selectLevel(Math.min(11,game.level.index+1));
window.addEventListener('veshte-save',()=>queueMicrotask(()=>showMap(Math.min(save.unlocked,game.level.index+1))));
const questions=[
 ['Sedir Blok’un haritadaki harfi hangisi?',['S','B','P'],0,'Haritada başlangıç noktasının yanında SEDİR · S yazıyor.'],
 ['3 peynir buldun, 2 peynir daha aldın. Kaç peynirin oldu?',['4','5','6'],1,'Üçten sonra iki kez daha say: dört, beş.'],
 ['2, 4, 6, … Sıradaki sayı hangisi?',['7','10','8'],2,'Sayılar her adımda iki artıyor.'],
 ['Hangisi diğerlerinden farklı?',['Üçgen','Kare','Elma'],2,'İki seçenek geometrik şekil; biri meyve.'],
 ['Dört arkadaş iki takıma eşit ayrılırsa her takımda kaç kişi olur?',['2','3','4'],0,'Dört kişiyi ikişer gruplara ayır.'],
 ['Bir arkadaşın parkurda zorlanırsa ne yaparsın?',['Onunla alay ederim','İpucu verip cesaretlendiririm','Oyundan çıkarırım'],1,'Veshte’de arkadaşlar birbirine destek olur.']
];
function finishChallenge(){challengeDialog.close();game.finishGate();playing=true;clearInput();canvas.focus({preventScroll:true});}
function challenge(){if(!game.gatePending)return;playing=false;clearInput();$('challengeFeedback').textContent='';$('challengeChoices').replaceChildren();const i=game.level.index;
 if(i%2===0){const [q,choices,answer,hint]=questions[i/2];$('challengeTitle').textContent='Bilmeceyi çöz, portalı aç';$('challengeText').textContent=q;choices.forEach((text,n)=>{const b=document.createElement('button');b.textContent=text;b.onclick=()=>{if(n===answer)finishChallenge();else{$('challengeFeedback').textContent='Bir daha deneyelim. İpucu: '+hint;beep('checkpoint');}};$('challengeChoices').append(b);});}
 else{const symbols=['🌿','⭐','🧀'],pattern=[i%3,(i+1)%3,(i+2)%3];sequenceStep=0;$('challengeTitle').textContent='Sembol anahtarı';$('challengeText').textContent='Sırayı aklında tut: '+pattern.map(n=>symbols[n]).join(' → ');const ready=document.createElement('button');ready.className='primary';ready.textContent='Hazırım, sırayı gizle';ready.onclick=()=>{$('challengeText').textContent='Üç sembole aynı sırayla dokun.';$('challengeChoices').replaceChildren();symbols.forEach((symbol,n)=>{const b=document.createElement('button');b.textContent=symbol;b.setAttribute('aria-label',['Yaprak','Yıldız','Peynir'][n]);b.onclick=()=>{if(n===pattern[sequenceStep]){sequenceStep++;$('challengeFeedback').textContent=sequenceStep+' / 3 doğru';beep('cheese');if(sequenceStep===3)finishChallenge();}else{challenge();$('challengeFeedback').textContent='Sorun değil, yeniden hatırlayalım.';}};$('challengeChoices').append(b);});};$('challengeChoices').append(ready);}
 if(!challengeDialog.open)challengeDialog.showModal();}
challengeDialog.addEventListener('cancel',()=>{queueMicrotask(()=>showMap());});$('challengeMap').onclick=()=>{challengeDialog.close();showMap();};
window.VeshteJourney={challenge,showMap};
document.querySelector('.world-section .section-title h2').textContent='Altı hayal dünyası, tek keşif rotası';
$('levelTitle').textContent=stops[game.level.index].name;showMap();
})();
