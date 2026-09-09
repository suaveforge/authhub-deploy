const completionCopy = {
  ko:{title:'거의 다 됐어요',subtitle:'계정을 안전하게 복구하고 기록을 보관할 수 있도록 이메일 주소 하나만 확인할게요.',email:'이메일',send:'인증메일 보내기',sending:'보내는 중…',emailHelp:'로그인용 비밀번호는 만들지 않습니다. 이메일 소유 여부만 확인해요.',sent:'인증번호를 보냈어요.',code:'6자리 인증번호',verify:'확인하고 시작하기',verifying:'확인 중…',resend:'인증번호 다시 받기',resendIn:(n)=>`${n}초 후 다시 받기`,change:'다른 이메일 사용',exit:'나가기',expiredTitle:'로그인이 만료됐어요',expiredSubtitle:'다시 카카오 로그인을 하면 같은 계정에서 이어서 진행할 수 있어요.',restart:'다시 로그인',invalidEmail:'이메일 주소를 확인해 주세요.',usedEmail:'이 이메일은 이미 다른 계정에서 사용 중이에요. 다른 이메일을 입력해 주세요.',badCode:'인증번호가 맞지 않습니다.',expiredCode:'인증번호가 만료됐어요. 새 인증번호를 받아 주세요.',tooMany:'입력 횟수를 초과했어요. 새 인증번호를 받아 주세요.',rate:'잠시 후 다시 시도해 주세요.',delivery:'인증메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.',session:'로그인 시간이 만료됐어요.',doneElsewhere:'다른 창에서 가입이 완료됐어요. 다시 로그인해 주세요.'},
  en:{title:'Almost there',subtitle:'Verify one email address so your account can be recovered and your records stay safe.',email:'Email',send:'Send verification code',sending:'Sending…',emailHelp:'No extra password is required. We only verify that you own this email.',sent:'We sent a verification code.',code:'6-digit code',verify:'Verify and continue',verifying:'Verifying…',resend:'Resend code',resendIn:(n)=>`Resend in ${n}s`,change:'Use another email',exit:'Exit',expiredTitle:'Your sign-in expired',expiredSubtitle:'Sign in with your social account again to resume with the same account.',restart:'Sign in again',invalidEmail:'Check the email address and try again.',usedEmail:'This email is already used by another account. Use a different email.',badCode:'That verification code is not correct.',expiredCode:'The verification code expired. Request a new one.',tooMany:'Too many incorrect attempts. Request a new code.',rate:'Please wait a moment and try again.',delivery:'We could not send the verification email. Try again shortly.',session:'Your sign-in session expired.',doneElsewhere:'Signup was completed in another window. Sign in again.'},
  ja:{title:'あと少しです',subtitle:'記録の保存とアカウント復旧のため、メールアドレスを1つ確認します。',email:'メール',send:'認証コードを送信',sending:'送信中…',emailHelp:'追加のパスワードは不要です。メールの所有確認だけを行います。',sent:'認証コードを送信しました。',code:'6桁の認証コード',verify:'確認して開始',verifying:'確認中…',resend:'コードを再送',resendIn:(n)=>`${n}秒後に再送`,change:'別のメールを使用',exit:'終了',expiredTitle:'ログインの有効期限が切れました',expiredSubtitle:'もう一度ソーシャルログインすると、同じアカウントで続行できます。',restart:'もう一度ログイン',invalidEmail:'メールアドレスを確認してください。',usedEmail:'このメールは別のアカウントで使用されています。',badCode:'認証コードが正しくありません。',expiredCode:'認証コードの期限が切れました。再送してください。',tooMany:'入力回数を超えました。新しいコードを取得してください。',rate:'しばらく待ってから再試行してください。',delivery:'認証メールを送信できませんでした。',session:'ログイン時間が切れました。',doneElsewhere:'別の画面で登録が完了しました。もう一度ログインしてください。'},
  'zh-TW':{title:'快完成了',subtitle:'為了安全保存紀錄並可復原帳號，請驗證一個電子郵件地址。',email:'電子郵件',send:'寄送驗證碼',sending:'寄送中…',emailHelp:'不需要另外設定密碼，只會確認電子郵件所有權。',sent:'驗證碼已寄出。',code:'6 位數驗證碼',verify:'驗證並繼續',verifying:'驗證中…',resend:'重新寄送',resendIn:(n)=>`${n} 秒後可重寄`,change:'使用其他電子郵件',exit:'離開',expiredTitle:'登入已逾時',expiredSubtitle:'再次使用社群帳號登入即可從同一帳號繼續。',restart:'重新登入',invalidEmail:'請確認電子郵件地址。',usedEmail:'此電子郵件已被其他帳號使用。',badCode:'驗證碼不正確。',expiredCode:'驗證碼已過期，請重新取得。',tooMany:'嘗試次數過多，請重新取得驗證碼。',rate:'請稍後再試。',delivery:'無法寄送驗證郵件，請稍後再試。',session:'登入工作階段已逾時。',doneElsewhere:'已在其他視窗完成註冊，請重新登入。'},
  'zh-CN':{title:'快完成了',subtitle:'为了安全保存记录并可恢复账号，请验证一个电子邮箱。',email:'电子邮箱',send:'发送验证码',sending:'发送中…',emailHelp:'无需再设置密码，只验证邮箱归属。',sent:'验证码已发送。',code:'6位验证码',verify:'验证并继续',verifying:'验证中…',resend:'重新发送',resendIn:(n)=>`${n} 秒后可重发`,change:'使用其他邮箱',exit:'退出',expiredTitle:'登录已过期',expiredSubtitle:'再次使用社交账号登录即可从同一账号继续。',restart:'重新登录',invalidEmail:'请检查邮箱地址。',usedEmail:'该邮箱已被其他账号使用。',badCode:'验证码不正确。',expiredCode:'验证码已过期，请重新获取。',tooMany:'尝试次数过多，请重新获取验证码。',rate:'请稍后再试。',delivery:'无法发送验证邮件，请稍后再试。',session:'登录会话已过期。',doneElsewhere:'已在其他窗口完成注册，请重新登录。'},
  vi:{title:'Sắp xong rồi',subtitle:'Hãy xác minh một email để bảo vệ lịch sử và khôi phục tài khoản khi cần.',email:'Email',send:'Gửi mã xác minh',sending:'Đang gửi…',emailHelp:'Không cần tạo thêm mật khẩu. Chúng tôi chỉ xác minh quyền sở hữu email.',sent:'Mã xác minh đã được gửi.',code:'Mã 6 chữ số',verify:'Xác minh và tiếp tục',verifying:'Đang xác minh…',resend:'Gửi lại mã',resendIn:(n)=>`Gửi lại sau ${n}s`,change:'Dùng email khác',exit:'Thoát',expiredTitle:'Phiên đăng nhập đã hết hạn',expiredSubtitle:'Đăng nhập mạng xã hội lại để tiếp tục với cùng tài khoản.',restart:'Đăng nhập lại',invalidEmail:'Hãy kiểm tra địa chỉ email.',usedEmail:'Email này đã được dùng bởi tài khoản khác.',badCode:'Mã xác minh không đúng.',expiredCode:'Mã đã hết hạn. Hãy yêu cầu mã mới.',tooMany:'Quá nhiều lần thử. Hãy yêu cầu mã mới.',rate:'Hãy chờ một chút rồi thử lại.',delivery:'Không thể gửi email xác minh. Hãy thử lại sau.',session:'Phiên đăng nhập đã hết hạn.',doneElsewhere:'Đăng ký đã hoàn tất ở cửa sổ khác. Hãy đăng nhập lại.'},
  id:{title:'Hampir selesai',subtitle:'Verifikasi satu email agar riwayat tetap aman dan akun dapat dipulihkan.',email:'Email',send:'Kirim kode verifikasi',sending:'Mengirim…',emailHelp:'Tidak perlu membuat kata sandi tambahan. Kami hanya memverifikasi kepemilikan email.',sent:'Kode verifikasi telah dikirim.',code:'Kode 6 digit',verify:'Verifikasi dan lanjutkan',verifying:'Memverifikasi…',resend:'Kirim ulang kode',resendIn:(n)=>`Kirim ulang dalam ${n} dtk`,change:'Gunakan email lain',exit:'Keluar',expiredTitle:'Sesi masuk berakhir',expiredSubtitle:'Masuk lagi dengan akun sosial untuk melanjutkan akun yang sama.',restart:'Masuk lagi',invalidEmail:'Periksa alamat email.',usedEmail:'Email ini sudah digunakan akun lain.',badCode:'Kode verifikasi salah.',expiredCode:'Kode sudah kedaluwarsa. Minta kode baru.',tooMany:'Terlalu banyak percobaan. Minta kode baru.',rate:'Tunggu sebentar lalu coba lagi.',delivery:'Email verifikasi tidak dapat dikirim. Coba lagi nanti.',session:'Sesi masuk telah berakhir.',doneElsewhere:'Pendaftaran selesai di jendela lain. Masuk lagi.'},
  es:{title:'Ya casi está',subtitle:'Verifica un correo para proteger tus registros y poder recuperar la cuenta.',email:'Correo electrónico',send:'Enviar código',sending:'Enviando…',emailHelp:'No necesitas crear otra contraseña. Solo verificamos que el correo sea tuyo.',sent:'Hemos enviado un código.',code:'Código de 6 dígitos',verify:'Verificar y continuar',verifying:'Verificando…',resend:'Reenviar código',resendIn:(n)=>`Reenviar en ${n}s`,change:'Usar otro correo',exit:'Salir',expiredTitle:'La sesión ha caducado',expiredSubtitle:'Vuelve a iniciar sesión con tu cuenta social para continuar con la misma cuenta.',restart:'Iniciar sesión de nuevo',invalidEmail:'Revisa la dirección de correo.',usedEmail:'Este correo ya pertenece a otra cuenta.',badCode:'El código no es correcto.',expiredCode:'El código ha caducado. Solicita uno nuevo.',tooMany:'Demasiados intentos. Solicita un código nuevo.',rate:'Espera un momento e inténtalo de nuevo.',delivery:'No se pudo enviar el correo de verificación.',session:'La sesión ha caducado.',doneElsewhere:'El registro se completó en otra ventana. Inicia sesión de nuevo.'}
};

export function createProfileCompletionController({ lang='ko', project, redirectUri, request, onAccessReady }) {
  const c = completionCopy[lang] || completionCopy.en;
  const $ = (id) => document.getElementById(id);
  const els = {
    section:$('completion-section'), emailStep:$('completion-email-step'), codeStep:$('completion-code-step'), expiredStep:$('completion-expired-step'),
    emailForm:$('completion-email-form'), email:$('completion-email'), emailLabel:$('completion-email-label'), send:$('completion-send-button'), emailHelp:$('completion-email-help'),
    sent:$('completion-sent-copy'), masked:$('completion-masked-email'), codeForm:$('completion-code-form'), code:$('completion-code'), codeLabel:$('completion-code-label'), verify:$('completion-verify-button'), codeHelp:$('completion-code-help'),
    resend:$('completion-resend-button'), change:$('completion-change-email'), restart:$('completion-restart-button'),
    title:$('auth-title'), subtitle:$('auth-subtitle'), tabs:$('auth-tabs'), social:$('social-section'), divider:$('divider'), loginForm:$('email-form'), status:$('status'), back:$('back-button'), error:$('error'), notice:$('notice'), security:$('security-note')
  };
  let active = false;
  let accessToken = '';
  let busy = false;
  let resendAt = 0;
  let timer = null;
  let lastEmail = '';

  const authHeaders = () => accessToken ? { authorization:`Bearer ${accessToken}` } : {};
  const clearMessages = () => { els.error.hidden=true;els.error.textContent='';els.notice.hidden=true;els.notice.textContent=''; };
  const showError = (message) => { els.error.textContent=message;els.error.hidden=false; };
  const setBusy = (value) => { busy=value;els.section.setAttribute('aria-busy',String(value));els.send.disabled=value;els.verify.disabled=value;if(value)els.resend.disabled=true; };
  const showStep = (name) => {
    els.emailStep.hidden=name!=='email';els.codeStep.hidden=name!=='code';els.expiredStep.hidden=name!=='expired';
    els.section.classList.toggle('code-stage',name==='code');
    if(name==='code')setTimeout(()=>els.code.focus(),0);else if(name==='email')setTimeout(()=>els.email.focus(),0);
  };
  function messageFor(error){
    const code=String(error?.body?.error||error?.message||'');
    if(code==='invalid_email')return c.invalidEmail;if(code==='email_already_in_use')return c.usedEmail;
    if(code==='invalid_verification_code')return c.badCode;if(code==='verification_code_expired')return c.expiredCode;
    if(code==='verification_attempts_exhausted')return c.tooMany;if(code==='verification_rate_limited'||code==='verification_resend_too_soon')return c.rate;
    if(code==='email_delivery_failed'||code==='email_delivery_unavailable')return c.delivery;
    if(code==='completion_session_already_used')return c.doneElsewhere;
    if(code==='completion_session_required'||error?.status===401)return c.session;
    return code ? code.replaceAll('_',' ') : c.session;
  }
  function updateTimer(){
    const seconds=Math.max(0,Math.ceil((resendAt-Date.now())/1000));
    if(seconds>0){els.resend.disabled=true;els.resend.textContent=c.resendIn(seconds);}else{els.resend.disabled=busy;els.resend.textContent=c.resend;if(timer){clearInterval(timer);timer=null;}}
  }
  function startTimer(value){
    resendAt=value?new Date(value).getTime():0;if(timer)clearInterval(timer);timer=setInterval(updateTimer,500);updateTimer();
  }
  function applyCopy(){
    els.title.textContent=c.title;els.subtitle.textContent=c.subtitle;els.emailLabel.textContent=c.email;els.send.textContent=c.send;els.emailHelp.textContent=c.emailHelp;els.sent.textContent=c.sent;els.codeLabel.textContent=c.code;els.verify.textContent=c.verify;els.resend.textContent=c.resend;els.change.textContent=c.change;els.back.textContent=c.exit;els.restart.textContent=c.restart;
  }
  function activate(){
    active=true;applyCopy();clearMessages();els.tabs.hidden=true;els.social.hidden=true;els.divider.hidden=true;els.loginForm.hidden=true;els.status.textContent='';els.section.hidden=false;els.security.hidden=false;
  }
  function expired(){
    activate();els.title.textContent=c.expiredTitle;els.subtitle.textContent=c.expiredSubtitle;showStep('expired');
  }
  function renderStatus(status){
    if(!status?.requirements?.length){return finish();}
    if(status.challenge){els.masked.textContent=status.challenge.maskedEmail||'';els.codeHelp.textContent='';showStep('code');startTimer(status.challenge.resendAfter);}
    else{showStep('email');}
  }
  async function status(){return request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/status`,{method:'GET',headers:authHeaders()});}
  async function enter(token=''){
    accessToken=String(token||'');activate();
    try{const current=await status();renderStatus(current);}catch(error){expired();showError(messageFor(error));}
  }
  async function finish(){
    clearMessages();setBusy(true);
    try{
      if(accessToken){await onAccessReady(accessToken);return;}
      const result=await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/complete`,{method:'POST',headers:authHeaders(),body:'{}'});
      if(!result?.redirectTo)throw new Error('completion_handoff_failed');location.replace(result.redirectTo);
    }catch(error){if(error?.status===401||error?.body?.error==='completion_session_already_used'){expired();}showError(messageFor(error));}
    finally{setBusy(false);}
  }
  async function send(emailValue=''){
    if(busy)return;clearMessages();setBusy(true);els.send.textContent=c.sending;
    try{
      const value=String(emailValue||'').trim();if(value)lastEmail=value;
      const result=await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/email/start`,{method:'POST',headers:authHeaders(),body:JSON.stringify({email:value})});
      els.masked.textContent=result.maskedEmail||'';els.code.value='';els.codeHelp.textContent='';showStep('code');startTimer(result.resendAfter);
    }catch(error){
      const challenge=error?.body?.challenge;if(challenge){els.masked.textContent=challenge.maskedEmail||'';showStep('code');startTimer(challenge.resendAfter);}
      showError(messageFor(error));
    }finally{setBusy(false);els.send.textContent=c.send;updateTimer();}
  }
  async function verify(code){
    if(busy)return;clearMessages();setBusy(true);els.verify.textContent=c.verifying;
    try{
      await request(`/v1/auth/${encodeURIComponent(project)}/profile-completion/email/verify`,{method:'POST',headers:authHeaders(),body:JSON.stringify({code:String(code||'').trim()})});
      await finish();
    }catch(error){
      showError(messageFor(error));
      if(['verification_code_expired','verification_attempts_exhausted'].includes(error?.body?.error)){resendAt=0;updateTimer();}
      els.code.select();
    }finally{setBusy(false);els.verify.textContent=c.verify;updateTimer();}
  }
  function restart(){const u=new URL(location.href);u.searchParams.delete('completion');u.searchParams.set('mode','login');location.replace(u.toString());}
  function handleBack(){if(!active)return false;location.replace(redirectUri);return true;}

  els.emailForm.addEventListener('submit',(event)=>{event.preventDefault();send(els.email.value);});
  els.codeForm.addEventListener('submit',(event)=>{event.preventDefault();verify(els.code.value);});
  els.resend.addEventListener('click',()=>send(lastEmail));
  els.change.addEventListener('click',()=>{clearMessages();els.email.value=lastEmail;showStep('email');});
  els.restart.addEventListener('click',restart);
  addEventListener('pagehide',()=>{if(timer)clearInterval(timer);},{once:true});

  return { enter, handleBack, get active(){return active;} };
}
