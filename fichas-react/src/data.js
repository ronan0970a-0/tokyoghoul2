export const TH={ghoul:'Ghoul',ccg:'CCG',humano:'Humano'};
export const TABS=[['geral','Visão geral'],['info','Informações pessoais'],['status','Status'],['equip','Equipamentos'],['acess','Acessórios'],['kag','Kagunes'],['pas','Passivas'],['hab','Habilidades especiais'],['quin','Quinques'],['npc','NPCs'],['hist','Histórico']];
export const HIDE={ghoul:['quin'],ccg:['kag'],humano:['kag','quin']};
export const CNT=[['equip','Equipamentos'],['acess','Acessórios'],['kag','Kagunes'],['pas','Passivas'],['hab','Habilidades'],['quin','Quinques'],['npc','NPCs'],['anot','Anotações','hist']];
export const FIELDS={
 ghoul:[['player','Player'],['cat','Categoria'],['alt','Altura'],['peso','Peso'],['kagune','Kagune'],['tipo','Tipo da Kagune',['Ukaku','Koukaku','Rinkaku','Bikaku']],['lvk','LV Kgn']],
 ccg:[['player','Player'],['cat','Categoria'],['alt','Altura'],['peso','Peso'],['patente','Patente'],['quinque','Quinque principal'],['lvq','LV Qn']],
 humano:[['player','Player'],['cat','Categoria'],['alt','Altura'],['peso','Peso'],['prof','Profissão'],['idade','Idade']]};
export const STATS={base:['Força','Defesa','Velocidade','Auto Controle'],ghoul:['Kagune','Fome'],ccg:['Quinque'],humano:[]};
export const LISTS=['equip','acess','kag','pas','hab','quin','npc','anot'];
export const LABEL={equip:'Equipamentos',acess:'Acessórios',kag:'Kagunes',pas:'Passivas',hab:'Habilidades especiais',quin:'Quinques',npc:'NPCs',anot:'Anotações'};
export const PH=['acess','kag','quin','npc']; // listas com foto
export const BARS=t=>t==='ghoul'?['HP','Sanidade','Fome']:['HP','Sanidade'];
export const blank=()=>({name:'Novo personagem',f:{},stats:{},bars:{},hist:'',img1:'',img2:'',cap2:'',...Object.fromEntries(LISTS.map(k=>[k,[]]))});
export const resize=(file,w)=>new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,w/im.width),cv=document.createElement('canvas');cv.width=im.width*s;cv.height=im.height*s;cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL('image/jpeg',.75))};im.src=r.result};r.readAsDataURL(file)});
