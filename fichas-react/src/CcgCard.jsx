// Ícone de espadas cruzadas (estilo Lucide) e cartão de identificação do CCG
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
      if(j!==1)bars.push(<rect key={i+'-'+j} x={x} y="0" width={w} height="30" fill="#111"/>);
      x+=w+(j===1?2:1);
    });
  });
  return <svg viewBox={`0 0 ${x} 30`} width="100%" height="30" preserveAspectRatio="none" aria-hidden="true">{bars}</svg>;
}

export function CcgCard({c}){
  const rank=c.f.patente||'Sem patente';
  const seed=(c.name||'')+(c.f.player||'');
  const num=String([...seed].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,7)%1e8).padStart(8,'0');
  return <div className="idcard">
    <div className="hd"><b>C</b>ommission of <b>C</b>ounter <b>G</b>houl</div>
    <div className="bd">
      <div className="ph" style={c.img1?{backgroundImage:`url(${c.img1})`}:undefined}/>
      <div>
        <div className="nm">{c.name||'Sem nome'}</div>
        <div className="rk">[ {rank} ]</div>
        <div className="meta">Player: {c.f.player||'—'}<br/>Idade: {c.f.idade||'—'}</div>
      </div>
      <div className="seal"><Seal/></div>
    </div>
    <div className="ft"><Barcode seed={seed||'ccg'}/><span>{num}</span></div>
  </div>;
}
