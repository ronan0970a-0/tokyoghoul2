import {toKatakana} from './katakana';
import {Fit} from './PhotoAdjust';
import bg from './assets/ghoul-card.jpg';

// Cartão de apresentação do Ghoul (sem patente, matrícula ou código de barras).
// Tudo é posicionado em % sobre a imagem e o texto usa cqw, então escala em qualquer tela.
export function GhoulCard({c}){
  const f=c.f;
  const name=(c.name||'Sem nome').trim();
  const jp=f.nomeJp?.trim()||toKatakana(c.name)||'―';
  const dob=f.nasc?f.nasc.split('-').map(Number).join(' / '):''; // 2019-07-07 → 2019 / 7 / 7
  const jpSize=Math.min(6.4,24.5/Math.max(jp.length,1));
  const enSize=Math.min(3.8,34/Math.max(name.length,1));
  const loc=(f.local||'').trim();
  const locSize=Math.min(4,40/Math.max(loc.length+2,1));
  return <div className="gcard" style={{backgroundImage:`url(${bg})`}}>
    <div className="gph">{c.img1&&<Fit src={c.img1} adj={c.adj1}/>}</div>
    <div className="gjp" style={{fontSize:jpSize+'cqw'}}>{jp}</div>
    <div className="gen" style={{fontSize:enSize+'cqw'}}>{name}</div>
    <div className="gttl">[喰種]</div>
    <div className="gsub">{f.tipo?`Ghoul · ${f.tipo}`:'Ghoul'}</div>
    <div className="gdob">{dob?`: ${dob}`:': — / — / —'}</div>
    <div className="glbl" style={{top:'68.6%'}}>出身地<small>Place of Birth</small></div>
    <div className="gloc" style={{fontSize:locSize+'cqw'}}>{loc?`: ${loc}`:': —'}</div>
  </div>;
}
