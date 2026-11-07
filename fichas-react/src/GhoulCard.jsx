import {Fragment} from 'react';
import {toKatakana} from './katakana';
import {Fit} from './PhotoAdjust';
import bg from './assets/ghoul-card-pt.jpg';

// Cartão de apresentação do Ghoul. Os rótulos (Nome, Data de nascimento, Local de nascimento,
// Local e Ocupação) são texto, não parte da imagem, e o tamanho se ajusta ao conteúdo.
// Tudo é posicionado em % sobre a imagem e o texto usa cqw, então escala em qualquer tela.
const fit=(t,max,k)=>Math.max(2.2,Math.min(max,k/Math.max(String(t).length,1)));

export function GhoulCard({c}){
  const f=c.f;
  const name=(c.name||'Sem nome').trim();
  const jp=f.nomeJp?.trim()||toKatakana(c.name)||'―';
  const dob=f.nasc?f.nasc.split('-').reverse().join('/'):''; // 2019-07-07 → 07/07/2019
  const rows=[
    ['生年月日','Data de nascimento',dob,51],
    ['出身地','Local de nascimento',f.local,61.4],
    ['所在地','Local',f.localAtual,71.8],
    ['職業','Ocupação',f.ocup,82.2],
  ];
  return <div className="gcard" style={{backgroundImage:`url(${bg})`}}>
    <div className="gph">{c.img1&&<Fit src={c.img1} adj={c.adj1}/>}</div>
    <div className="glb" style={{top:'19.2%'}}><span className="k">氏名</span><small>Nome</small></div>
    <div className="gjp" style={{fontSize:Math.min(6.4,24.5/Math.max(jp.length,1))+'cqw'}}>{jp}</div>
    <div className="gen" style={{fontSize:Math.min(3.8,34/Math.max(name.length,1))+'cqw'}}>{name}</div>
    <div className="gttl">[喰種]</div>
    <div className="gsub">{f.tipo?`Ghoul · ${f.tipo}`:'Ghoul'}</div>
    {rows.map(([k,pt,v,top])=>{
      const t=(v||'').trim()||'—';
      return <Fragment key={k}>
        <div className="glb" style={{top:top+'%'}}><span className="k">{k}</span><small>{pt}</small></div>
        <div className="gval" style={{top:top+'%',fontSize:fit(t,3.6,31)+'cqw'}}>{t}</div>
      </Fragment>;
    })}
  </div>;
}
