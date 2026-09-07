(() => {
  'use strict';
  const cfg=window.AUTHHUB_CONFIG||{};
  const api=String(cfg.apiBase||'https://api-authhub.suaveforge.com').replace(/\/$/,'');
  let lastUserId='';
  let boardSeq=0;

  const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const initials=v=>String(v||'A').trim().slice(0,2).toUpperCase();
  const toast=(message,type='ok')=>{
    const root=document.getElementById('toast-root');
    if(!root){alert(message);return;}
    const el=document.createElement('div');el.className=`toast ${type==='error'?'error':''}`;
    el.innerHTML=`<i class="bi ${type==='error'?'bi-exclamation-circle':'bi-check-circle'}"></i><span>${esc(message)}</span>`;
    root.appendChild(el);setTimeout(()=>el.remove(),3600);
  };
  async function req(path,options={}){
    const headers={'content-type':'application/json',...(options.headers||{})};
    const res=await fetch(`${api}${path}`,{credentials:'include',...options,headers});
    const text=await res.text();let data={};try{data=text?JSON.parse(text):{}}catch{data={error:text||'request_failed'}}
    if(!res.ok)throw new Error(data.error||`요청 실패 (${res.status})`);
    return data;
  }
  const refresh=()=>{window.dispatchEvent(new Event('hashchange'));setTimeout(schedule,80)};
  const currentRoute=()=>location.hash.slice(1)||'/overview';

  document.addEventListener('click',e=>{
    const row=e.target.closest?.('[data-user]');
    if(row?.dataset.user)lastUserId=String(row.dataset.user);
  },true);

  async function mountScopeBoard(){
    if(currentRoute()!=='/projects')return;
    const content=document.querySelector('#app .content');
    if(!content||content.querySelector('[data-admin-v4-scope]'))return;
    const seq=++boardSeq;
    let projects,groups;
    try{
      [projects,groups]=await Promise.all([req('/admin/projects'),req('/admin/account-groups')]);
    }catch{return;}
    if(seq!==boardSeq||currentRoute()!=='/projects')return;
    const byId=new Map((projects.items||[]).map(p=>[String(p.id),p]));
    const scopes=(groups.items||[]).filter(g=>g.status!=='disabled').map(g=>({...g,projects:(g.projects||[]).filter(p=>byId.has(String(p.id)))}));
    const label=g=>{
      const names=(g.projects||[]).map(p=>p.name).filter(Boolean);
      if(names.length===1)return names[0];
      if(names.length>1)return names.slice(0,2).join(' + ')+(names.length>2?` +${names.length-2}`:'');
      return g.name||'보존된 빈 범위';
    };
    const boxes=scopes.map(g=>{
      const count=(g.projects||[]).length;
      const cards=(g.projects||[]).map(p=>`<article class="scope-v4-project" draggable="true" data-v4-project="${esc(p.id)}" data-v4-source="${esc(g.id)}"><div class="scope-v4-icon">${esc(initials(p.name))}</div><div class="scope-v4-copy"><strong>${esc(p.name)}</strong><small>${esc(p.monitor_project_id||p.slug||'프로젝트')}</small></div><i class="bi bi-grip-vertical scope-v4-grip"></i></article>`).join('');
      return `<section class="scope-v4-box ${count>1?'shared':count===0?'empty':''}" data-v4-target="${esc(g.id)}"><header class="scope-v4-box-head"><div><strong>${esc(label(g))}</strong><small>${count===0?'프로젝트가 빠져도 이 범위와 그룹 Social Key는 삭제 전까지 보존됩니다.':count===1?'이 프로젝트만의 계정·소셜 키 범위입니다.':'박스 안 프로젝트들이 회원 계정과 Social Key를 공유합니다.'}</small></div><div class="scope-v4-actions"><span class="scope-v4-badge">${count===0?'보존됨':count===1?'독립':`공유 ${count}`}</span><button class="scope-v4-delete" type="button" data-v4-delete="${esc(g.id)}" data-v4-count="${count}" aria-label="계정 범위 삭제"><i class="bi bi-trash3"></i></button></div></header><div class="scope-v4-body">${cards||'<div class="scope-v4-empty"><i class="bi bi-archive"></i><span>보존된 범위 · 프로젝트를 여기로 드래그해 다시 사용할 수 있습니다.</span></div>'}</div></section>`;
    }).join('');
    const board=document.createElement('section');
    board.className='scope-v4';board.dataset.adminV4Scope='1';
    board.innerHTML=`<div class="scope-v4-head"><div><div class="scope-v4-eyebrow">ACCOUNT SCOPE MAP</div><h2>계정 공유 범위</h2><p>박스 하나가 하나의 계정 범위입니다. 프로젝트 카드를 다른 박스로 끌면 그 범위의 회원 계정과 공통 Social Key를 사용합니다.</p></div><div class="scope-v4-legend"><span><i class="bi bi-box"></i>독립</span><span><i class="bi bi-intersect"></i>공유</span></div></div><div class="scope-v4-detach" data-v4-detach><i class="bi bi-box-arrow-up-right"></i><strong>독립 범위로 분리</strong><span>공유 중인 프로젝트를 여기에 놓으면 원래 프로젝트 Social Key로 돌아갑니다.</span></div><div class="scope-v4-grid">${boxes||'<div class="scope-v4-empty">프로젝트를 연결하면 독립 계정 범위가 자동 생성됩니다.</div>'}</div>`;
    const head=content.querySelector('.page-head');head?.insertAdjacentElement('afterend',board);
    if(!board.isConnected)content.prepend(board);

    let dragged=null;
    const detach=board.querySelector('[data-v4-detach]');
    const reset=()=>{board.classList.remove('dragging');detach.classList.remove('active');board.querySelectorAll('.scope-v4-box').forEach(x=>x.classList.remove('drag-over'));dragged=null};
    board.querySelectorAll('[data-v4-project]').forEach(card=>{
      card.addEventListener('click',()=>{if(!dragged)location.hash=`/project/${card.dataset.v4Project}`});
      card.addEventListener('dragstart',e=>{const p=byId.get(String(card.dataset.v4Project));dragged={projectId:String(card.dataset.v4Project),sourceId:String(card.dataset.v4Source),name:p?.name||'프로젝트'};e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragged.projectId);board.classList.add('dragging');card.classList.add('dragging')});
      card.addEventListener('dragend',()=>{card.classList.remove('dragging');reset()});
    });
    board.querySelectorAll('[data-v4-target]').forEach(box=>{
      box.addEventListener('dragover',e=>{if(!dragged)return;e.preventDefault();box.classList.add('drag-over')});
      box.addEventListener('dragleave',e=>{if(!box.contains(e.relatedTarget))box.classList.remove('drag-over')});
      box.addEventListener('drop',async e=>{
        e.preventDefault();if(!dragged)return;const d={...dragged};const targetId=String(box.dataset.v4Target);reset();
        if(targetId===d.sourceId)return;
        let preview;try{preview=await req(`/admin/account-groups/${encodeURIComponent(targetId)}/projects/${encodeURIComponent(d.projectId)}/preview`)}catch(err){toast(err.message,'error');return}
        if(preview.emailConflicts||preview.identityConflicts){toast(`합칠 수 없습니다. 이메일 충돌 ${preview.emailConflicts||0}건 · 소셜 계정 충돌 ${preview.identityConflicts||0}건`,'error');return}
        const target=scopes.find(g=>String(g.id)===targetId);
        if(!confirm(`${d.name}을(를) [${label(target||{})}] 범위에 합칩니다.\n\n• 이후 회원 계정과 소셜 identity를 공유합니다.\n• 대상 범위의 공통 Social Key가 로그인에 사용됩니다.\n• 기존 프로젝트 Social Key는 삭제하지 않고 보존합니다.\n• 기존 세션은 안전을 위해 재발급됩니다.\n\n진행할까요?`))return;
        try{await req(`/admin/account-groups/${encodeURIComponent(targetId)}/projects/${encodeURIComponent(d.projectId)}`,{method:'POST',body:'{}'});toast('계정 범위를 합쳤습니다.');refresh()}catch(err){toast(err.message==='account_group_conflicts'?'계정 충돌 때문에 합칠 수 없습니다.':err.message,'error')}
      });
    });
    detach.addEventListener('dragover',e=>{if(!dragged)return;e.preventDefault();detach.classList.add('active')});
    detach.addEventListener('dragleave',()=>detach.classList.remove('active'));
    detach.addEventListener('drop',async e=>{
      e.preventDefault();if(!dragged)return;const d={...dragged};const source=scopes.find(g=>String(g.id)===d.sourceId);reset();
      if(!source||(source.projects||[]).length<=1){toast('이미 독립 계정 범위입니다.');return}
      if(!confirm(`${d.name}을(를) 공유 범위에서 분리합니다.\n\n• 이 프로젝트는 독립 계정 범위를 새로 갖습니다.\n• 이 프로젝트가 원래 보관하던 Social Key가 다시 활성화됩니다.\n• 기존 공유 범위와 그 Social Key는 그대로 유지됩니다.\n• 세션은 재발급됩니다.\n\n진행할까요?`))return;
      try{await req(`/admin/account-groups/${encodeURIComponent(d.sourceId)}/projects/${encodeURIComponent(d.projectId)}`,{method:'DELETE'});toast('독립 범위로 분리했습니다.');refresh()}catch(err){toast(err.message,'error')}
    });
    board.querySelectorAll('[data-v4-delete]').forEach(btn=>btn.addEventListener('click',async e=>{
      e.stopPropagation();const id=String(btn.dataset.v4Delete);const count=Number(btn.dataset.v4Count||0);const g=scopes.find(x=>String(x.id)===id);
      const msg=count===0?`[${label(g||{})}] 보존 범위를 완전히 삭제할까요? 그룹 Social Key도 함께 삭제됩니다.`:`[${label(g||{})}] 범위를 삭제할까요? 포함된 ${count}개 프로젝트는 각각 독립 범위로 분리되고 이 그룹의 공통 Social Key는 완전히 삭제됩니다.`;
      if(!confirm(msg))return;
      try{await req(`/admin/account-groups/${encodeURIComponent(id)}`,{method:'DELETE'});toast('계정 범위를 삭제했습니다.');refresh()}catch(err){toast(err.message,'error')}
    }));
  }

  async function enhanceUserModal(){
    const modal=[...document.querySelectorAll('.modal')].find(x=>x.querySelector('.modal-head h3')?.textContent?.trim()==='사용자 관리');
    if(!modal||modal.dataset.adminV4Email||!lastUserId)return;
    modal.dataset.adminV4Email='loading';
    let user;try{user=await req(`/admin/users/${encodeURIComponent(lastUserId)}`)}catch{delete modal.dataset.adminV4Email;return}
    if(!modal.isConnected)return;
    const firstCheck=modal.querySelector('.modal-body .check-row');
    if(!firstCheck){delete modal.dataset.adminV4Email;return}
    const wrap=document.createElement('div');wrap.className='admin-v4-email';
    wrap.innerHTML=`<label class="field"><span>이메일</span><input class="input" data-v4-email type="email" value="${esc(user.email||'')}" autocomplete="off"><small>이메일 중복은 같은 Account scope 안에서만 검사합니다. 서로 독립된 프로젝트 범위는 같은 이메일을 각각 사용할 수 있습니다.</small></label><div class="check-row"><div><strong>이메일 검증됨</strong><small>주소를 변경하면 자동으로 해제됩니다. 소유 확인이 된 경우에만 관리자가 다시 켜세요.</small></div><button class="switch ${user.email_verified?'on':''}" data-v4-verified type="button"></button></div>`;
    firstCheck.before(wrap);modal.dataset.adminV4Email='1';
    const input=wrap.querySelector('[data-v4-email]'),verified=wrap.querySelector('[data-v4-verified]');
    const original=String(user.email||'').trim().toLowerCase();
    verified.onclick=()=>verified.classList.toggle('on');
    input.addEventListener('input',()=>{if(String(input.value||'').trim().toLowerCase()!==original)verified.classList.remove('on')});
    const save=modal.querySelector('.modal-foot [data-save]');
    if(save){
      save.textContent='계정 정보 저장';
      save.onclick=async()=>{
        const email=String(input.value||'').trim();const changed=email.toLowerCase()!==original;
        if(changed&&!confirm('이메일을 변경하면 기존 로그인 세션을 종료하고 새 주소 기준으로 다시 로그인해야 합니다. 변경할까요?'))return;
        const status=modal.querySelector('#u-status')?.value||user.status||'active';
        try{await req(`/admin/users/${encodeURIComponent(lastUserId)}`,{method:'PATCH',body:JSON.stringify({email,emailVerified:verified.classList.contains('on'),status})});toast(changed?'이메일을 변경하고 기존 세션을 종료했습니다.':'계정 정보를 저장했습니다.');modal.closest('.modal-backdrop')?.remove();refresh()}catch(err){const msg={email_in_use_in_account_scope:'같은 계정 범위에 이미 이 이메일을 사용하는 사용자가 있습니다.',invalid_user_email:'이메일 형식을 확인하세요.',user_spans_multiple_account_scopes:'이 사용자가 여러 계정 범위에 걸쳐 있어 이메일을 안전하게 변경할 수 없습니다.'}[err.message]||err.message;toast(msg,'error')}
      };
    }
  }

  let timer=0;
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>{mountScopeBoard();enhanceUserModal()},45)}
  const obs=new MutationObserver(schedule);obs.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('hashchange',()=>{boardSeq++;schedule()});
  addEventListener('load',schedule);schedule();
})();
