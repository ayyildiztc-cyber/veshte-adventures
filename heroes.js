(function(root){
'use strict';
const info={bagujik:{name:'Bagujik',species:'Erkek fare · Mus musculus',role:'Yeşil kaşif',color:'#83b951',speed:76,jump:76,craft:82},ceren:{name:'Ceren',species:'Dişi fare · Mus musculus',role:'Yuvanın koruyucusu',color:'#cf92b5',speed:76,jump:76,craft:82},cinar:{name:'Çınar',species:'Mirket · Suricata suricatta',role:'Çevik iz sürücü',color:'#c99d63',speed:84,jump:76,craft:82},kermit:{name:'Pamuk',species:'Kedi · Felis catus',role:'Yükseklerin kâşifi',color:'#e7d9c0',speed:76,jump:84,craft:82},pengu:{name:'Kaptan Pengu',species:'Penguen',role:'Keşif kaptanı',color:'#465e72',speed:76,jump:76,craft:82}};
function draw(c,id,x,y,scale=1,time=0,motion={}){
 const hero=info[id]||info.bagujik,walk=motion.walk?Math.sin(time*14):0,climb=motion.climb?Math.sin(time*12):0,tail=Math.sin(time*4)*7,bob=motion.walk?Math.abs(walk)*1.6:Math.sin(time*2)*.7;
 c.save();c.translate(x+17*scale,y+(23-bob)*scale);c.scale(scale*(motion.facing||1),scale);
 const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();},box=(x,y,w,h,color,r=4)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();},line=(pts,color,width)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.stroke();};
 if(id!=='pengu'){c.strokeStyle=id==='bagujik'?'#69943f':id==='ceren'?'#b2759c':id==='cinar'?'#987040':'#c8b99d';c.lineWidth=id==='kermit'?6:4;c.lineCap='round';c.beginPath();c.moveTo(-10,12);c.bezierCurveTo(-30,22+tail,-35,2+tail,-31,-2+tail);c.stroke();}
 const fur=hero.color,belly=id==='bagujik'?'#bdd887':id==='ceren'?'#f4d7e8':id==='pengu'?'#fff9df':'#f5e6c8';
 box(-12,-5,26,29,fur,11);ellipse(1,10,8,12,belly);box(-14,18+walk*3,12,6,'#5c6049',3);box(5,18-walk*3,13,6,'#5c6049',3);
 if(id==='cinar'){ellipse(-10,-24,5,5,'#947044');ellipse(10,-24,5,5,'#947044');ellipse(0,-15,14,16,fur);ellipse(7,-17,6,7,'#624b36');ellipse(8,-17,2.5,3,'#fff7d5');ellipse(9,-17,1.5,2,'#51321f');ellipse(13,-7,10,6,belly);ellipse(21,-8,3,3,'#4d392b');}
 else if(id==='pengu'){ellipse(0,-13,16,20,fur);ellipse(6,-12,9,12,belly);ellipse(8,-15,2.5,3,'#463c31');box(12,-9,13,6,'#efbd5c',3);box(-15,-2,31,5,'#b95448',2);}
 else{if(id==='kermit'){c.fillStyle=fur;c.beginPath();c.moveTo(-16,-17);c.lineTo(-17,-35);c.lineTo(-2,-24);c.lineTo(15,-35);c.lineTo(18,-15);c.fill();}else{ellipse(-12,-24,11,12,fur);ellipse(10,-26,11,12,fur);ellipse(-12,-24,6,7,belly);ellipse(10,-26,6,7,belly);}ellipse(0,-11,17,17,fur);if(id==='bagujik'){c.fillStyle='#416e32';c.beginPath();c.moveTo(-10,-24);c.lineTo(-7,-36);c.lineTo(-1,-28);c.lineTo(7,-35);c.lineTo(10,-22);c.fill();}ellipse(8,-13,5,6,'#fff8db');ellipse(10,-13,3,4,'#744727');ellipse(11,-15,1,1,'white');ellipse(17,-5,4,3,'#dba79c');line([[9,2],[13,4],[17,1]],'#6e5144',1.4);if(id==='ceren'){ellipse(-12,-26,6,3,'#724a8a');ellipse(-3,-26,6,3,'#724a8a');ellipse(-7,-26,2.5,3,'#f2c968');}}
 line([[-11,1],[-17,9+walk*4-climb*10]],fur,6);line([[11,0],[18,8-walk*4+climb*10]],fur,6);
 if(motion.mining){c.save();c.translate(20,4);c.rotate(Math.sin(time*20)*.65);line([[0,10],[0,-16]],'#a87947',4);line([[-10,-16],[0,-20],[11,-15]],'#b8d3d3',4);c.restore();}
 if(motion.season===1&&motion.walk){ellipse(21,-19+(time*13)%17,1.8,3.5,'#83d7e2');ellipse(-17,-14+(time*9)%13,1.5,3,'#83d7e2');}if(motion.season===3){box(-14,-2,28,4,'#b85b4d',2);ellipse(27+Math.sin(time*2)*3,-5,7+Math.sin(time*2)*2,3,'#ffffff77');}
 c.restore();
}
root.VeshteHeroes={info,draw};
})(typeof window!=='undefined'?window:globalThis);
