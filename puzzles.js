(function(root){
'use strict';
// Original Turkish clues. Ten clue-pair variants for each of 50 concepts.
const concepts=[
['Güneş','Gündüz gökyüzünü aydınlatırım|Dünyayı ısıtan bir yıldızım|Doğarken sabah başlar|Bana doğrudan bakmak gözlerini incitir|Bitkiler ışığımdan yararlanır'],
['Ay','Dünya çevresinde dolanırım|Güneş ışığını yansıtırım|Bazen ince bir hilal gibi görünürüm|Yüzeyimde kraterler vardır|Dünya’nın doğal uydusuyum'],
['Bulut','Gökyüzünde su damlacıkları taşırım|Rüzgâr beni başka yerlere götürür|Yağmur benden düşebilir|Bazen pamuk yığınına benzerim|Güneşin önüne geçince gölge yaparım'],
['Yağmur','Bulutlardan damlalar halinde inerim|Toprağı ıslatırım|Şemsiyeni açmana neden olurum|Camda küçük damla izleri bırakırım|Kurumuş bahçeye su getiririm'],
['Kar','Soğuk havada beyaz tanelerle yağarım|Tanelerim buz kristalleridir|Biriktirilince kardan adam olurum|Isınınca suya dönüşürüm|Yeri beyaz bir örtü gibi kaplarım'],
['Rüzgâr','Havanın hareketiyim|Yelkenleri şişiririm|Uçurtmayı havada tutmaya yardım ederim|Yaprakları kımıldatırım|Beni göremezsin ama esişimi hissedersin'],
['Gökkuşağı','Gökyüzünde renkli bir yayım|Güneşli yağmurdan sonra görünebilirim|Su damlaları ışığı ayırınca oluşurum|Kırmızıdan mora uzanan renkler taşırım|Yaklaşsan da beni elinle tutamazsın'],
['Ağaç','Toprağa köklerimle tutunurum|Odunsu bir gövdem vardır|Dallarıma kuşlar konabilir|Yapraklarım güneşten yararlanır|Büyüdükçe gövdemde halkalar oluşur'],
['Çiçek','Bitkinin renkli taç yapraklarını taşırım|Arılar nektarımı arayabilir|Bazı türlerim güzel kokar|Tohum oluşumunda görev alırım|Tomurcuk halinden açılırım'],
['Elma','Ağaçta büyüyen bir meyveyim|Ortamdaki çekirdek yuvası yıldız gibi görünebilir|Kırmızı yeşil ya da sarı olabilirim|Isırınca çıtır bir ses çıkarabilirim|Kabuklu yuvarlak bir meyveyim'],
['Muz','Uzun ve kıvrık bir meyveyim|Olgun kabuğum çoğunlukla sarıdır|Yemeden önce kalın kabuğum soyulur|Bir salkımda birlikte büyürüm|İçim yumuşak ve açık renklidir'],
['Havuç','Turuncu köküm yenebilir|Toprağın altında büyürüm|Üstümde yeşil yapraklar vardır|Uzun ve uca doğru incelen bir sebzeyim|Salataya rendelenebilirim'],
['Peynir','Sütten yapılan bir yiyeceğim|Bazı türlerimde delikler bulunur|Tostta eriyebilirim|Kahvaltıda dilim dilim yenebilirim|Bagujik beni toplamayı sever'],
['Ekmek','Hamurum fırında pişer|Dilimlerimle sandviç yapılır|Kabuk ve iç kısımlarım vardır|Un ve suyla hazırlanabilirim|Fırından çıkınca güzel kokarım'],
['Bal','Arıların yaptığı tatlı bir yiyeceğim|Çiçek nektarından oluşurum|Petek gözlerinde saklanırım|Kavanozdan yavaşça akarım|Çoğunlukla altın sarısı görünürüm'],
['Kedi','Miyav diye ses çıkarırım|Yüzümde uzun bıyıklar vardır|Tırnaklarımı çoğu zaman içeri çekebilirim|Memnunken mırıldanabilirim|Veshte’de Pamuk benim türümdendir'],
['Fare','Küçük bir kemirgenim|İnce uzun kuyruğum vardır|Ön dişlerim sürekli uzar|Küçük aralıklardan geçebilirim|Bagujik ve Ceren benim türümdendir'],
['Mirket','Afrika’da yaşayan küçük bir memeliyim|Çevreyi izlerken dik durabilirim|Gözlerimin çevresinde koyu lekeler vardır|Gruplar halinde yuvalarda yaşarım|Çınar benim türümdendir'],
['Penguen','Uçamayan bir kuşum|Kanatlarım yüzmeye uygundur|Suda balık peşinden giderim|Karada dik yürürüm|Kaptan Pengu benim türümdendir'],
['Tavşan','Uzun kulaklı bir memeliyim|Güçlü arka bacaklarımla sıçrarım|Bitkilerle beslenirim|Kısa tüylü bir kuyruğum vardır|Tehlikeyi kulaklarımla fark edebilirim'],
['Kaplumbağa','Sırtımda sert bir kabuk taşırım|Bir sürüngenim|Bazı türlerim karada bazıları suda yaşar|Yumurtayla çoğalırım|Kabuğum iskeletimin bir parçasıdır'],
['Kelebek','Tırtıldan dönüşerek büyürüm|Dört renkli kanadım vardır|Çiçeklerin çevresinde uçabilirim|Antenlerimle çevremi algılarım|Bir böceğim ve altı bacağım vardır'],
['Arı','Altı bacaklı uçan bir böceğim|Çiçekler arasında polen taşıyabilirim|Bazı türlerim kovanda yaşar|Vızıldayarak uçabilirim|Bal yapan türlerim vardır'],
['Karınca','Altı bacağımla yerde yürürüm|Koloniler halinde yaşarım|Antenlerimle haberleşmeye yardım ederim|Yuvama yiyecek taşırım|Yollarda sıra halinde görülebilirim'],
['Balık','Solungaçlarımla sudan oksijen alırım|Yüzgeçlerimle yön değiştiririm|Çoğu türümün pulları vardır|Suda yaşayan omurgalıyım|Kuyruğum yüzmeme yardım eder'],
['Baykuş','Gözlerim başımın ön tarafındadır|Bir kuşum ve güçlü pençelerim vardır|Birçok türüm gece avlanır|Sessiz uçmaya uygun tüylerim vardır|Başımı geniş bir açıyla çevirebilirim'],
['Kirpi','Sırtımda sivri dikenler taşırım|Tehlikede top gibi kıvrılabilirim|Küçük bir memeliyim|Uzun burnumla yiyecek ararım|Dikenlerim değişmiş kıllardır'],
['Salyangoz','Ev gibi kabuğumu taşırım|Kaslı ayağımla yavaşça ilerlerim|Nemli yerleri severim|Arkamda parlak bir iz bırakabilirim|Başımda duyargalar vardır'],
['Örümcek','Sekiz bacağım vardır|Böceklerden farklı bir grubum|İpek iplik üretebilirim|Bazı türlerim ağla av yakalar|Vücudumun iki ana bölümü vardır'],
['Yunus','Denizde yaşayan bir memeliyim|Nefes almak için yüzeye çıkarım|Seslerle çevremi algılayabilirim|Yavrularımı sütle beslerim|Başımın üstünde soluk deliğim vardır'],
['Kitap','Sayfalarım sırayla çevrilir|Kapağım yazıları korur|Hikâyeler ya da bilgiler taşıyabilirim|Bir kütüphanede rafım olabilir|Okudukça yeni dünyalar anlatırım'],
['Kalem','Kâğıtta yazı ya da çizgi bırakırım|Beni parmaklarınla tutarsın|Bazı türlerimin ucu açılır|Çizim yapmana yardım ederim|İçimde grafit ya da mürekkep olabilir'],
['Silgi','Kurşun kalem izlerini azaltırım|Kullanılınca küçük parçalar bırakabilirim|Kalem kutusunda bulunabilirim|Yanlış çizgiyi düzeltmeye yardım ederim|Kâğıda sürtülerek kullanılırım'],
['Cetvel','Düz çizgi çizmeye yardım ederim|Üzerimde santimetre işaretleri olabilir|Uzunluk ölçmekte kullanılırım|Genellikle düz ve inceyim|Kalemin kenarıma yaslanabilir'],
['Makas','İki keskin ağzım açılıp kapanır|Kâğıdı kesebilirim|İki sapımdan tutulurum|Ortamdaki bağlantı ile dönerek çalışırım|Küçükler beni yetişkin yardımıyla kullanır'],
['Saat','Zamanı göstermeye yararım|Bazı türlerimde akrep ve yelkovan vardır|Duvara asılabilir ya da kola takılabilirim|Dijital türlerim rakamlarla konuşur|Dakikaları takip etmene yardım ederim'],
['Ayna','Üzerime gelen ışığı yansıtırım|Karşımda yüzünü görebilirsin|Düz yüzeyimde görüntü oluşur|Saçını tararken bana bakabilirsin|Görüntüyü gösteririm ama saklamam'],
['Şemsiye','Yağmurda başının üstünde açılırım|Islanmanı azaltmaya yardım ederim|Katlanınca ince bir hale gelirim|Kumaşımı teller taşır|Sapımdan tutularak taşınırım'],
['Anahtar','Uygun kilidi açarım|Küçük dişlerim olabilir|Kapıyı açmak için çevrilebilirim|Anahtarlık halkasına takılabilirim|Her kilide her zaman uyamam'],
['Merdiven','Basamak basamak yükselirim|Yukarı çıkmaya yardım ederim|Aşağı inmeyi de sağlayabilirim|İki yüksekliği birbirine bağlarım|Oyunda üzerimde yukarı aşağı hareket edilir'],
['İp','Uzun ince liflerden yapılabilirim|Düğüm atılarak bağlanabilirim|Oyunda halkaya fırlatılıp tırmanılırım|Bir şeyi çekmeye yardım edebilirim|Sarılarak çantaya konabilirim'],
['Kazma','Sapım ve sert metal başım vardır|Toprağı ya da kayayı gevşetmeye yararım|Oyunda çatlak dağın içinden yol açarım|Bir el aletiyim|Oyundaki tüneli açmak için kullanılırım'],
['Pusula','Manyetik kuzeyi bulmaya yardım ederim|İğnem yön gösterir|Yolculukta haritayla kullanılırım|Üzerimde yön işaretleri vardır|Elektrik gerektirmeyen türüm bulunur'],
['Harita','Bir yerin küçültülmüş çizimiyim|Yolları ve yerleri gösterebilirim|İşaretlerim açıklama kutusunda anlatılır|Veshte’de Sedir başlangıcını gösteririm|Gideceğin rotayı planlamaya yardım ederim'],
['Bisiklet','İki tekerlekli bir taşıtım|Pedallarım çevrilince ilerlerim|Gidonumla yön değiştirirsin|Zincirim hareketi aktarabilir|Kullanırken kask takmak iyi bir fikirdir'],
['Tren','Rayların üzerinde ilerlerim|Vagonlarım birbirine bağlıdır|İstasyonda yolcu alabilirim|Lokomotifim vagonları çekebilir|Uzun yolculuklarda birçok yolcu taşırım'],
['Uçurtma','İple yere bağlıyken havalanırım|Rüzgâr beni havada taşır|Renkli bir gövdem ve kuyruğum olabilir|Açık alanda uçurulurum|Bir makaraya bağlı olabilirim'],
['Balon','İçime hava dolunca şişerim|Esnek bir yüzeyim olabilir|Süsleme için kullanılabilirim|İçimdeki gazla şeklim büyür|Keskin bir yere değince patlayabilirim'],
['Davul','Vurulduğunda ses çıkarırım|Gergin bir yüzeyim vardır|Ritim tutmaya yardım ederim|Tokmakla ya da elle çalınabilirim|Vurmalı bir çalgıyım'],
['Flüt','Üflenerek çalınan bir çalgıyım|Deliklerim kapatılınca sesim değişir|Uzun bir boruya benzerim|Nefes ve parmaklarla melodi üretirim|Vurulmadan ses verebilirim']
];
const riddles=[];concepts.forEach(([answer,text],c)=>{const clues=text.split('|');for(let a=0;a<5;a++)for(let b=a+1;b<5;b++){const id=riddles.length;riddles.push({id:'r-'+id,kind:'riddle',concept:c,answer,prompt:clues[a]+'. '+clues[b]+'. Ben neyim?',hint:clues[(b+1)%5]+'.',options:[answer,concepts[(c+17)%50][0],concepts[(c+31)%50][0]]});}});
const puzzles=[],symbols=['🍎','⭐','🌿','🧀','💎'];
for(let age=0;age<4;age++)for(let family=0;family<5;family++)for(let j=0;j<25;j++){
 const id='p-'+(age*125+family*25+j),a=1+j%5,b=1+Math.floor(j/5),base=(age+1)*3;let p={id,age,kind:'choice',family};
 if(family===0){const count=age===0?2:age+3,sequence=Array.from({length:count},(_,k)=>symbols[k===0?j%5:k===1?Math.floor(j/5):(j+k*3+age)%5]);p={...p,kind:'memory',prompt:'Sembol sırasını hatırla.',sequence,options:symbols,hint:'Sırayı tekrar gösterip birlikte söyleyebilirsin.'};}
 if(family===1){let answer;if(age===0){answer=a+b;p.prompt='Sepette '+a+' elma var. '+b+' elma daha koyduk. Kaç elma oldu?';}else if(age===1){answer=10+a-b+2;p.prompt=(10+a)+' peynirin '+b+' tanesini paylaşıp 2 peynir kazandın. Kaç peynirin var?';}else if(age===2){answer=(a+2)*(b+1)-b;p.prompt=(a+2)+' kutunun her birinde '+(b+1)+' kristal var. '+b+' kristali kullandın. Kaç kaldı?';}else{answer=(a+3)*b+a-2;p.prompt=b+' sandıkta '+(a+3)+'er anahtar, çantada '+a+' anahtar var. 2 anahtar kullandın. Kaç kaldı?';}p.answer=String(answer);p.options=[String(answer),String(answer+1),String(answer+3)];p.hint=age===0?'İki grubu birlikte say.':age===1?'Önce paylaştıklarını çıkar, sonra kazandıklarını ekle.':'Önce eşit grupları hesapla.';}
 if(family===2){const start=a+age*10,step=age===0?1:age===1?b:age===2?b+1:b*2;const seq=[start,start+step,start+2*step];const answer=start+3*step;p.prompt='Sayı yolunu tamamla: '+seq.join(' → ')+' → ?'+(age===0?' (Birer say.)':'');p.answer=String(answer);p.options=[String(answer+step),String(answer),String(answer-1)];p.hint='Her adımda '+step+' ekleniyor.';if(age===0){p.prompt='İlk durak '+a+'. '+b+' adım birer sayarak ilerle. Hangi sayıya ulaşırsın?';p.answer=String(a+b);p.options=[String(a+b),String(a+b+1),String(a+b+2)];}}
 if(family===3){const right=age===0?a:a+age,down=age===0?b:b+age;const back=age<2?0:age;const answer=(right-back)+','+down;p.prompt='Başlangıç (0,0). '+right+' adım sağa, '+down+' adım aşağı'+(back?', '+back+' adım sola':'')+'. Hangi noktadasın? (sağ, aşağı)';p.answer=answer;p.options=[answer,right+','+(down+1),(right+1)+','+down];p.hint='Sağa gittiklerin ilk sayı, aşağı gittiklerin ikinci sayı. Sola dönüşü ilk sayıdan çıkar.';if(age===0){p.prompt=a+' kırmızı ve '+b+' mavi taş var. Hangi renkten '+(a===b?'eşit sayıda var?':'daha çok var?');p.answer=a===b?'İkisi eşit':a>b?'Kırmızı':'Mavi';p.options=['Kırmızı','Mavi','İkisi eşit'];p.hint='İki grubun taşlarını karşılıklı eşleştir.';}}
 if(family===4){const numbers=[a+base,b+base+10,a+b+base+20];p.prompt='Kapı şifresi: '+numbers.join(', ')+'. '+(age<2?'En küçük sayıyı seç.':age===2?'En büyük ile en küçüğün farkı kaç?':'Ortadaki sayının iki katından en küçüğü çıkar.');const answer=age<2?numbers[0]:age===2?numbers[2]-numbers[0]:2*numbers[1]-numbers[0];p.answer=String(answer);p.options=[String(answer),String(answer+2),String(answer+5)];p.hint=age<2?'Sayı doğrusunda önce gelen daha küçüktür.':age===2?'En büyük sayıdan en küçüğü çıkar.':'Önce ortadaki sayıyı ikiyle çarp.';}
 if(age===0&&family===4){const symbol=symbols[b-1];p.prompt='Resimde kaç '+symbol+' var? '+Array(a).fill(symbol).join(' ');p.answer=String(a);p.options=[String(a),String(a%5+1),String((a+1)%5+1)];p.hint='Her şekle bir kez dokunarak say.';}
 puzzles.push(p);
}
function choose(kind,save,random=Math.random){const age=Math.max(0,['4-6','7-9','10-12','13+'].indexOf(save.age));const source=kind==='riddle'?riddles.filter(r=>age!==0||r.concept<25):puzzles.filter(p=>p.age===age);let pool=source.filter(p=>!save.seen.includes(p.id)&&(!p.answer||!save.recentAnswers.includes(p.answer)||kind!=='riddle'));if(!pool.length)pool=source.filter(p=>!save.seen.includes(p.id));if(!pool.length){const ids=new Set(source.map(p=>p.id));save.seen=save.seen.filter(id=>!ids.has(id));pool=source;}const p=pool[Math.floor(random()*pool.length)];return {...p,options:[...p.options]};}
function mark(p,save){if(!save.seen.includes(p.id))save.seen.push(p.id);if(p.kind==='riddle'){save.recentAnswers.push(p.answer);save.recentAnswers=save.recentAnswers.slice(-15);}}
const api={riddles,puzzles,choose,mark};root.VeshtePuzzles=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
