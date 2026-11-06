import {useEffect,useMemo,useRef,useState} from 'react';
import {sb} from './supabase';
import {TH,blank} from './data';
import {Auth,CharList} from './Screens';
import Sheet from './Sheet';

function Drips(){
  const d=useMemo(()=>Array.from({length:28},(_,i)=>({l:i*3.6+Math.random()*2.5,w:4+Math.random()*7,h:14+Math.random()*70,d:4+Math.random()*6,dl:-Math.random()*8})),[]);
  return <div className="drips" aria-hidden="true">{d.map((x,i)=><span key={i} style={{left:x.l+'%','--w':x.w+'px','--h':x.h+'px','--d':x.d+'s','--l':x.dl+'s'}}/>)}</div>;
}

export default function App(){
  const [user,setUser]=useState(null),[ready,setReady]=useState(false);
  const [theme,setTheme]=useState('ghoul'),[list,setList]=useState([]),[cur,setCur]=useState(null),[st,setSt]=useState('');
  const timer=useRef();

  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
  useEffect(()=>{document.documentElement.dataset.hybrid=cur&&cur.theme==='ccg'&&cur.c.hybrid?'1':'0'},[cur]);
  useEffect(()=>{
    sb.auth.getSession().then(({data})=>{setUser(data.session?.user??null);setReady(true)});
    const {data:{subscription}}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user??null));
    return ()=>subscription.unsubscribe();
  },[]);

  const load=async()=>{const {data}=await sb.from('characters').select('id,theme,name').order('updated_at',{ascending:false});setList(data||[])};
  useEffect(()=>{if(user)load();else{setCur(null);setList([])}},[user?.id]);

  const open=async id=>{
    const {data,error}=await sb.from('characters').select('*').eq('id',id).single();
    if(error)return setSt(error.message);
    const c={...blank(),...data.data};
    if(c.quin?.length)c.kag=[...c.kag,...c.quin]; // junta Quinques antigos em Kagune/Quinque
    delete c.quin;
    setTheme(data.theme);setCur({id:data.id,theme:data.theme,c});
  };
  const create=async th=>{
    const c=blank();
    const {data,error}=await sb.from('characters').insert({theme:th,name:c.name,data:c}).select('id').single();
    if(error)return setSt(error.message);
    open(data.id);
  };
  const remove=async id=>{if(!confirm('Excluir este personagem?'))return;await sb.from('characters').delete().eq('id',id);load()};
  const back=()=>{setCur(null);load()};

  // altera a ficha e salva no Supabase 700 ms depois da última alteração
  const change=(c,th=cur.theme)=>{
    setCur({...cur,c,theme:th});setTheme(th);setSt('Salvando…');
    clearTimeout(timer.current);const id=cur.id;
    timer.current=setTimeout(async()=>{
      const {error}=await sb.from('characters').update({theme:th,name:c.name,data:c,updated_at:new Date().toISOString()}).eq('id',id);
      setSt(error?'Erro ao salvar':'Salvo ✓');
    },700);
  };

  return <>
    <Drips/>
    <header>
      <h1>Fichas</h1>
      <div className="themes">{Object.entries(TH).map(([k,v])=><button key={k} className={k===theme?'on':''} onClick={()=>cur?change(cur.c,k):setTheme(k)}>{v}</button>)}</div>
      <span style={{color:'var(--muted)',fontSize:'.8rem'}}>{st}</span>
      {user&&<button className="del" style={{width:'auto',padding:'0 .8rem'}} onClick={()=>sb.auth.signOut()}>Sair</button>}
    </header>
    <main>{!ready?null:!user?<Auth/>:cur?<Sheet cur={cur} change={change} back={back}/>:<CharList list={list} create={create} open={open} remove={remove}/>}</main>
  </>;
}
