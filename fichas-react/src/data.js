export const TH={ghoul:'Ghoul',ccg:'CCG',humano:'Humano'};
export const TABS=[['geral','Visão geral'],['info','Informações pessoais'],['status','Status'],['equip','Equipamentos'],['acess','Acessórios'],['kag','Kagune/Quinque'],['pas','Passivas'],['hab','Habilidades especiais'],['npc','NPCs'],['hist','Histórico']];
export const HIDE={ghoul:[],ccg:[],humano:['kag']};
export const CNT=[['equip','Equipamentos'],['acess','Acessórios'],['kag','Kagune/Quinque'],['pas','Passivas'],['hab','Habilidades'],['npc','NPCs'],['anot','Anotações','hist']];
export const FIELDS={
 ghoul:[['name','Nome'],['player','Player'],['cat','Categoria'],['idade','Idade'],['alt','Altura'],['peso','Peso'],['kagune','Kagune'],['tipo','Tipo da Kagune',['Ukaku','Koukaku','Rinkaku','Bikaku','Quimera']],['lvk','LV Kgn']],
 ccg:[['name','Nome'],['player','Player'],['cat','Categoria'],['idade','Idade'],['alt','Altura'],['peso','Peso'],['patente','Patente'],['quinque','Quinque principal'],['lvq','LV Qn']],
 humano:[['name','Nome'],['player','Player'],['cat','Categoria'],['idade','Idade'],['alt','Altura'],['peso','Peso'],['prof','Profissão']]};
export const STATS={base:['Força','Defesa','Velocidade','Auto Controle'],ghoul:['Kagune','Fome'],ccg:['Quinque'],humano:[]};
export const LISTS=['equip','acess','kag','pas','hab','npc','anot'];
export const LABEL={equip:'Equipamentos',acess:'Acessórios',kag:'Kagune/Quinque',pas:'Passivas',hab:'Habilidades especiais',npc:'NPCs',anot:'Anotações'};
export const PH=['acess','kag','npc']; // listas com foto
// CCG que também é ghoul (quimera) ganha as opções de ghoul
const hyb=(t,c)=>t==='ccg'&&!!c.hybrid;       // CCG que também é Ghoul
const agt=(t,c)=>t==='ghoul'&&!!c.agent;       // Ghoul que também é CCG
export const isAgent=(t,c)=>t==='ccg'||agt(t,c);
export const RANKS=['Assistente','Investigador de 3ª Classe','Investigador de 2ª Classe','Investigador de 1ª Classe','Investigador Associado Especial','Investigador Especial de 2ª Classe','Investigador Especial de 1ª Classe','Investigador Especial'];
const CF=FIELDS.ccg.filter(x=>['patente','quinque','lvq'].includes(x[0]));
export const fieldsFor=(t,c)=>agt(t,c)?[...FIELDS.ghoul,...CF]:hyb(t,c)?[...FIELDS.ccg,...FIELDS.ghoul.filter(x=>['kagune','tipo','lvk'].includes(x[0]))]:FIELDS[t];
export const statsFor=(t,c)=>[...STATS.base,...STATS[t],...(hyb(t,c)?STATS.ghoul:[]),...(agt(t,c)?STATS.ccg:[])];
export const barsFor=(t,c)=>t==='ghoul'||hyb(t,c)?['HP','Sanidade','Fome']:['HP','Sanidade'];
export const blank=()=>({name:'Novo personagem',f:{},stats:{},bars:{},hist:'',img1:'',img2:'',cap2:'',...Object.fromEntries(LISTS.map(k=>[k,[]]))});
export const resize=(file,w)=>new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,w/im.width),cv=document.createElement('canvas');cv.width=im.width*s;cv.height=im.height*s;cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL('image/jpeg',.75))};im.src=r.result};r.readAsDataURL(file)});
