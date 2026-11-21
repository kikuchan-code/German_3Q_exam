// ===== 状態 =====
DATA.forEach(d=>d.items.forEach(x=>x.cat=d.name));
const $=document.getElementById("app"),g=id=>document.getElementById(id);
let sel=new Set(DATA.map(d=>d.id)),weakOnly=false,typing=false,Q=[],i=0,wrong=[],total=0;
let weak={};try{weak=JSON.parse(localStorage.getItem("de_weak")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("de_weak",JSON.stringify(weak))}catch(e){}};
let theme="light";try{theme=localStorage.getItem("de_theme")||"light"}catch(e){}
const setTheme=t=>{theme=t;document.documentElement.dataset.theme=t;try{localStorage.setItem("de_theme",t)}catch(e){}document.querySelector("meta[name=theme-color]").content=t==="dark"?"#141b2b":"#eef5ff"};
setTheme(theme);
const SK="de_session";
const shuf=a=>{a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.random()*(k+1)|0;[a[k],a[j]]=[a[j],a[k]]}return a};
const kk=x=>x.q+"|"+x.a;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fm=s=>esc(s).replace(/【([^\s】][^】]*)】/g,'<span class="hl">$1</span>');
const pool=()=>{const p=DATA.filter(d=>sel.has(d.id)).flatMap(d=>d.items);return weakOnly?p.filter(x=>weak[kk(x)]):p};
const byKey=new Map(DATA.flatMap(d=>d.items).map(x=>[kk(x),x]));
const saveSess=()=>{try{localStorage.setItem(SK,JSON.stringify({q:Q.map(kk),i,w:wrong.map(kk),total,ty:typing}))}catch(e){}};
const clearSess=()=>{try{localStorage.removeItem(SK)}catch(e){}};
const loadSess=()=>{try{const s=JSON.parse(localStorage.getItem(SK)||"null");if(!s)return null;const q=s.q.map(k=>byKey.get(k)).filter(Boolean);if(!q.length||q.length!==s.q.length||s.i>=q.length)return null;return{...s,Qs:q}}catch(e){return null}};
const PH=["odd","same","lv","lp","ac","sc","yn"];
const GROUPS=[["発音",DATA.filter(d=>PH.includes(d.id))],["文法・翻訳",DATA.filter(d=>!PH.includes(d.id))]];

function home(){
  const nw=Object.keys(weak).length,S=loadSess();
  const pick=d=>`<label class="pick"><input type="checkbox" data-id="${d.id}" ${sel.has(d.id)?"checked":""}><span class="bx"></span><span class="nm">${esc(d.name.replace(/^発音：/,""))}</span><span class="n">${d.items.length}問</span></label>`;
  $.className="home";window.scrollTo(0,0);
  $.innerHTML=`<div class="top"><h1>ドイツ語 後期中間<br>対策クイズ</h1><button class="ghost" id="th" aria-label="表示切替">${theme==="dark"?"☀️":"🌙"}</button></div>
  <p class="m">出題範囲を選んでスタート。毎回シャッフルされ、何周でも繰り返せます。</p>
  ${S?`<div class="card"><b>前回の続きがあります</b><div class="m">${S.i+1} / ${S.Qs.length} 問目から再開できます</div><div class="row"><button id="rsn">破棄</button><button class="p" id="rs">続きから</button></div></div>`:""}
  <div class="top" style="margin-top:22px"><h2>出題範囲</h2><span><button class="ghost" id="all">全選択</button> <button class="ghost" id="none">全解除</button></span></div>
  ${GROUPS.map(([t,ds])=>`<h2>${t}</h2>${ds.map(pick).join("")}`).join("")}
  <h2>設定</h2>
  <label class="pick"><input type="checkbox" id="wk" ${weakOnly?"checked":""}><span class="bx"></span><span class="nm">苦手な問題だけ出す<br><small class="m">間違えた問題が自動で記録されます（現在 ${nw} 問）</small></span></label>
  <label class="pick"><input type="checkbox" id="ty" ${typing?"checked":""}><span class="bx"></span><span class="nm">入力モード<br><small class="m">和訳・独訳・書き換え・「違う語」系を文字入力で解答（ä→ae, ß→ss でもOK）</small></span></label>
  <div class="dock"><button class="p" id="go"></button></div>`;
  const upd=()=>{const n=pool().length,b=g("go");b.textContent=n?`スタート（${n}問）`:"出題できる問題がありません";b.disabled=!n};
  $.querySelectorAll("[data-id]").forEach(c=>c.onchange=()=>{c.checked?sel.add(c.dataset.id):sel.delete(c.dataset.id);upd()});
  g("wk").onchange=e=>{weakOnly=e.target.checked;upd()};
  g("ty").onchange=e=>typing=e.target.checked;
  g("all").onclick=()=>{sel=new Set(DATA.map(d=>d.id));home()};
  g("none").onclick=()=>{sel.clear();home()};
  g("th").onclick=()=>{setTheme(theme==="dark"?"light":"dark");home()};
  g("go").onclick=()=>run(shuf(pool()));
  upd();
  if(S){g("rs").onclick=()=>{Q=S.Qs;i=S.i;wrong=S.w.map(k=>byKey.get(k)).filter(Boolean);total=S.total;typing=S.ty;show()};g("rsn").onclick=()=>{clearSess();home()}}
}
function run(p){Q=p;i=0;wrong=[];total=p.length;show()}
const verdict=(x,ok,ans)=>`<div class="a ${ok?"ok":"ng"}"><b>${ok?"○ 正解！":"✕ 不正解"}</b>${ans?fm(x.a):""}${x.e?`<div class="note">${esc(x.e)}</div>`:""}</div>`;
const nxBtn=()=>`<button class="p" id="nx">${i+1>=Q.length?"結果を見る":"次へ"}</button>`;
const goNext=()=>{g("nx").onclick=()=>{i++;show()};g("nx").scrollIntoView({block:"nearest",behavior:"smooth"})};
function show(){
  if(i>=Q.length)return fin();
  saveSess();
  const x=Q[i],ty=typing&&((x.t==="c"&&!x.nt)||x.g);
  $.className="";window.scrollTo(0,0);
  let h=`<div class="top"><button class="ghost" id="hm">✕ やめる</button><span class="m"><b>${i+1}</b> / ${Q.length}　正解 ${i-wrong.length}</span></div><div class="bar" style="margin-top:10px"><i style="width:${i/Q.length*100}%"></i></div><div class="card"><span class="chip">${esc(x.cat)}</span><div class="q">${fm(x.q)}</div>`;
  if(ty)h+=`${x.t==="c"?'<p class="m" style="margin:10px 0 0">'+x.o.map(fm).join(" / ")+"</p>":""}<div class="opts"><textarea id="in" rows="${x.g?3:1}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${x.t==="c"?"該当する語を入力":x.cat==="和訳（独→日）"?"日本語で入力":"ドイツ語で入力"}"></textarea></div><div class="chars">${["ä","ö","ü","ß"].map(c=>`<button type="button" data-c="${c}">${c}</button>`).join("")}</div><div class="row"><button class="p" id="chk">答え合わせ</button></div>`;
  else if(x.t==="c"){const c=x.o.length===8?"g4":x.o.length%2===0&&x.o.every(o=>o.length<=14)?"g2":"";h+=`<div class="opts ${c}">${shuf(x.o).map(o=>`<button data-o="${esc(o)}">${fm(o)}</button>`).join("")}</div>`}
  else h+=`<div class="row"><button class="p" id="rv">答えを見る</button></div>`;
  $.innerHTML=h+`</div>`;
  g("hm").onclick=()=>{if(confirm("やめてトップに戻りますか？（進捗は保存され、あとで続きから再開できます）"))home()};
  if(ty)setupTy(x);
  else if(x.t==="c")$.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{
    const ok=b.dataset.o===x.a;
    $.querySelectorAll("[data-o]").forEach(c=>{c.disabled=true;if(c.dataset.o===x.a)c.classList.add("ok");else if(c!==b)c.classList.add("dim")});
    if(!ok)b.classList.add("ng");
    rec(ok);
    $.querySelector(".card").insertAdjacentHTML("beforeend",verdict(x,ok,!ok)+`<div class="row">${nxBtn()}</div>`);
    goNext();});
  else g("rv").onclick=()=>{
    g("rv").parentElement.remove();
    $.querySelector(".card").insertAdjacentHTML("beforeend",`<div class="a"><b>解答</b>${fm(x.a)}</div><p class="m" style="margin:14px 0 0;text-align:center">自分の答えは合っていましたか？</p><div class="row"><button id="ng">✕ できなかった</button><button class="p" id="ok">○ できた</button></div>`);
    g("ok").onclick=()=>{rec(true);i++;show()};
    g("ng").onclick=()=>{rec(false);i++;show()};
    g("ok").scrollIntoView({block:"nearest",behavior:"smooth"});};
}
const nz=s=>s.replace(/[【】]/g," ").replace(/[（(].*?[）)]/g," ").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss").replace(/[―—–]/g,"-").replace(/[.,?!„“"、。！？「」『』]/g," ").replace(/\s*-\s*/g,"-").replace(/\s+/g," ").trim();
function setupTy(x){
  const inp=g("in");inp.focus();
  $.querySelectorAll("[data-c]").forEach(b=>{b.onpointerdown=b.onmousedown=e=>e.preventDefault();b.onclick=()=>{inp.setRangeText(b.dataset.c,inp.selectionStart,inp.selectionEnd,"end");inp.focus()}});
  const go=()=>{
    if(inp.disabled)return;
    let a=nz(inp.value),b=nz(x.a);if(x.t==="c"){a=a.toLowerCase();b=b.toLowerCase()}
    const ok=a===b;inp.disabled=true;rec(ok);
    $.querySelectorAll("[data-c]").forEach(c=>c.disabled=true);
    g("chk").parentElement.outerHTML=verdict(x,ok,true)+`<div class="row">${ok?"":'<button id="ovr">正解にする</button>'}${nxBtn()}</div>`;
    goNext();
    const o=g("ovr");if(o)o.onclick=()=>{wrong.pop();delete weak[kk(x)];save();o.remove()};
  };
  g("chk").onclick=go;
  inp.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();go()}};
}
function rec(ok){const x=Q[i];if(ok)delete weak[kk(x)];else{weak[kk(x)]=1;wrong.push(x)}save()}
function fin(){
  clearSess();
  const r=total-wrong.length,pc=Math.round(r/total*100);
  $.className="";window.scrollTo(0,0);
  $.innerHTML=`<h1 style="margin-top:6px">結果</h1><div class="card score"><div class="big">${pc}<small style="font-size:1.4rem">%</small></div><div>${r} / ${total} 問正解</div><div class="bar" style="margin-top:14px"><i style="width:${pc}%"></i></div><p class="m" style="margin:14px 0 0">${wrong.length?`間違えた問題が ${wrong.length} 問あります。もう一度やって定着させましょう。`:"全問正解です。お見事！"}</p></div>
  ${wrong.length?`<button class="p" id="rt" style="width:100%;margin-bottom:10px">間違えた問題をもう一度</button>`:""}
  <button id="again" style="width:100%;margin-bottom:10px">同じ範囲でもう一周</button><button id="hm" style="width:100%">トップへ</button>
  ${wrong.length?`<details class="card"><summary>間違えた問題と正解（${wrong.length}）</summary>${wrong.map(x=>`<div class="wr">${fm(x.q)}<b>${fm(x.a)}</b></div>`).join("")}</details>`:""}`;
  if(wrong.length)g("rt").onclick=()=>run(shuf(wrong));
  g("again").onclick=()=>{const p=pool();run(shuf(p.length?p:DATA.flatMap(d=>d.items)))};
  g("hm").onclick=home;
}
home();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
