// Rolagem de dados: "1d20+Força+2", "2d6+1d4", "2d20kh1" (vantagem), "2d20kl1" (desvantagem)
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,'');
const RE=/([+-]?)(?:(\d*)d(\d+)(?:k([hl])(\d+))?|(\d+)|([a-z]+))/y;

export function roll(expr,stats={}){
  const src=norm(String(expr).replace(/[−–]/g,'-'));
  if(!src)throw new Error('Digite uma expressão, por exemplo 1d20+Força');
  const names=new Map(Object.entries(stats).map(([k,v])=>[norm(k),[k,v]]));
  const parts=[];let total=0,pos=0;
  while(pos<src.length){
    RE.lastIndex=pos;
    const m=RE.exec(src);
    if(!m)throw new Error(`Não entendi "${src.slice(pos,pos+8)}"`);
    if(pos>0&&!m[1])throw new Error('Use + ou − entre os termos');
    pos=RE.lastIndex;
    const sign=m[1]==='-'?-1:1;
    if(m[3]){
      const n=+(m[2]||1),f=+m[3];
      if(n<1||n>100)throw new Error('Use de 1 a 100 dados por termo');
      if(f<2||f>1000)throw new Error('O dado deve ter de 2 a 1000 faces');
      const rs=Array.from({length:n},()=>1+Math.floor(Math.random()*f));
      let kept=rs.map(()=>true);
      if(m[4]){
        const k=Math.max(1,Math.min(+m[5],n));
        const ord=rs.map((_,i)=>i).sort((a,b)=>m[4]==='h'?rs[b]-rs[a]:rs[a]-rs[b]);
        kept=rs.map(()=>false);ord.slice(0,k).forEach(i=>{kept[i]=true});
      }
      total+=sign*rs.reduce((a,v,i)=>a+(kept[i]?v:0),0);
      parts.push({dice:true,sign,txt:`${n}d${f}${m[4]?'k'+m[4]+m[5]:''}`,rs,kept,f,n});
    }else if(m[6]!==undefined){
      total+=sign*+m[6];parts.push({sign,txt:m[6]});
    }else{
      const h=names.get(m[7]);
      if(!h)throw new Error(`Atributo desconhecido: ${m[7]}`);
      total+=sign*h[1];parts.push({sign,txt:h[0],val:h[1]});
    }
  }
  // crítico / falha crítica no d20 (o primeiro dado d20 da expressão)
  let flag='';
  const d=parts.find(p=>p.dice&&p.f===20);
  if(d){const kv=d.rs.filter((_,i)=>d.kept[i]);if(kv.length===1)flag=kv[0]===20?'crit':kv[0]===1?'fumble':''}
  return {expr:String(expr).trim(),total,parts,flag};
}
