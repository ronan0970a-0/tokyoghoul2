import {useState} from 'react';
import {sb} from './supabase';
import {TH} from './data';

export function Auth(){
  const [em,setEm]=useState(''),[pw,setPw]=useState(''),[msg,setMsg]=useState('');
  const go=async mode=>{
    const cred={email:em.trim(),password:pw};
    const r=mode==='login'?await sb.auth.signInWithPassword(cred):await sb.auth.signUp(cred);
    if(r.error)setMsg(r.error.message);
    else if(!r.data.session)setMsg('Conta criada. Confirme o e-mail e entre.');
  };
  return <div className="card" style={{maxWidth:380,margin:'3rem auto'}}>
    <h2>Entrar</h2>
    <div className="add" style={{gridTemplateColumns:'1fr',marginTop:'1rem'}}>
      <input type="email" placeholder="E-mail" autoComplete="email" value={em} onChange={e=>setEm(e.target.value)}/>
      <input type="password" placeholder="Senha (mín. 6)" autoComplete="current-password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go('login')}/>
      <button onClick={()=>go('login')}>Entrar</button>
      <button style={{background:'var(--panel2)',color:'var(--text)'}} onClick={()=>go('signup')}>Criar conta</button>
    </div>
    <p style={{color:'var(--muted)'}}>{msg}</p>
  </div>;
}

export function CharList({list,create,open,remove,master,scope,setScope,emails,uid}){
  const [q,setQ]=useState('');
  const all=scope==='all';
  const rows=list.filter(c=>(c.name+' '+(emails[c.owner]||'')+' '+TH[c.theme]).toLowerCase().includes(q.toLowerCase()));
  return <>
    <h2>{all?'Todas as fichas':'Personagens'}</h2>
    {master&&<div className="card themes" style={{marginTop:'1rem'}}>
      <button className={!all?'on':''} onClick={()=>setScope('mine')}>Minhas fichas</button>
      <button className={all?'on':''} onClick={()=>setScope('all')}>Todas as fichas (mestre)</button>
    </div>}
    {all
      ?<input style={{width:'100%',margin:'1rem 0 .2rem'}} placeholder="Buscar por personagem, jogador ou categoria" value={q} onChange={e=>setQ(e.target.value)}/>
      :<div className="card" style={{marginTop:'1rem'}}>
        <div className="themes">{Object.entries(TH).map(([k,v])=><button key={k} onClick={()=>create(k)}>+ {v}</button>)}</div>
      </div>}
    {rows.length?rows.map(c=><div className="item" key={c.id}>
      <b style={{alignSelf:'center'}}>{c.name} <small style={{color:'var(--muted)'}}>· {TH[c.theme]}{all&&` · ${emails[c.owner]||'jogador'}`}</small></b>
      <span><button className="del" style={{width:'auto',padding:'0 .8rem'}} onClick={()=>open(c.id)}>Abrir</button>{(c.owner===uid||master)&&<> <button className="del" onClick={()=>remove(c.id)} aria-label="Excluir">×</button></>}</span>
    </div>):<div className="empty">Nenhum personagem encontrado.</div>}
  </>;
}
