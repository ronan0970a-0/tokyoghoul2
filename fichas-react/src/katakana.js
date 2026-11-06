// Transliteração fonética (português/inglês → katakana). Não é tradução de significado nem gera kanji.
const V='aiueo';
const R={k:'カ キ ク ケ コ',g:'ガ ギ グ ゲ ゴ',s:'サ シ ス セ ソ',z:'ザ ジ ズ ゼ ゾ',t:'タ ティ トゥ テ ト',d:'ダ ディ ドゥ デ ド',n:'ナ ニ ヌ ネ ノ',f:'ファ フィ フ フェ フォ',b:'バ ビ ブ ベ ボ',p:'パ ピ プ ペ ポ',m:'マ ミ ム メ モ',r:'ラ リ ル レ ロ',j:'ジャ ジ ジュ ジェ ジョ',sh:'シャ シ シュ シェ ショ',lh:'リャ リ リュ リェ リョ',nh:'ニャ ニ ニュ ニェ ニョ',y:'ヤ イ ユ イェ ヨ',w:'ワ ウィ ウ ウェ ウォ'};
Object.keys(R).forEach(k=>R[k]=R[k].split(' '));
const CODA={k:'ク',g:'グ',s:'ス',z:'ズ',t:'ト',d:'ド',n:'ン',m:'ム',f:'フ',b:'ブ',p:'プ',r:'ル',j:'ジ',sh:'シュ',lh:'ル',nh:'ン',y:'イ',w:'ウ'};
const SOLO=['ア','イ','ウ','エ','オ'];
const isV=c=>!!c&&V.includes(c);

function word(w){
  let out='',i=0;
  while(i<w.length){
    const c=w[i],n=w[i+1],n2=w[i+2];
    if(isV(c)){out+=SOLO[V.indexOf(c)];i++;continue}
    let key=c,len=1;
    if((c==='c'||c==='s')&&n==='h'){key='sh';len=2}
    else if(c==='l'&&n==='h'){key='lh';len=2}
    else if(c==='n'&&n==='h'){key='nh';len=2}
    else if(c==='p'&&n==='h'){key='f';len=2}
    else if(c==='t'&&n==='h'){key='t';len=2}
    else if(c==='c'&&n==='k'){key='k';len=2}
    else if(c==='q'){key='k';len=n==='u'&&(n2==='e'||n2==='i')?2:1}
    else if(c==='g'){len=n==='u'&&(n2==='e'||n2==='i')?2:1}
    else if(c==='c')key=(n==='e'||n==='i')?'s':'k';
    else if(c==='x')key='sh';
    else if(c==='v')key='b';
    else if(c==='l')key='r';
    else if(c==='h'||!R[c]){i++;continue}
    if(len===1&&n===c)len=2; // consoante dobrada (ss, rr...)
    const nx=w[i+len];
    if(isV(nx)){out+=R[key][V.indexOf(nx)];i+=len+1}
    else{out+=(key==='m'&&nx)?'ン':(CODA[key]??'');i+=len}
  }
  return out;
}

export function toKatakana(name){
  const clean=(name||'').toLowerCase().replace(/ç/g,'s').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return clean.split(/[^a-z]+/).filter(Boolean).map(word).join('・');
}
