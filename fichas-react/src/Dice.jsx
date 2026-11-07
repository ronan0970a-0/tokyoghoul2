import {useState} from 'react';
import {roll} from './dice';
import {statsFor} from './data';

const QUICK=[4,6,8,10,12,20,100];

function Result({r,big}){
  return <div className={'rr'+(big?' big':'')}>
    <div className="rt">{r.total}{r.flag&&<span className={'flag '+r.flag}>{r.flag==='crit'?'CRÍTICO!':'FALHA CRÍTICA'}</span>}</div>
    <div className="rb"><b>{r.label||r.expr}</b>
      <div>{r.parts.map((p,i)=><span key={i}>{i>0||p.sign<0?(p.sign<0?' − ':' + '):''}{p.dice
        ?<>{p.txt} [{p.rs.map((v,j)=><span key={j} className={p.kept[j]?'':'drop'}>{v}{j<p.rs.length-1?', ':''}</span>)}]</>
        :<>{p.txt}{p.val!==undefined?` (${p.val})`:''}</>}</span>)}</div>
    </div>
  </div>;
}

export default function Dice({c,theme,set,hist,setHist}){
  const [expr,setExpr]=useState('1d20'),[err,setErr]=useState(''),[nome,setNome]=useState('');
  const stats=Object.fromEntries(statsFor(theme,c).map(n=>[n,c.stats[n]??0]));
  const saved=c.dados||[];
  const go=(e,label)=>{
    try{const r=roll(e,stats);setErr('');setHist(h=>[{...r,label},...h].slice(0,30))}
    catch(x){setErr(x.message)}
  };
  const add=t=>setExpr(e=>e.trim()?e.trim()+'+'+t:t);
  const save=()=>{if(!expr.trim()||!nome.trim())return;set({dados:[...saved,{n:nome.trim(),e:expr.trim()}]});setNome('')};
  return <>
    <div className="card">
      <div className="diceline">
        <input value={expr} onChange={e=>setExpr(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go(expr)} placeholder="Ex.: 1d20+Força+2" aria-label="Expressão de dados"/>
        <button className="rollbtn" onClick={()=>go(expr)}>Rolar</button>
      </div>
      {err&&<div className="err">{err}</div>}
      <div className="dchips">{QUICK.map(f=><button key={f} onClick={()=>add('1d'+f)}>d{f}</button>)}<button onClick={()=>setExpr('')}>Limpar</button></div>
      <div className="dchips"><small>Somar atributo:</small>{Object.entries(stats).map(([k,v])=><button key={k} onClick={()=>add(k.replace(/\s+/g,''))}>{k} ({v})</button>)}</div>
      <small className="hint">Aceita +, −, números, atributos e vantagem/desvantagem (2d20kh1 e 2d20kl1).</small>
    </div>
    <div className="card">
      <h3 style={{marginTop:0}}>Atalhos salvos</h3>
      <div className="add"><input value={nome} onChange={e=>setNome(e.target.value)} onKeyDown={e=>e.key==='Enter'&&save()} placeholder="Nome (ex.: Ataque de Kagune)"/><button onClick={save}>Salvar atual</button></div>
      {saved.length?<div className="dsaved">{saved.map((s,i)=><div key={i}>
        <button onClick={()=>go(s.e,s.n)}>{s.n} <small>{s.e}</small></button>
        <button className="x" onClick={()=>set({dados:saved.filter((_,j)=>j!==i)})} aria-label="Remover atalho">×</button></div>)}</div>
        :<div className="empty">Escreva uma expressão, dê um nome e salve para rolar com um toque.</div>}
    </div>
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{margin:0}}>Rolagens</h3>{hist.length>0&&<button className="dchips-clear" onClick={()=>setHist([])}>Limpar</button>}</div>
      {hist.length?<><Result r={hist[0]} big/>{hist.slice(1).map((r,i)=><Result key={i} r={r}/>)}</>:<div className="empty">Nenhuma rolagem ainda.</div>}
    </div>
  </>;
}
