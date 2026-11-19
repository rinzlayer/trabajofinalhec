(() => {
 const rows = window.GRONINGEN_DATA;
 const sectorGroups = [
  {key:'manufactura',label:'Manufactura',color:'#2158a8',dash:''},
  {key:'comercio',label:'Comercio, restaurantes y hoteles',color:'#526477',dash:'9 4'},
  {key:'finanzas',label:'Finanzas, seguros, inmobiliarias y servicios empresariales',color:'#92532b',dash:'3 4'}
 ];
 const fmt = v => v.toLocaleString('es-CO',{minimumFractionDigits:1,maximumFractionDigits:1});
 for (const mode of ['index','share']) {
  const groups = mode==='index' ? [...sectorGroups,{key:'total',label:'Total de la economía (suma sectorial)',color:'#17212e',dash:'12 6'}] : sectorGroups;
  const svg = document.getElementById(`${mode}-chart`);
  const slider = document.getElementById(`${mode}-year`);
  const values = rows.flatMap(r => groups.map(g => r[g.key][mode]));
  const step = mode === 'index' ? 100 : 5;
  const max = Math.ceil(Math.max(...values)/step)*step;
  const x = year => 75+(year-1970)/40*890;
  const y = value => 403-value/max*315;
  let base = `<title>${mode==='index'?'Evolución real, 1970 = 100':'Participación porcentual en el valor agregado sectorial'}</title><desc>Colombia, 1970 a 2010. Tres grupos de actividades y, en evolución, el total sectorial. Consulte los valores con el selector de año o en la tabla.</desc>`;
  for(let i=0;i<=5;i++){
   const value = max*i/5;
   base += `<line x1="75" x2="965" y1="${y(value)}" y2="${y(value)}" stroke="#e2e7ed"/><text x="61" y="${y(value)+5}" text-anchor="end">${fmt(value)}${mode==='share'?' %':''}</text>`;
  }
  for(let year=1970;year<=2010;year+=5) base += `<text x="${x(year)}" y="435" text-anchor="middle">${year}</text>`;
  for(const [year,text,anchor,dx] of [[1983,'Hacia 1983 · cierre de Ricolandia','start',8],[2005,'2005 · ingreso a aseguradora','end',-8]]){
   base+=`<line x1="${x(year)}" x2="${x(year)}" y1="70" y2="403" stroke="#637083" stroke-dasharray="5 6"/><text x="${x(year)+dx}" y="${year===1983?35:58}" text-anchor="${anchor}">${text}</text>`;
  }
  for(const g of groups){
   base+=`<path d="${rows.map((r,i)=>`${i?'L':'M'}${x(r.year)},${y(r[g.key][mode])}`).join(' ')}" fill="none" stroke="${g.color}" stroke-width="3.3" stroke-dasharray="${g.dash}"/>`;
   for(const r of rows)base+=`<circle cx="${x(r.year)}" cy="${y(r[g.key][mode])}" r="4" fill="${g.color}" fill-opacity="0.01"><title>${r.year} · ${g.label}: ${fmt(r[g.key][mode])}${mode==='share'?' %':''}</title></circle>`;
  }
  function selectYear(){
   const year = Number(slider.value), row=rows.find(r=>r.year===year);
   document.getElementById(`${mode}-year-label`).textContent=year;
   svg.innerHTML=base+`<line x1="${x(year)}" x2="${x(year)}" y1="88" y2="403" stroke="#202b3a" opacity="0.25"/>`+groups.map(g=>`<circle cx="${x(year)}" cy="${y(row[g.key][mode])}" r="5" fill="${g.color}" stroke="white" stroke-width="2"/>`).join('');
   document.getElementById(`${mode}-values`).innerHTML=groups.map(g=>`<div><span>${g.label}</span><strong style="color:${g.color}">${fmt(row[g.key][mode])}${mode==='share'?' %':''}</strong><small>${year}${mode==='index'?` · crecimiento acumulado: ${fmt(row[g.key][mode]-100)} %`:''}</small></div>`).join('');
  }
  document.getElementById(`${mode}-table`).innerHTML=rows.map(r=>`<tr><th scope="row">${r.year}</th>${groups.map(g=>`<td>${fmt(r[g.key][mode])}${mode==='share'?' %':''}</td>`).join('')}</tr>`).join('');
  slider.addEventListener('input',selectYear);
  selectYear();
 }
})();
