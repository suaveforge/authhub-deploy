const params=new URLSearchParams(location.search);
const project=String(params.get('project')||'').trim();
const environment=String(params.get('environment')||'production').trim();
const redirectUri=String(params.get('redirect_uri')||'').trim();
const state=String(params.get('state')||'');
const lang=String(params.get('lang')||navigator.language||'ko');
const apiBase=String(globalThis.AUTHHUB_CONFIG?.apiBase||'').replace(/\/$/,'');
const $=(id)=>document.getElementById(id);
const els={project:$('project'),exit:$('exit'),error:$('error'),emailStep:$('email-step'),emailForm:$('email-form'),email:$('email'),send:$('send'),codeStep:$('code-step'),masked:$('masked'),codeForm:$('code-form'),code:$('code'),verify:$('verify'),resend:$('resend'),change:$('change'),expired:$('expired-step'),restart:$('restart'),progress:document.querySelector('.progress')};
let busy=false,resendUntil=0,timer=null,lastEmail='';
const endpoint=(path)=>`${apiBase}${path}${path.includes('?')?'&':'?'}environment=${encodeURIComponent(environment)}`;
function showError(message=''){els.error.textContent=message;els.error.hidden=!message;}
function friendly(error){
  const code=String(error?.body?.error||error?.message||'');
  if(code==='invalid_email')return '이메일 주소를 확인해 주세요.';
  if(code==='email_already_in_use')return '이 이메일은 이미 다른 계정에서 사용 중이에요. 다른 이메일을 입력해 주세요.';
  if(code==='invalid_verification_code')return '인증번호가 맞지 않습니다.';
  if(code==='verification_code_expired')return '인증번호가 만료됐어요. 새 인증번호를 받아 주세요.';
  if(code==='verification_attempts_exhausted')return '입력 횟수를 초과했어요. 새 인증번호를 받아 주세요.';
  if(code==='verification_rate_limited'||code==='verification_resend_too_soon')return '잠시 후 다시 시도해 주세요.';
  if(code==='email_delivery_failed'||code==='email_delivery_unavailable')return '인증메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.';
  if(code==='completion_session_already_used')return '다른 창에서 가입이 완료됐어요. 다시 로그인해 주세요.';
  return '로그인 시간이 만료됐어요.';
}
async function request(path,options={}){
  const res=await fetch(endpoint(path),{...options,credentials:'include',headers:{'content-type':'application/json',...(options.headers||{})}});
  const body=await res.json().catch(()=>({}));
  if(!res.ok){const err=new Error(body.error||`http_${res.status}`);err.status=res.status;err.body=body;throw err;}
  return body;
}
function setBusy(value){busy=value;els.send.disabled=value;els.verify.disabled=value;if(value)els.resend.disabled=true;}
function showStep(name){
  els.emailStep.hidden=name!=='email';els.codeStep.hidden=name!=='code';els.expired.hidden=name!=='expired';
  els.progress.classList.toggle('done',name==='code');
  if(name==='email')setTimeout(()=>els.email.focus(),0);
  if(name==='code')setTimeout(()=>els.code.focus(),0);
}
function updateTimer(){
  const seconds=Math.max(0,Math.ceil((resendUntil-Date.now())/1000));
  if(seconds>0){els.resend.disabled=true;els.resend.textContent=`${seconds}초 후 다시 받기`;}
  else{els.resend.disabled=busy;els.resend.textContent='인증번호 다시 받기';if(timer){clearInterval(timer);timer=null;}}
}
function startTimer(value){resendUntil=value?new Date(value).getTime():0;if(timer)clearInterval(timer);timer=setInterval(updateTimer,500);updateTimer();}
function restartUrl(){
  const u=new URL('/login/',location.origin);u.searchParams.set('project',project);u.searchParams.set('environment',environment);u.searchParams.set('redirect_uri',redirectUri);if(state)u.searchParams.set('state',state);if(lang)u.searchParams.set('lang',lang);u.searchParams.set('mode','login');return u.toString();
}
function expire(message=''){showStep('expired');showError(message);}
async function status(){
  try{
    const s=await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/status`,{method:'GET'});
    if(!Array.isArray(s.requirements)||!s.requirements.length)return finish();
    if(s.challenge){els.masked.textContent=s.challenge.maskedEmail||'';showStep('code');startTimer(s.challenge.resendAfter);}else showStep('email');
  }catch(error){expire(friendly(error));}
}
async function send(email){
  if(busy)return;showError();setBusy(true);els.send.textContent='보내는 중…';
  try{
    lastEmail=String(email||'').trim();
    const r=await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/email/start`,{method:'POST',body:JSON.stringify({email:lastEmail})});
    els.masked.textContent=r.maskedEmail||'';els.code.value='';showStep('code');startTimer(r.resendAfter);
  }catch(error){
    if(error?.body?.challenge){els.masked.textContent=error.body.challenge.maskedEmail||'';showStep('code');startTimer(error.body.challenge.resendAfter);}
    if(error?.status===401)expire(friendly(error));else showError(friendly(error));
  }finally{setBusy(false);els.send.textContent='인증메일 보내기';updateTimer();}
}
async function verify(code){
  if(busy)return;showError();setBusy(true);els.verify.textContent='확인 중…';
  try{
    await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/email/verify`,{method:'POST',body:JSON.stringify({code:String(code||'').trim()})});
    await finish();
  }catch(error){if(error?.status===401)expire(friendly(error));else{showError(friendly(error));els.code.select();}}
  finally{setBusy(false);els.verify.textContent='확인하고 시작하기';updateTimer();}
}
async function finish(){
  if(busy)return;showError();setBusy(true);
  try{
    const r=await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/complete`,{method:'POST',body:'{}'});
    if(!r.redirectTo)throw new Error('completion_handoff_failed');location.replace(r.redirectTo);
  }catch(error){expire(friendly(error));}
  finally{setBusy(false);}
}
els.emailForm.addEventListener('submit',(e)=>{e.preventDefault();send(els.email.value);});
els.codeForm.addEventListener('submit',(e)=>{e.preventDefault();verify(els.code.value);});
els.resend.addEventListener('click',()=>send(lastEmail));
els.change.addEventListener('click',()=>{showError();els.email.value=lastEmail;showStep('email');});
els.restart.addEventListener('click',()=>location.replace(restartUrl()));
els.exit.addEventListener('click',()=>location.replace(redirectUri||'/'));
addEventListener('pagehide',()=>{if(timer)clearInterval(timer);},{once:true});
if(!project||!redirectUri||!apiBase)expire('잘못된 로그인 요청입니다.');else status();
