(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const Oe=e=>`
  <rect x="${-e-11}" y="-7" width="22" height="14" rx="6" fill="#1d1a1c"/>
  <rect x="${e-11}" y="-7" width="22" height="14" rx="6" fill="#1d1a1c"/>
  <path d="M${-e+11} -2 Q0 -6 ${e-11} -2" stroke="#1d1a1c" stroke-width="2.5" fill="none"/>
  <path d="M${-e-6} -3 l5 -2 M${e-6} -3 l5 -2" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>`,He=e=>`
  <circle cx="${-e}" r="9" fill="#fff" fill-opacity=".18" stroke="#b97f00" stroke-width="2.5"/>
  <circle cx="${e}" r="9" fill="#fff" fill-opacity=".18" stroke="#b97f00" stroke-width="2.5"/>
  <path d="M${-e+9} -1 Q0 -5 ${e-9} -1" stroke="#b97f00" stroke-width="2.5" fill="none"/>`,ae="M0 6 C-9 0 -10 -6 -6 -8 C-3 -9.5 -1 -8 0 -6 C1 -8 3 -9.5 6 -8 C10 -6 9 0 0 6Z",Ne=e=>`
  <path transform="translate(${-e} 0) scale(1.45)" d="${ae}" fill="#ff5c9a" fill-opacity=".92" stroke="#c93468" stroke-width="1"/>
  <path transform="translate(${e} 0) scale(1.45)" d="${ae}" fill="#ff5c9a" fill-opacity=".92" stroke="#c93468" stroke-width="1"/>
  <path d="M${-e+10} -4 Q0 -8 ${e-10} -4" stroke="#c93468" stroke-width="2.5" fill="none"/>`,Be=()=>'<path d="M-32 0 Q0 -14 32 0" stroke="#3ccf91" stroke-width="3" fill="none"/>'+[-26,-13,0,13,26].map((e,t)=>{const n=e===0?-8:Math.abs(e)===13?-6:-3,s=["#ff8fb3","#ffc93c","#b69cff","#ffc93c","#ff8fb3"][t];return`<g transform="translate(${e} ${n})"><circle r="6.5" fill="${s}"/><circle r="2.3" fill="#fff"/></g>`}).join(""),fe=[{id:"party-hat",name:"Party Hat",slot:"hat",price:3,art:()=>'<path d="M-16 0 L0 -44 L16 0Z" fill="#ff5c9a"/><path d="M-11 -14 H11 M-6 -28 H6" stroke="#ffd23f" stroke-width="4"/><circle cy="-46" r="5" fill="#ffd23f"/>'},{id:"beanie",name:"Beanie",slot:"hat",price:3,art:()=>'<path d="M-30 0 C-30 -36 30 -36 30 0Z" fill="#5b8def"/><rect x="-32" y="-8" width="64" height="11" rx="5" fill="#3b6fd8"/><circle cy="-31" r="7" fill="#fff"/>'},{id:"flower-crown",name:"Flower Crown",slot:"hat",price:6,art:Be},{id:"cowboy",name:"Cowboy Hat",slot:"hat",price:6,art:()=>'<path d="M-20 -4 C-22 -32 -6 -34 0 -25 C6 -34 22 -32 20 -4Z" fill="#b97a45"/><rect x="-20" y="-11" width="40" height="5" fill="#6b3e1f"/><path d="M-44 -8 Q-32 4 0 3 Q32 4 44 -8 Q38 8 0 8 Q-38 8 -44 -8Z" fill="#a8693a"/>'},{id:"top-hat",name:"Top Hat",slot:"hat",price:9,art:()=>'<rect x="-34" y="-6" width="68" height="8" rx="4" fill="#2b2328"/><rect x="-20" y="-46" width="40" height="42" rx="3" fill="#2b2328"/><rect x="-20" y="-15" width="40" height="7" fill="#e5487f"/>'},{id:"crown",name:"Crown",slot:"hat",price:12,art:()=>'<path d="M-24 0 V-22 L-12 -10 L0 -30 L12 -10 L24 -22 V0Z" fill="#ffc93c" stroke="#d99a00" stroke-width="2" stroke-linejoin="round"/><circle cy="-8" r="3.5" fill="#ff5c9a"/><circle cx="-14" cy="-6" r="2.5" fill="#5b8def"/><circle cx="14" cy="-6" r="2.5" fill="#3ccf91"/>'},{id:"round-glasses",name:"Round Glasses",slot:"eyes",price:3,art:He},{id:"sunglasses",name:"Sunglasses",slot:"eyes",price:6,art:Oe},{id:"heart-glasses",name:"Heart Glasses",slot:"eyes",price:6,art:Ne},{id:"bow-tie",name:"Bow Tie",slot:"neck",price:3,art:()=>'<path d="M0 0 L-15 -9 L-15 9Z M0 0 L15 -9 L15 9Z" fill="#e5487f" stroke="#c93468" stroke-width="1.5" stroke-linejoin="round"/><rect x="-4.5" y="-4.5" width="9" height="9" rx="2.5" fill="#c93468"/>'},{id:"scarf",name:"Scarf",slot:"neck",price:6,art:()=>'<path d="M13 4 l4 22 l9 -2 l-5 -21Z" fill="#ef4565"/><path d="M-30 -4 Q0 8 30 -4 L30 4 Q0 16 -30 4Z" fill="#ef4565"/><path d="M-20 -1 v8 M-6 2 v9 M8 2 v9 M22 -1 v8" stroke="#ffc93c" stroke-width="3"/>'},{id:"gold-chain",name:"Gold Chain",slot:"neck",price:9,art:()=>'<path d="M-22 -6 Q0 14 22 -6" stroke="#e8a200" stroke-width="2.5" fill="none" stroke-dasharray="3 2"/><circle cy="10" r="7.5" fill="#ffc93c" stroke="#d98a00" stroke-width="2"/><circle cy="10" r="3.8" fill="none" stroke="#e8a200" stroke-width="1.2"/>'}],Z=new Map(fe.map(e=>[e.id,e])),Pe={pig:{hatY:60,hatScale:1,eyeY:104,gap:22,neckY:160,neckScale:1.1},male:{hatY:52,hatScale:.95,eyeY:102,gap:16,neckY:151,neckScale:1},female:{hatY:48,hatScale:.95,eyeY:102,gap:16,neckY:151,neckScale:1},nonbinary:{hatY:42,hatScale:1,eyeY:102,gap:16,neckY:151,neckScale:1}};function Ie(e,t){const n=Pe[e],s=h=>{const i=t[h]?Z.get(t[h]):void 0;return(i==null?void 0:i.slot)===h?i:void 0},a=s("neck"),r=s("eyes"),o=s("hat");return[a&&`<g transform="translate(100 ${n.neckY}) scale(${n.neckScale})">${a.art(0)}</g>`,r&&`<g transform="translate(100 ${n.eyeY})">${r.art(n.gap)}</g>`,o&&`<g transform="translate(100 ${n.hatY}) scale(${n.hatScale})">${o.art(0)}</g>`].filter(Boolean).join("")}const Fe={hat:"-46 -52 92 64",eyes:"-34 -14 68 28",neck:"-34 -14 68 44"};function Ge(e){return`<svg viewBox="${Fe[e.slot]}" aria-hidden="true">${e.art(14)}</svg>`}const je=[{id:"male",label:"Male"},{id:"female",label:"Female"},{id:"nonbinary",label:"Non-binary"},{id:"pig",label:"Piggy"}],M="#3a2530",F="#eba57c";let Re=0;function Qe(e){return`<defs>
    <radialGradient id="${e}-bg" cx="30%" cy="25%" r="85%"><stop offset="0" stop-color="#fdfaf6"/><stop offset="1" stop-color="#f6e6ec"/></radialGradient>
    <radialGradient id="${e}-skin" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe6d2"/><stop offset="1" stop-color="#f3b48c"/></radialGradient>
    <radialGradient id="${e}-pig" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe4ef"/><stop offset="1" stop-color="#f792b9"/></radialGradient>
    <linearGradient id="${e}-coin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff07a"/><stop offset="1" stop-color="#f2a900"/></linearGradient>
    <clipPath id="${e}-clip"><circle cx="100" cy="100" r="96"/></clipPath>
    <filter id="${e}-gray"><feColorMatrix type="saturate" values="0.08"/></filter>
  </defs>`}function ue(e,t,n,s,a){const r=t-a,o=t+a,h=n-13,i=s,b=f=>e==="happy"?`<path d="M${f-6} ${n+1} Q${f} ${n-7} ${f+6} ${n+1}" stroke="${M}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`:e==="dead"?`<path d="M${f-5} ${n-5} L${f+5} ${n+5} M${f+5} ${n-5} L${f-5} ${n+5}" stroke="${M}" stroke-width="3.2" stroke-linecap="round"/>`:`<ellipse cx="${f}" cy="${n}" rx="4.6" ry="5.8" fill="${M}"/><circle cx="${f-1.6}" cy="${n-2.2}" r="1.8" fill="#fff"/>`,m={happy:[1,-5,1],okay:[0,-1,0],sad:[3,0,-6],angry:[-5,-1,5],dead:null}[e],p=m?`<path d="M${r-8} ${h+m[0]} Q${r} ${h+m[1]} ${r+7} ${h+m[2]} M${o+8} ${h+m[0]} Q${o} ${h+m[1]} ${o-7} ${h+m[2]}" stroke="${M}" stroke-width="${e==="angry"?3.4:2.6}" fill="none" stroke-linecap="round" opacity=".85"/>`:"",l={happy:`<path d="M${t-13} ${i} Q${t} ${i+20} ${t+13} ${i} Z" fill="#8c2f45"/><ellipse cx="${t}" cy="${i+6.5}" rx="5.5" ry="2.8" fill="#ff7a9c"/>`,okay:`<path d="M${t-10} ${i+2} Q${t} ${i+10} ${t+10} ${i+2}" stroke="${M}" stroke-width="3" fill="none" stroke-linecap="round"/>`,sad:`<path d="M${t-11} ${i+10} Q${t} ${i} ${t+11} ${i+10}" stroke="${M}" stroke-width="3" fill="none" stroke-linecap="round"/>`,angry:`<rect x="${t-11}" y="${i+1}" width="22" height="10" rx="3" fill="#fff" stroke="${M}" stroke-width="2.5"/><path d="M${t-11} ${i+6} H${t+11} M${t-4} ${i+1} V${i+11} M${t+4} ${i+1} V${i+11}" stroke="${M}" stroke-width="1.5"/>`,dead:`<ellipse cx="${t+4}" cy="${i+10}" rx="4" ry="5" fill="#ff7a9c"/><path d="M${t-10} ${i+6} q5 -4 10 0 t10 0" stroke="${M}" stroke-width="3" fill="none" stroke-linecap="round"/>`},d=e==="dead"?"":e==="angry"?`<ellipse cx="${r-7}" cy="${n+13}" rx="8" ry="5" fill="#ff4d4d" opacity=".55"/><ellipse cx="${o+7}" cy="${n+13}" rx="8" ry="5" fill="#ff4d4d" opacity=".55"/>`:`<ellipse cx="${r-7}" cy="${n+13}" rx="7" ry="4.5" fill="#ff8fb3" opacity="${e==="sad"?.25:.6}"/><ellipse cx="${o+7}" cy="${n+13}" rx="7" ry="4.5" fill="#ff8fb3" opacity="${e==="sad"?.25:.6}"/>`,u=e==="sad"?`<path class="tear" d="M${o+1} ${n+8} q-5 9 0 12 q5 -3 0 -12z" fill="#7cc8f5"/>`:e==="angry"?`<path class="anger" transform="translate(${o+22} ${n-30})" d="M-7 -2 Q-2 -2 -2 -7 M2 -7 Q2 -2 7 -2 M7 2 Q2 2 2 7 M-2 7 Q-2 2 -7 2" stroke="#ef4565" stroke-width="3" fill="none" stroke-linecap="round"/>`:"";return p+b(r)+b(o)+d+l[e]+u}const ze={male:{hair:"#3b2416",shirt:"#ffc93c",back:"",front:'<path d="M58 100 C54 60 80 44 104 46 C132 48 148 66 142 100 C138 86 130 76 118 72 C104 80 82 82 68 76 C62 84 60 92 58 100Z"/><path d="M84 54 C96 48 112 50 122 56" stroke="#6b4430" stroke-width="3" fill="none" stroke-linecap="round"/>',extra:""},female:{hair:"#8a4b2a",shirt:"#ff6fa5",back:'<path d="M56 96 C50 50 80 36 100 36 C124 36 152 50 146 100 C150 130 156 150 150 172 C138 176 128 168 124 160 L76 160 C72 168 62 176 50 172 C44 150 50 130 56 96Z"/>',front:'<path d="M60 96 C58 62 82 50 104 50 C128 50 144 66 142 96 C132 76 116 66 96 70 C84 80 72 88 60 96Z"/><path d="M80 58 C92 52 108 52 120 58" stroke="#b46a42" stroke-width="3" fill="none" stroke-linecap="round"/>',extra:'<g transform="translate(130 64) rotate(-25)"><rect x="-11" y="-4" width="22" height="8" rx="4" fill="#ffd23f" stroke="#e8a900" stroke-width="1.5"/><circle cx="-5" cy="0" r="1.6" fill="#fff"/></g>'},nonbinary:{hair:"#ff8fb8",shirt:"#ffd23f",back:[[64,92,16],[68,68,18],[86,52,20],[114,52,20],[132,68,18],[136,92,16]].map(([e,t,n])=>`<circle cx="${e}" cy="${t}" r="${n}"/>`).join(""),front:'<circle cx="80" cy="64" r="14"/><circle cx="100" cy="60" r="14"/><circle cx="120" cy="64" r="14"/><path d="M86 52 C94 48 104 48 112 52" stroke="#ffc2d8" stroke-width="3" fill="none" stroke-linecap="round"/>',extra:""}};function We(e,t,n){const s=ze[t];return`
    <g clip-path="url(#${e}-clip)">
      <g fill="${s.hair}">${s.back}</g>
      <rect x="88" y="124" width="24" height="34" rx="10" fill="${F}"/>
      <path d="M34 210 C36 160 64 148 100 148 C136 148 164 160 166 210Z" fill="${s.shirt}"/>
      <path d="M84 149 Q100 172 116 149Z" fill="${F}"/>
    </g>
    <circle cx="61" cy="104" r="9" fill="${F}"/><circle cx="139" cy="104" r="9" fill="${F}"/>
    <ellipse cx="100" cy="100" rx="40" ry="44" fill="url(#${e}-skin)"/>
    <path d="M97 110 Q100 114 103 110" stroke="#d98b62" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g fill="${s.hair}">${s.front}</g>
    ${s.extra}
    ${ue(n,100,102,122,16)}`}function Ze(e,t,n){const s='<path d="M62 78 C54 58 60 46 82 60 C78 68 70 74 62 78Z" fill="#f78fb6" stroke="#ec7aa6" stroke-width="2" stroke-linejoin="round"/><path d="M65 70 C62 60 66 55 76 62 C73 66 69 68 65 70Z" fill="#ff6f9f" opacity=".55"/>',a=(o,h)=>`<rect x="${o}" y="${h}" width="16" height="20" rx="7" fill="#f78fb6" stroke="#ec7aa6" stroke-width="2"/><rect x="${o+2}" y="${h+13}" width="12" height="5" rx="2.5" fill="#e0709b"/>`,r=t==="happy"&&!n?`<g class="coin-drop"><circle cx="100" cy="40" r="10" fill="url(#${e}-coin)" stroke="#e09a00" stroke-width="2"/><circle cx="100" cy="40" r="5" fill="none" stroke="#e8a900" stroke-width="1.5"/></g>`:"";return`
    <ellipse cx="100" cy="175" rx="54" ry="6" fill="#3a2530" opacity=".08"/>
    <path d="M154 112 c12 -6 16 8 6 10 c-8 1 -7 -9 3 -12" stroke="#ec7aa6" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${a(62,146)}${a(122,146)}
    ${s}<g transform="translate(200 0) scale(-1 1)">${s}</g>
    <ellipse cx="100" cy="112" rx="58" ry="50" fill="url(#${e}-pig)" stroke="#ec7aa6" stroke-width="2"/>
    <ellipse cx="74" cy="84" rx="13" ry="7" fill="#fff" opacity=".35" transform="rotate(-25 74 84)"/>
    ${a(76,154)}${a(108,154)}
    <rect x="91" y="65" width="18" height="4" rx="2" fill="#d94f84" opacity=".45"/>
    ${r}
    <ellipse cx="100" cy="124" rx="15" ry="10.5" fill="#ff9cc2" stroke="#f27aa6" stroke-width="2"/>
    <ellipse cx="95" cy="124" rx="2.4" ry="3.8" fill="#c9466f"/>
    <ellipse cx="105" cy="124" rx="2.4" ry="3.8" fill="#c9466f"/>
    ${ue(t,100,104,138,22)}`}function O(e,t,n={}){const s=`av${++Re}`,a=e==="pig"?Ze(s,t,!!n.hat):We(s,e,t),r=t==="dead";return`<svg class="avatar avatar-${t}" viewBox="0 0 200 200" role="img" aria-label="${e} avatar feeling ${t}">
    ${Qe(s)}
    <circle cx="100" cy="100" r="96" fill="url(#${s}-bg)"/>
    <g ${r?`filter="url(#${s}-gray)"`:""}>${a}${Ie(e,n)}</g>
    ${r?'<ellipse class="halo" cx="100" cy="24" rx="30" ry="7" fill="none" stroke="#ffc93c" stroke-width="5"/>':""}
  </svg>`}const N=["happy","okay","sad","angry","dead"],I=["Shopping","Food & Dining","Entertainment","Transport","Bills","Groceries","Health","Other"],pe=["Save more money","Stop impulse buying","Pay off debt","Just track my spending"],Ye={Shopping:.1,"Food & Dining":.1,Entertainment:.05,Transport:.1,Bills:.35,Groceries:.15,Health:.05,Other:.1},he=["Shopping","Food & Dining","Entertainment"],Q=e=>he.includes(e),_e={Shopping:"Try a 48-hour rule: wait two days before buying anything non-essential.","Food & Dining":"Cook at home a few more nights a week and pack lunch.",Entertainment:"Look for free events and pause subscriptions you rarely use.",Transport:"Combine errands, carpool, or try public transit a few days.",Bills:"Call providers to negotiate rates or switch to a cheaper plan.",Groceries:"Plan meals, shop with a list, and buy store brands.",Health:"Check if generic medicine or in-network options can lower costs.",Other:"Review these purchases - can any be moved into a planned category?"};function Ve(e,t=[]){const n={};for(const s of I){const a=Ye[s]*(t.includes(s)?.8:1);n[s]=Math.round(e*a*100)/100}return n}function E(e=new Date){const t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${t}-${n}`}function $(e){return e.toLocaleString(void 0,{style:"currency",currency:"USD"})}function se(e,t,n=new Date){const s=E(n).slice(0,7),a=t.filter(f=>f.date.startsWith(s)),r=I.map(f=>{const v=a.filter(z=>z.category===f).reduce((z,qe)=>z+qe.amount,0),w=e.limits[f]??0,Te=w>0?v/w:v>0?1/0:0;return{category:f,spent:v,limit:w,ratio:Te}}).sort((f,v)=>v.spent-f.spent),o=r.reduce((f,v)=>f+v.spent,0),h=r.filter(f=>Q(f.category)),i=h.reduce((f,v)=>f+v.spent,0),b=h.reduce((f,v)=>f+v.limit,0),g=b>0?i/b:i>0?1/0:0,m=h.find(f=>f.spent>0)??null,p=h.find(f=>e.focus.includes(f.category)&&f.ratio>1)??null;let l=g<.5?0:g<.8?1:g<=1.1?2:g<=1.5?3:4;p&&l<N.length-1&&l++;const d=N[l],u=p??m??r.find(f=>f.spent>0)??null;return{monthKey:s,spent:o,remaining:e.budget-o,usage:e.budget>0?o/e.budget:0,categories:r,top:r[0].spent>0?r[0]:null,topWant:m,wantsSpent:i,wantsLimit:b,needsSpent:o-i,mood:d,message:o===0?`${e.name} is ready. Add an expense or import a statement to get started.`:Ue(e.name,d,i,b,m,p),tip:u?_e[u.category]:null}}function Ue(e,t,n,s,a,r){const o=s>0?Math.round(n/s*100):0,h=a?`${a.category} (${$(a.spent)})`:"extras";switch(t){case"happy":return n===0?`${e} is happy. Everything this month has gone to needs.`:`${e} is happy. You've used ${o}% of your wants budget.`;case"okay":return`${e} is doing okay. ${o}% of your wants budget is used, mostly on ${h}.`;case"sad":return`${e} is sad. ${h} is pushing your wants to ${o}% of budget.`;case"angry":return n>s?`${e} is angry. Wants are ${$(n-s)} over budget, led by ${h}.`:`${e} is angry. ${(r==null?void 0:r.category)??"A goal category"} is over the limit you set.`;case"dead":return`${e} fainted. Wants are at ${o}% of budget. Pause ${(a==null?void 0:a.category)??"extras"} to bring ${e} back.`}}const W={hunger:5,fun:4,love:3},D=e=>Math.round(Math.min(100,Math.max(0,e)));function K(e,t=Date.now()){const n=Math.max(0,(t-e.updatedAt)/36e5);return{hunger:D(e.hunger-W.hunger*n),fun:D(e.fun-W.fun*n),love:D(e.love-W.love*n),updatedAt:t}}function Ke(e,t){const n=K(e);return t==="feed"&&(n.hunger=D(n.hunger+25)),t==="play"&&(n.fun=D(n.fun+25),n.hunger=D(n.hunger-5)),t==="pet"&&(n.love=D(n.love+20)),n}function Je(e,t){const n=N.indexOf(e);return Math.min(t.hunger,t.fun,t.love)>=25||n>=N.indexOf("angry")?e:N[n+1]}function Xe(e,t){return t.hunger<25?`${e} is hungry. Tap Feed.`:t.fun<25?`${e} is bored. Try Play.`:t.love<25?`${e} could use some attention. Tap Pet.`:null}const S=e=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,q={chevronLeft:S('<path d="M15 18l-6-6 6-6"/>'),chevronRight:S('<path d="M9 18l6-6-6-6"/>'),close:S('<path d="M6 6l12 12M18 6L6 18"/>'),bulb:S('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.4h6c0-1.1.2-1.8.8-2.4A6 6 0 0 0 12 3z"/>'),pet:S('<path d="M12 20s-7-4.4-9-8.5C1.5 8 3.5 5 6.5 5c2 0 3.5 1.2 5.5 3 2-1.8 3.5-3 5.5-3 3 0 5 3 3.5 6.5-2 4.1-9 8.5-9 8.5z"/>')},x={cookie:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#f2b95c" stroke="#d48f2f" stroke-width="2"/><circle cx="13" cy="15" r="3" fill="#6b3e1f"/><circle cx="25" cy="12" r="2.5" fill="#6b3e1f"/><circle cx="23" cy="25" r="3" fill="#6b3e1f"/><circle cx="12" cy="26" r="2" fill="#6b3e1f"/><circle cx="29" cy="19" r="1.8" fill="#6b3e1f"/></svg>',ball:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#ffc93c" stroke="#e8a200" stroke-width="2"/><path d="M20 3 Q8 20 20 37" stroke="#ff5c9a" stroke-width="4" fill="none"/><path d="M20 3 Q32 20 20 37" stroke="#ff5c9a" stroke-width="4" fill="none"/><circle cx="14" cy="11" r="3" fill="#fff" opacity=".7"/></svg>',heart:'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 35 C6 25 2 17 6 10 C10 4 18 5 20 11 C22 5 30 4 34 10 C38 17 34 25 20 35Z" fill="#ff5c9a" stroke="#e0407f" stroke-width="2"/><ellipse cx="12" cy="13" rx="3" ry="2" fill="#fff" opacity=".6"/></svg>',bag:'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 14h22l-2 21H11z" fill="#b69cff" stroke="#8b6cf0" stroke-width="2" stroke-linejoin="round"/><path d="M15 15v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#8b6cf0" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="24" r="4.5" fill="#ffc93c" stroke="#e8a200" stroke-width="1.5"/></svg>',coin:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="10" fill="#d98a00"/><circle cx="12" cy="11.5" r="10" fill="#ffc93c"/><circle cx="12" cy="11.5" r="6.5" fill="none" stroke="#e8a200" stroke-width="1.5"/><path d="M6 7.5a8 8 0 0 1 4-3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".7"/></svg>'},y=e=>e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),et=[{title:"Saving methods",intro:"Simple systems that make saving automatic.",lessons:[{title:"50/30/20 rule",body:"Split your take-home pay: 50% needs, 30% wants, 20% savings and debt. OinkCoin already tracks needs vs. wants for you."},{title:"Pay yourself first",body:"Set up an automatic transfer to savings on payday, before you can spend it. Even $25 a paycheck adds up."},{title:"Envelope (cash stuffing) method",body:"Give each want category a fixed amount in a cash or digital envelope. When it's empty, you're done for the month."},{title:"No-spend challenge",body:"Pick a week or weekend where you only pay for needs. Great for resetting shopping and dining habits."},{title:"52-week challenge",body:"Save $1 in week 1, $2 in week 2, and so on. By week 52 you'll have $1,378."},{title:"Round-ups",body:"Round every purchase up to the next dollar and move the difference to savings. Many banks can do this automatically."}]},{title:"Paying off debt",intro:"Two proven ways to get out of debt faster.",lessons:[{title:"Avalanche method",body:"Pay the minimum on everything, then put every extra dollar toward the highest-interest debt. Saves the most money overall."},{title:"Snowball method",body:"Pay the minimum on everything, then attack the smallest balance first. Quick wins keep you motivated."}]},{title:"How to start investing",intro:"Follow these steps in order.",lessons:[{title:"1. Build an emergency fund",body:"Before investing, save 3-6 months of essential expenses in a high-yield savings account."},{title:"2. Pay off high-interest debt",body:"Credit cards often charge 20%+ interest. Paying them off is a guaranteed return no investment can match."},{title:"3. Get your employer match",body:"If your job offers a 401(k) match, contribute at least enough to get it. It's free money."},{title:"4. Open a Roth IRA",body:"Your money grows tax-free and can be withdrawn tax-free in retirement. Many brokers let you start with $0."},{title:"5. Pick low-cost index funds",body:"Index funds and ETFs spread your money across hundreds of companies with low fees. Diversifying lowers your risk."},{title:"6. Invest regularly",body:"Invest the same amount every month no matter what the market does (dollar-cost averaging). Time in the market beats timing the market."}]}],tt={"Save more money":"Pay yourself first","Stop impulse buying":"No-spend challenge","Pay off debt":"Avalanche method","Just track my spending":"50/30/20 rule"};function nt(e,t){const n=tt[e.goal],s=t.wantsSpent*.2;return`
    <section class="card learn-hero">
      <h2>Grow your money</h2>
      <p>Your goal is <strong>${y(e.goal.toLowerCase())}</strong>. A good place to start: <strong>${y(n)}</strong>.</p>
      ${s>0?`<p class="projection">Cutting your wants by 20% (${$(s)}/month) would save <strong>${$(s*12)}</strong> in a year.</p>`:""}
    </section>
    ${et.map(a=>`
      <section class="card">
        <h2>${y(a.title)}</h2>
        <p class="hint">${y(a.intro)}</p>
        ${a.lessons.map(r=>`
          <details class="lesson"${r.title===n?" open":""}>
            <summary>${y(r.title)}${r.title===n?'<span class="tag want">For you</span>':""}</summary>
            <p>${y(r.body)}</p>
          </details>`).join("")}
      </section>`).join("")}
    <p class="disclaimer">For education only, not financial advice.</p>`}let at=0;function st(e=44){const t=`coin${++at}`;return`<svg class="coin-logo" width="${e}" height="${e}" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient id="${t}-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff07a"/><stop offset=".55" stop-color="#ffc93c"/><stop offset="1" stop-color="#f2a100"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="34" r="28" fill="#d98a00"/>
    <circle cx="32" cy="31" r="28" fill="url(#${t}-g)"/>
    <circle cx="32" cy="31" r="21.5" fill="none" stroke="#e8a200" stroke-width="2" stroke-dasharray="3 2.5"/>
    <ellipse cx="32" cy="31" rx="12.5" ry="9.5" fill="#fff3b8" stroke="#b97f00" stroke-width="1.6"/>
    <ellipse cx="27.6" cy="31" rx="2.4" ry="3.8" fill="#a56f00"/>
    <ellipse cx="36.4" cy="31" rx="2.4" ry="3.8" fill="#a56f00"/>
    <path d="M13 22 A20 20 0 0 1 24 10.5" stroke="#fff" stroke-opacity=".75" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`}function J(){return`<h1 class="logo">${st()}<span class="wordmark"><span class="oink">Oink</span><span class="coin">Coin</span></span></h1>`}const rt=5*1024*1024,ot=[["Groceries",/grocery|whole ?foods|trader joe|safeway|kroger|aldi|publix|wegmans|sprouts|h-e-b|\bheb\b|food lion|supermarket/i],["Food & Dining",/restaurant|cafe|coffee|starbucks|dunkin|mcdonald|chipotle|taco|pizza|burger|doordash|uber ?eats|grubhub|subway|kitchen|grill|diner|wendy|chick-fil|panera|sushi/i],["Transport",/uber|lyft|shell|chevron|exxon|mobil|\bbp\b|\bgas\b|fuel|parking|metro|transit|toll|airline|delta|united|southwest|amtrak/i],["Entertainment",/netflix|spotify|hulu|disney|hbo|cinema|theat(er|re)|\bamc\b|steam|playstation|xbox|nintendo|ticketmaster|concert|youtube|twitch|apple\.com\/bill/i],["Bills",/rent|mortgage|electric|utilit|water|internet|comcast|xfinity|verizon|at&t|t-mobile|insurance|geico|state farm|progressive|loan/i],["Health",/pharmacy|\bcvs\b|walgreens|doctor|clinic|dental|hospital|medical|\bgym\b|fitness/i],["Shopping",/amazon|amzn|target|walmart|best buy|nike|zara|h&m|shein|etsy|ebay|apple store|sephora|ulta|old navy|\bgap\b|tj ?maxx|marshalls|nordstrom|macy|costco|ikea|store|shop/i]],it=/payroll|direct dep|deposit|transfer|payment.*thank|online payment|zelle from|refund/i;function lt(e){var t;return((t=ot.find(([,n])=>n.test(e)))==null?void 0:t[0])??"Other"}function ct(e){const t=[];let n=[],s="",a=!1;for(let r=0;r<e.length;r++){const o=e[r];a?o==='"'&&e[r+1]==='"'?(s+='"',r++):o==='"'?a=!1:s+=o:o==='"'?a=!0:o===","?(n.push(s),s=""):o===`
`||o==="\r"?(o==="\r"&&e[r+1]===`
`&&r++,n.push(s),t.push(n),n=[],s=""):s+=o}return(s||n.length)&&(n.push(s),t.push(n)),t.filter(r=>r.some(o=>o.trim()))}function dt(e){const t=e.trim(),n=a=>String(a).padStart(2,"0");let s=t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);return s?`${s[1]}-${n(+s[2])}-${n(+s[3])}`:(s=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/),s?`${s[3].length===2?2e3+ +s[3]:+s[3]}-${n(+s[1])}-${n(+s[2])}`:null)}function re(e){const t=e.trim();if(!t)return null;const n=/^\(.*\)$/.test(t)||t.startsWith("-"),s=Number(t.replace(/[^0-9.]/g,""));return Number.isFinite(s)?n?-s:s:null}function ft(e){const t=ct(e),n=t.findIndex(l=>l.some(d=>/date/i.test(d))&&l.some(d=>/amount|debit|withdrawal/i.test(d)));if(n<0)throw new Error("Couldn't find Date and Amount columns in this file.");const s=t[n].map(l=>l.trim().toLowerCase()),a=l=>s.findIndex(d=>l.test(d)),r=a(/date/),o=a(/description|payee|merchant|name|memo|details/),h=a(/debit|withdrawal/),i=a(/amount/),b=t.slice(n+1),g=b.map(l=>i>=0?re(l[i]??""):null),m=g.some(l=>l!==null&&l<0),p=[];if(b.forEach((l,d)=>{const u=dt(l[r]??""),f=(o>=0?l[o]:"").trim();if(!u||it.test(f))return;let v=null;if(h>=0){const w=re(l[h]??"");v=w?Math.abs(w):null}else{const w=g[d];w!==null&&(v=m?w<0?-w:null:w)}!v||v<=0||p.push({id:crypto.randomUUID(),amount:Math.round(v*100)/100,category:lt(f),note:f.slice(0,60),date:u})}),p.length===0)throw new Error("No spending transactions found in this file.");return p}function ye(e,t){const n=a=>`${a.date}|${a.amount}|${a.note}`,s=new Set(e.map(n));return[...e,...t.filter(a=>!s.has(n(a)))]}function ge(e){return e.size>rt?Promise.reject(new Error("File is too large (max 5 MB).")):e.text().then(ft)}const oe=["Buddy","Budget","Statement","Quiz"],X=I.filter(e=>e!=="Bills");let G=null;function ut(e){const t=e.profile;return{step:0,character:(t==null?void 0:t.character)??"pig",name:(t==null?void 0:t.name)??"",budget:(t==null?void 0:t.budget)??2e3,imported:[],importMsg:"",importError:!1,focus:(t==null?void 0:t.focus)??[],goal:(t==null?void 0:t.goal)??"Save more money"}}function pt(e){switch(e.step){case 0:return`
        <h2>Choose your buddy</h2>
        <div class="avatar-pick">
          ${je.map(t=>`
            <label class="pick">
              <input type="radio" name="character" value="${t.id}" aria-label="${t.label}" ${t.id===e.character?"checked":""} />
              ${O(t.id,"happy")}
            </label>`).join("")}
        </div>
        <label class="field">Give your buddy a name
          <input name="name" required maxlength="20" value="${y(e.name)}" placeholder="e.g. Penny" />
        </label>`;case 1:return`
        <h2>What's your monthly budget?</h2>
        <p class="hint">How much can you spend each month after savings?</p>
        <div class="money-input"><span>$</span><input name="budget" type="number" min="1" step="1" required value="${e.budget}" aria-label="Monthly budget" /></div>
        <div class="chips">
          ${[1e3,2e3,3e3,5e3].map(t=>`<button type="button" class="chip" data-budget="${t}">$${t.toLocaleString()}</button>`).join("")}
        </div>`;case 2:return`
        <h2>Add a bank statement</h2>
        <p class="hint">Upload a CSV from your bank (for example in Bank of America: Activity &gt; Download &gt; Microsoft Excel). We'll sort your spending into categories. Your file stays on this device.</p>
        <label class="dropzone">
          <input type="file" id="statement" accept=".csv,text/csv" />
          <strong>${e.imported.length?"Choose another file":"Choose CSV file"}</strong>
          <small>Optional - you can skip this</small>
        </label>
        ${e.importMsg?`<p class="import-msg${e.importError?" error":""}" role="status">${y(e.importMsg)}</p>`:""}`;default:return`
        <h2>Quick quiz</h2>
        <p class="q">1. What do you want to spend less on?</p>
        <div class="chips">
          ${X.map(t=>`<label class="chip"><input type="checkbox" name="focus" value="${y(t)}" ${e.focus.includes(t)?"checked":""} />${y(t)}</label>`).join("")}
        </div>
        <p class="q">2. What's your main goal?</p>
        <div class="options">
          ${pe.map(t=>`<label class="option"><input type="radio" name="goal" value="${y(t)}" ${t===e.goal?"checked":""} />${y(t)}</label>`).join("")}
        </div>`}}function ie(e){const t=new Map;for(const s of e)X.includes(s.category)&&t.set(s.category,(t.get(s.category)??0)+s.amount);const[n]=[...t].sort((s,a)=>a[1]-s[1]);return n?{category:n[0],total:n[1]}:null}function me(e,t,n,s){var h,i,b;G??(G=ut(t));const a=G,r=()=>me(e,t,n,s);e.innerHTML=`
    <main class="onboard card">
      <div class="onboard-head">
        ${J()}
        ${s?`<button type="button" class="icon" id="cancel" aria-label="Close">${q.close}</button>`:""}
      </div>
      <ol class="steps">
        ${oe.map((g,m)=>`<li class="${m<a.step?"done":""}${m===a.step?" current":""}"><span>${m+1}</span>${g}</li>`).join("")}
      </ol>
      <form id="step-form">
        ${pt(a)}
        <div class="actions">
          ${a.step>0?'<button type="button" class="secondary" id="back">Back</button>':""}
          <button type="submit">${a.step===oe.length-1?"Let's go!":a.step===2&&!a.imported.length?"Skip":"Next"}</button>
        </div>
      </form>
    </main>`;const o=e.querySelector("#step-form");(h=e.querySelector("#cancel"))==null||h.addEventListener("click",()=>{G=null,s==null||s()}),(i=e.querySelector("#back"))==null||i.addEventListener("click",()=>{a.step--,r()}),e.querySelectorAll("[data-budget]").forEach(g=>g.addEventListener("click",()=>{o.querySelector('input[name="budget"]').value=g.dataset.budget})),(b=e.querySelector("#statement"))==null||b.addEventListener("change",async g=>{var p;const m=(p=g.target.files)==null?void 0:p[0];if(m){try{a.imported=await ge(m);const l=ie(a.imported);a.importMsg=`Imported ${a.imported.length} transactions.${l?` Outside of bills, you spend the most on ${l.category} (${$(l.total)}).`:""}`,a.importError=!1}catch(l){a.imported=[],a.importMsg=l instanceof Error?l.message:"Could not read that file.",a.importError=!0}r()}}),o.addEventListener("submit",g=>{g.preventDefault();const m=new FormData(o);if(a.step===0)a.character=m.get("character"),a.name=String(m.get("name")).trim()||"Buddy";else if(a.step===1)a.budget=Math.max(1,Number(m.get("budget"))||1);else if(a.step===2){const p=ie(a.imported);p&&a.focus.length===0&&(a.focus=[p.category])}else{a.focus=m.getAll("focus").map(String).filter(l=>X.includes(l));const p=String(m.get("goal"));a.goal=pe.includes(p)?p:"Save more money",t.profile={name:a.name,character:a.character,budget:a.budget,limits:Ve(a.budget,a.focus),focus:a.focus,goal:a.goal},t.expenses=ye(t.expenses,a.imported),G=null,n();return}a.step++,r()})}const ee={Shopping:"#ff5c9a","Food & Dining":"#ffb000",Entertainment:"#8b5cf6",Transport:"#22a7e0",Bills:"#5b3fa6",Groceries:"#2fb36b",Health:"#3b82f6",Other:"#a59aa1"},ht={Bills:'<path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4z"/>',Transport:'<path d="M5 16l1.6-5.4C7 9.4 7.8 9 9 9h6c1.2 0 2 .4 2.4 1.6L19 16v3h-2.5v-1.5h-9V19H5z"/><circle cx="8" cy="15" r="1.3" fill="#0003"/><circle cx="16" cy="15" r="1.3" fill="#0003"/>',Groceries:'<path d="M3 5h3l2 10h10l2-7H7" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/>',Health:'<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',"Food & Dining":'<path d="M7 3v7M5 3v5c0 1.2.9 2 2 2s2-.8 2-2V3M7 10v11M17 3c-2.5 2-3 5-3 8h3v10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',Shopping:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5C9 4.6 10.3 3 12 3s3 1.6 3 3.5V8" fill="none" stroke="#fff" stroke-width="2"/>',Entertainment:'<path d="M3 8c1.1 0 2-.9 2-2h14c0 1.1.9 2 2 2v8c-1.1 0-2 .9-2 2H5c0-1.1-.9-2-2-2z"/><path d="M10 9.5v5l4-2.5z" fill="#0003"/>',Other:'<circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>'};function $e(e){return`<span class="cat-icon" style="background:${ee[e]}"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#fff">${ht[e]}</g></svg></span>`}function be(e){return Q(e)?'<span class="tag want">Want</span>':e==="Other"?"":'<span class="tag need">Need</span>'}const Y=136,_=2*Math.PI*Y,le=_*.75;function yt(e,t,n){const s=Math.max(t,e.spent),a=e.categories.filter(i=>i.spent>0),r=a.length>1?3:0;let o=0;const h=a.map(i=>{const b=i.spent/s*le,m=`<circle class="arc-seg${n?n===i.category?" selected":" dim":""}" data-cat="${y(i.category)}" cx="150" cy="150" r="${Y}" stroke="${ee[i.category]}" stroke-dasharray="${Math.max(b-r,1)} ${_}" stroke-dashoffset="${-o}"><title>${y(i.category)}: ${$(i.spent)}</title></circle>`;return o+=b,m}).join("");return`<svg class="arc" viewBox="0 0 300 300" aria-hidden="true">
    <g transform="rotate(135 150 150)" fill="none">
      <circle cx="150" cy="150" r="${Y}" stroke="#f1edef" stroke-width="14" stroke-linecap="round" stroke-dasharray="${le} ${_}"/>
      ${h}
    </g>
  </svg>`}function gt(e,t){const n=e.limit-e.spent,s=n<0,a=t>0?Math.round(e.spent/t*100):0,r=e.limit>0?Math.min(100,e.spent/e.limit*100):e.spent>0?100:0;return`<div class="cat-detail">
    <div class="cat-title">${$e(e.category)}<strong style="color:${ee[e.category]}">${y(e.category)}</strong>${be(e.category)}</div>
    <p class="amt">${$(e.spent)} <span>of ${$(e.limit)}</span></p>
    <div class="bar"><div class="fill ${s?"over":"ok"}" style="width:${r}%"></div></div>
    <div class="split">
      <div><b class="${s?"neg":""}">${$(Math.abs(n))}</b><small>${s?"over":"under"} budget</small></div>
      <div><b>${a}%</b><small>of total spending</small></div>
    </div>
  </div>`}function ve(e,t){return`<ul class="cat-list">${e.categories.map(n=>{const s=n.category===t,a=n.limit>0?Math.min(100,n.ratio*100):n.spent>0?100:0;return`<li>
        <button class="cat-row${s?" selected":""}" data-cat="${y(n.category)}" aria-pressed="${s}">
          ${$e(n.category)}
          <div class="cat-info">
            <div class="cat-name">${y(n.category)}${be(n.category)}</div>
            <div class="cat-amt">${$(n.spent)} <span>of ${$(n.limit)}</span></div>
            <div class="bar"><div class="fill ${n.ratio>1?"over":"ok"}" style="width:${a}%"></div></div>
          </div>
          <span class="chev" aria-hidden="true">${q.chevronRight}</span>
        </button>
      </li>`}).join("")}</ul>`}const V=3,j=e=>{const[t,n,s]=e.split("-").map(Number);return new Date(t,n-1,s)};function U(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate()-(e.getDay()+6)%7)}const mt=e=>e.toLocaleDateString(void 0,{month:"short",day:"numeric"});function ke(e){return he.reduce((t,n)=>t+(e.limits[n]??0),0)}function te(e){return Math.round(ke(e)*7/30.44*100)/100}function $t(e,t=new Date){const n=E(U(t)),s=E(new Date(j(n).getTime()+6*864e5));return{spent:e.expenses.filter(r=>Q(r.category)&&r.date>=n&&r.date<=s).reduce((r,o)=>r+o.amount,0),limit:e.profile?te(e.profile):0}}function bt(e,t=new Date){const n=e.profile;if(!n)return[];const s=E(t),a=E(U(t)),r=s.slice(0,7),o=te(n),h=ke(n),i=new Map,b=new Map;for(const p of e.expenses){const l=E(U(j(p.date))),d=Q(p.category)?p.amount:0;i.set(l,(i.get(l)??0)+d);const u=b.get(p.date.slice(0,7))??{total:0,wants:0};u.total+=p.amount,u.wants+=d,b.set(p.date.slice(0,7),u)}const g=[];for(const[p,l]of i)p<a&&l<=o&&g.push({key:`week:${p}`,label:`Week of ${mt(j(p))}`});for(const[p,l]of b)p<r&&l.total<=n.budget&&l.wants<=h&&g.push({key:`month:${p}`,label:j(`${p}-01`).toLocaleDateString(void 0,{month:"long",year:"numeric"})});const m=new Set(e.rewards);return g.filter(p=>!m.has(p.key)).sort((p,l)=>p.key.localeCompare(l.key))}const we="oinkcoin-state-v1",xe=()=>({hunger:80,fun:80,love:80,updatedAt:Date.now()});function vt(){try{const e=localStorage.getItem(we);if(e){const t=JSON.parse(e),n=t.profile;return{profile:n?{focus:[],goal:"Just track my spending",...n}:null,expenses:Array.isArray(t.expenses)?t.expenses:[],care:t.care??xe(),coins:typeof t.coins=="number"?t.coins:0,rewards:Array.isArray(t.rewards)?t.rewards:[],owned:Array.isArray(t.owned)?t.owned:[],equipped:t.equipped??{}}}}catch{}return Me()}function Me(){return{profile:null,expenses:[],care:xe(),coins:0,rewards:[],owned:[],equipped:{}}}function ne(e){localStorage.setItem(we,JSON.stringify(e))}const kt=[{slot:"hat",title:"Hats"},{slot:"eyes",title:"Glasses"},{slot:"neck",title:"Neckwear"}];function wt(e,t){const n=t.owned.includes(e.id),s=t.equipped[e.slot]===e.id,a=n?`<button class="small ${s?"secondary":""}" data-wear="${e.id}">${s?"Take off":"Wear"}</button>`:`<button class="small buy" data-buy="${e.id}" ${t.coins<e.price?"disabled":""} aria-label="Buy ${y(e.name)} for ${e.price} coins">${x.coin}${e.price}</button>`;return`<div class="shop-item${s?" wearing":""}">
    <div class="shop-art">${Ge(e)}</div>
    <span class="shop-name">${y(e.name)}</span>
    ${a}
  </div>`}function xt(e,t){const n=$t(e),s=n.limit>0?Math.min(100,n.spent/n.limit*100):0;return`
    <section class="card store-hero">
      <div class="store-preview">${O(t.character,"happy",e.equipped)}</div>
      <div class="store-balance">
        <small>Your coins</small>
        <strong>${x.coin}${e.coins}</strong>
      </div>
      <div class="earn">
        <p>Earn <b>${V} coins</b> each week your wants stay under ${$(te(t))}, and each month you stay on budget.</p>
        <div class="meter-head"><span>This week's wants</span><b>${$(n.spent)} / ${$(n.limit)}</b></div>
        <div class="bar"><div class="fill ${n.spent>n.limit?"over":"ok"}" style="width:${s}%"></div></div>
      </div>
    </section>
    ${kt.map(a=>`
      <section class="card">
        <h2>${a.title}</h2>
        <div class="shop-grid">${fe.filter(r=>r.slot===a.slot).map(r=>wt(r,e)).join("")}</div>
      </section>`).join("")}`}const k=document.querySelector("#app"),c=vt();let R=!1,B="buddy",C=new Date(new Date().getFullYear(),new Date().getMonth(),1),T=null,P="",ce=0;const Se={happy:"Happy",okay:"Okay",sad:"Sad",angry:"Angry",dead:"Fainted"},Mt=[{view:"buddy",label:"Budget Buddy",icon:q.pet},{view:"report",label:"Full Report",icon:S('<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>')},{view:"store",label:"Store",icon:S('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>')},{view:"learn",label:"Grow Your Money",icon:S('<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>')},{view:"settings",label:"Profile & Settings",icon:S('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>')}],St={feed:`<div class="fx-food">${x.cookie}</div><span class="fx-plus">+25 Hunger</span>`,play:`<div class="fx-ball-x"><div class="fx-ball-y">${x.ball}</div></div><span class="fx-plus">+25 Fun</span>`,pet:[-40,0,40].map((e,t)=>`<span class="fx-heart" style="--x:${e}px;--d:${t*.25}s">${x.heart}</span>`).join("")+'<span class="fx-plus">+20 Love</span>'},Ce=[{action:"feed",stat:"hunger",label:"Feed",icon:x.cookie,color:"#fff1d6",ring:"#f2b230"},{action:"play",stat:"fun",label:"Play",icon:x.ball,color:"#fde7f0",ring:"#8b5cf6"},{action:"pet",stat:"love",label:"Pet",icon:x.heart,color:"#ffe4ea",ring:"#e5487f"}],Ct={hunger:"Hunger",fun:"Fun",love:"Love"},Le=(e,t)=>`${e.label} (${Ct[e.stat]} ${t}%)`;function Ee(e){const t=document.createElement("div");t.className="toast",t.setAttribute("role","status"),t.innerHTML=e,document.body.append(t),requestAnimationFrame(()=>t.classList.add("show")),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),400)},3200)}function Lt(){const e=bt(c);if(e.length===0)return;c.coins+=e.length*V,c.rewards.push(...e.map(n=>n.key)),ne(c);const t=e.length===1?y(e[0].label):`${e.length} goals`;Ee(`${x.coin}<span>Goal met: ${t} &middot; <b>+${e.length*V} coins</b></span>`)}function A(){ne(c),L()}function L(){if(!c.profile||R){me(k,c,()=>{R=!1,B="buddy",A()},c.profile?()=>{R=!1,L()}:null);return}Lt(),qt(c.profile)}const Ae=e=>e.monthKey===E().slice(0,7);function De(e){const t=C.toLocaleDateString(void 0,{month:"long",year:"numeric"});return`<div class="month-nav">
    <button class="icon" id="prev" aria-label="Previous month">${q.chevronLeft}</button>
    <h2>${y(t)}</h2>
    <button class="icon" id="next" aria-label="Next month" ${Ae(e)?"disabled":""}>${q.chevronRight}</button>
  </div>`}function Et(e,t,n,s,a){const r=a==="dead"?n.message:Xe(e.name,s)??n.message,o=t.categories.find(g=>g.category===T)??t.topWant??t.categories[0],h=C.toLocaleDateString(void 0,{month:"long"}),i=Ae(t)?new Date:new Date(C.getFullYear(),C.getMonth()+1,0),b=a==="dead";return`
    <section class="card pet-card mood-${a}">
      ${De(t)}
      <p class="speech">${y(r)}</p>
      <div class="ring-stage">
        ${yt(t,e.budget,T)}
        <button class="pet" id="pet" aria-label="Pet ${y(e.name)}" ${b?"disabled":""}>${O(e.character,a,c.equipped)}</button>
        <div class="fx" id="fx" aria-hidden="true"></div>
      </div>
      <div class="total">
        <small>Total ${y(h)} Spending</small>
        <strong>${$(t.spent)}</strong>
        <small>of ${$(e.budget)} &middot; as of ${y(i.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}))}</small>
      </div>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${$(t.needsSpent)}</b></div>
        <div class="want"><small>Wants</small><b>${$(t.wantsSpent)} <span>/ ${$(t.wantsLimit)}</span></b></div>
      </div>
      <div class="pet-name"><h2>${y(e.name)}</h2><span class="mood-badge">${Se[a]}</span></div>
      ${n.tip?`<p class="tip">${q.bulb}<span>${y(n.tip)}</span></p>`:""}
    </section>

    <section class="card">${gt(o,t.spent)}</section>

    <section class="card">
      <h2>Spending categories</h2>
      ${ve(t,o.category)}
    </section>

    <nav class="action-bar" aria-label="Care for your buddy">
      ${Ce.map(g=>`<button data-action="${g.action}" class="${s[g.stat]<25?"low":""}" style="--c:${g.color};--ring:${g.ring};--v:${s[g.stat]}" aria-label="${Le(g,s[g.stat])}" ${b?"disabled":""}><span class="bubble">${g.icon}</span><span>${g.label}</span></button>`).join("")}
      <button data-view="store" class="plain" style="--c:#efe9ff"><span class="bubble">${x.bag}</span><span>Shop</span></button>
    </nav>`}function At(e,t){const n=c.expenses.filter(r=>r.date.startsWith(t.monthKey)).sort((r,o)=>o.date.localeCompare(r.date)),s=Math.min(100,Math.round(t.usage*100)),a=t.categories.find(r=>r.category===T)??t.topWant??t.categories[0];return`
    <section class="card">
      ${De(t)}
      <div class="stats">
        <div><small>Budget</small><strong>${$(e.budget)}</strong></div>
        <div><small>Spent</small><strong>${$(t.spent)}</strong></div>
        <div><small>Left</small><strong class="${t.remaining<0?"neg":"pos"}">${$(t.remaining)}</strong></div>
      </div>
      <div class="bar big"><div class="fill ${t.usage>1?"over":"ok"}" style="width:${s}%"></div></div>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${$(t.needsSpent)}</b></div>
        <div class="want"><small>Wants</small><b>${$(t.wantsSpent)} <span>/ ${$(t.wantsLimit)}</span></b></div>
      </div>
    </section>

    <section class="card">
      <h2>Spending categories</h2>
      ${ve(t,a.category)}
    </section>

    <section class="card">
      <h2>Add expense</h2>
      <form id="expense-form" class="expense-form">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" aria-label="Amount" required />
        <select name="category" aria-label="Category">${I.map(r=>`<option>${y(r)}</option>`).join("")}</select>
        <input name="note" maxlength="60" placeholder="Note (optional)" aria-label="Note" />
        <input name="date" type="date" value="${E()}" aria-label="Date" required />
        <button type="submit">Add</button>
      </form>
      <h3>Import bank statement</h3>
      <label class="dropzone small">
        <input type="file" id="statement" accept=".csv,text/csv" />
        <strong>Upload CSV</strong>
      </label>
      ${P?`<p class="import-msg" role="status">${y(P)}</p>`:""}
    </section>

    <section class="card">
      <h2>Transactions</h2>
      ${n.length===0?'<p class="empty">No expenses this month.</p>':`<ul class="expenses">${n.map(r=>`
            <li>
              <div><strong>${y(r.category)}</strong>${r.note?` - ${y(r.note)}`:""}<br /><small>${y(r.date)}</small></div>
              <span>${$(r.amount)}</span>
              <button class="icon" data-delete="${y(r.id)}" aria-label="Delete expense">&times;</button>
            </li>`).join("")}</ul>`}
    </section>`}function Dt(e){return`
    <section class="card settings">
      <div class="profile-row">
        ${O(e.character,"happy",c.equipped)}
        <div><h2>${y(e.name)}</h2><p class="hint">Your budget buddy</p></div>
      </div>
      <dl class="facts">
        <div><dt>Monthly budget</dt><dd>${$(e.budget)}</dd></div>
        <div><dt>Main goal</dt><dd>${y(e.goal)}</dd></div>
        <div><dt>Cutting back on</dt><dd>${e.focus.length?y(e.focus.join(", ")):"Nothing yet"}</dd></div>
        <div><dt>Coins</dt><dd>${c.coins}</dd></div>
        <div><dt>Transactions saved</dt><dd>${c.expenses.length}</dd></div>
      </dl>
      <button id="edit">Edit buddy, budget &amp; quiz</button>
    </section>

    <section class="card">
      <h2>Reset</h2>
      <p class="hint">Delete your buddy, budget and all transactions from this device.</p>
      <button id="reset" class="danger">Reset everything</button>
    </section>`}function Tt(e,t){return`
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="Menu">
      <div class="drawer-head">${J()}<button class="icon" id="close-menu" aria-label="Close menu">${q.close}</button></div>
      <div class="drawer-profile">
        ${O(e.character,t,c.equipped)}
        <div><strong>${y(e.name)}</strong><small>${Se[t]}</small></div>
      </div>
      <nav>
        ${Mt.map(n=>`<button data-view="${n.view}" ${n.view===B?'aria-current="page"':""}>${n.icon}<span>${n.label}</span></button>`).join("")}
      </nav>
    </aside>`}function H(e){var t,n;document.body.classList.toggle("drawer-open",e),(t=k.querySelector("#menu"))==null||t.setAttribute("aria-expanded",String(e)),e&&((n=k.querySelector("#drawer [aria-current]"))==null||n.focus())}document.addEventListener("keydown",e=>{e.key==="Escape"&&H(!1)});function qt(e){var i,b,g,m,p,l;const t=se(e,c.expenses),n=se(e,c.expenses,C),s=K(c.care),a=Je(t.mood,s),r={buddy:()=>Et(e,n,t,s,a),report:()=>At(e,n),store:()=>xt(c,e),learn:()=>nt(e,t),settings:()=>Dt(e)}[B]();H(!1),k.innerHTML=`
    <header class="topbar">
      <button class="menu-btn" id="menu" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      ${J()}
      <button class="coin-chip" data-view="store" aria-label="${c.coins} coins, open store">${x.coin}<b>${c.coins}</b></button>
    </header>
    ${Tt(e,a)}
    <main class="stack">${r}</main>`,k.querySelector("#menu").addEventListener("click",()=>H(!0)),k.querySelector("#close-menu").addEventListener("click",()=>H(!1)),k.querySelector("#scrim").addEventListener("click",()=>H(!1)),k.querySelectorAll("[data-view]").forEach(d=>d.addEventListener("click",()=>{B=d.dataset.view,T=null,L(),window.scrollTo(0,0)})),(i=k.querySelector("#edit"))==null||i.addEventListener("click",()=>{R=!0,L()}),(b=k.querySelector("#reset"))==null||b.addEventListener("click",()=>{confirm("Delete your buddy and all your data? This cannot be undone.")&&(Object.assign(c,Me()),B="buddy",A())}),k.querySelectorAll("[data-buy]").forEach(d=>d.addEventListener("click",()=>{const u=Z.get(d.dataset.buy);!u||c.owned.includes(u.id)||c.coins<u.price||(c.coins-=u.price,c.owned.push(u.id),c.equipped[u.slot]=u.id,Ee(`${x.bag}<span>${y(u.name)} is yours!</span>`),A())})),k.querySelectorAll("[data-wear]").forEach(d=>d.addEventListener("click",()=>{const u=Z.get(d.dataset.wear);!u||!c.owned.includes(u.id)||(c.equipped[u.slot]===u.id?delete c.equipped[u.slot]:c.equipped[u.slot]=u.id,A())}));const o=d=>{C=new Date(C.getFullYear(),C.getMonth()+d,1),T=null,L()};(g=k.querySelector("#prev"))==null||g.addEventListener("click",()=>o(-1)),(m=k.querySelector("#next"))==null||m.addEventListener("click",()=>o(1)),k.querySelectorAll("[data-cat]").forEach(d=>d.addEventListener("click",()=>{const u=d.getAttribute("data-cat");T=T===u?null:u,L()})),k.querySelectorAll("[data-action]").forEach(d=>d.addEventListener("click",()=>{d.classList.remove("pop"),d.offsetWidth,d.classList.add("pop"),de(e,d.dataset.action)})),(p=k.querySelector("#pet"))==null||p.addEventListener("click",()=>de(e,"pet"));const h=k.querySelector("#expense-form");h==null||h.addEventListener("submit",d=>{d.preventDefault();const u=new FormData(h),f=Number(u.get("amount")),v=String(u.get("category"));if(!(f>0)||!I.includes(v))return;const w={id:crypto.randomUUID(),amount:Math.round(f*100)/100,category:v,note:String(u.get("note")??"").trim(),date:String(u.get("date"))};c.expenses.push(w),P="",A()}),(l=k.querySelector("#statement"))==null||l.addEventListener("change",async d=>{var f;const u=(f=d.target.files)==null?void 0:f[0];if(u){try{const v=await ge(u),w=c.expenses.length;c.expenses=ye(c.expenses,v),P=`Imported ${c.expenses.length-w} new transactions.`}catch(v){P=v instanceof Error?v.message:"Could not read that file."}A()}}),k.querySelectorAll("[data-delete]").forEach(d=>d.addEventListener("click",()=>{c.expenses=c.expenses.filter(u=>u.id!==d.dataset.delete),A()}))}function de(e,t){c.care=Ke(c.care,t),ne(c);const n=K(c.care);for(const r of Ce){const o=k.querySelector(`[data-action="${r.action}"]`);o&&(o.style.setProperty("--v",String(n[r.stat])),o.classList.toggle("low",n[r.stat]<25),o.setAttribute("aria-label",Le(r,n[r.stat])))}const s=k.querySelector("#pet"),a=k.querySelector("#fx");!s||!a||(s.innerHTML=O(e.character,"happy",c.equipped),s.classList.add("reacting"),a.innerHTML=St[t],clearTimeout(ce),ce=window.setTimeout(L,2200))}L();
