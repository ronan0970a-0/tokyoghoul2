import {RANKS,SITU} from './data';
import {toKatakana} from './katakana';
import {Fit} from './PhotoAdjust';

// Ícone de espadas cruzadas (estilo Lucide)
export const Swords=()=>(
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>
    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>
  </svg>
);

function Seal(){
  return <svg viewBox="0 0 100 100" width="80" height="80" aria-hidden="true">
    <circle cx="50" cy="50" r="47" fill="#111" stroke="#b3121d" strokeWidth="5"/>
    <circle cx="50" cy="50" r="37" fill="#1c1c1c" stroke="#d9d9d9" strokeWidth="1.5"/>
    <g stroke="#e8e8e8" strokeWidth="3" strokeLinecap="round"><path d="M27 27L73 73"/><path d="M73 27L27 73"/></g>
    <text x="50" y="59" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="700" fontSize="25" fill="#d4202c" stroke="#111" strokeWidth=".8">CCG</text>
  </svg>;
}

function Barcode({seed}){
  let x=0;const bars=[];
  [...seed.padEnd(12,'x')].forEach((ch,i)=>{
    const n=ch.charCodeAt(0);
    [n%3+1,(n>>2)%3+1,(n>>4)%2+1].forEach((w,j)=>{
      if(j!==1)bars.push(<rect key={i+'-'+j} x={x} y="0" width={w} height="30" fill="currentColor"/>);
      x+=w+(j===1?2:1);
    });
  });
  return <svg viewBox={`0 0 ${x} 30`} width="100%" height="30" preserveAspectRatio="none" aria-hidden="true">{bars}</svg>;
}

const DEF={bg:'#dde1e1',hd:'#0a0a0a',ht:'Commission of Counter Ghoul'};
const NEUTRO='#7d8590';
const ICON=['●','◐','★','?','✝'];
const lum=h=>{const n=parseInt(h.slice(1),16);const [r,g,b]=[n>>16,(n>>8)&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
const txt=h=>lum(h)>.45?'#111':'#f4f4f4';

export function CcgCard({c}){
  const f=c.f,cd={...DEF,...c.card};
  const rank=f.patente||'Sem patente';
  const ri=RANKS.findIndex(r=>r[0].toLowerCase()===rank.trim().toLowerCase());
  const rk=ri>=0?RANKS[ri][1]:NEUTRO; // a borda muda conforme a patente
  const jp=f.nomeJp?.trim()||toKatakana(c.name);
  const si=SITU.indexOf(f.situacao);
  const seed=(c.name||'')+(f.player||'');
  const num=f.matricula||String([...seed].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,7)%1e8).padStart(8,'0');
  const lines=[['Player',f.player],f.nasc?['Nascimento',f.nasc.split('-').reverse().join('/')]:['Idade',f.idade],['Local',f.local],['Divisão',f.divisao],['Esquadrão',f.esquadrao],['Sangue',f.sangue]].filter(x=>x[1]);
  return <div className="idcard" style={{'--rk':rk,'--cb':cd.bg,'--ct':txt(cd.bg)}}>
    <div className="in">
      <div className="hd" style={{background:cd.hd,color:txt(cd.hd)}}>
        {cd.ht.split(' ').map((w,i)=>/^[A-ZÀ-Ý]/.test(w)?<span key={i}><b>{w[0]}</b>{w.slice(1)} </span>:<span key={i}>{w} </span>)}
      </div>
      <div className="bd">
        <div className="ph">{c.img1&&<Fit src={c.img1} adj={c.adj1}/>}</div>
        <div>
          <div className="nm">{c.name||'Sem nome'} {jp&&<span className="jp">({jp})</span>}</div>
          <div className="rk">[ {rank} ]</div>
          <div className="meta">{lines.map(([k,v])=><div key={k}>{k}: {v}</div>)}</div>
          {si>=0&&<div className={'stamp s'+si}>{ICON[si]} {SITU[si].toUpperCase()}</div>}
        </div>
        <div className="seal"><Seal/></div>
      </div>
      <div className="ft"><Barcode seed={seed||'ccg'}/><span>{num}</span></div>
    </div>
  </div>;
}

export function CardEditor({c,set}){
  const cd={...DEF,...c.card},up=p=>set({card:{...c.card,...p}});
  return <details className="cust">
    <summary>Personalizar cartão</summary>
    <label className="row">Cor do cartão<input type="color" value={cd.bg} onChange={e=>up({bg:e.target.value})}/></label>
    <label className="row">Cor do cabeçalho<input type="color" value={cd.hd} onChange={e=>up({hd:e.target.value})}/></label>
    <label className="row">Texto do cabeçalho<input value={cd.ht} onChange={e=>up({ht:e.target.value})} style={{width:'60%'}}/></label>
    <div className="row"><span>A borda muda sozinha conforme a patente.</span><button className="del" style={{width:'auto',padding:'0 .8rem'}} onClick={()=>set({card:{}})}>Restaurar</button></div>
  </details>;
}
