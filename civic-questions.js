(function(root){
'use strict';
const rows=[
 ['Bahçedeki kâğıtları topladın. Sonra ne yapmalısın?','Uygun geri dönüşüm kutusuna bırakmak','Çalıların arkasına saklamak','Rüzgâra bırakmak','Temizlemek, çöpü doğru yere ulaştırınca tamamlanır.'],
 ['Kedinin su kabı kirlenmiş. En iyi çözüm hangisi?','Kabı temizletip temiz su koymak','Kirli suyun üstüne biraz su eklemek','Kabı boş bırakmak','Temiz kap ve temiz su birlikte gerekir.'],
 ['Üç elmas bir mama paketi alıyor. Altı elmasın var; bir paket aldın. Kaç elmas kalır?','3','2','6','Bir paketin bedelini toplamdan çıkar.'],
 ['Poşet taşıyan bir komşuya yardım etmek istiyorsun. İlk adım ne?','Yardım isteyip istemediğini sormak','Poşeti haber vermeden almak','Koşarak önünü kesmek','Yardım ederken kişinin iznini ve ihtiyacını gözetiriz.'],
 ['Havuz kenarı ıslak. Topun uzaklaştı. Ne yaparsın?','Koşmadan yürür, gerekirse görevliye söylerim','Kaymadan önce hızlanırım','Arkadaşımı iterek geçerim','Islak zemin kaygan olabilir.'],
 ['Kışın kedi yuvasını nereye kurmak daha uygun?','Kuru ve rüzgârdan korunaklı yere','Yağmur suyunun biriktiği çukura','Araçların geçtiği yolun ortasına','Yuvanın hem kuru hem güvenli olması gerekir.'],
 ['Yaya ışığı yeşil oldu ama bir araç yaklaşmaya devam ediyor. Ne yaparsın?','Durur, aracın durduğundan emin olurum','Işık yeşil diye hemen atlarım','Aracın önünden koşarım','Işık tek başına güvenliği garanti etmez; çevreni de izle.'],
 ['Yerde kırık cam gördün. Ne yapmalısın?','Dokunmadan bir yetişkine haber vermek','Çıplak elle toplamak','Ayağımla kenara itmek','Oyundaki kâğıtları toplarız; gerçek hayatta keskin çöpe dokunmayız.'],
 ['Çiçekleri suladın; musluk hâlâ açık. Son adım ne?','Musluğu kapatıp suyu korumak','Daha çok su aksın diye bırakmak','Suyu yola yönlendirmek','İhtiyaç kadar su kullanırız.'],
 ['Komşunun çantasını getirdin ama kapı açılmıyor. Ne yaparsın?','Güvendiğim yetişkine haber verip beklerim','İzinsiz içeri girerim','Çantayı yola bırakırım','İzin ve güvenlik, hızlı bitirmekten önemlidir.'],
 ['Kedi yuvasındaki örtü ıslanmış, mama da bitmiş. Ne yapmalı?','Örtüyü kurusuyla değiştirip uygun mama koymak','Yalnız üstüne yeni örtü sermek','Islak örtüyü olduğu gibi bırakmak','Hem kuru yuva hem beslenme ihtiyacını düşün.'],
 ['İyilik Feneri neden herkesin hazinesi?','Herkesin yaşamını iyileştirdiğimiz için','Yalnız en hızlı kişi kazandığı için','Bütün eşyalar bize kaldığı için','Dayanışma, çevre ve canlılara özen ortak bir kazançtır.']
];
function get(slot,age){const r=rows[slot];let prompt=r[0],answer=r[1],options=r.slice(1,4);if(slot===2&&['10-12','13+'].includes(age)){prompt='Bir mama paketi 3 elmas. 14 elmasla 3 paket alıp kalan elmasları sakladın. Kaç elmasın kaldı?';answer='5';options=['5','3','11'];}if(slot===2&&age==='4-6'){prompt='Kedinin mama kabı boş. Ne koymalıyız?';answer='Kedi maması';options=['Kedi maması','Çöp','Oyuncak'];}return{id:'p-'+(1000+slot),kind:'choice',prompt,answer,options,hint:r[4]};}
root.VeshteCivicQuestions={get};if(typeof module!=='undefined')module.exports={get};
})(typeof window!=='undefined'?window:globalThis);
