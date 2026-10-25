(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const _n=e=>`
  <rect x="${-e-11}" y="-7" width="22" height="14" rx="6" fill="#1d1a1c"/>
  <rect x="${e-11}" y="-7" width="22" height="14" rx="6" fill="#1d1a1c"/>
  <path d="M${-e+11} -2 Q0 -6 ${e-11} -2" stroke="#1d1a1c" stroke-width="2.5" fill="none"/>
  <path d="M${-e-6} -3 l5 -2 M${e-6} -3 l5 -2" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>`,Un=e=>`
  <circle cx="${-e}" r="9" fill="#fff" fill-opacity=".18" stroke="#b97f00" stroke-width="2.5"/>
  <circle cx="${e}" r="9" fill="#fff" fill-opacity=".18" stroke="#b97f00" stroke-width="2.5"/>
  <path d="M${-e+9} -1 Q0 -5 ${e-9} -1" stroke="#b97f00" stroke-width="2.5" fill="none"/>`,Bt="M0 6 C-9 0 -10 -6 -6 -8 C-3 -9.5 -1 -8 0 -6 C1 -8 3 -9.5 6 -8 C10 -6 9 0 0 6Z",jn=e=>`
  <path transform="translate(${-e} 0) scale(1.45)" d="${Bt}" fill="#ff5c9a" fill-opacity=".92" stroke="#c93468" stroke-width="1"/>
  <path transform="translate(${e} 0) scale(1.45)" d="${Bt}" fill="#ff5c9a" fill-opacity=".92" stroke="#c93468" stroke-width="1"/>
  <path d="M${-e+10} -4 Q0 -8 ${e-10} -4" stroke="#c93468" stroke-width="2.5" fill="none"/>`,Yn=()=>'<path d="M-32 0 Q0 -14 32 0" stroke="#3ccf91" stroke-width="3" fill="none"/>'+[-26,-13,0,13,26].map((e,t)=>{const n=e===0?-8:Math.abs(e)===13?-6:-3,a=["#ff8fb3","#ffc93c","#b69cff","#ffc93c","#ff8fb3"][t];return`<g transform="translate(${e} ${n})"><circle r="6.5" fill="${a}"/><circle r="2.3" fill="#fff"/></g>`}).join(""),Kt=[{id:"party-hat",name:"Party Hat",slot:"hat",price:3,art:()=>'<path d="M-16 0 L0 -44 L16 0Z" fill="#ff5c9a"/><path d="M-11 -14 H11 M-6 -28 H6" stroke="#ffd23f" stroke-width="4"/><circle cy="-46" r="5" fill="#ffd23f"/>'},{id:"beanie",name:"Beanie",slot:"hat",price:3,art:()=>'<path d="M-30 0 C-30 -36 30 -36 30 0Z" fill="#5b8def"/><rect x="-32" y="-8" width="64" height="11" rx="5" fill="#3b6fd8"/><circle cy="-31" r="7" fill="#fff"/>'},{id:"flower-crown",name:"Flower Crown",slot:"hat",price:6,art:Yn},{id:"cowboy",name:"Cowboy Hat",slot:"hat",price:6,art:()=>'<path d="M-20 -4 C-22 -32 -6 -34 0 -25 C6 -34 22 -32 20 -4Z" fill="#b97a45"/><rect x="-20" y="-11" width="40" height="5" fill="#6b3e1f"/><path d="M-44 -8 Q-32 4 0 3 Q32 4 44 -8 Q38 8 0 8 Q-38 8 -44 -8Z" fill="#a8693a"/>'},{id:"top-hat",name:"Top Hat",slot:"hat",price:9,art:()=>'<rect x="-34" y="-6" width="68" height="8" rx="4" fill="#2b2328"/><rect x="-20" y="-46" width="40" height="42" rx="3" fill="#2b2328"/><rect x="-20" y="-15" width="40" height="7" fill="#e5487f"/>'},{id:"crown",name:"Crown",slot:"hat",price:12,art:()=>'<path d="M-24 0 V-22 L-12 -10 L0 -30 L12 -10 L24 -22 V0Z" fill="#ffc93c" stroke="#d99a00" stroke-width="2" stroke-linejoin="round"/><circle cy="-8" r="3.5" fill="#ff5c9a"/><circle cx="-14" cy="-6" r="2.5" fill="#5b8def"/><circle cx="14" cy="-6" r="2.5" fill="#3ccf91"/>'},{id:"round-glasses",name:"Round Glasses",slot:"eyes",price:3,art:Un},{id:"sunglasses",name:"Sunglasses",slot:"eyes",price:6,art:_n},{id:"heart-glasses",name:"Heart Glasses",slot:"eyes",price:6,art:jn},{id:"bow-tie",name:"Bow Tie",slot:"neck",price:3,art:()=>'<path d="M0 0 L-15 -9 L-15 9Z M0 0 L15 -9 L15 9Z" fill="#e5487f" stroke="#c93468" stroke-width="1.5" stroke-linejoin="round"/><rect x="-4.5" y="-4.5" width="9" height="9" rx="2.5" fill="#c93468"/>'},{id:"scarf",name:"Scarf",slot:"neck",price:6,art:()=>'<path d="M13 4 l4 22 l9 -2 l-5 -21Z" fill="#ef4565"/><path d="M-30 -4 Q0 8 30 -4 L30 4 Q0 16 -30 4Z" fill="#ef4565"/><path d="M-20 -1 v8 M-6 2 v9 M8 2 v9 M22 -1 v8" stroke="#ffc93c" stroke-width="3"/>'},{id:"gold-chain",name:"Gold Chain",slot:"neck",price:9,art:()=>'<path d="M-22 -6 Q0 14 22 -6" stroke="#e8a200" stroke-width="2.5" fill="none" stroke-dasharray="3 2"/><circle cy="10" r="7.5" fill="#ffc93c" stroke="#d98a00" stroke-width="2"/><circle cy="10" r="3.8" fill="none" stroke="#e8a200" stroke-width="1.2"/>'}],at=new Map(Kt.map(e=>[e.id,e])),Gn={pig:{hatY:60,hatScale:1,eyeY:104,gap:22,neckY:160,neckScale:1.1},male:{hatY:52,hatScale:.95,eyeY:102,gap:16,neckY:151,neckScale:1},female:{hatY:48,hatScale:.95,eyeY:102,gap:16,neckY:151,neckScale:1},nonbinary:{hatY:42,hatScale:1,eyeY:102,gap:16,neckY:151,neckScale:1}};function Wn(e,t){const n=Gn[e],a=f=>{const i=t[f]?at.get(t[f]):void 0;return(i==null?void 0:i.slot)===f?i:void 0},s=a("neck"),o=a("eyes"),r=a("hat");return[s&&`<g transform="translate(100 ${n.neckY}) scale(${n.neckScale})">${s.art(0)}</g>`,o&&`<g transform="translate(100 ${n.eyeY})">${o.art(n.gap)}</g>`,r&&`<g transform="translate(100 ${n.hatY}) scale(${n.hatScale})">${r.art(0)}</g>`].filter(Boolean).join("")}const zn={hat:"-46 -52 92 64",eyes:"-34 -14 68 28",neck:"-34 -14 68 44"};function Kn(e){return`<svg viewBox="${zn[e.slot]}" aria-hidden="true">${e.art(14)}</svg>`}const F=e=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,H={chevronLeft:F('<path d="M15 18l-6-6 6-6"/>'),chevronRight:F('<path d="M9 18l6-6-6-6"/>'),close:F('<path d="M6 6l12 12M18 6L6 18"/>'),bulb:F('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.4h6c0-1.1.2-1.8.8-2.4A6 6 0 0 0 12 3z"/>'),bell:F('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),pet:F('<path d="M12 20s-7-4.4-9-8.5C1.5 8 3.5 5 6.5 5c2 0 3.5 1.2 5.5 3 2-1.8 3.5-3 5.5-3 3 0 5 3 3.5 6.5-2 4.1-9 8.5-9 8.5z"/>')},O={cookie:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#f2b95c" stroke="#d48f2f" stroke-width="2"/><circle cx="13" cy="15" r="3" fill="#6b3e1f"/><circle cx="25" cy="12" r="2.5" fill="#6b3e1f"/><circle cx="23" cy="25" r="3" fill="#6b3e1f"/><circle cx="12" cy="26" r="2" fill="#6b3e1f"/><circle cx="29" cy="19" r="1.8" fill="#6b3e1f"/></svg>',ball:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#ffc93c" stroke="#e8a200" stroke-width="2"/><path d="M20 3 Q8 20 20 37" stroke="#ff5c9a" stroke-width="4" fill="none"/><path d="M20 3 Q32 20 20 37" stroke="#ff5c9a" stroke-width="4" fill="none"/><circle cx="14" cy="11" r="3" fill="#fff" opacity=".7"/></svg>',heart:'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 35 C6 25 2 17 6 10 C10 4 18 5 20 11 C22 5 30 4 34 10 C38 17 34 25 20 35Z" fill="#ff5c9a" stroke="#e0407f" stroke-width="2"/><ellipse cx="12" cy="13" rx="3" ry="2" fill="#fff" opacity=".6"/></svg>',bag:'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 14h22l-2 21H11z" fill="#b69cff" stroke="#8b6cf0" stroke-width="2" stroke-linejoin="round"/><path d="M15 15v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#8b6cf0" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="24" r="4.5" fill="#ffc93c" stroke="#e8a200" stroke-width="1.5"/></svg>',coin:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="10" fill="#d98a00"/><circle cx="12" cy="11.5" r="10" fill="#ffc93c"/><circle cx="12" cy="11.5" r="6.5" fill="none" stroke="#e8a200" stroke-width="1.5"/><path d="M6 7.5a8 8 0 0 1 4-3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".7"/></svg>'};let Qn=0;function Vn(e=44){const t=`coin${++Qn}`;return`<svg class="coin-logo" width="${e}" height="${e}" viewBox="0 0 64 64" aria-hidden="true">
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
  </svg>`}function Y(){return`<h1 class="logo">${Vn()}<span class="wordmark"><span class="oink">Oink</span><span class="coin">Coin</span></span></h1>`}const ot=new URLSearchParams(location.hash.slice(1)),Zn=ot.get("type")==="recovery",be=ot.get("error_code")??ot.get("error");be&&history.replaceState(null,"",location.pathname+location.search);const D=null,c=e=>e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),yt="oinkcoin-account-v1",Ee="oinkcoin-session-v1",Jn=15e4,Z=8,Qt='<a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>',Ne=[{id:"balances",label:"View account balances",detail:"See how much is in your checking and savings accounts.",required:!0},{id:"transactions",label:"View transaction history",detail:"Read your purchases so your buddy can sort them into categories.",required:!0},{id:"sync",label:"Refresh automatically",detail:"Check for new transactions once a day so your budget stays current.",required:!1},{id:"alerts",label:"Spending alerts",detail:"Notify you when you are close to a category limit.",required:!1}];let _=null;const gt=()=>_;function Ce(){try{const e=localStorage.getItem(yt);return e?JSON.parse(e):null}catch{return null}}const Vt=e=>localStorage.setItem(yt,JSON.stringify(e));let st=Zn;const Xn=()=>st;async function ea(e){const t=Ce();_=t&&localStorage.getItem(Ee)===t.email?{email:t.email,consent:t.consent}:null}async function ta(e){{const t=Ce();t&&Vt({...t,consent:e})}_&&(_={..._,consent:e})}async function $t(){localStorage.removeItem(Ee),_=null,bt=null,Ge=!1}let bt=null,Ge=!1;const Zt=()=>bt,na=()=>Ge;async function Jt(){bt=null,Ge=!1}async function Xt(e,t){const{error:n}=await D.auth.mfa.challengeAndVerify({factorId:e,code:t});if(n)throw new Error("That code didn't work. Check your authenticator app and try again.")}async function aa(){const{data:e,error:t}=await D.auth.mfa.listFactors();if(t)throw new Error(t.message);for(const n of e.totp){const{error:a}=await D.auth.mfa.unenroll({factorId:n.id});if(a)throw new Error(a.message)}await Jt()}const en='<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="123456" />';function tn(e,t){const n=e.querySelector("#code-form"),a=e.querySelector("#code-error");n.addEventListener("submit",async s=>{s.preventDefault();const o=n.querySelector('button[type="submit"]');o.disabled=!0;try{await t(String(new FormData(n).get("code")).trim())}catch(r){a.textContent=r instanceof Error?r.message:"Something went wrong. Try again.",a.hidden=!1,o.disabled=!1}})}function oa(e,t){e.innerHTML=`
    <main class="onboard card auth">
      <div class="onboard-head">${Y()}</div>
      <h2>Enter your code</h2>
      <p class="hint">Open your authenticator app and enter the 6-digit code for OinkCoin.</p>
      <form id="code-form">
        <label class="field">Code ${en}</label>
        <p class="import-msg error" id="code-error" role="alert" hidden></p>
        <div class="actions"><button type="submit">Verify</button></div>
      </form>
      <p class="auth-switch"><button type="button" class="link" id="switch-account">Use a different account</button></p>
    </main>`,e.querySelector('input[name="code"]').focus(),e.querySelector("#switch-account").addEventListener("click",async()=>{await $t(),t()}),tn(e,async n=>{const{data:a,error:s}=await D.auth.mfa.listFactors(),o=a==null?void 0:a.totp[0];if(s||!o)throw new Error("Could not find your authenticator. Try logging in again.");await Xt(o.id,n),Ge=!1,t()})}async function sa(e,t,n){e.innerHTML=`<main class="onboard card auth"><div class="onboard-head">${Y()}</div><p class="hint">Setting up...</p></main>`;const a=D.auth.mfa,s=y=>{e.innerHTML=`
      <main class="onboard card auth">
        <div class="onboard-head">${Y()}</div>
        <h2>Two-factor sign-in</h2>
        <p class="import-msg error" role="alert">${c(y)}</p>
        <div class="actions"><button type="button" class="secondary" id="cancel">Back</button></div>
      </main>`,e.querySelector("#cancel").addEventListener("click",n)},{data:o}=await a.listFactors();for(const y of(o==null?void 0:o.all)??[])y.factor_type==="totp"&&y.status==="unverified"&&await a.unenroll({factorId:y.id});const{data:r,error:f}=await a.enroll({factorType:"totp",friendlyName:"OinkCoin"});if(f||!r)return s((f==null?void 0:f.message)??"Could not start two-factor setup.");const i=r.totp.qr_code,p=i.startsWith("data:")?i:`data:image/svg+xml;utf-8,${encodeURIComponent(i)}`;e.innerHTML=`
    <main class="onboard card auth two-factor">
      <div class="onboard-head">${Y()}</div>
      <h2>Turn on two-factor sign-in</h2>
      <p class="hint">Scan this with an authenticator app like Google Authenticator, Microsoft Authenticator or 1Password.</p>
      <img class="qr" src="${c(p)}" alt="QR code for your authenticator app" width="200" height="200" />
      <p class="hint">Can't scan it? Enter this key instead:<br /><code class="secret">${c(r.totp.secret)}</code></p>
      <form id="code-form">
        <label class="field">Then enter the 6-digit code it shows ${en}</label>
        <p class="import-msg error" id="code-error" role="alert" hidden></p>
        <div class="actions">
          <button type="button" class="secondary" id="cancel">Cancel</button>
          <button type="submit">Turn on</button>
        </div>
      </form>
    </main>`,e.querySelector("#cancel").addEventListener("click",async()=>{await a.unenroll({factorId:r.id}),n()}),tn(e,async y=>{await Xt(r.id,y),await Jt(),t()})}function ra(){localStorage.removeItem(yt),localStorage.removeItem(Ee),_=null}const nn=e=>[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join(""),ia=e=>Uint8Array.from(e.match(/../g),t=>parseInt(t,16));async function an(e,t){const n=await crypto.subtle.importKey("raw",new TextEncoder().encode(e),"PBKDF2",!1,["deriveBits"]),a=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:t,iterations:Jn},n,256);return nn(a)}async function la(e,t){const n=Ce();if(n&&n.email!==e&&!confirm("Another account is saved on this device. Replace it?"))throw new Error("");const a=crypto.getRandomValues(new Uint8Array(16));return Vt({email:e,salt:nn(a.buffer),hash:await an(t,a),consent:null}),localStorage.setItem(Ee,e),_={email:e,consent:null},!0}async function ca(e,t){const n=Ce();if(!n||n.email!==e||await an(t,ia(n.salt))!==n.hash)throw new Error("Email or password is incorrect.");localStorage.setItem(Ee,e),_={email:e,consent:n.consent}}class da extends Error{constructor(){super("Confirm your email first, then log in. Check your spam folder too.")}}const ua=e=>e.trim().toLowerCase(),fa=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),pa=()=>location.origin+location.pathname;let te=be?"forgot":null,Q=be?be==="otp_expired"?"That email link has expired or was already used. Links only work once, so request a new one below.":"That email link did not work. Request a new one below.":"",we=!!be,he="",ie=!1;const ha=()=>Q?`<p class="import-msg${we?" error":""}" role="${we?"alert":"status"}">${c(Q)}</p>`:"";function ma(e,t){if(!_)return st=!1,te="forgot",Q="That reset link has expired. Request a new one.",we=!0,wt(e,t);e.innerHTML=`
    <main class="onboard card auth">
      <div class="onboard-head">${Y()}</div>
      <h2>Choose a new password</h2>
      <p class="hint">For ${c(_.email)}</p>
      <form id="new-password-form" novalidate>
        <label class="field">New password
          <input name="password" type="password" autocomplete="new-password" required minlength="${Z}" />
        </label>
        <label class="field">Confirm new password
          <input name="confirm" type="password" autocomplete="new-password" required minlength="${Z}" />
        </label>
        <p class="import-msg error" id="new-password-error" role="alert" hidden></p>
        <div class="actions"><button type="submit">Save password</button></div>
      </form>
    </main>`;const n=e.querySelector("#new-password-form"),a=n.querySelector("#new-password-error"),s=o=>{a.textContent=o,a.hidden=!1,n.querySelector('button[type="submit"]').disabled=!1};n.addEventListener("submit",async o=>{o.preventDefault();const r=new FormData(n),f=String(r.get("password"));if(f.length<Z)return s(`Password must be at least ${Z} characters.`);if(f!==String(r.get("confirm")))return s("Passwords do not match.");n.querySelector('button[type="submit"]').disabled=!0;const{error:i}=await D.auth.updateUser({password:f});if(i)return s(i.message);st=!1,t()})}function wt(e,t){var f,i;const n=Ce();te??(te=n?"login":"signup");const a=te==="signup",s=()=>wt(e,t);he||(he=(n==null?void 0:n.email)??""),e.innerHTML=`
    <main class="onboard card auth">
      <div class="onboard-head">${Y()}</div>
      <h2>${a?"Create your account":"Welcome back"}</h2>
      <p class="hint">${a?"Sign up to start budgeting with your buddy.":"Log in to check on your buddy."}</p>
      <form id="auth-form" novalidate>
        <label class="field">Email
          <input name="email" type="email" autocomplete="email" required value="${c(he)}" placeholder="you@example.com" />
        </label>
        <label class="field">Password
          <input name="password" type="password" autocomplete="${a?"new-password":"current-password"}" required minlength="${Z}" />
        </label>
        ${a?`<label class="field">Confirm password
                <input name="confirm" type="password" autocomplete="new-password" required minlength="${Z}" />
              </label>`:""}
        
        ${ha()}
        ${ie&&D?'<p class="forgot"><button type="button" class="link" id="resend">Resend confirmation email</button></p>':""}
        <div class="actions"><button type="submit">${a?"Sign up":"Log in"}</button></div>
      </form>
      <p class="auth-switch">
        ${a?"Already have an account?":"New here?"}
        <button type="button" class="link" id="switch">${a?"Log in":"Create an account"}</button>
      </p>
      ${a?`<p class="auth-switch legal">By signing up you agree to our ${Qt}.</p>`:""}
    </main>`;const o=e.querySelector("#auth-form"),r=()=>he=ua(String(new FormData(o).get("email")));e.querySelector("#switch").addEventListener("click",()=>{r(),te=a?"login":"signup",Q="",ie=!1,s()}),(f=e.querySelector("#forgot"))==null||f.addEventListener("click",()=>{r(),te="forgot",Q="",ie=!1,s()}),(i=e.querySelector("#resend"))==null||i.addEventListener("click",async()=>{const{error:p}=await D.auth.resend({type:"signup",email:he,options:{emailRedirectTo:pa()}});we=!!p,Q=p?p.status===429?"Too many emails sent. Wait a few minutes and try again.":p.message:`Sent another confirmation email to ${he}. Check your spam folder too.`,s()}),o.addEventListener("submit",async p=>{p.preventDefault();const y=new FormData(o),b=r(),m=String(y.get("password")),w=(g,$=!0)=>{Q=g,we=$,s()};if(!fa(b))return w("Enter a valid email address.");if(m.length<Z)return w(`Password must be at least ${Z} characters.`);if(a&&m!==String(y.get("confirm")))return w("Passwords do not match.");o.querySelector('button[type="submit"]').disabled=!0;try{if(a&&!await la(b,m))return te="login",ie=!0,w("Check your inbox to confirm your email, then log in. Check your spam folder too.",!1);a||await ca(b,m)}catch(g){return ie=g instanceof da,w(g instanceof Error?g.message:"Something went wrong. Try again.")}te=null,Q="",ie=!1,t()})}function ya(e,t,n,a){var r,f;const s=new Set(((r=t.consent)==null?void 0:r.scopes)??Ne.map(i=>i.id));e.innerHTML=`
    <main class="onboard card consent">
      <div class="onboard-head">
        ${Y()}
        ${a?`<button type="button" class="icon" id="cancel" aria-label="Close">${H.close}</button>`:""}
      </div>
      <h2>Connect your bank</h2>
      <p class="hint">OinkCoin needs your permission to read your bank account so your buddy can track your budget.</p>
      <form id="consent-form">
        <p class="q">OinkCoin will be able to:</p>
        <div class="options">
          ${Ne.map(i=>`
            <label class="option scope">
              <input type="checkbox" name="scope" value="${i.id}" ${i.required||s.has(i.id)?"checked":""} ${i.required?"disabled":""} />
              <span><strong>${c(i.label)}${i.required?" <em>Required</em>":""}</strong><small>${c(i.detail)}</small></span>
            </label>`).join("")}
        </div>
        <div class="never">
          <strong>OinkCoin will never:</strong>
          <ul>
            <li>Move money, make payments or transfers</li>
            <li>See or store your bank username and password</li>
            <li>Sell or share your data</li>
          </ul>
        </div>
        <p class="hint">You can change these permissions or disconnect any time in Profile &amp; Settings. Read our ${Qt}.</p>
        <label class="option agree">
          <input type="checkbox" name="agree" required ${t.consent?"checked":""} />
          <span>I agree to let OinkCoin access my bank account as described above.</span>
        </label>
        <p class="import-msg error" id="consent-error" role="alert" hidden></p>
        <div class="actions"><button type="submit">Agree &amp; continue</button></div>
      </form>
    </main>`,(f=e.querySelector("#cancel"))==null||f.addEventListener("click",()=>a==null?void 0:a());const o=e.querySelector("#consent-form");o.addEventListener("submit",async i=>{i.preventDefault();const p=new FormData(o).getAll("scope").map(String),y=Ne.filter(m=>m.required||p.includes(m.id)).map(m=>m.id),b=o.querySelector('button[type="submit"]');b.disabled=!0;try{await ta({scopes:y,agreedAt:Date.now()}),n()}catch(m){const w=o.querySelector("#consent-error");w.textContent=m instanceof Error?m.message:"Could not save your choices.",w.hidden=!1,b.disabled=!1}})}const ga=[{id:"male",label:"Male"},{id:"female",label:"Female"},{id:"nonbinary",label:"Non-binary"},{id:"pig",label:"Piggy"}],G="#3a2530",qe="#eba57c";let $a=0;function ba(e){return`<defs>
    <radialGradient id="${e}-bg" cx="30%" cy="25%" r="85%"><stop offset="0" stop-color="#fdfaf6"/><stop offset="1" stop-color="#f6e6ec"/></radialGradient>
    <radialGradient id="${e}-skin" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe6d2"/><stop offset="1" stop-color="#f3b48c"/></radialGradient>
    <radialGradient id="${e}-pig" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe4ef"/><stop offset="1" stop-color="#f792b9"/></radialGradient>
    <linearGradient id="${e}-coin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff07a"/><stop offset="1" stop-color="#f2a900"/></linearGradient>
    <clipPath id="${e}-clip"><circle cx="100" cy="100" r="96"/></clipPath>
    <filter id="${e}-gray"><feColorMatrix type="saturate" values="0.08"/></filter>
  </defs>`}function on(e,t,n,a,s){const o=t-s,r=t+s,f=n-13,i=a,p=x=>e==="happy"?`<path d="M${x-6} ${n+1} Q${x} ${n-7} ${x+6} ${n+1}" stroke="${G}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`:e==="dead"?`<path d="M${x-5} ${n-5} L${x+5} ${n+5} M${x+5} ${n-5} L${x-5} ${n+5}" stroke="${G}" stroke-width="3.2" stroke-linecap="round"/>`:`<ellipse cx="${x}" cy="${n}" rx="4.6" ry="5.8" fill="${G}"/><circle cx="${x-1.6}" cy="${n-2.2}" r="1.8" fill="#fff"/>`,b={happy:[1,-5,1],okay:[0,-1,0],sad:[3,0,-6],angry:[-5,-1,5],dead:null}[e],m=b?`<path d="M${o-8} ${f+b[0]} Q${o} ${f+b[1]} ${o+7} ${f+b[2]} M${r+8} ${f+b[0]} Q${r} ${f+b[1]} ${r-7} ${f+b[2]}" stroke="${G}" stroke-width="${e==="angry"?3.4:2.6}" fill="none" stroke-linecap="round" opacity=".85"/>`:"",w={happy:`<path d="M${t-13} ${i} Q${t} ${i+20} ${t+13} ${i} Z" fill="#8c2f45"/><ellipse cx="${t}" cy="${i+6.5}" rx="5.5" ry="2.8" fill="#ff7a9c"/>`,okay:`<path d="M${t-10} ${i+2} Q${t} ${i+10} ${t+10} ${i+2}" stroke="${G}" stroke-width="3" fill="none" stroke-linecap="round"/>`,sad:`<path d="M${t-11} ${i+10} Q${t} ${i} ${t+11} ${i+10}" stroke="${G}" stroke-width="3" fill="none" stroke-linecap="round"/>`,angry:`<rect x="${t-11}" y="${i+1}" width="22" height="10" rx="3" fill="#fff" stroke="${G}" stroke-width="2.5"/><path d="M${t-11} ${i+6} H${t+11} M${t-4} ${i+1} V${i+11} M${t+4} ${i+1} V${i+11}" stroke="${G}" stroke-width="1.5"/>`,dead:`<ellipse cx="${t+4}" cy="${i+10}" rx="4" ry="5" fill="#ff7a9c"/><path d="M${t-10} ${i+6} q5 -4 10 0 t10 0" stroke="${G}" stroke-width="3" fill="none" stroke-linecap="round"/>`},g=e==="dead"?"":e==="angry"?`<ellipse cx="${o-7}" cy="${n+13}" rx="8" ry="5" fill="#ff4d4d" opacity=".55"/><ellipse cx="${r+7}" cy="${n+13}" rx="8" ry="5" fill="#ff4d4d" opacity=".55"/>`:`<ellipse cx="${o-7}" cy="${n+13}" rx="7" ry="4.5" fill="#ff8fb3" opacity="${e==="sad"?.25:.6}"/><ellipse cx="${r+7}" cy="${n+13}" rx="7" ry="4.5" fill="#ff8fb3" opacity="${e==="sad"?.25:.6}"/>`,$=e==="sad"?`<path class="tear" d="M${r+1} ${n+8} q-5 9 0 12 q5 -3 0 -12z" fill="#7cc8f5"/>`:e==="angry"?`<path class="anger" transform="translate(${r+22} ${n-30})" d="M-7 -2 Q-2 -2 -2 -7 M2 -7 Q2 -2 7 -2 M7 2 Q2 2 2 7 M-2 7 Q-2 2 -7 2" stroke="#ef4565" stroke-width="3" fill="none" stroke-linecap="round"/>`:"";return m+p(o)+p(r)+g+w[e]+$}const wa={male:{hair:"#3b2416",shirt:"#ffc93c",back:"",front:'<path d="M58 100 C54 60 80 44 104 46 C132 48 148 66 142 100 C138 86 130 76 118 72 C104 80 82 82 68 76 C62 84 60 92 58 100Z"/><path d="M84 54 C96 48 112 50 122 56" stroke="#6b4430" stroke-width="3" fill="none" stroke-linecap="round"/>',extra:""},female:{hair:"#8a4b2a",shirt:"#ff6fa5",back:'<path d="M56 96 C50 50 80 36 100 36 C124 36 152 50 146 100 C150 130 156 150 150 172 C138 176 128 168 124 160 L76 160 C72 168 62 176 50 172 C44 150 50 130 56 96Z"/>',front:'<path d="M60 96 C58 62 82 50 104 50 C128 50 144 66 142 96 C132 76 116 66 96 70 C84 80 72 88 60 96Z"/><path d="M80 58 C92 52 108 52 120 58" stroke="#b46a42" stroke-width="3" fill="none" stroke-linecap="round"/>',extra:'<g transform="translate(130 64) rotate(-25)"><rect x="-11" y="-4" width="22" height="8" rx="4" fill="#ffd23f" stroke="#e8a900" stroke-width="1.5"/><circle cx="-5" cy="0" r="1.6" fill="#fff"/></g>'},nonbinary:{hair:"#ff8fb8",shirt:"#ffd23f",back:[[64,92,16],[68,68,18],[86,52,20],[114,52,20],[132,68,18],[136,92,16]].map(([e,t,n])=>`<circle cx="${e}" cy="${t}" r="${n}"/>`).join(""),front:'<circle cx="80" cy="64" r="14"/><circle cx="100" cy="60" r="14"/><circle cx="120" cy="64" r="14"/><path d="M86 52 C94 48 104 48 112 52" stroke="#ffc2d8" stroke-width="3" fill="none" stroke-linecap="round"/>',extra:""}};function va(e,t,n){const a=wa[t];return`
    <g clip-path="url(#${e}-clip)">
      <g fill="${a.hair}">${a.back}</g>
      <rect x="88" y="124" width="24" height="34" rx="10" fill="${qe}"/>
      <path d="M34 210 C36 160 64 148 100 148 C136 148 164 160 166 210Z" fill="${a.shirt}"/>
      <path d="M84 149 Q100 172 116 149Z" fill="${qe}"/>
    </g>
    <circle cx="61" cy="104" r="9" fill="${qe}"/><circle cx="139" cy="104" r="9" fill="${qe}"/>
    <ellipse cx="100" cy="100" rx="40" ry="44" fill="url(#${e}-skin)"/>
    <path d="M97 110 Q100 114 103 110" stroke="#d98b62" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g fill="${a.hair}">${a.front}</g>
    ${a.extra}
    ${on(n,100,102,122,16)}`}function ka(e,t,n){const a='<path d="M62 78 C54 58 60 46 82 60 C78 68 70 74 62 78Z" fill="#f78fb6" stroke="#ec7aa6" stroke-width="2" stroke-linejoin="round"/><path d="M65 70 C62 60 66 55 76 62 C73 66 69 68 65 70Z" fill="#ff6f9f" opacity=".55"/>',s=(r,f)=>`<rect x="${r}" y="${f}" width="16" height="20" rx="7" fill="#f78fb6" stroke="#ec7aa6" stroke-width="2"/><rect x="${r+2}" y="${f+13}" width="12" height="5" rx="2.5" fill="#e0709b"/>`,o=t==="happy"&&!n?`<g class="coin-drop"><circle cx="100" cy="40" r="10" fill="url(#${e}-coin)" stroke="#e09a00" stroke-width="2"/><circle cx="100" cy="40" r="5" fill="none" stroke="#e8a900" stroke-width="1.5"/></g>`:"";return`
    <ellipse cx="100" cy="175" rx="54" ry="6" fill="#3a2530" opacity=".08"/>
    <path d="M154 112 c12 -6 16 8 6 10 c-8 1 -7 -9 3 -12" stroke="#ec7aa6" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${s(62,146)}${s(122,146)}
    ${a}<g transform="translate(200 0) scale(-1 1)">${a}</g>
    <ellipse cx="100" cy="112" rx="58" ry="50" fill="url(#${e}-pig)" stroke="#ec7aa6" stroke-width="2"/>
    <ellipse cx="74" cy="84" rx="13" ry="7" fill="#fff" opacity=".35" transform="rotate(-25 74 84)"/>
    ${s(76,154)}${s(108,154)}
    <rect x="91" y="65" width="18" height="4" rx="2" fill="#d94f84" opacity=".45"/>
    ${o}
    <ellipse cx="100" cy="124" rx="15" ry="10.5" fill="#ff9cc2" stroke="#f27aa6" stroke-width="2"/>
    <ellipse cx="95" cy="124" rx="2.4" ry="3.8" fill="#c9466f"/>
    <ellipse cx="105" cy="124" rx="2.4" ry="3.8" fill="#c9466f"/>
    ${on(t,100,104,138,22)}`}function X(e,t,n={},a=!1){const s=`av${++$a}`,o=e==="pig"?ka(s,t,!!n.hat):va(s,e,t),r=t==="dead";return`<svg class="avatar avatar-${t}" viewBox="0 0 200 200" role="img" aria-label="${e} avatar feeling ${t}">
    ${ba(s)}
    ${a?"":`<circle cx="100" cy="100" r="96" fill="url(#${s}-bg)"/>`}
    <g ${r?`filter="url(#${s}-gray)"`:""}>${o}${Wn(e,n)}</g>
    ${r?'<ellipse class="halo" cx="100" cy="24" rx="30" ry="7" fill="none" stroke="#ffc93c" stroke-width="5"/>':""}
  </svg>`}const je="oinkcoin-state-v1";let ve=je;const sn=()=>({hunger:80,fun:80,love:80,updatedAt:Date.now()});function Sa(e){return ve=`${je}:${e}`,Ma(localStorage.getItem(ve)??xa())}function xa(){const e=localStorage.getItem(je);return e&&(localStorage.setItem(ve,e),localStorage.removeItem(je)),e}function Ma(e){try{if(e){const t=typeof e=="string"?JSON.parse(e):e,n=t.profile;return{profile:n?{focus:[],goal:"Just track my spending",...n}:null,expenses:Array.isArray(t.expenses)?t.expenses:[],income:Array.isArray(t.income)?t.income:[],care:t.care??sn(),coins:typeof t.coins=="number"?t.coins:0,rewards:Array.isArray(t.rewards)?t.rewards:[],alerts:Array.isArray(t.alerts)?t.alerts:[],notices:Array.isArray(t.notices)?t.notices:[],owned:Array.isArray(t.owned)?t.owned:[],equipped:t.equipped??{},house:t.house??{},bank:t.bank??null,tutorialSeen:t.tutorialSeen===!0,savedAt:typeof t.savedAt=="number"?t.savedAt:0}}}catch{}return Ye()}function Ye(){return{profile:null,expenses:[],income:[],care:sn(),coins:0,rewards:[],alerts:[],notices:[],owned:[],equipped:{},house:{},bank:null,tutorialSeen:!1,savedAt:0}}function oe(e){e.savedAt=Date.now(),localStorage.setItem(ve,JSON.stringify(e))}function _t(){localStorage.removeItem(ve)}let rn=0,rt=null;async function Ea(){var t;const{data:e}=await D.auth.getSession();return((t=e.session)==null?void 0:t.user.id)??null}function Ca(){clearTimeout(rn),rt=null}async function ln(){clearTimeout(rn);const e=rt;if(rt=null,!e)return;const t=await Ea();if(!t)return;const{error:n}=await D.from("app_state").upsert({user_id:t,data:e,updated_at:new Date().toISOString()});n&&console.warn("Could not back up to your account:",n.message)}const La=5*1024*1024,Ta=[["Groceries",/grocery|whole ?foods|trader joe|safeway|kroger|aldi|publix|wegmans|sprouts|h-e-b|\bheb\b|food lion|supermarket/i],["Food & Dining",/restaurant|cafe|coffee|starbucks|dunkin|mcdonald|chipotle|taco|pizza|burger|doordash|uber ?eats|grubhub|subway|kitchen|grill|diner|wendy|chick-fil|panera|sushi/i],["Transport",/uber|lyft|shell|chevron|exxon|mobil|\bbp\b|\bgas\b|fuel|parking|metro|transit|toll|airline|delta|united|southwest|amtrak/i],["Entertainment",/netflix|spotify|hulu|disney|hbo|cinema|theat(er|re)|\bamc\b|steam|playstation|xbox|nintendo|ticketmaster|concert|youtube|twitch|apple\.com\/bill/i],["Bills",/rent|mortgage|electric|utilit|water|internet|comcast|xfinity|verizon|at&t|t-mobile|insurance|geico|state farm|progressive|loan/i],["Health",/pharmacy|\bcvs\b|walgreens|doctor|clinic|dental|hospital|medical|\bgym\b|fitness/i],["Shopping",/amazon|amzn|target|walmart|best buy|nike|zara|h&m|shein|etsy|ebay|apple store|sephora|ulta|old navy|\bgap\b|tj ?maxx|marshalls|nordstrom|macy|costco|ikea|store|shop/i]],Aa=/payroll|direct dep|deposit|transfer|payment.*thank|online payment|zelle from|refund/i,qa=/payroll|direct dep|salary|paycheck|deposit|zelle from|venmo|cash app|interest paid|dividend/i,Oa=/transfer|refund|reversal|payment.*thank/i;function cn(e){var t;return((t=Ta.find(([,n])=>n.test(e)))==null?void 0:t[0])??"Other"}function Da(e){const t=[];let n=[],a="",s=!1;for(let o=0;o<e.length;o++){const r=e[o];s?r==='"'&&e[o+1]==='"'?(a+='"',o++):r==='"'?s=!1:a+=r:r==='"'?s=!0:r===","?(n.push(a),a=""):r===`
`||r==="\r"?(r==="\r"&&e[o+1]===`
`&&o++,n.push(a),t.push(n),n=[],a=""):a+=r}return(a||n.length)&&(n.push(a),t.push(n)),t.filter(o=>o.some(r=>r.trim()))}function Ia(e){const t=e.trim(),n=s=>String(s).padStart(2,"0");let a=t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);return a?`${a[1]}-${n(+a[2])}-${n(+a[3])}`:(a=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/),a?`${a[3].length===2?2e3+ +a[3]:+a[3]}-${n(+a[1])}-${n(+a[2])}`:null)}function Ze(e){const t=e.trim();if(!t)return null;const n=/^\(.*\)$/.test(t)||t.startsWith("-"),a=Number(t.replace(/[^0-9.]/g,""));return Number.isFinite(a)?n?-a:a:null}function Na(e){const t=Da(e),n=t.findIndex($=>$.some(x=>/date/i.test(x))&&$.some(x=>/amount|debit|withdrawal/i.test(x)));if(n<0)throw new Error("Couldn't find Date and Amount columns in this file.");const a=t[n].map($=>$.trim().toLowerCase()),s=$=>a.findIndex(x=>$.test(x)),o=s(/date/),r=s(/description|payee|merchant|name|memo|details/),f=s(/debit|withdrawal/),i=s(/credit|deposit/),p=s(/amount/),y=t.slice(n+1),b=y.map($=>p>=0?Ze($[p]??""):null),m=b.some($=>$!==null&&$<0),w=[],g=[];if(y.forEach(($,x)=>{const I=Ia($[o]??""),A=(r>=0?$[r]:"").trim();if(!I)return;const E=b[x],M=i>=0&&i!==f?Ze($[i]??""):m&&E!==null&&E>0?E:null;if(M&&M>0){qa.test(A)&&!Oa.test(A)&&g.push({id:crypto.randomUUID(),amount:Math.round(M*100)/100,note:A.slice(0,60),date:I});return}if(Aa.test(A))return;let C=null;if(f>=0){const L=Ze($[f]??"");C=L?Math.abs(L):null}else E!==null&&(C=m?E<0?-E:null:E);!C||C<=0||w.push({id:crypto.randomUUID(),amount:Math.round(C*100)/100,category:cn(A),note:A.slice(0,60),date:I})}),w.length===0&&g.length===0)throw new Error("No transactions found in this file.");return{expenses:w,income:g}}function vt(e,t){const n=s=>`${s.date}|${s.amount}|${s.note}`,a=new Set(e.map(n));return[...e,...t.filter(s=>!a.has(n(s)))]}function We(e,t){const n=s=>`${s.date}|${s.amount}|${s.note}`,a=new Set(e.map(n));return[...e,...t.filter(s=>!a.has(n(s)))]}function dn(e){return e.size>La?Promise.reject(new Error("File is too large (max 5 MB).")):e.text().then(Na)}const Pa=!1;async function ze(e,t={}){throw new Error("Bank connection is not set up yet.")}let Je=null;function un(){return Je??(Je=new Promise((e,t)=>{const n=document.createElement("script");n.src="https://cdn.plaid.com/link/v2/stable/link-initialize.js",n.onload=()=>e(),n.onerror=()=>{Je=null,t(new Error("Could not load the bank connection screen."))},document.head.append(n)})),Je}const it="oinkcoin-plaid-link-token",Ra=()=>location.origin+location.pathname;function lt(e){try{e?sessionStorage.setItem(it,e):sessionStorage.removeItem(it)}catch{}}async function Fa(){const[{link_token:e}]=await Promise.all([ze("link_token",{}),un()]);return lt(e),fn(e)}async function Ha(){const e=location.href;history.replaceState(null,"",Ra());let t=null;try{t=sessionStorage.getItem(it)}catch{}if(!t)throw new Error("The bank connection timed out. Try connecting again.");return await un(),fn(t,e)}function fn(e,t){return new Promise((n,a)=>{const s=window.Plaid.create({token:e,receivedRedirectUri:t,onSuccess:o=>{s.destroy(),lt(null),ze("exchange",{}).then(()=>n(!0),a)},onExit:o=>{s.destroy(),lt(null),o?a(new Error(o.display_message||o.error_message||"Could not connect to your bank.")):n(!1)}});s.open()})}const Ba=new Set(["INCOME","TRANSFER_IN","TRANSFER_OUT"]),_a=new Set(["LOAN_PAYMENTS_CREDIT_CARD_PAYMENT"]),Ua={FOOD_AND_DRINK:"Food & Dining",GENERAL_MERCHANDISE:"Shopping",HOME_IMPROVEMENT:"Shopping",ENTERTAINMENT:"Entertainment",TRANSPORTATION:"Transport",TRAVEL:"Transport",RENT_AND_UTILITIES:"Bills",LOAN_PAYMENTS:"Bills",MEDICAL:"Health",PERSONAL_CARE:"Health"};function ja(e){if(e.pending||e.amount<=0||e.primary&&Ba.has(e.primary)||e.detailed&&_a.has(e.detailed))return null;const t=e.detailed==="FOOD_AND_DRINK_GROCERIES"?"Groceries":(e.primary?Ua[e.primary]:void 0)??cn(e.name);return{id:`plaid:${e.id}`,amount:Math.round(e.amount*100)/100,category:t,note:e.name.slice(0,60),date:e.date}}function Ya(e){return e.pending||e.amount>=0||e.primary!=="INCOME"?null:{id:`plaid:${e.id}`,amount:Math.round(-e.amount*100)/100,note:e.name.slice(0,60),date:e.date}}async function Ga(){const e=await ze();return{linked:e.linked,ready:e.ready,accounts:e.accounts,expenses:e.transactions.map(ja).filter(t=>t!==null),income:e.transactions.map(Ya).filter(t=>t!==null)}}const Wa=()=>ze(),de=["happy","okay","sad","angry","dead"],P=["Shopping","Food & Dining","Entertainment","Transport","Bills","Groceries","Health","Other"],pn=["Save more money","Stop impulse buying","Pay off debt","Just track my spending"],ye={Shopping:.1,"Food & Dining":.1,Entertainment:.05,Transport:.1,Bills:.35,Groceries:.15,Health:.05,Other:.1},kt=["Shopping","Food & Dining","Entertainment"],za=["Bills","Groceries","Transport","Health"],K=e=>kt.includes(e),Ka={Shopping:"Try a 48-hour rule: wait two days before buying anything non-essential.","Food & Dining":"Cook at home a few more nights a week and pack lunch.",Entertainment:"Look for free events and pause subscriptions you rarely use.",Transport:"Combine errands, carpool, or try public transit a few days.",Bills:"Call providers to negotiate rates or switch to a cheaper plan.",Groceries:"Plan meals, shop with a list, and buy store brands.",Health:"Check if generic medicine or in-network options can lower costs.",Other:"Review these purchases - can any be moved into a planned category?"},ct=[{mood:"happy",from:0},{mood:"okay",from:.5},{mood:"sad",from:.8},{mood:"angry",from:1.1},{mood:"dead",from:1.5}];function Qa(e,t=[]){const n={};for(const a of P){const s=ye[a]*(t.includes(a)?.8:1);n[a]=Math.round(e*s*100)/100}return n}function U(e=new Date){const t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${t}-${n}`}function k(e){return e.toLocaleString(void 0,{style:"currency",currency:"USD"})}function ke(e,t,n=new Date){const a=U(n).slice(0,7),s=t.filter(v=>v.date.startsWith(a)),o=P.map(v=>{const T=s.filter(re=>re.category===v).reduce((re,Ae)=>re+Ae.amount,0),se=e.limits[v]??0,Te=se>0?T/se:T>0?1/0:0;return{category:v,spent:T,limit:se,ratio:Te}}).sort((v,T)=>T.spent-v.spent),r=o.reduce((v,T)=>v+T.spent,0),f=o.filter(v=>K(v.category)),i=f.reduce((v,T)=>v+T.spent,0),p=f.reduce((v,T)=>v+T.limit,0),y=p>0?i/p:i>0?1/0:0,b=o.filter(v=>!K(v.category)),m=r-i,w=b.reduce((v,T)=>v+T.limit,0),g=f.find(v=>v.spent>0)??null,$=b.find(v=>v.spent>0)??null,x=f.find(v=>e.focus.includes(v.category)&&v.ratio>1)??null;let I=ct.filter(v=>y>=v.from).length-1,A="wants";const E=de.indexOf("angry"),M=de.indexOf("sad");x&&I<E&&(I++,A="focus"),w>0&&m>w&&I<M&&(I=M,A="needs");const C=de[I],L=x??g??o.find(v=>v.spent>0)??null;return{monthKey:a,spent:r,remaining:e.budget-r,usage:e.budget>0?r/e.budget:0,categories:o,top:o[0].spent>0?o[0]:null,topWant:g,wantsSpent:i,wantsLimit:p,needsSpent:m,needsLimit:w,topNeed:$,reason:A,mood:C,message:r===0?`${fe(e)} is ready! Add your first expense.`:Va(fe(e),C,A,g,x,$),tip:L?Ka[L.category]:null}}const fe=e=>e.name.charAt(0).toUpperCase()+e.name.slice(1);function Va(e,t,n,a,s,o){const r=(a==null?void 0:a.category)??"extras";if(n==="needs")return`${e} is a little sad. ${(o==null?void 0:o.category)??"Bills"} cost more than planned.`;if(n==="focus"&&s)return`${e} is ${t==="angry"?"angry":"sad"}. ${s.category} is over your cut-back limit.`;switch(t){case"happy":return`${e} is happy! You're doing great.`;case"okay":return`${e} is okay. Go easy on ${r}.`;case"sad":return`${e} is sad. Slow down on ${r}.`;case"angry":return`${e} is angry. You're over budget on ${r}.`;case"dead":return`${e} fainted from too much ${r}. Spend less to wake ${e} up.`}}function Za(e,t,n){var o,r;const a=fe(e),s=((o=t.topWant)==null?void 0:o.category)??"extras";if(t.reason==="needs")return`${a} was a little sad in ${n}. ${((r=t.topNeed)==null?void 0:r.category)??"Bills"} cost more than planned.`;if(t.reason==="focus")return`${a} was sad in ${n}. A cut-back category went over.`;switch(t.mood){case"happy":return`${a} had a happy ${n}!`;case"okay":return`${a} did okay in ${n}.`;case"sad":return`${a} was sad in ${n}. Too much ${s}.`;case"angry":return`${a} was angry in ${n}. Over budget on ${s}.`;case"dead":return`${a} fainted in ${n} from too much ${s}.`}}function Ja(e,t=new Date){const n=U(t).slice(0,7),a=[...new Set(e.map(i=>i.date.slice(0,7)))].filter(i=>i<=n).sort(),s=a.filter(i=>i<n),o=(s.length?s:a).slice(-3);if(o.length===0)return null;const r=Object.fromEntries(P.map(i=>[i,0]));for(const i of e)o.includes(i.date.slice(0,7))&&(r[i.category]+=i.amount);for(const i of P)r[i]=Math.round(r[i]/o.length*100)/100;const f=P.reduce((i,p)=>i+r[p],0);return f>0?{months:o.length,partial:s.length===0,total:f,byCategory:r}:null}const Pe=e=>Math.max(50,Math.round(e/50)*50);function hn(e,t,n){if(!n)return Qa(e,t);const a=n.byCategory,s=P.filter(g=>!K(g)),o=P.filter(K),r=g=>Math.round(g*100)/100,f={},i=Object.fromEntries(s.map(g=>[g,a[g]>0?a[g]:ye[g]*e*.1])),p=s.reduce((g,$)=>g+i[$],0),y=Math.min(1,e*.85/p);for(const g of s)f[g]=r(i[g]*y);const b=e-s.reduce((g,$)=>g+f[$],0),m=o.reduce((g,$)=>g+a[$],0),w=o.reduce((g,$)=>g+ye[$],0);for(const g of o){const $=m>0?.7*(a[g]/m)+.3*(ye[g]/w):ye[g]/w;f[g]=r(b*$*(t.includes(g)?.8:1))}return f}const Xe={hunger:5,fun:4,love:3},ae=e=>Math.round(Math.min(100,Math.max(0,e)));function St(e,t=Date.now()){const n=Math.max(0,(t-e.updatedAt)/36e5);return{hunger:ae(e.hunger-Xe.hunger*n),fun:ae(e.fun-Xe.fun*n),love:ae(e.love-Xe.love*n),updatedAt:t}}function Xa(e,t){const n=St(e);return t==="feed"&&(n.hunger=ae(n.hunger+25)),t==="play"&&(n.fun=ae(n.fun+25),n.hunger=ae(n.hunger-5)),t==="pet"&&(n.love=ae(n.love+20)),n}function eo(e,t){const n=de.indexOf(e);return Math.min(t.hunger,t.fun,t.love)>=25||n>=de.indexOf("angry")?e:de[n+1]}function to(e,t){return t.hunger<25?`${e} is hungry. Tap Feed.`:t.fun<25?`${e} is bored. Try Play.`:t.love<25?`${e} could use some attention. Tap Pet.`:null}const no=[{slot:"wall",title:"Wallpaper"},{slot:"floor",title:"Floors"},{slot:"art",title:"Wall art"},{slot:"bed",title:"Beds & seats"},{slot:"plant",title:"Plants"},{slot:"lamp",title:"Lights"}],Re='x="0" y="0" width="320" height="150"',Fe='x="0" y="150" width="320" height="70"',mn=[{id:"wall-stripes",name:"Pink stripes",slot:"wall",price:15,art:e=>`<defs><pattern id="${e}-st" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="#fde7f0"/><rect width="10" height="24" fill="#fbd3e3"/></pattern></defs>
      <rect ${Re} fill="url(#${e}-st)"/>`},{id:"wall-dots",name:"Gold dots",slot:"wall",price:15,art:e=>`<defs><pattern id="${e}-dt" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="#fff8e6"/><circle cx="11" cy="11" r="3" fill="#f2c45a"/></pattern></defs>
      <rect ${Re} fill="url(#${e}-dt)"/>`},{id:"wall-stars",name:"Starry night",slot:"wall",price:25,art:e=>`<defs><pattern id="${e}-sk" width="60" height="50" patternUnits="userSpaceOnUse">
        <rect width="60" height="50" fill="#2b2f5c"/>
        <path d="M12 10l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#ffe27a"/>
        <circle cx="42" cy="32" r="1.6" fill="#fff"/><circle cx="30" cy="8" r="1.2" fill="#fff"/></pattern></defs>
      <rect ${Re} fill="url(#${e}-sk)"/>`},{id:"floor-wood",name:"Wood floor",slot:"floor",price:12,art:e=>`<defs><pattern id="${e}-wd" width="80" height="18" patternUnits="userSpaceOnUse">
        <rect width="80" height="18" fill="#c98f5e"/><path d="M0 17.5H80M40 0V18" stroke="#a8724a" stroke-width="1.5"/></pattern></defs>
      <rect ${Fe} fill="url(#${e}-wd)"/>`},{id:"floor-check",name:"Checkered tiles",slot:"floor",price:18,art:e=>`<defs><pattern id="${e}-ck" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="#fff"/><rect width="14" height="14" fill="#1d1a1c"/><rect x="14" y="14" width="14" height="14" fill="#1d1a1c"/></pattern></defs>
      <rect ${Fe} fill="url(#${e}-ck)"/>`},{id:"floor-rug",name:"Cloud rug",slot:"floor",price:20,art:()=>`<rect ${Fe} fill="#e9d3b8"/>
      <path d="M70 196c-18 0-22-22 0-24 4-12 30-14 38-4 10-10 40-8 46 4 14-6 40-2 40 10 22 2 20 24 0 24z" fill="#cfe6ff" stroke="#9cc6f2" stroke-width="2"/>`},{id:"art-coin",name:"Coin poster",slot:"art",price:10,art:()=>`<g transform="translate(30 30)"><rect width="56" height="70" rx="4" fill="#fff" stroke="#b97f00" stroke-width="3"/>
      <circle cx="28" cy="32" r="16" fill="#ffc93c" stroke="#d98a00" stroke-width="2.5"/><text x="28" y="38" text-anchor="middle" font-size="16" font-weight="700" fill="#a56f00" font-family="sans-serif">$</text>
      <rect x="12" y="56" width="32" height="5" rx="2.5" fill="#f2b230"/></g>`},{id:"art-window",name:"Sunny window",slot:"art",price:16,art:()=>`<g transform="translate(26 26)"><rect width="74" height="64" rx="4" fill="#bfe3ff" stroke="#fff" stroke-width="5"/>
      <circle cx="56" cy="18" r="9" fill="#ffd34d"/><path d="M8 50c6-8 16-8 22 0 6-6 14-6 18 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M37 0V64M0 32H74" stroke="#fff" stroke-width="4"/></g>`},{id:"bed-cozy",name:"Cozy bed",slot:"bed",price:30,art:()=>`<g transform="translate(222 118)"><rect x="0" y="22" width="88" height="34" rx="6" fill="#e5487f"/>
      <rect x="0" y="0" width="12" height="62" rx="4" fill="#a8724a"/><rect x="8" y="14" width="26" height="14" rx="6" fill="#fff"/>
      <rect x="30" y="18" width="58" height="18" rx="6" fill="#ff9cc2"/><rect x="80" y="30" width="10" height="32" rx="4" fill="#a8724a"/></g>`},{id:"bed-beanbag",name:"Bean bag",slot:"bed",price:18,art:()=>`<g transform="translate(238 138)"><path d="M0 40c-4-26 18-44 38-40 20 4 36 18 34 40z" fill="#8b5cf6"/>
      <path d="M14 22c8-8 22-10 32-4" stroke="#b69cff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`},{id:"plant-cactus",name:"Cactus",slot:"plant",price:8,art:()=>`<g transform="translate(22 130)"><rect x="0" y="30" width="30" height="24" rx="4" fill="#d9774a"/>
      <rect x="9" y="0" width="12" height="34" rx="6" fill="#3ccf91"/><rect x="0" y="10" width="9" height="14" rx="4.5" fill="#3ccf91"/>
      <rect x="21" y="6" width="9" height="14" rx="4.5" fill="#3ccf91"/></g>`},{id:"plant-monstera",name:"Big leafy plant",slot:"plant",price:14,art:()=>`<g transform="translate(14 104)"><rect x="12" y="56" width="34" height="28" rx="4" fill="#fff" stroke="#ece7e9" stroke-width="2"/>
      <ellipse cx="18" cy="30" rx="16" ry="12" fill="#1f9d63" transform="rotate(-30 18 30)"/>
      <ellipse cx="42" cy="26" rx="16" ry="12" fill="#2bb673" transform="rotate(25 42 26)"/>
      <ellipse cx="30" cy="10" rx="12" ry="10" fill="#1f9d63"/><path d="M29 56V16" stroke="#1f7a4d" stroke-width="3"/></g>`},{id:"lamp-lava",name:"Lava lamp",slot:"lamp",price:12,art:()=>`<g transform="translate(196 132)"><path d="M6 46h20l-4-40h-12z" fill="#ff8fb3" opacity=".85"/>
      <circle cx="16" cy="20" r="4" fill="#ffc93c"/><circle cx="13" cy="34" r="3" fill="#ffc93c"/>
      <rect x="4" y="44" width="24" height="8" rx="2" fill="#3e4f86"/><rect x="8" y="0" width="16" height="8" rx="2" fill="#3e4f86"/></g>`},{id:"lamp-fairy",name:"Fairy lights",slot:"lamp",price:20,art:()=>'<path d="M0 12Q80 40 160 14T320 14" stroke="#5b4b52" stroke-width="1.5" fill="none"/>'+[20,52,84,116,148,180,212,244,276,304].map((e,t)=>`<circle cx="${e}" cy="${t%2?24:28}" r="4.5" fill="${["#ffd34d","#ff8fb3","#8fd3ff","#b69cff"][t%4]}"/>`).join("")}],dt=new Map(mn.map(e=>[e.id,e]));let ao=0;const oo=["wall","floor","art","lamp","plant","bed"];function yn(e,t,n="House"){const a=`house${++ao}`,s=r=>{const f=e[r]?dt.get(e[r]):void 0;return f?f.art(`${a}-${r}`):""},o=(t==null?void 0:t.mood)==="dead";return`<svg class="house${o?" house-fainted":""}" viewBox="0 0 320 220" role="img" aria-label="${n}">
    <rect ${Re} fill="#fdf1e7"/>
    <rect ${Fe} fill="#e9d3b8"/>
    ${oo.map(s).join("")}
    <rect x="0" y="146" width="320" height="6" fill="#fff" opacity=".7"/>
    ${t?`<ellipse cx="160" cy="200" rx="40" ry="7" fill="#000" opacity=".12"/>${X(t.character,t.mood,t.equipped,!0).replace(/^<svg/,'<svg x="100" y="84" width="120" height="120"')}`:""}
    ${o?'<rect x="0" y="0" width="320" height="220" fill="#1d1a1c" opacity=".18"/>':""}
  </svg>`}function so(e){return yn({[e.slot]:e.id},null,e.name)}function ro(e,t,n){return`
    <section class="card house-card mood-${n}">
      <h2>${c(t.name)}'s house</h2>
      ${yn(e.house,{character:t.character,mood:n,equipped:e.equipped},`${t.name}'s house`)}
      <p class="hint">Friends see your buddy's house and mood, never your money.</p>
      <button class="secondary" data-view="store">Decorate in the Store</button>
    </section>`}const io=[{title:"Saving methods",intro:"Simple systems that make saving automatic.",lessons:[{title:"50/30/20 rule",body:"Split your take-home pay: 50% needs, 30% wants, 20% savings and debt. OinkCoin already tracks needs vs. wants for you."},{title:"Pay yourself first",body:"Set up an automatic transfer to savings on payday, before you can spend it. Even $25 a paycheck adds up."},{title:"Envelope (cash stuffing) method",body:"Give each want category a fixed amount in a cash or digital envelope. When it's empty, you're done for the month."},{title:"No-spend challenge",body:"Pick a week or weekend where you only pay for needs. Great for resetting shopping and dining habits."},{title:"52-week challenge",body:"Save $1 in week 1, $2 in week 2, and so on. By week 52 you'll have $1,378."},{title:"Round-ups",body:"Round every purchase up to the next dollar and move the difference to savings. Many banks can do this automatically."}]},{title:"Paying off debt",intro:"Two proven ways to get out of debt faster.",lessons:[{title:"Avalanche method",body:"Pay the minimum on everything, then put every extra dollar toward the highest-interest debt. Saves the most money overall."},{title:"Snowball method",body:"Pay the minimum on everything, then attack the smallest balance first. Quick wins keep you motivated."}]},{title:"How to start investing",intro:"Follow these steps in order.",lessons:[{title:"1. Build an emergency fund",body:"Before investing, save 3-6 months of essential expenses in a high-yield savings account."},{title:"2. Pay off high-interest debt",body:"Credit cards often charge 20%+ interest. Paying them off is a guaranteed return no investment can match."},{title:"3. Get your employer match",body:"If your job offers a 401(k) match, contribute at least enough to get it. It's free money."},{title:"4. Open a Roth IRA",body:"Your money grows tax-free and can be withdrawn tax-free in retirement. Many brokers let you start with $0."},{title:"5. Pick low-cost index funds",body:"Index funds and ETFs spread your money across hundreds of companies with low fees. Diversifying lowers your risk."},{title:"6. Invest regularly",body:"Invest the same amount every month no matter what the market does (dollar-cost averaging). Time in the market beats timing the market."}]}],gn={"Save more money":"Pay yourself first","Stop impulse buying":"No-spend challenge","Pay off debt":"Avalanche method","Just track my spending":"50/30/20 rule"};function lo(e,t){const n=gn[e.goal],a=t.wantsSpent*.2;return`
    <section class="card learn-hero">
      <h2>Grow your money</h2>
      <p>Your goal is <strong>${c(e.goal.toLowerCase())}</strong>. A good place to start: <strong>${c(n)}</strong>.</p>
      ${a>0?`<p class="projection">Cutting your wants by 20% (${k(a)}/month) would save <strong>${k(a*12)}</strong> in a year.</p>`:""}
    </section>
    ${io.map(s=>`
      <section class="card">
        <h2>${c(s.title)}</h2>
        <p class="hint">${c(s.intro)}</p>
        ${s.lessons.map(o=>`
          <details class="lesson"${o.title===n?" open":""}>
            <summary>${c(o.title)}${o.title===n?'<span class="tag want">For you</span>':""}</summary>
            <p>${c(o.body)}</p>
          </details>`).join("")}
      </section>`).join("")}
    <p class="disclaimer">For education only, not financial advice.</p>`}const Se=3,He=e=>{const[t,n,a]=e.split("-").map(Number);return new Date(t,n-1,a)};function ut(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate()-(e.getDay()+6)%7)}const co=e=>e.toLocaleDateString(void 0,{month:"short",day:"numeric"});function $n(e){return kt.reduce((t,n)=>t+(e.limits[n]??0),0)}function xt(e){return Math.round($n(e)*7/30.44*100)/100}function bn(e,t=new Date){const n=U(ut(t)),a=U(new Date(He(n).getTime()+6*864e5));return{spent:e.expenses.filter(o=>K(o.category)&&o.date>=n&&o.date<=a).reduce((o,r)=>o+r.amount,0),limit:e.profile?xt(e.profile):0}}function uo(e,t=new Date){const n=e.profile;if(!n)return[];const a=U(t),s=U(ut(t)),o=a.slice(0,7),r=xt(n),f=$n(n),i=new Map,p=new Map;for(const m of e.expenses){const w=U(ut(He(m.date))),g=K(m.category)?m.amount:0;i.set(w,(i.get(w)??0)+g);const $=p.get(m.date.slice(0,7))??{total:0,wants:0};$.total+=m.amount,$.wants+=g,p.set(m.date.slice(0,7),$)}const y=[];for(const[m,w]of i)m<s&&w<=r&&y.push({key:`week:${m}`,label:`Week of ${co(He(m))}`});for(const[m,w]of p)m<o&&w.total<=n.budget&&w.wants<=f&&y.push({key:`month:${m}`,label:He(`${m}-01`).toLocaleDateString(void 0,{month:"long",year:"numeric"})});const b=new Set(e.rewards);return y.filter(m=>!b.has(m.key)).sort((m,w)=>m.key.localeCompare(w.key))}const fo={happy:"Happy",okay:"Okay",sad:"Sad",angry:"Angry",dead:"Fainted"};function po(e){const t=e.limit>0?e.spent/e.limit:e.spent>0?1/0:0,n=t>1?"over":t>=.8?"warn":"ok",a=s=>k(Math.round(s)).replace(/\.00$/,"");return`
    <details class="goal-row ${n}">
      <summary>
        <div class="goal-head">
          <strong>${c(e.title)}</strong>
          <span class="${t>1?"neg":""}">${a(e.spent)} / ${a(e.limit)}</span>
        </div>
        <div class="bar"><div class="fill ${n}" style="width:${Math.min(100,Math.round(t*100))}%"></div></div>
      </summary>
      <small>${e.note}</small>
    </details>`}const Oe=e=>`${Math.round(e*100)}%`;function ho(e,t,n,a=!1){const s=c(t.name),o=bn(e),r=[{title:"Wants",spent:n.wantsSpent,limit:n.wantsLimit,note:`${c(kt.join(", "))}. This sets ${s}'s mood.`},...n.categories.filter(p=>t.focus.includes(p.category)).map(p=>({title:`Cut back: ${p.category}`,spent:p.spent,limit:p.limit,note:`20% less than usual, because you picked it in your goals. Going over makes ${s} one step sadder.`})),{title:"Needs",spent:n.needsSpent,limit:n.needsLimit,note:`${c([...za,"Other"].join(", "))}. Going over makes ${s} sad, never worse.`},{title:"This week",spent:o.spent,limit:o.limit,note:`Wants this week. Stay under to earn <b>+${Se} coins</b> when the week ends.`},{title:"Whole month",spent:n.spent,limit:t.budget,note:`Finish under your budget with wants on budget to earn <b>+${Se} coins</b>.`}],f=r.filter(p=>p.spent<=p.limit).length,i=ct.map((p,y)=>{const b=ct[y+1],m=b?p.from===0?`under ${Oe(b.from)}`:`${Oe(p.from)} to ${Oe(b.from)}`:`over ${Oe(p.from)}`;return`<li><span class="mood-chip mood-${p.mood}"><span class="mood-badge">${fo[p.mood]}</span></span> wants ${m} of budget</li>`}).join("");return`
    <details class="card goals fold" id="goals-card" ${a?"open":""}>
      <summary class="fold-head">
        <h2>This month's goals</h2>
        <span class="fold-count ${f===r.length?"pos":f===0?"neg":""}">${f} of ${r.length} on track</span>
      </summary>
      ${r.map(po).join("")}

      <details class="mood-rules">
        <summary>How ${s}'s mood works</summary>
        <ul class="mood-steps">${i}</ul>
        <ul>
          <li>Only <b>wants</b> can make ${s} faint.</li>
          <li>Going over a category you chose to cut back on makes ${s} one step sadder (angry at most).</li>
          <li>Needs over plan make ${s} sad at most. Bills happen.</li>
          <li>If Hunger, Fun or Love drops under 25%, ${s} feels a bit worse. Feed, play and pet to fix it.</li>
          <li>A fresh ${s} starts every month. Past months are in Pet History.</li>
        </ul>
      </details>

      <p class="goal-main">Your main goal: <b>${c(t.goal)}</b>. Try <button class="link" data-view="learn">${c(gn[t.goal])}</button> in Grow Your Money.</p>
    </details>`}const Ut=["Buddy","Spending","Budget","Goals"],et=1,tt=2,Mt=P.filter(e=>e!=="Bills");let De=null;function mo(e){const t=e.profile;return{step:0,character:(t==null?void 0:t.character)??"pig",name:(t==null?void 0:t.name)??"",budget:(t==null?void 0:t.budget)??2e3,budgetChosen:!!t,imported:[],importedIncome:[],importMsg:"",importError:!1,focus:(t==null?void 0:t.focus)??[],goal:(t==null?void 0:t.goal)??"Save more money"}}function yo(e,t,n){const a=t.bank,s=a||e.imported.length>0;return`
        <h2>How should ${c(e.name||"your buddy")} see your spending?</h2>
        <p class="hint">Pick one. You can always add more later.</p>
        ${a?`<p class="import-msg" role="status">Bank connected: ${c(a.accounts.map(o=>o.name+(o.mask?` ··${o.mask}`:"")).join(", ")||"your accounts")}.</p>`:""}
        <div class="sources">
          ${n&&!a?`<button type="button" class="source" id="link-bank" ${n.busy?"disabled":""}>
                  <strong>${n.busy?"Connecting...":"Link your bank"}</strong>
                  <small>Imports transactions automatically and keeps them up to date. Read-only: OinkCoin can never move money.</small>
                </button>`:""}
          <label class="source">
            <input type="file" id="statement" accept=".csv,text/csv" />
            <strong>${e.imported.length?"Upload another statement":"Upload a bank statement"}</strong>
            <small>A CSV file from your bank (for example Bank of America: Activity &gt; Download &gt; Microsoft Excel). Stays private.</small>
          </label>
          ${s?"":`<button type="button" class="source" id="use-cash">
                  <strong>Skip, I use cash</strong>
                  <small>Add expenses by hand as you spend.</small>
                </button>`}
        </div>
        ${n!=null&&n.message?`<p class="import-msg" role="status">${c(n.message)}</p>`:""}
        ${e.importMsg?`<p class="import-msg${e.importError?" error":""}" role="status">${c(e.importMsg)}</p>`:""}`}const nt=(e,t)=>Ja(We(t.expenses,e.imported));function wn(e,t,n){const a=hn(e,t,n);return P.map(s=>({c:s,v:a[s]})).sort((s,o)=>o.v-s.v).map(({c:s,v:o})=>`<li><span>${c(s)} <small>${K(s)?"want":"need"}${t.includes(s)?", cutting back":""}</small></span><b>${k(o)}</b></li>`).join("")}function go(e,t){const n=`<div class="money-input"><span>$</span><input name="budget" type="number" min="1" step="1" required value="${e.budget}" aria-label="Monthly budget" /></div>`,a=`
    <p class="q">Your category limits</p>
    <p class="hint">${t?"Shaped by where your money actually goes.":"A typical split."} They update as you change the budget.</p>
    <ul class="limit-preview" id="limit-preview">${wn(e.budget,e.focus,t)}</ul>`;if(!t)return`
      <h2>What's your monthly budget?</h2>
      <p class="hint">How much can you spend each month after savings?</p>
      ${n}
      <div class="chips">
        ${[1e3,2e3,3e3,5e3].map(i=>`<button type="button" class="chip" data-budget="${i}" aria-pressed="false">$${i.toLocaleString()}</button>`).join("")}
      </div>
      ${a}`;const s=P.filter(K).reduce((i,p)=>i+t.byCategory[p],0),o=P.filter(i=>t.byCategory[i]>0).sort((i,p)=>t.byCategory[p]-t.byCategory[i]).slice(0,3),r=t.partial?"So far this month":`Over the last ${t.months===1?"month":`${t.months} months`}`,f=[{label:"Match my spending",value:Pe(t.total)},{label:"Save 10%",value:Pe(t.total*.9),suggested:!0},{label:"Save 20%",value:Pe(t.total*.8)}];return`
    <h2>What's your monthly budget?</h2>
    <div class="spend-summary">
      <p>${r}, you spent about <b>${k(t.total)}</b>${t.partial?"":" a month"}.</p>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${k(t.total-s)}</b></div>
        <div class="want"><small>Wants</small><b>${k(s)}</b></div>
      </div>
      <p class="hint">Biggest: ${o.map(i=>`${c(i)} ${k(t.byCategory[i])}`).join(" &middot; ")}</p>
    </div>
    <p class="hint">We suggest a budget about 10% under what you spend now. Pick one or type your own.</p>
    ${n}
    <div class="chips">
      ${f.map(i=>`<button type="button" class="chip" data-budget="${i.value}" aria-pressed="false">${i.label} &middot; ${k(i.value).replace(".00","")}${i.suggested?' <small class="tag">suggested</small>':""}</button>`).join("")}
    </div>
    ${a}`}function $o(e){switch(e.step){case 0:return`
        <h2>Choose your buddy</h2>
        <div class="avatar-pick">
          ${ga.map(t=>`
            <label class="pick">
              <input type="radio" name="character" value="${t.id}" aria-label="${t.label}" ${t.id===e.character?"checked":""} />
              ${X(t.id,"happy")}
            </label>`).join("")}
        </div>
        <label class="field">Give your buddy a name
          <input name="name" required maxlength="20" value="${c(e.name)}" placeholder="e.g. Penny" />
        </label>`;default:return`
        <h2>Set your goals</h2>
        <p class="hint">Two quick questions. You can change them later in Profile &amp; Settings.</p>
        <p class="q">1. What do you want to spend less on?</p>
        <p class="hint">Each one gets a limit 20% smaller than usual. Going over it makes your buddy one step sadder.</p>
        <div class="chips">
          ${Mt.map(t=>`<label class="chip"><input type="checkbox" name="focus" value="${c(t)}" ${e.focus.includes(t)?"checked":""} />${c(t)}</label>`).join("")}
        </div>
        <p class="q">2. What's your main goal?</p>
        <p class="hint">We'll suggest a matching tip in Grow Your Money.</p>
        <div class="options">
          ${pn.map(t=>`<label class="option"><input type="radio" name="goal" value="${c(t)}" ${t===e.goal?"checked":""} />${c(t)}</label>`).join("")}
        </div>`}}function jt(e){const t=new Map;for(const a of e)Mt.includes(a.category)&&t.set(a.category,(t.get(a.category)??0)+a.amount);const[n]=[...t].sort((a,s)=>s[1]-a[1]);return n?{category:n[0],total:n[1]}:null}function vn(e,t,n,a,s=null){var g,$,x,I,A;De??(De=mo(t));const o=De,r=()=>vn(e,t,n,a,s),f=!!t.bank||o.imported.length>0,i=o.step>=tt?nt(o,t):null,p=o.step===et?yo(o,t,s):o.step===tt?go(o,i):$o(o);e.innerHTML=`
    <main class="onboard card">
      <div class="onboard-head">
        ${Y()}
        ${a?`<button type="button" class="icon" id="cancel" aria-label="Close">${H.close}</button>`:""}
      </div>
      <ol class="steps">
        ${Ut.map((E,M)=>`<li class="${M<o.step?"done":""}${M===o.step?" current":""}"><span>${M+1}</span>${E}</li>`).join("")}
      </ol>
      <form id="step-form">
        ${p}
        <div class="actions">
          ${o.step>0?'<button type="button" class="secondary" id="back">Back</button>':""}
          ${o.step===et&&!f?"":`<button type="submit">${o.step===Ut.length-1?"Let's go!":"Next"}</button>`}
        </div>
      </form>
    </main>`;const y=e.querySelector("#step-form");(g=e.querySelector("#cancel"))==null||g.addEventListener("click",()=>{De=null,a==null||a()}),($=e.querySelector("#link-bank"))==null||$.addEventListener("click",()=>s==null?void 0:s.link()),(x=e.querySelector("#use-cash"))==null||x.addEventListener("click",()=>y.requestSubmit()),(I=e.querySelector("#back"))==null||I.addEventListener("click",()=>{o.step--,r()});const b=y.querySelector('input[name="budget"]'),m=e.querySelectorAll("[data-budget]"),w=()=>{if(!b)return;const E=Number(b.value);m.forEach(C=>{const L=Number(C.dataset.budget)===E;C.classList.toggle("selected",L),C.setAttribute("aria-pressed",String(L))});const M=e.querySelector("#limit-preview");M&&(M.innerHTML=wn(Math.max(1,E||1),o.focus,i))};b==null||b.addEventListener("input",w),w(),m.forEach(E=>E.addEventListener("click",()=>{b.value=E.dataset.budget,w()})),(A=e.querySelector("#statement"))==null||A.addEventListener("change",async E=>{var C;const M=(C=E.target.files)==null?void 0:C[0];if(M){try{const L=await dn(M);o.imported=L.expenses,o.importedIncome=L.income;const v=jt(o.imported),T=o.importedIncome.length?` and ${o.importedIncome.length} deposit${o.importedIncome.length===1?"":"s"}`:"";o.importMsg=`Imported ${o.imported.length} purchases${T}.${v?` Outside of bills, you spend the most on ${v.category} (${k(v.total)}).`:""}`,o.importError=!1}catch(L){o.imported=[],o.importedIncome=[],o.importMsg=L instanceof Error?L.message:"Could not read that file.",o.importError=!0}r()}}),y.addEventListener("submit",E=>{E.preventDefault();const M=new FormData(y);if(o.step===0)o.character=M.get("character"),o.name=String(M.get("name")).trim()||"Buddy";else if(o.step===et){const C=jt([...o.imported,...t.expenses]);C&&o.focus.length===0&&(o.focus=[C.category]);const L=nt(o,t);L&&!o.budgetChosen&&(o.budget=Pe(L.total*.9))}else if(o.step===tt)o.budget=Math.max(1,Number(M.get("budget"))||1),o.budgetChosen=!0;else{o.focus=M.getAll("focus").map(String).filter(L=>Mt.includes(L));const C=String(M.get("goal"));o.goal=pn.includes(C)?C:"Save more money",t.profile={name:o.name,character:o.character,budget:o.budget,limits:hn(o.budget,o.focus,nt(o,t)),focus:o.focus,goal:o.goal},t.expenses=We(t.expenses,o.imported),t.income=vt(t.income,o.importedIncome),De=null,n();return}o.step++,r()})}const Et={Shopping:"#ff5c9a","Food & Dining":"#ffb000",Entertainment:"#8b5cf6",Transport:"#22a7e0",Bills:"#5b3fa6",Groceries:"#2fb36b",Health:"#3b82f6",Other:"#a59aa1"},bo={Bills:'<path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4z"/>',Transport:'<path d="M5 16l1.6-5.4C7 9.4 7.8 9 9 9h6c1.2 0 2 .4 2.4 1.6L19 16v3h-2.5v-1.5h-9V19H5z"/><circle cx="8" cy="15" r="1.3" fill="#0003"/><circle cx="16" cy="15" r="1.3" fill="#0003"/>',Groceries:'<path d="M3 5h3l2 10h10l2-7H7" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/>',Health:'<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',"Food & Dining":'<path d="M7 3v7M5 3v5c0 1.2.9 2 2 2s2-.8 2-2V3M7 10v11M17 3c-2.5 2-3 5-3 8h3v10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',Shopping:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5C9 4.6 10.3 3 12 3s3 1.6 3 3.5V8" fill="none" stroke="#fff" stroke-width="2"/>',Entertainment:'<path d="M3 8c1.1 0 2-.9 2-2h14c0 1.1.9 2 2 2v8c-1.1 0-2 .9-2 2H5c0-1.1-.9-2-2-2z"/><path d="M10 9.5v5l4-2.5z" fill="#0003"/>',Other:'<circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>'};function kn(e){return`<span class="cat-icon" style="background:${Et[e]}"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#fff">${bo[e]}</g></svg></span>`}function Sn(e){return K(e)?'<span class="tag want">Want</span>':e==="Other"?"":'<span class="tag need">Need</span>'}const ft=136,pt=2*Math.PI*ft,Yt=pt*.75;function wo(e,t,n){const a=Math.max(t,e.spent),s=e.categories.filter(i=>i.spent>0),o=s.length>1?3:0;let r=0;const f=s.map(i=>{const p=i.spent/a*Yt,b=`<circle class="arc-seg${n?n===i.category?" selected":" dim":""}" data-cat="${c(i.category)}" cx="150" cy="150" r="${ft}" stroke="${Et[i.category]}" stroke-dasharray="${Math.max(p-o,1)} ${pt}" stroke-dashoffset="${-r}"><title>${c(i.category)}: ${k(i.spent)}</title></circle>`;return r+=p,b}).join("");return`<svg class="arc" viewBox="0 0 300 300" aria-hidden="true">
    <g transform="rotate(135 150 150)" fill="none">
      <circle cx="150" cy="150" r="${ft}" stroke="#f1edef" stroke-width="14" stroke-linecap="round" stroke-dasharray="${Yt} ${pt}"/>
      ${f}
    </g>
  </svg>`}function vo(e,t){const n=e.limit-e.spent,a=n<0,s=t>0?Math.round(e.spent/t*100):0,o=e.limit>0?Math.min(100,e.spent/e.limit*100):e.spent>0?100:0;return`<div class="cat-detail">
    <div class="cat-title">${kn(e.category)}<strong style="color:${Et[e.category]}">${c(e.category)}</strong>${Sn(e.category)}</div>
    <p class="amt">${k(e.spent)} <span>of ${k(e.limit)}</span></p>
    <div class="bar"><div class="fill ${a?"over":"ok"}" style="width:${o}%"></div></div>
    <div class="split">
      <div><b class="${a?"neg":""}">${k(Math.abs(n))}</b><small>${a?"over":"under"} budget</small></div>
      <div><b>${s}%</b><small>of total spending</small></div>
    </div>
  </div>`}function ko(e,t){return`<ul class="cat-list">${e.categories.map(n=>{const a=n.category===t,s=n.limit>0?Math.min(100,n.ratio*100):n.spent>0?100:0;return`<li>
        <button class="cat-row${a?" selected":""}" data-cat="${c(n.category)}" aria-pressed="${a}">
          ${kn(n.category)}
          <div class="cat-info">
            <div class="cat-name">${c(n.category)}${Sn(n.category)}</div>
            <div class="cat-amt">${k(n.spent)} <span>of ${k(n.limit)}</span></div>
            <div class="bar"><div class="fill ${n.ratio>1?"over":"ok"}" style="width:${s}%"></div></div>
          </div>
          <span class="chev" aria-hidden="true">${H.chevronRight}</span>
        </button>
      </li>`}).join("")}</ul>`}async function Ke(){var n;const{data:e}=await D.auth.getSession(),t=(n=e.session)==null?void 0:n.user.id;if(!t)throw new Error("Please log in again.");return t}const Le=e=>{if(e)throw new Error(e.message)};let So=0;function xn(){clearTimeout(So)}async function xo(e){const{error:t}=await D.from("buddies").update({display_name:e.trim().slice(0,30)}).eq("user_id",await Ke());Le(t)}async function Mo(e){const{data:t,error:n}=await D.rpc("send_friend_request",{code:e});return Le(n),{pending:"Request sent! You will be friends once they accept.",accepted:"You are now friends!",already:"You are already friends.",self:"That's your own code.",not_found:"No one has that friend code. Check it and try again."}[t]??"Something went wrong. Try again."}async function Eo(e){const{error:t}=await D.from("friendships").update({status:"accepted"}).eq("requester",e).eq("addressee",await Ke());Le(t)}async function Gt(e){const t=await Ke(),{error:n}=await D.from("friendships").delete().or(`and(requester.eq.${t},addressee.eq.${e}),and(requester.eq.${e},addressee.eq.${t})`);Le(n)}async function Co(e){const{error:t}=await D.from("cheers").insert({from_user:await Ke(),to_user:e});return(t==null?void 0:t.code)==="23505"?!1:(Le(t),!0)}const Lo=[{slot:"hat",title:"Hats"},{slot:"eyes",title:"Glasses"},{slot:"neck",title:"Neckwear"}];function To(e,t){const n=t.owned.includes(e.id),a=t.equipped[e.slot]===e.id,s=n?`<button class="small ${a?"secondary":""}" data-wear="${e.id}">${a?"Take off":"Wear"}</button>`:`<button class="small buy" data-buy="${e.id}" ${t.coins<e.price?"disabled":""} aria-label="Buy ${c(e.name)} for ${e.price} coins">${O.coin}${e.price}</button>`;return`<div class="shop-item${a?" wearing":""}">
    <div class="shop-art">${Kn(e)}</div>
    <span class="shop-name">${c(e.name)}</span>
    ${s}
  </div>`}function Ao(e,t){const n=t.owned.includes(e.id),a=t.house[e.slot]===e.id,s=n?`<button class="small ${a?"secondary":""}" data-place="${e.id}">${a?"Remove":"Place"}</button>`:`<button class="small buy" data-buy-house="${e.id}" ${t.coins<e.price?"disabled":""} aria-label="Buy ${c(e.name)} for ${e.price} coins">${O.coin}${e.price}</button>`;return`<div class="shop-item house-item${a?" wearing":""}">
    <div class="shop-art">${so(e)}</div>
    <span class="shop-name">${c(e.name)}</span>
    ${s}
  </div>`}function qo(e,t){const n=bn(e),a=n.limit>0?Math.min(100,n.spent/n.limit*100):0;return`
    <section class="card store-hero">
      <div class="store-preview">${X(t.character,"happy",e.equipped)}</div>
      <div class="store-balance">
        <small>Your coins</small>
        <strong>${O.coin}${e.coins}</strong>
      </div>
      <div class="earn">
        <p>Earn <b>${Se} coins</b> each week your wants stay under ${k(xt(t))}, and each month you stay on budget.</p>
        <div class="meter-head"><span>This week's wants</span><b>${k(n.spent)} / ${k(n.limit)}</b></div>
        <div class="bar"><div class="fill ${n.spent>n.limit?"over":"ok"}" style="width:${a}%"></div></div>
      </div>
    </section>
    ${Lo.map(s=>`
      <section class="card">
        <h2>${s.title}</h2>
        <div class="shop-grid">${Kt.filter(o=>o.slot===s.slot).map(o=>To(o,e)).join("")}</div>
      </section>`).join("")}
    <section class="card">
      <h2>For your house</h2>
      <p class="hint">Decorate ${c(t.name)}'s house. Friends see it when they visit.</p>
      ${no.map(s=>`
        <h3>${s.title}</h3>
        <div class="shop-grid">${mn.filter(o=>o.slot===s.slot).map(o=>Ao(o,e)).join("")}</div>`).join("")}
    </section>`}const ne=[{icon:"🐷",eyebrow:"YOUR MONEY SIDEKICK",title:"Meet your Budget Buddy",text:"Your buddy reacts to your spending and helps make money habits feel a little more fun. Check in, give them a name, and watch them grow with you."},{icon:"🧾",eyebrow:"A CLEARER PICTURE",title:"Track spending your way",text:"Add expenses as you go, upload a bank statement, or connect a bank for read-only transaction imports. Your history and report help you spot patterns."},{icon:"🎯",eyebrow:"SMALL STEPS ADD UP",title:"Make a budget that fits",text:"Choose a monthly budget, set category limits, and pick a goal. Your buddy’s mood gives you a friendly nudge as you make progress."},{icon:"✨",eyebrow:"LEARN AS YOU GO",title:"Grow, earn, and decorate",text:"Find bite-sized money tips in Grow Your Money. Reach goals to earn coins, then visit the Store to treat your buddy to something new."},{icon:"🏡",eyebrow:"TOTALLY OPTIONAL",title:"Make it yours",text:"Visit Friends & House to decorate your buddy’s space or connect with friends. You can explore everything at your own pace from the menu."}];function Oo(e){const t=ne[e];return`
    <div class="tutorial-backdrop">
      <section class="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" aria-describedby="tutorial-text">
        <div class="tutorial-topline"><span>QUICK TOUR</span><span>${e+1} of ${ne.length}</span></div>
        <div class="tutorial-art" aria-hidden="true">${t.icon}</div>
        <p class="tutorial-eyebrow">${t.eyebrow}</p>
        <h2 id="tutorial-title">${t.title}</h2>
        <p class="tutorial-copy" id="tutorial-text">${t.text}</p>
        <div class="tutorial-progress" aria-label="Step ${e+1} of ${ne.length}">
          ${ne.map((n,a)=>`<span class="${a===e?"current":a<e?"done":""}"></span>`).join("")}
        </div>
        <div class="tutorial-actions">
          <button type="button" class="link tutorial-skip" id="tutorial-skip">${e===ne.length-1?"Close tour":"Skip tour"}</button>
          <div>
            ${e>0?'<button type="button" class="secondary" id="tutorial-back">Back</button>':""}
            <button type="button" id="tutorial-next">${e===ne.length-1?"Let’s go":"Next"}</button>
          </div>
        </div>
      </section>
    </div>`}const Do=ne.length,h=document.querySelector("#app"),l=Ye();let xe="",Ie=!1,j="",Be=!1,_e=!1,ht=!1,Mn=!1,En=!1,Cn=!1,N="",ce=null,J="",z="buddy",le=new Date(new Date().getFullYear(),new Date().getMonth(),1),V=null,$e="",Wt=0,ee=0;const Ct={happy:"Happy",okay:"Okay",sad:"Sad",angry:"Angry",dead:"Fainted"},Io=[{view:"buddy",label:"Budget Buddy",icon:H.pet},{view:"history",label:"Pet History",icon:F('<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>')},{view:"friends",label:"Friends & House",icon:F('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.6c2.2.6 3.5 2.4 3.5 5.4"/>')},{view:"report",label:"Full Report",icon:F('<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>')},{view:"store",label:"Store",icon:F('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>')},{view:"learn",label:"Grow Your Money",icon:F('<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>')},{view:"settings",label:"Profile & Settings",icon:F('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>')}],No={feed:`<div class="fx-food">${O.cookie}</div><span class="fx-plus">+25 Hunger</span>`,play:`<div class="fx-ball-x"><div class="fx-ball-y">${O.ball}</div></div><span class="fx-plus">+25 Fun</span>`,pet:[-40,0,40].map((e,t)=>`<span class="fx-heart" style="--x:${e}px;--d:${t*.25}s">${O.heart}</span>`).join("")+'<span class="fx-plus">+20 Love</span>'},Ln=[{action:"feed",stat:"hunger",label:"Feed",icon:O.cookie,color:"#fff1d6",ring:"#f2b230"},{action:"play",stat:"fun",label:"Play",icon:O.ball,color:"#fde7f0",ring:"#8b5cf6"},{action:"pet",stat:"love",label:"Pet",icon:O.heart,color:"#ffe4ea",ring:"#e5487f"}],Po={hunger:"Hunger",fun:"Fun",love:"Love"},Tn=(e,t)=>`${e.label} (${Po[e.stat]} ${t}%)`,An=[];let qn=!1;function mt(e){An.push(e),qn||On()}function On(){const e=An.shift();if(qn=e!==void 0,e===void 0)return;const t=document.createElement("div");t.className="toast",t.setAttribute("role","status"),t.innerHTML=e,document.body.append(t),requestAnimationFrame(()=>t.classList.add("show")),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove(),On()},400)},3200)}const Dn={coins:O.coin,alert:H.bulb,cheer:O.heart,bank:O.coin,error:H.close};function Qe(e,t){l.notices=[{id:crypto.randomUUID(),kind:e,text:t,at:Date.now(),read:!1},...l.notices].slice(0,40),oe(l),mt(`${Dn[e]}<span>${c(t)}</span>`)}function Ro(){const e=uo(l);if(e.length===0)return;l.coins+=e.length*Se,l.rewards.push(...e.map(n=>n.key));const t=e.length===1?e[0].label:`${e.length} goals`;Qe("coins",`Goal met: ${t} · +${e.length*Se} coins`)}function B(){oe(l),S()}const Fo=24*60*60*1e3,W=e=>e instanceof Error?e.message:"Something went wrong. Try again.";function In(){var s,o;if(!l.profile||!((o=(s=gt())==null?void 0:s.consent)!=null&&o.scopes.includes("alerts")))return;const e=ke(l.profile,l.expenses),t=e.categories.filter(r=>r.limit>0&&r.ratio>=.9&&!l.alerts.includes(`${e.monthKey}:${r.category}`));if(t.length===0)return;l.alerts=[...l.alerts.filter(r=>r.startsWith(e.monthKey)),...t.map(r=>`${e.monthKey}:${r.category}`)];const n=t.map(r=>`${r.category} ${Math.round(r.ratio*100)}%`),a=n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`;Qe("alert",`Spending alert: ${a} of this month's limit${t.length===1?"":"s"}.`)}async function Nn(e){S();let t=0;try{const n=await Ga(),a=l.expenses.length;l.expenses=We(l.expenses,n.expenses),l.income=vt(l.income,n.income),l.bank=n.linked?{accounts:n.accounts,syncedAt:Date.now()}:null,oe(l),t=l.expenses.length-a,j=n.linked?n.ready?`Synced ${t} new transaction${t===1?"":"s"}.`:"Your bank is still preparing your transactions. Try syncing again in a minute.":"",j&&(!e||t)&&Qe("bank",j),In()}catch(n){j=W(n)}finally{S()}}async function Ho(e=!1){j="",S();try{if(await(e?Ha():Fa()))return await Nn(!1)}catch(t){j=W(t),Qe("error",j)}S()}async function Bo(){await ln(),J="",xe="",ce=null,xn(),await $t()}function S(){const e=gt();if(Xn()){ma(h,S);return}if(!e){wt(h,S);return}if(na()){oa(h,S);return}if(ht){const t=n=>{ht=!1,J=n,S()};sa(h,()=>t("Two-factor sign-in is on."),()=>t(""));return}if(xe!==e.email&&(Object.assign(l,Sa(e.email)),xe=e.email,ce=null,xn(),Ie=!1,j="",z="buddy"),!e.consent||_e){const t=!e.consent;ya(h,e,()=>{_e=!1,Ie=!0,t&&Pa&&!l.bank&&l.profile||S()},e.consent?()=>{_e=!1,S()}:null);return}if(!l.profile||Be){vn(h,l,()=>{Be=!1,z="buddy",B()},l.profile?()=>{Be=!1,S()}:null,null);return}Ie||(Ie=!0,!l.bank||e.consent.scopes.includes("sync")&&Date.now()-l.bank.syncedAt>Fo),Ro(),Ue(l.profile)}const _o=e=>e.monthKey===U().slice(0,7);function Uo(e){const t=le.toLocaleDateString(void 0,{month:"long",year:"numeric"});return`<div class="month-nav">
    <button class="icon" id="prev" aria-label="Previous month">${H.chevronLeft}</button>
    <h2>${c(t)}</h2>
    <button class="icon" id="next" aria-label="Next month" ${_o(e)?"disabled":""}>${H.chevronRight}</button>
  </div>`}const Me=(e=0)=>new Date(new Date().getFullYear(),new Date().getMonth()+e,1),ue=(e,t=!0)=>e.toLocaleDateString(void 0,t?{month:"long",year:"numeric"}:{month:"long"});function Pn(e){const t=ke(e,l.expenses,Me(-1)),n=ue(Me(),!1);return t.spent>0&&(t.mood==="dead"||t.mood==="angry")?`${fe(e)} is back! A fresh start for ${n}.`:`A fresh ${n} for ${fe(e)}!`}function jo(e,t,n,a){const s=t.spent===0?Pn(e):t.message,o=a==="dead"?s:to(fe(e),n)??s,r=t.categories.find(y=>y.category===V)??t.topWant??t.categories[0],f=ue(Me(),!1),i=new Date,p=a==="dead";return`
    <section class="card pet-card mood-${a}">
      <div class="month-nav">
        <h2>${c(ue(Me()))}</h2>
        <button class="link" data-view="history">Past months</button>
      </div>
      <p class="speech">${c(o)}</p>
      <div class="ring-stage">
        ${wo(t,e.budget,V)}
        <button class="pet" id="pet" aria-label="Pet ${c(e.name)}" ${p?"disabled":""}>${X(e.character,a,l.equipped)}</button>
        <div class="fx" id="fx" aria-hidden="true"></div>
      </div>
      <div class="total">
        <small>Total ${c(f)} Spending</small>
        <strong>${k(t.spent)}</strong>
        <small>of ${k(e.budget)} &middot; as of ${c(i.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}))}</small>
      </div>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${k(t.needsSpent)}</b></div>
        <div class="want"><small>Wants</small><b>${k(t.wantsSpent)} <span>/ ${k(t.wantsLimit)}</span></b></div>
      </div>
      <div class="pet-name"><h2>${c(e.name)}</h2><span class="mood-badge">${Ct[a]}</span></div>
      ${t.tip?`<p class="tip">${H.bulb}<span>${c(t.tip)}</span></p>`:""}
    </section>

    ${ho(l,e,t,Mn)}

    ${Wo(t)}

    <section class="card">${vo(r,t.spent)}</section>

    ${Fn(t,r.category)}

    <nav class="action-bar" aria-label="Care for your buddy">
      ${Ln.map(y=>`<button data-action="${y.action}" class="${n[y.stat]<25?"low":""}" style="--c:${y.color};--ring:${y.ring};--v:${n[y.stat]}" aria-label="${Tn(y,n[y.stat])}" ${p?"disabled":""}><span class="bubble">${y.icon}</span><span>${y.label}</span></button>`).join("")}
      <button data-view="store" class="plain" style="--c:#efe9ff"><span class="bubble">${O.bag}</span><span>Shop</span></button>
    </nav>`}function Yo(){const e=U().slice(0,7);return[...new Set(l.expenses.map(n=>n.date.slice(0,7)))].filter(n=>n<e).sort().reverse().map(n=>new Date(Number(n.slice(0,4)),Number(n.slice(5,7))-1,1))}function Go(e,t,n){const a=Yo().map(i=>({month:i,a:ke(e,l.expenses,i)})),s=i=>a.filter(p=>p.a.mood===i).length,o=s("happy"),r=s("dead"),f=(i,p,y,b,m)=>`
    <li class="mood-${y}${m?" current":""}">
      <div class="history-pet">${X(e.character,y,l.equipped)}</div>
      <div class="history-body">
        <div class="history-head"><strong>${c(m?"This month":ue(i))}</strong><span class="mood-badge">${Ct[y]}</span></div>
        <p>${c(b)}</p>
        <small>${k(p.spent)} of ${k(e.budget)} spent${m?" so far":""}</small>
      </div>
      <button class="icon" data-report="${p.monthKey}" aria-label="See ${c(ue(i))} report">${H.chevronRight}</button>
    </li>`;return`
    <section class="card">
      <h2>${c(e.name)}'s history</h2>
      <p class="hint">A fresh ${c(e.name)} starts every month. Here's how each one went.</p>
      ${a.length?`<div class="history-stats">
              <div><strong>${a.length}</strong><small>month${a.length===1?"":"s"} tracked</small></div>
              <div><strong>${o}</strong><small>happy month${o===1?"":"s"}</small></div>
              <div><strong>${r}</strong><small>time${r===1?"":"s"} fainted</small></div>
            </div>`:""}
      <ul class="history">
        ${f(Me(),t,n,t.spent===0?Pn(e):t.message,!0)}
        ${a.map(i=>f(i.month,i.a,i.a.mood,Za(e,i.a,ue(i.month,!1)),!1)).join("")}
      </ul>
      ${a.length?"":`<p class="empty">No past months yet. Come back next month to see how ${c(e.name)} did.</p>`}
    </section>`}const me=e=>k(Math.round(e)).replace(/\.00$/,""),Rn=e=>l.income.filter(t=>t.date.startsWith(e));function Wo(e){const t=Rn(e.monthKey).reduce((o,r)=>o+r.amount,0),n=t-e.spent,a=t>0?`${n>=0?"+":"−"}${me(Math.abs(n))} left`:"Add your income",s=t===0?"Add your paychecks or other income to see what you have left over.":n>=0?`You kept ${Math.round(n/t*100)}% of what came in.`:`You spent ${me(-n)} more than came in.`;return`
    <details class="card fold cash" id="cash-card" ${Cn?"open":""}>
      <summary class="fold-head">
        <h2>Cash flow</h2>
        <span class="fold-count ${t===0?"":n>=0?"pos":"neg"}">${a}</span>
      </summary>
      <div class="flow">
        <div><small>Money in</small><b class="pos">${me(t)}</b></div>
        <div><small>Money out</small><b class="neg">${me(e.spent)}</b></div>
        <div><small>Left over</small><b class="${n>=0?"pos":"neg"}">${n<0?"−":""}${me(Math.abs(n))}</b></div>
      </div>
      ${t>0?`<div class="bar"><div class="fill ${e.spent>t?"over":e.spent>t*.8?"warn":"ok"}" style="width:${Math.min(100,Math.round(e.spent/t*100))}%"></div></div>`:""}
      <p class="hint">${c(s)}</p>
      <button class="secondary" data-view="report">Add money in</button>
    </details>`}function zo(e){const t=Rn(e).sort((n,a)=>a.date.localeCompare(n.date));return`
    <section class="card">
      <h2>Money in</h2>
      <p class="hint">Paychecks and deposits from your bank or statement show up here. Add cash income yourself.</p>
      <form id="income-form" class="expense-form">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" aria-label="Amount" required />
        <input name="note" maxlength="60" placeholder="Paycheck, side job..." aria-label="What it was" />
        <input name="date" type="date" value="${U()}" aria-label="Date" required />
        <button type="submit">Add money in</button>
      </form>
      ${t.length?`<ul class="expenses">${t.map(n=>`
            <li>
              <div><strong>${c(n.note||"Income")}</strong><br /><small>${c(n.date)}</small></div>
              <span class="pos">+${k(n.amount)}</span>
              <button class="icon" data-delete-income="${c(n.id)}" aria-label="Delete income">&times;</button>
            </li>`).join("")}</ul>`:'<p class="empty">No money in this month yet.</p>'}
    </section>`}function Fn(e,t){const n=e.categories.filter(a=>a.spent>0&&a.ratio>1).length;return`
    <details class="card fold" id="categories-card" ${En?"open":""}>
      <summary class="fold-head">
        <h2>Spending categories</h2>
        <span class="fold-count ${n?"neg":"pos"}">${n?`${n} over limit`:"All on track"}</span>
      </summary>
      ${ko(e,t)}
    </details>`}function Ko(e,t){const n=l.expenses.filter(o=>o.date.startsWith(t.monthKey)).sort((o,r)=>r.date.localeCompare(o.date)),a=Math.min(100,Math.round(t.usage*100)),s=t.categories.find(o=>o.category===V)??t.topWant??t.categories[0];return`
    <section class="card">
      ${Uo(t)}
      <div class="stats">
        <div><small>Budget</small><strong>${k(e.budget)}</strong></div>
        <div><small>Spent</small><strong>${k(t.spent)}</strong></div>
        <div><small>Left</small><strong class="${t.remaining<0?"neg":"pos"}">${k(t.remaining)}</strong></div>
      </div>
      <div class="bar big"><div class="fill ${t.usage>1?"over":"ok"}" style="width:${a}%"></div></div>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${k(t.needsSpent)}</b></div>
        <div class="want"><small>Wants</small><b>${k(t.wantsSpent)} <span>/ ${k(t.wantsLimit)}</span></b></div>
      </div>
    </section>

    ${Fn(t,s.category)}

    ${zo(t.monthKey)}

    <section class="card">
      <h2>Add expense</h2>
      <form id="expense-form" class="expense-form">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" aria-label="Amount" required />
        <select name="category" aria-label="Category">${P.map(o=>`<option>${c(o)}</option>`).join("")}</select>
        <input name="note" maxlength="60" placeholder="Note (optional)" aria-label="Note" />
        <input name="date" type="date" value="${U()}" aria-label="Date" required />
        <button type="submit">Add</button>
      </form>
      <h3>Import bank statement</h3>
      <label class="dropzone small">
        <input type="file" id="statement" accept=".csv,text/csv" />
        <strong>Upload CSV</strong>
      </label>
      ${$e?`<p class="import-msg" role="status">${c($e)}</p>`:""}
    </section>

    <section class="card">
      <h2>Transactions</h2>
      ${n.length===0?'<p class="empty">No expenses this month.</p>':`<ul class="expenses">${n.map(o=>`
            <li>
              <div><strong>${c(o.category)}</strong>${o.note?` - ${c(o.note)}`:""}<br /><small>${c(o.date)}</small></div>
              <span>${k(o.amount)}</span>
              <button class="icon" data-delete="${c(o.id)}" aria-label="Delete expense">&times;</button>
            </li>`).join("")}</ul>`}
    </section>`}function Qo(e){const t=gt(),n=Ne.filter(s=>{var o;return(o=t==null?void 0:t.consent)==null?void 0:o.scopes.includes(s.id)}),a=Zt();return`
    <section class="card settings">
      <div class="profile-row">
        ${X(e.character,"happy",l.equipped)}
        <div><h2>${c(e.name)}</h2><p class="hint">Your budget buddy</p></div>
      </div>
      <dl class="facts">
        <div><dt>Monthly budget</dt><dd>${k(e.budget)}</dd></div>
        <div><dt>Main goal</dt><dd>${c(e.goal)}</dd></div>
        <div><dt>Cutting back on</dt><dd>${e.focus.length?c(e.focus.join(", ")):"Nothing yet"}</dd></div>
        <div><dt>Coins</dt><dd>${l.coins}</dd></div>
        <div><dt>Transactions saved</dt><dd>${l.expenses.length}</dd></div>
      </dl>
      <button id="edit">Edit buddy, budget &amp; goals</button>
      <button id="restart-tutorial" class="secondary">Take the quick tour</button>
    </section>

    <section class="card settings">
      <h2>Account</h2>
      <dl class="facts">
        <div><dt>Email</dt><dd>${c((t==null?void 0:t.email)??"")}</dd></div>
        <div><dt>Bank permissions</dt><dd>${c(n.map(s=>s.label).join(", "))}</dd></div>
        ${a===null?"":`<div><dt>Two-factor sign-in</dt><dd>${a?"On":"Off"}</dd></div>`}
      </dl>
      ${a===!1?'<p class="hint">Turn on two-factor sign-in so a stolen password alone can&#39;t open your bank data.</p>':""}
      ${J?`<p class="import-msg" role="status">${c(J)}</p>`:""}
      ${a===null?"":`<button id="two-factor" class="${a?"secondary":""}">${a?"Turn off two-factor":"Turn on two-factor"}</button>`}
      <button id="permissions" class="secondary">Manage bank permissions</button>
      <button id="logout" class="secondary">Log out</button>
      <button id="logout-clear" class="secondary">Log out &amp; clear this device</button>
      <p class="hint small-print">Your buddy, coins and transactions are saved on this device only. Clearing removes them for good.</p>
    </section>

    ${Vo()}

    <section class="card">
      <h2>Reset</h2>
      <p class="hint">Delete your account, buddy, budget and all transactions from this device.</p>
      <button id="reset" class="danger">Reset everything</button>
    </section>`}function Vo(){return""}function Zo(e){const t=Math.round((Date.now()-e)/6e4);return t<1?"Just now":t<60?`${t} min ago`:t<24*60?`${Math.round(t/60)} h ago`:new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function Jo(){return`
    <section class="card">
      <div class="notices-head">
        <h2>Notifications</h2>
        ${l.notices.length?'<button class="link" id="clear-notices">Clear all</button>':""}
      </div>
      ${l.notices.length?`<ul class="notices">${l.notices.map(e=>`<li class="${e.read?"":"unread"}">
                  <span class="notice-icon">${Dn[e.kind]}</span>
                  <div><p>${c(e.text)}</p><small>${Zo(e.at)}</small></div>
                </li>`).join("")}</ul>`:'<p class="empty">Nothing yet. Coin rewards, spending alerts, cheers from friends and bank syncs show up here.</p>'}
    </section>`}function Xo(e,t){return`
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="Menu">
      <div class="drawer-head">${Y()}<button class="icon" id="close-menu" aria-label="Close menu">${H.close}</button></div>
      <div class="drawer-profile">
        ${X(e.character,t,l.equipped)}
        <div><strong>${c(e.name)}</strong><small>${Ct[t]}</small></div>
      </div>
      <nav>
        ${Io.map(n=>`<button data-view="${n.view}" ${n.view===z?'aria-current="page"':""}>${n.icon}<span>${n.label}</span></button>`).join("")}
      </nav>
    </aside>`}function ge(e){var t,n;document.body.classList.toggle("drawer-open",e),(t=h.querySelector("#menu"))==null||t.setAttribute("aria-expanded",String(e)),e&&((n=h.querySelector("#drawer [aria-current]"))==null||n.focus())}document.addEventListener("keydown",e=>{e.key==="Escape"&&ge(!1)});function Ue(e){var g,$,x,I,A,E,M,C,L,v,T,se,Te,re,Ae,Lt,Tt,At,qt,Ot,Dt,It,Nt,Pt,Rt,Ft,Ht;const t=ke(e,l.expenses),n=ke(e,l.expenses,le),a=St(l.care),s=eo(t.mood,a),o={buddy:()=>jo(e,t,a,s),history:()=>Go(e,t,s),notifications:()=>Jo(),friends:()=>`${ro(l,e,s)}<section class="card"><h2>Friends</h2><p class="hint">Friends need an online account. This copy of OinkCoin isn't connected to one.</p></section>`,report:()=>Ko(e,n),store:()=>qo(l,e),learn:()=>lo(e,t),settings:()=>Qo(e)}[z](),r=z==="notifications"?0:l.notices.filter(d=>!d.read).length;ge(!1),h.innerHTML=`
    <header class="topbar">
      <button class="menu-btn" id="menu" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      ${Y()}
      <div class="top-actions">
        <button class="bell${r?" has-unread":""}" data-view="notifications" aria-label="Notifications${r?`, ${r} unread`:""}">
          ${H.bell}${r?`<span class="badge">${r>9?"9+":r}</span>`:""}
        </button>
        <button class="coin-chip" data-view="store" aria-label="${l.coins} coins, open store">${O.coin}<b>${l.coins}</b></button>
      </div>
    </header>
    ${Xo(e,s)}
    <main class="stack">${o}</main>
    ${l.tutorialSeen?"":Oo(ee)}`,z==="notifications"&&l.notices.some(d=>!d.read)&&(l.notices=l.notices.map(d=>({...d,read:!0})),oe(l)),(g=h.querySelector("#goals-card"))==null||g.addEventListener("toggle",d=>{Mn=d.target.open}),($=h.querySelector("#cash-card"))==null||$.addEventListener("toggle",d=>{Cn=d.target.open}),(x=h.querySelector("#categories-card"))==null||x.addEventListener("toggle",d=>{En=d.target.open}),(I=h.querySelector("#clear-notices"))==null||I.addEventListener("click",()=>{l.notices=[],B()});const f=()=>{l.tutorialSeen=!0,ee=0,oe(l),S()};(A=h.querySelector("#tutorial-skip"))==null||A.addEventListener("click",f),(E=h.querySelector("#tutorial-next"))==null||E.addEventListener("click",()=>{if(ee>=Do-1)return f();ee++,Ue(e)}),(M=h.querySelector("#tutorial-back"))==null||M.addEventListener("click",()=>{ee=Math.max(0,ee-1),Ue(e)}),(C=h.querySelector("#restart-tutorial"))==null||C.addEventListener("click",()=>{ee=0,l.tutorialSeen=!1,Ue(e)}),h.querySelector("#menu").addEventListener("click",()=>ge(!0)),h.querySelector("#close-menu").addEventListener("click",()=>ge(!1)),h.querySelector("#scrim").addEventListener("click",()=>ge(!1)),h.querySelectorAll("[data-view]").forEach(d=>d.addEventListener("click",()=>{z=d.dataset.view,V=null,z==="friends"&&(N="",ce=null),S(),window.scrollTo(0,0)}));const i=()=>{S()};(L=h.querySelector("#retry-friends"))==null||L.addEventListener("click",()=>{N="",i()}),(v=h.querySelector("#copy-code"))==null||v.addEventListener("click",async d=>{const u=d.currentTarget;try{await navigator.clipboard.writeText(u.dataset.code),u.textContent="Copied!"}catch{u.textContent="Select and copy it"}});const p=h.querySelector("#add-friend");p==null||p.addEventListener("submit",async d=>{d.preventDefault();const u=String(new FormData(p).get("code")).trim();if(u){p.querySelector("button").disabled=!0;try{N=await Mo(u)}catch(q){N=W(q)}i()}}),(T=h.querySelector("#display-name"))==null||T.addEventListener("change",async d=>{try{await xo(d.target.value),N="Saved. Friends will see this name."}catch(u){N=W(u)}i()});const y=(d,u,q)=>h.querySelectorAll(`[data-${d}]`).forEach(R=>R.addEventListener("click",async()=>{R.disabled=!0;try{await u(R.getAttribute(`data-${d}`)),N=q}catch(pe){N=W(pe)}i()}));y("accept",Eo,"You are now friends!"),y("decline",Gt,"Request declined."),h.querySelectorAll("[data-visit]").forEach(d=>d.addEventListener("click",()=>{ce=d.dataset.visit,N="",S(),window.scrollTo(0,0)})),(se=h.querySelector("#back-friends"))==null||se.addEventListener("click",()=>{ce=null,N="",S()}),(Te=h.querySelector("#cheer"))==null||Te.addEventListener("click",async d=>{const u=d.currentTarget;u.disabled=!0;try{N=await Co(u.dataset.cheer)?"Cheer sent! They get +10 Love next time they open OinkCoin.":"You already cheered for them today. Come back tomorrow!"}catch(q){N=W(q)}S()}),(re=h.querySelector("#unfriend"))==null||re.addEventListener("click",async d=>{if(confirm("Remove this friend? You can add each other again with your codes.")){try{await Gt(d.currentTarget.dataset.unfriend),ce=null,N="Friend removed."}catch(u){N=W(u)}i()}}),(Ae=h.querySelector("#edit"))==null||Ae.addEventListener("click",()=>{Be=!0,S()}),(Lt=h.querySelector("#permissions"))==null||Lt.addEventListener("click",()=>{_e=!0,S()}),(Tt=h.querySelector("#logout"))==null||Tt.addEventListener("click",async()=>{await Bo(),S()}),(At=h.querySelector("#logout-clear"))==null||At.addEventListener("click",async()=>{if(confirm("Log out and remove your buddy, coins and transactions from this device? This cannot be undone.")){await ln(),_t(),Object.assign(l,Ye()),xe="",J="";try{sessionStorage.clear()}catch{}await $t(),S()}}),(qt=h.querySelector("#two-factor"))==null||qt.addEventListener("click",async()=>{if(J="",!Zt())return ht=!0,S();if(confirm("Turn off two-factor sign-in? Your account will be protected by your password only.")){try{await aa(),J="Two-factor sign-in is off."}catch(d){J=W(d)}S()}}),(Ot=h.querySelector("#link-bank"))==null||Ot.addEventListener("click",()=>void Ho()),(Dt=h.querySelector("#sync-bank"))==null||Dt.addEventListener("click",()=>void Nn(!1)),(It=h.querySelector("#unlink-bank"))==null||It.addEventListener("click",async()=>{if(confirm("Disconnect your bank? Transactions already imported stay in OinkCoin.")){try{await Wa(),l.bank=null,j="Bank disconnected. OinkCoin can no longer see your accounts.",oe(l)}catch(d){j=W(d)}S()}}),(Nt=h.querySelector("#reset"))==null||Nt.addEventListener("click",async()=>{confirm("Delete your account, buddy and all your data? This cannot be undone.")&&(Ca(),_t(),Object.assign(l,Ye()),xe="",ra(),S())}),h.querySelectorAll("[data-buy]").forEach(d=>d.addEventListener("click",()=>{const u=at.get(d.dataset.buy);!u||l.owned.includes(u.id)||l.coins<u.price||(l.coins-=u.price,l.owned.push(u.id),l.equipped[u.slot]=u.id,mt(`${O.bag}<span>${c(u.name)} is yours!</span>`),B())})),h.querySelectorAll("[data-buy-house]").forEach(d=>d.addEventListener("click",()=>{const u=dt.get(d.dataset.buyHouse);!u||l.owned.includes(u.id)||l.coins<u.price||(l.coins-=u.price,l.owned.push(u.id),l.house[u.slot]=u.id,mt(`${O.bag}<span>${c(u.name)} is in your house!</span>`),B())})),h.querySelectorAll("[data-place]").forEach(d=>d.addEventListener("click",()=>{const u=dt.get(d.dataset.place);!u||!l.owned.includes(u.id)||(l.house[u.slot]===u.id?delete l.house[u.slot]:l.house[u.slot]=u.id,B())})),h.querySelectorAll("[data-wear]").forEach(d=>d.addEventListener("click",()=>{const u=at.get(d.dataset.wear);!u||!l.owned.includes(u.id)||(l.equipped[u.slot]===u.id?delete l.equipped[u.slot]:l.equipped[u.slot]=u.id,B())}));const b=d=>{le=new Date(le.getFullYear(),le.getMonth()+d,1),V=null,S()};h.querySelectorAll("[data-report]").forEach(d=>d.addEventListener("click",()=>{const[u,q]=d.dataset.report.split("-").map(Number);le=new Date(u,q-1,1),z="report",V=null,S(),window.scrollTo(0,0)})),(Pt=h.querySelector("#prev"))==null||Pt.addEventListener("click",()=>b(-1)),(Rt=h.querySelector("#next"))==null||Rt.addEventListener("click",()=>b(1)),h.querySelectorAll("[data-cat]").forEach(d=>d.addEventListener("click",()=>{const u=d.getAttribute("data-cat");V=V===u?null:u,S()})),h.querySelectorAll("[data-action]").forEach(d=>d.addEventListener("click",()=>{d.classList.remove("pop"),d.offsetWidth,d.classList.add("pop"),zt(e,d.dataset.action)})),(Ft=h.querySelector("#pet"))==null||Ft.addEventListener("click",()=>zt(e,"pet"));const m=h.querySelector("#expense-form");m==null||m.addEventListener("submit",d=>{d.preventDefault();const u=new FormData(m),q=Number(u.get("amount")),R=String(u.get("category"));if(!(q>0)||!P.includes(R))return;const pe={id:crypto.randomUUID(),amount:Math.round(q*100)/100,category:R,note:String(u.get("note")??"").trim(),date:String(u.get("date"))};l.expenses.push(pe),$e="",B(),In()}),(Ht=h.querySelector("#statement"))==null||Ht.addEventListener("change",async d=>{var q;const u=(q=d.target.files)==null?void 0:q[0];if(u){try{const R=await dn(u),pe=l.expenses.length,Bn=l.income.length;l.expenses=We(l.expenses,R.expenses),l.income=vt(l.income,R.income);const Ve=l.income.length-Bn;$e=`Imported ${l.expenses.length-pe} new purchases${Ve?` and ${Ve} deposit${Ve===1?"":"s"}`:""}.`}catch(R){$e=R instanceof Error?R.message:"Could not read that file."}B()}});const w=h.querySelector("#income-form");w==null||w.addEventListener("submit",d=>{d.preventDefault();const u=new FormData(w),q=Number(u.get("amount"));q>0&&(l.income.push({id:crypto.randomUUID(),amount:Math.round(q*100)/100,note:String(u.get("note")??"").trim(),date:String(u.get("date"))}),B())}),h.querySelectorAll("[data-delete-income]").forEach(d=>d.addEventListener("click",()=>{l.income=l.income.filter(u=>u.id!==d.dataset.deleteIncome),B()})),h.querySelectorAll("[data-delete]").forEach(d=>d.addEventListener("click",()=>{l.expenses=l.expenses.filter(u=>u.id!==d.dataset.delete),B()}))}function zt(e,t){l.care=Xa(l.care,t),oe(l);const n=St(l.care);for(const o of Ln){const r=h.querySelector(`[data-action="${o.action}"]`);r&&(r.style.setProperty("--v",String(n[o.stat])),r.classList.toggle("low",n[o.stat]<25),r.setAttribute("aria-label",Tn(o,n[o.stat])))}const a=h.querySelector("#pet"),s=h.querySelector("#fx");!a||!s||(a.innerHTML=X(e.character,"happy",l.equipped),a.classList.add("reacting"),s.innerHTML=No[t],clearTimeout(Wt),Wt=window.setTimeout(S,2200))}async function Hn(){var e,t;if(!location.hash)try{const n=((e=document.querySelector('script[type="module"][src*="assets/index-"]'))==null?void 0:e.src)??"",s=(t=(await(await fetch(`${location.pathname}?check=${Date.now()}`,{cache:"no-store"})).text()).match(/assets\/index-[\w-]+\.js/))==null?void 0:t[0];if(!s||!n||n.endsWith(s)||sessionStorage.getItem("oinkcoin-reloaded-for")===s)return;sessionStorage.setItem("oinkcoin-reloaded-for",s),location.replace(`${location.pathname}?v=${Date.now()}`)}catch{}}new URLSearchParams(location.search).has("v")&&history.replaceState(null,"",location.pathname+location.hash);Hn();document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&Hn()});ea().then(()=>{S()});
