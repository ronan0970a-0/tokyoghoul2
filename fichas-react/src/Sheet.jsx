import {useState} from 'react';
import {TH,TABS,HIDE,CNT,LABEL,PH,RANKS,isAgent,fieldsFor,statsFor,barsFor,resize} from './data';
import {CcgCard,CardEditor,Swords} from './CcgCard';
import {GhoulCard} from './GhoulCard';
import Dice from './Dice';
import {Fit,PhotoAdjust} from './PhotoAdjust';

function Pic({src,adj,cls,w,onPick}){
  return <label className={cls}>
    {src?<Fit src={src} adj={adj}/>:'Sem foto'}
    <input type="file" accept="image/*" hidden onChange={async e=>{const f=e.target.files[0];if(f)onPick(await resize(f,w))}}/>
  </label>;
}

function Info({c,theme,set}){
  return <div className="card info">
    {theme==='ccg'&&<label className="hyb"><input type="checkbox" checked={!!c.hybrid} onChange={()=>set({hybrid:!c.hybrid})}/>Ghoul</label>}
    {theme==='ghoul'&&<label className="hyb"><input type="checkbox" checked={!!c.agent} onChange={()=>set({agent:!c.agent})}/><Swords/> CCG</label>}
    {fieldsFor(theme,c).map(([k,l,o])=>{
    const v=k==='cat'?TH[theme]:k==='name'?c.name:c.f[k]??'';
    const base=k==='patente'?RANKS.map(r=>r[0]):o;
    const opts=Array.isArray(base)&&v&&!base.includes(v)?[...base,v]:base; // mantém valor antigo digitado antes
    const on=e=>k==='name'?set({name:e.target.value}):set({f:{...c.f,[k]:e.target.value}});
    return <label className="fld" key={k}>{l}{Array.isArray(opts)
      ?<select value={v} onChange={on}><option value=""></option>{opts.map(o=><option key={o}>{o}</option>)}</select>
      :<input value={v} onChange={on} readOnly={k==='cat'} type={typeof opts==='string'?opts:'text'}/>}</label>;
  })}</div>;
}

// ícones simples (estilo Lucide)
const Ico=({d})=><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const BAR={
  HP:{l:'Vida',cls:'hp',i:<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>},
  Sanidade:{l:'Sanidade',cls:'san',i:<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>},
  Fome:{l:'Fome',cls:'fome',i:<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></>}
};

function Bars({c,theme,set}){
  return <div className="card bars">{barsFor(theme,c).map(n=>{
    const x=c.bars[n]||{cur:0,max:0},m=BAR[n]||{l:n,cls:'hp',i:null};
    const pct=x.max>0?Math.max(0,Math.min(100,x.cur/x.max*100)):0;
    const put=(cur,max=x.max)=>set({bars:{...c.bars,[n]:{...x,cur,max}}});
    const bump=d=>{const v=Math.max(0,x.cur+d);put(x.max>0?Math.min(x.max,v):v)};
    const low=m.cls!=='fome'&&x.max>0&&pct<=25;
    return <div className={'vbar '+m.cls+(low?' low':'')} key={n}>
      <div className="vtop">
        <span className="vname"><Ico d={m.i}/>{m.l}</span>
        <span className="vnum">
          <input type="number" inputMode="numeric" min="0" value={x.cur} aria-label={m.l+' atual'} onFocus={e=>e.target.select()} onChange={e=>put(Math.max(0,+e.target.value||0))}/>
          <i>/</i>
          <input type="number" inputMode="numeric" min="0" value={x.max} aria-label={m.l+' máxima'} onFocus={e=>e.target.select()} onChange={e=>put(x.cur,Math.max(0,+e.target.value||0))}/>
        </span>
      </div>
      <div className="vtrack" role="progressbar" aria-valuemin="0" aria-valuemax={x.max} aria-valuenow={x.cur} aria-label={m.l}>
        <i style={{width:pct+'%'}}/><span>{Math.round(pct)}%</span>
      </div>
      <div className="vbtns">
        {[-10,-5,-1].map(d=><button key={d} onClick={()=>bump(d)}>−{-d}</button>)}
        <button className="full" onClick={()=>put(x.max)} title="Encher até o máximo">Cheio</button>
        {[1,5,10].map(d=><button key={d} onClick={()=>bump(d)}>+{d}</button>)}
      </div>
    </div>;
  })}</div>;
}

function Stats({c,theme,set}){
  return <div className="card stats">{statsFor(theme,c).map(n=>{
    const v=c.stats[n]??0;
    const put=x=>set({stats:{...c.stats,[n]:Math.max(0,x)}});
    return <div className="stat" key={n}><small>{n}</small>
      <div><button onClick={()=>put(v-1)} aria-label={'Diminuir '+n}>−</button>
      <input type="number" inputMode="numeric" min="0" value={v} aria-label={n} onFocus={e=>e.target.select()} onChange={e=>put(+e.target.value||0)}/>
      <button onClick={()=>put(v+1)} aria-label={'Aumentar '+n}>+</button></div></div>;
  })}</div>;
}

function QuickKag({c,theme,set,go}){
  const [n,setN]=useState(''),[d,setD]=useState('');
  const lbl=theme==='ccg'&&!c.hybrid?'Quinque':theme==='ghoul'&&!c.agent?'Kagune':'Kagune/Quinque';
  const add=()=>{if(!n.trim())return;set({kag:[...c.kag,{n:n.trim(),d:d.trim()}]});setN('');setD('')};
  return <div className="card qk">
    <h3>{lbl}<a onClick={()=>go('kag')}>Ver todos ({c.kag.length})</a></h3>
    <div className="add">
      <input value={n} onChange={e=>setN(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder={`Nome do ${lbl.split('/')[0].toLowerCase()}`}/>
      <button onClick={add}>Adicionar</button>
      <textarea value={d} onChange={e=>setD(e.target.value)} placeholder="Descrição, dano, efeito..."/>
    </div>
    {c.kag.length>0&&<div className="chips">{c.kag.map((k,i)=><div className="chip" key={i} onClick={()=>go('kag')}>
      <div className="t">{k.img&&<Fit src={k.img} adj={k.adj}/>}</div>
      <div><b>{k.n}</b>{k.d&&<small>{k.d}</small>}</div></div>)}</div>}
  </div>;
}

function Overview(p){
  const {c,theme,set,go}=p;
  const [adjN,setAdjN]=useState(0);
  const pins=c.npc.filter(n=>n.pin),hide=HIDE[theme],ag=isAgent(theme,c);
  return <div className="grid">
    <div>
      <div className="photos">{[1,2].map(n=><Pic key={n} cls={'photo'+(ag?' ccgf':'')} src={c['img'+n]} adj={c['adj'+n]} w={420} onPick={v=>set({['img'+n]:v,['adj'+n]:null})}/>)}</div>
      <div className="photos" style={{marginTop:'.5rem'}}>{[1,2].map(n=><button key={n} className="adjbtn" disabled={!c['img'+n]} onClick={()=>setAdjN(n)}>✎ Ajustar foto {n}</button>)}</div>
      {adjN>0&&<PhotoAdjust src={c['img'+adjN]} adj={c['adj'+adjN]} onClose={()=>setAdjN(0)} onSave={a=>{set({['adj'+adjN]:a});setAdjN(0)}}/>}
      {theme==='ghoul'&&<GhoulCard c={c}/>}
      {ag&&<><CcgCard c={c}/><CardEditor c={c} set={set}/></>}
      {pins.length>0&&<div style={{marginTop:'1rem'}}>
        <small style={{color:'var(--muted)'}}>NPCs</small>
        <div className="photos" style={{gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))',marginTop:'.4rem'}}>
          {pins.map((n,i)=><div key={i} title={n.d} onClick={()=>go('npc')} style={{cursor:'pointer'}}>
            <div className="ithumb">{n.img?<Fit src={n.img} adj={n.adj}/>:'Sem foto'}</div>
            <div className="cap" style={{fontSize:'.85rem'}}>{n.n}</div>
          </div>)}
        </div>
      </div>}
    </div>
    <div>
      <div className="counters">{CNT.filter(x=>!hide.includes(x[0])).map(x=>
        <div className="cnt" key={x[0]} onClick={()=>go(x[2]||x[0])}><b>{c[x[0]].length}</b><span>{x[1]}</span></div>)}</div>
      <Info {...p}/>{!hide.includes('kag')&&<QuickKag {...p}/>}<Bars {...p}/><Stats {...p}/>
    </div>
  </div>;
}

function ListView({k,c,set,theme}){
  const [n,setN]=useState(''),[d,setD]=useState(''),[adjI,setAdjI]=useState(null);
  const arr=c[k],ph=PH.includes(k);
  const upd=(i,patch)=>set({[k]:arr.map((x,j)=>j===i?{...x,...patch}:x)});
  const add=()=>{if(!n.trim())return;set({[k]:[...arr,{n:n.trim(),d:d.trim()}]});setN('');setD('')};
  return <div className="card">
    <div className="add">
      <input value={n} onChange={e=>setN(e.target.value)} placeholder={`Nome (${k==='kag'?(theme==='ccg'?'Quinque':'Kagune'):LABEL[k]})`}/>
      <button onClick={add}>Adicionar</button>
      <textarea value={d} onChange={e=>setD(e.target.value)} placeholder="Descrição, dano, efeito..."/>
    </div>
    {arr.length?arr.map((it,i)=><div className={'item'+(ph?' ph':'')} key={i}>
      {ph&&<Pic cls="ithumb" src={it.img} adj={it.adj} w={360} onPick={v=>upd(i,{img:v,adj:null})}/>}
      {ph&&<button className="adjbtn" style={{gridColumn:1,gridRow:3}} disabled={!it.img} onClick={()=>setAdjI(i)}>✎ Ajustar</button>}
      <input value={it.n} onChange={e=>upd(i,{n:e.target.value})}/>
      <button className="del" onClick={()=>set({[k]:arr.filter((_,j)=>j!==i)})} aria-label="Remover">×</button>
      <textarea value={it.d} onChange={e=>upd(i,{d:e.target.value})}/>
      {k==='npc'&&<button className={'pin'+(it.pin?' on':'')} onClick={()=>upd(i,{pin:!it.pin})}>{it.pin?'★ Na tela principal':'☆ Fixar na tela principal'}</button>}
    </div>):<div className="empty">Nada por aqui ainda.</div>}
    {adjI!==null&&arr[adjI]&&<PhotoAdjust src={arr[adjI].img} adj={arr[adjI].adj} onClose={()=>setAdjI(null)} onSave={a=>{upd(adjI,{adj:a});setAdjI(null)}}/>}
  </div>;
}

export default function Sheet({cur,change,back,viewing}){
  const {c,theme}=cur;
  const [tab,setTab]=useState('geral'),[menu,setMenu]=useState(false),[hist,setHist]=useState([]);
  const hide=HIDE[theme],t=hide.includes(tab)?'geral':tab;
  const p={c,theme,go:setTab,set:patch=>change({...c,...patch})};
  return <>
    {viewing&&<div className="card" style={{padding:'.6rem 1rem',marginTop:'1rem',marginBottom:0}}>Modo mestre · ficha de <b>{viewing}</b></div>}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:'1rem',flexWrap:'wrap'}}>
      <h2>{c.name||'Sem nome'}</h2>
      <a href="#" onClick={e=>{e.preventDefault();back()}} style={{color:'var(--muted)'}}>Voltar aos personagens</a>
    </div>
    <div className="menubar">
      <button className="burger" onClick={()=>setMenu(true)} aria-label="Abrir menu"><span/><span/><span/></button>
      <b>{TABS.find(x=>x[0]===t)[1]}</b>
    </div>
    {menu&&<div className="scrim" onClick={()=>setMenu(false)}/>}
    <nav className={'tabs'+(menu?' open':'')}>{TABS.filter(x=>!hide.includes(x[0])).map(([k,l])=><button key={k} className={k===t?'on':''} onClick={()=>{setTab(k);setMenu(false)}}>{l}</button>)}</nav>
    {t==='geral'&&<Overview {...p}/>}
    {t==='info'&&<Info {...p}/>}
    {t==='status'&&<><Bars {...p}/><Stats {...p}/></>}
    {t==='hist'&&<>
      <div className="card"><textarea style={{minHeight:220}} value={c.hist} onChange={e=>p.set({hist:e.target.value})} placeholder="Histórico do personagem..."/></div>
      <h3>Anotações</h3><ListView k="anot" {...p}/></>}
    {t==='dados'&&<Dice {...p} hist={hist} setHist={setHist}/>}
    {!['geral','info','status','hist','dados'].includes(t)&&<ListView key={t} k={t} {...p}/>}
  </>;
}
