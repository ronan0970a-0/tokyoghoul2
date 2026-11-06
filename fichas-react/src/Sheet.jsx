import {useState} from 'react';
import {TH,TABS,HIDE,CNT,LABEL,PH,fieldsFor,statsFor,barsFor,resize} from './data';

function Pic({src,cls,w,onPick}){
  return <label className={cls} style={src?{backgroundImage:`url(${src})`}:undefined}>
    {src?'':'Sem foto'}
    <input type="file" accept="image/*" hidden onChange={async e=>{const f=e.target.files[0];if(f)onPick(await resize(f,w))}}/>
  </label>;
}

function Info({c,theme,set}){
  return <div className="card info">
    {theme==='ccg'&&<label className="hyb"><input type="checkbox" checked={!!c.hybrid} onChange={()=>set({hybrid:!c.hybrid})}/>Ghoul</label>}
    {fieldsFor(theme,c).map(([k,l,opts])=>{
    const v=k==='cat'?TH[theme]:k==='name'?c.name:c.f[k]??'';
    const on=e=>k==='name'?set({name:e.target.value}):set({f:{...c.f,[k]:e.target.value}});
    return <label className="fld" key={k}>{l}{opts
      ?<select value={v} onChange={on}><option value=""></option>{opts.map(o=><option key={o}>{o}</option>)}</select>
      :<input value={v} onChange={on} readOnly={k==='cat'}/>}</label>;
  })}</div>;
}

function Bars({c,theme,set}){
  return <div className="card">{barsFor(theme,c).map(n=>{
    const x=c.bars[n]||{cur:0,max:0};
    const p=x.max>0?Math.max(0,Math.min(100,x.cur/x.max*100)):0;
    const on=k=>e=>set({bars:{...c.bars,[n]:{...x,[k]:+e.target.value||0}}});
    return <div className="bar" key={n}>
      <div className="top"><span>{n}</span><span><input type="number" value={x.cur} onChange={on('cur')}/> / <input type="number" value={x.max} onChange={on('max')}/></span></div>
      <div className="track"><i style={{width:p+'%'}}/></div>
    </div>;
  })}</div>;
}

function Stats({c,theme,set}){
  return <div className="card stats">{statsFor(theme,c).map(n=>{
    const v=c.stats[n]??0;
    const m=d=>set({stats:{...c.stats,[n]:Math.max(0,v+d)}});
    return <div className="stat" key={n}><small>{n}</small>
      <div><button onClick={()=>m(-1)} aria-label={'Diminuir '+n}>−</button><span>{v}</span><button onClick={()=>m(1)} aria-label={'Aumentar '+n}>+</button></div></div>;
  })}</div>;
}

function Overview(p){
  const {c,theme,set,go}=p;
  const pins=c.npc.filter(n=>n.pin),hide=HIDE[theme];
  return <div className="grid">
    <div>
      <div className="photos">{[1,2].map(n=><Pic key={n} cls="photo" src={c['img'+n]} w={420} onPick={v=>set({['img'+n]:v})}/>)}</div>
      {pins.length>0&&<div style={{marginTop:'1rem'}}>
        <small style={{color:'var(--muted)'}}>NPCs</small>
        <div className="photos" style={{gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))',marginTop:'.4rem'}}>
          {pins.map((n,i)=><div key={i} title={n.d} onClick={()=>go('npc')} style={{cursor:'pointer'}}>
            <div className="ithumb" style={n.img?{backgroundImage:`url(${n.img})`}:undefined}>{n.img?'':'Sem foto'}</div>
            <div className="cap" style={{fontSize:'.85rem'}}>{n.n}</div>
          </div>)}
        </div>
      </div>}
    </div>
    <div>
      <div className="counters">{CNT.filter(x=>!hide.includes(x[0])).map(x=>
        <div className="cnt" key={x[0]} onClick={()=>go(x[2]||x[0])}><b>{c[x[0]].length}</b><span>{x[1]}</span></div>)}</div>
      <Info {...p}/><Bars {...p}/><Stats {...p}/>
    </div>
  </div>;
}

function ListView({k,c,set,theme}){
  const [n,setN]=useState(''),[d,setD]=useState('');
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
      {ph&&<Pic cls="ithumb" src={it.img} w={360} onPick={v=>upd(i,{img:v})}/>}
      <input value={it.n} onChange={e=>upd(i,{n:e.target.value})}/>
      <button className="del" onClick={()=>set({[k]:arr.filter((_,j)=>j!==i)})} aria-label="Remover">×</button>
      <textarea value={it.d} onChange={e=>upd(i,{d:e.target.value})}/>
      {k==='npc'&&<button className={'pin'+(it.pin?' on':'')} onClick={()=>upd(i,{pin:!it.pin})}>{it.pin?'★ Na tela principal':'☆ Fixar na tela principal'}</button>}
    </div>):<div className="empty">Nada por aqui ainda.</div>}
  </div>;
}

export default function Sheet({cur,change,back,viewing}){
  const {c,theme}=cur;
  const [tab,setTab]=useState('geral'),[menu,setMenu]=useState(false);
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
    {!['geral','info','status','hist'].includes(t)&&<ListView key={t} k={t} {...p}/>}
  </>;
}
