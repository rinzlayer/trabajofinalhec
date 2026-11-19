const data=window.SECTOR_DATA;
const colors={C:'#2158a8',K:'#616a78'};
let mode='volume';
const fmt=(v,d=1)=>v.toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const point=(year,sector)=>data.find(r=>r.year===year&&r.sector===sector);
function render(){
 const [start,end]=document.querySelector('#period').value.split(',').map(Number);
 const rows=data.filter(r=>r.year>=start&&r.year<=end);
 const value=r=>mode==='volume'?r.volume2015/point(start,r.sector).volume2015*100:r.volume2015;
 const max=Math.ceil(Math.max(...rows.map(value))/(mode==='volume'?50:50000))*(mode==='volume'?50:50000);
 const left=65,right=970,top=30,bottom=385;
 const x=y=>left+(y-start)/(end-start)*(right-left),y=v=>bottom-v/max*(bottom-top);
 let svg='<title>Comparación sectorial de Colombia</title><desc>Dos series anuales. Los valores exactos están en la tabla inferior.</desc>';
 for(let i=0;i<=5;i++){let v=max*i/5;svg+=`<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#e2e6de"/><text x="${left-12}" y="${y(v)+5}" text-anchor="end">${fmt(v,0)}</text>`;}
 for(let yr=start;yr<=end;yr++){if(yr===start||yr===end||yr%5===0)svg+=`<text x="${x(yr)}" y="420" text-anchor="middle">${yr}</text>`;}
 for(const s of ['C','K']){const selected=rows.filter(r=>r.sector===s);svg+=`<path d="${selected.map((r,i)=>`${i?'L':'M'}${x(r.year)},${y(value(r))}`).join(' ')}" fill="none" stroke="${colors[s]}" stroke-width="3.5"/>`;for(const r of selected)svg+=`<circle cx="${x(r.year)}" cy="${y(value(r))}" r="3.5" fill="${colors[s]}"><title>${r.year} · ${r.label}: ${fmt(value(r),2)}</title></circle>`;}
 if(start<=1983&&end>=1983){svg+=`<line x1="${x(1983)}" x2="${x(1983)}" y1="20" y2="${bottom}" stroke="#6b7280" stroke-dasharray="6 5"/><text x="${x(1983)-10}" y="18" text-anchor="end">Cierre aproximado · 1983</text>`;}
 document.querySelector('#chart').innerHTML=svg;
 const title=mode==='volume'?`Evolución real · ${start} = 100`:'Valor agregado · millones de pesos constantes de 1975';
 document.querySelector('#chart-title').textContent=title;
 document.querySelector('#chart-description').textContent=mode==='volume'?`Cada sector parte de 100 en ${start}. Una línea más alta indica mayor crecimiento acumulado desde ese año, no un sector de mayor tamaño.`:'Valores a precios constantes de 1975: permiten comparar el valor agregado descontando el efecto de los cambios de precios. No son ventas ni utilidades de la empresa.';
 document.querySelector('#stats').innerHTML=['C','K'].map(s=>{const a=point(start,s),b=point(end,s),n=((b.volume2015/a.volume2015)**(1/(end-start))-1)*100;return `<div class="stat"><span>${s==='C'?'Industrias manufactureras':'Comercio'}</span><strong style="color:${colors[s]}">${n>0?'+':''}${fmt(n)} %</strong><small>Crecimiento real anual compuesto · ${start}–${end}</small></div>`}).join('');
 document.querySelector('#table-caption').textContent=title;
 document.querySelector('#table-body').innerHTML=Array.from({length:end-start+1},(_,i)=>{const yr=start+i;return `<tr><td>${yr}</td><td>${fmt(value(point(yr,'C')),2)}</td><td>${fmt(value(point(yr,'K')),2)}</td></tr>`}).join('');
 for(const id of ['volume','share'])document.getElementById(id).setAttribute('aria-pressed',String(id===mode));
}
for(const id of ['volume','share'])document.getElementById(id).addEventListener('click',()=>{mode=id;render()});
document.getElementById('period').addEventListener('change',render);
render();
