import {useEffect,useRef,useState} from 'react';

export const ASPECT=0.7; // largura/altura do quadro de foto (fichas e cartões)

// Foto que preenche o quadro (cover) com zoom e deslocamento opcionais: adj={x,y,z}
export const Fit=({src,adj})=><img className="fit" src={src} alt="" draggable="false" style={adj?{transform:`translate(${adj.x}%,${adj.y}%) scale(${adj.z})`}:undefined}/>;

// deslocamento máximo (em % do quadro) para a foto sempre cobrir o quadro
const lim=(ia,z)=>{const ox=ia>ASPECT?ia/ASPECT:1,oy=ia>ASPECT?1:ASPECT/ia;return [(ox*z-1)/2*100,(oy*z-1)/2*100]};

export function PhotoAdjust({src,adj,onSave,onClose}){
  const [a,setA]=useState(adj||{x:0,y:0,z:1}),[ia,setIa]=useState(ASPECT),drag=useRef(null);
  useEffect(()=>{const im=new Image();im.onload=()=>setIa(im.naturalWidth/im.naturalHeight);im.src=src},[src]);
  const clamp=(x,y,z)=>{const [mx,my]=lim(ia,z);return {x:Math.max(-mx,Math.min(mx,x)),y:Math.max(-my,Math.min(my,y)),z}};
  const down=e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={px:e.clientX,py:e.clientY,x:a.x,y:a.y}};
  const move=e=>{
    const d=drag.current;if(!d)return;
    const r=e.currentTarget.getBoundingClientRect();
    setA(clamp(d.x+(e.clientX-d.px)/r.width*100,d.y+(e.clientY-d.py)/r.height*100,a.z));
  };
  const up=()=>{drag.current=null};
  const reset=a.x===0&&a.y===0&&a.z===1;
  return <div className="modal" onClick={onClose}>
    <div className="mbox" onClick={e=>e.stopPropagation()}>
      <h3 style={{margin:'0 0 .3rem'}}>Ajustar foto</h3>
      <small className="hint">Arraste a foto para mover e use o zoom para aproximar.</small>
      <div className="adjframe" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><Fit src={src} adj={a}/></div>
      <label className="row" style={{display:'flex',gap:'.8rem',alignItems:'center',margin:'.8rem 0'}}>Zoom
        <input type="range" min="1" max="3" step="0.01" value={a.z} onChange={e=>setA(clamp(a.x,a.y,+e.target.value))} style={{flex:1}}/></label>
      <div className="mbtns">
        <button className="mbtn" onClick={()=>setA({x:0,y:0,z:1})}>Centralizar</button>
        <button className="mbtn" onClick={onClose}>Cancelar</button>
        <button className="mbtn pri" onClick={()=>onSave(reset?null:a)}>Salvar</button>
      </div>
    </div>
  </div>;
}
