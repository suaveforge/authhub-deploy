from pathlib import Path
import re


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8')


def must_replace(text, old, new, label, count=1):
    actual = text.count(old)
    if actual != count:
        raise SystemExit(f'{label}: expected {count}, got {actual}')
    return text.replace(old, new, count)


# Remove the separate green Group Management application from the production document.
idx = read('index.html')
idx = '\n'.join(line for line in idx.splitlines() if 'account-groups.css' not in line and 'account-groups.js' not in line) + '\n'
idx = re.sub(r'(<script src="\./app\.js)(?:\?v=[^"]*)?("></script>)', r'\1?v=20260907-scope3\2', idx)
write('index.html', idx)

app = read('app.js')
if 'ACCOUNT_SCOPE_UI_V3' not in app:
    app = app.replace("        ${nav('groups','그룹 관리','bi-people','/groups')}\n", '')

    lines = app.splitlines()
    out = []
    for line in lines:
        if "const rows=visible.map(p=>" in line:
            line = "    const rows=visible.map(p=>{const scopeCount=Math.max(1,Number(p.account_scope_count||1));return `<tr data-click data-project=\"${p.id}\"><td><div class=\"project-cell\"><div class=\"project-icon\">${esc(initials(p.name))}</div><div><strong>${esc(p.name)} ${projectPid(p)?`<span class=\"project-id\">${esc(projectPid(p))}</span>`:''}</strong><small>${esc(p.monitor_public_url||p.monitor_category||'MONITOR 연결')}</small></div></div></td><td><span class=\"badge ${p.status==='active'?'green':'gray'}\">${esc(p.status)}</span></td><td><span class=\"badge ${scopeCount>1?'amber':'gray'}\">${scopeCount>1?`공유 ${scopeCount}`:'독립'}</span></td><td>${p.environments||0}</td><td>${date(p.created_at)}</td><td>${date(p.updated_at)}</td><td><i class=\"bi bi-chevron-right\" style=\"color:#adb3bb\"></i></td></tr>`}).join('');"
        elif "const content=pageHead('PROJECT REGISTRY'" in line:
            line = "    const content=pageHead('PROJECT REGISTRY','Projects','각 프로젝트는 생성 즉시 독립 계정 범위를 가지며, 필요한 경우 기존 프로젝트와 계정을 공유합니다.',`<button class=\"btn primary\" data-create-project><i class=\"bi bi-plus-lg\"></i>프로젝트 연결</button>`)+`<div class=\"filter-row\"><label class=\"search\"><i class=\"bi bi-search\"></i><input id=\"project-search\" value=\"${esc(state.projectQuery)}\" placeholder=\"프로젝트명 또는 pNN 검색\"></label></div><section class=\"card\"><div class=\"card-head\"><h2>등록 프로젝트</h2><div class=\"spacer\"><span class=\"badge gray\">${visible.length} / ${state.projects.length}</span></div></div>${rows?`<table class=\"table\"><thead><tr><th>Project</th><th>Status</th><th>Account scope</th><th>Envs</th><th>Created</th><th>Updated</th><th></th></tr></thead><tbody>${rows}</tbody></table>`:empty('bi-boxes',state.projectQuery?'검색 결과가 없습니다.':'아직 연결된 프로젝트가 없습니다.',state.projectQuery?'프로젝트명이나 pNN을 다시 확인하세요.':'MONITOR 목록에서 프로젝트를 연결하면 독립 계정 범위와 production/staging 환경이 자동 생성됩니다.',state.projectQuery?'':`<button class=\"btn primary\" data-create-project>프로젝트 연결</button>`)}</section>`;"
        out.append(line)
    app = '\n'.join(out) + '\n'

    old = "    const providerHtml=(envObj.providers||[]).map(providerCard).join(''); const groupProviderNotice=envObj.providerSource==='group'&&p.accountGroup?`<div class=\"ag-project-group-notice\"><i class=\"bi bi-people-fill\"></i><div><strong>${esc(p.accountGroup.name)} 그룹 소셜 키 사용 중</strong><span>프로젝트 자체 소셜 키는 보존되어 있지만 현재 인증에는 사용되지 않습니다. 그룹에서 이탈하면 자동으로 다시 활성화됩니다.</span></div><button type=\"button\" data-open-account-group>그룹에서 관리</button></div>`:''; const uriHtml=(envObj.redirectUris||[]).map(r=>`<div class=\"uri-row\"><i class=\"bi bi-arrow-return-right\"></i><code>${esc(r.uri)}</code><button data-delete-uri=\"${r.id}\" aria-label=\"삭제\"><i class=\"bi bi-x-lg\"></i></button></div>`).join('');"
    new = "    // ACCOUNT_SCOPE_UI_V3\n    const providerHtml=(envObj.providers||[]).map(providerCard).join('');\n    const scopeMembers=(p.accountGroup?.projects||[]); const scopeCount=Math.max(1,scopeMembers.length||1); const scopeShared=scopeCount>1;\n    const scopeMemberHtml=(scopeMembers.length?scopeMembers:[p]).map(x=>`<span class=\"scope-member ${String(x.id)===String(p.id)?'current':''}\">${esc(x.name)}</span>`).join('');\n    const scopeSection=`<section class=\"section\"><div class=\"section-title\"><div><h2>Account scope</h2><p>사용자 계정과 소셜 로그인 키를 어느 프로젝트까지 공유할지 정합니다.</p></div><div class=\"section-actions\"><button class=\"btn\" data-account-scope><i class=\"bi bi-diagram-3\"></i>공유 설정</button></div></div><div class=\"settings-card\"><div class=\"setting-row\"><div class=\"setting-label\"><strong>현재 범위</strong><small>프로젝트는 항상 하나의 계정 범위에 속합니다.</small></div><div class=\"setting-value inline\"><span class=\"badge ${scopeShared?'amber':'gray'}\">${scopeShared?`${scopeCount}개 프로젝트 공유`:'이 프로젝트만 사용'}</span></div></div><div class=\"setting-row\"><div class=\"setting-label\"><strong>포함 프로젝트</strong><small>같은 범위의 프로젝트끼리 이메일·소셜 identity를 공유합니다.</small></div><div class=\"setting-value\"><div class=\"scope-members\">${scopeMemberHtml}</div></div></div></div></section>`;\n    const uriHtml=(envObj.redirectUris||[]).map(r=>`<div class=\"uri-row\"><i class=\"bi bi-arrow-return-right\"></i><code>${esc(r.uri)}</code><button data-delete-uri=\"${r.id}\" aria-label=\"삭제\"><i class=\"bi bi-x-lg\"></i></button></div>`).join('');"
    app = must_replace(app, old, new, 'project detail account scope')
    app = must_replace(app, '${groupProviderNotice}<section class="section"><div class="section-title"><div><h2>Sign-in methods</h2>', '${scopeSection}<section class="section"><div class="section-title"><div><h2>Sign-in methods</h2>', 'scope section placement')

    app = must_replace(app, 'function openProviderModal(projectId,envObj,providerName){', 'function openProviderModal(projectId,projectObj,envObj,providerName){', 'provider modal signature')
    app = must_replace(app, "    const p=envObj.providers.find(x=>x.provider===providerName)||{}; const meta=providers[providerName]||{};", "    const p=envObj.providers.find(x=>x.provider===providerName)||{}; const meta=providers[providerName]||{}; const effectiveGroupId=envObj.providerSource==='group'?envObj.providerGroupId:''; const sharedCount=Math.max(1,Number(projectObj?.accountGroup?.project_count||projectObj?.accountGroup?.projects?.length||1));", 'provider scope metadata')
    oldsave = "      loading(true);try{await request(`/admin/environments/${envObj.id}/providers/${providerName}`,{method:'PUT',body:JSON.stringify(body)});m.remove();toast(`${meta.label||providerName} 설정을 저장했습니다.`);await projectView(projectId)}catch(e){toast(e.message,'error')}finally{loading(false)}"
    newsave = "      if(effectiveGroupId&&sharedCount>1&&!confirm(`이 변경은 현재 계정 범위를 공유하는 ${sharedCount}개 프로젝트의 ${meta.label||providerName} 로그인에 함께 적용됩니다. 저장할까요?`))return;\n      const endpoint=effectiveGroupId?`/admin/account-groups/${encodeURIComponent(effectiveGroupId)}/providers/${encodeURIComponent(envObj.name)}/${providerName}`:`/admin/environments/${envObj.id}/providers/${providerName}`;\n      loading(true);try{await request(endpoint,{method:'PUT',body:JSON.stringify(body)});m.remove();toast(effectiveGroupId&&sharedCount>1?`${sharedCount}개 프로젝트의 ${meta.label||providerName} 공통 설정을 저장했습니다.`:`${meta.label||providerName} 설정을 저장했습니다.`);await projectView(projectId)}catch(e){toast(e.message,'error')}finally{loading(false)}"
    app = must_replace(app, oldsave, newsave, 'effective provider save')

    oldbind = "    app.querySelectorAll('[data-provider]').forEach(b=>b.onclick=()=>{if(envObj.providerSource==='group'&&p.account_group_id){window.AuthHubAccountGroupsUI?.selectGroup(p.account_group_id);navigate('/groups');return}openProviderModal(id,envObj,b.dataset.provider)});\n    app.querySelector('[data-open-account-group]')?.addEventListener('click',()=>{window.AuthHubAccountGroupsUI?.selectGroup(p.account_group_id);navigate('/groups')});"
    newbind = "    app.querySelectorAll('[data-provider]').forEach(b=>b.onclick=()=>openProviderModal(id,p,envObj,b.dataset.provider));\n    app.querySelector('[data-account-scope]')?.addEventListener('click',()=>openAccountScopeModal(id,p));"
    app = must_replace(app, oldbind, newbind, 'project detail scope binding')

    insert_before = '\n  async function openBridgeModal(projectId){'
    scope_fn = r'''
  async function openAccountScopeModal(projectId,projectObj){
    loading(true);let data;try{data=await request('/admin/account-groups')}catch(e){toast(e.message,'error');return}finally{loading(false)}
    const currentId=String(projectObj.account_group_id||''); const currentCount=Math.max(1,Number(projectObj.accountGroup?.project_count||projectObj.accountGroup?.projects?.length||1));
    const targets=(data.items||[]).filter(g=>String(g.id)!==currentId&&Number(g.project_count||0)>0);
    const options=targets.map(g=>`<option value="${esc(g.id)}">${esc((g.projects||[]).map(p=>p.name).join(' + ')||g.name)} · ${Number(g.project_count||0)}개 프로젝트</option>`).join('');
    const m=modal('계정 범위 변경',`<div class="scope-choice"><label class="scope-option"><input type="radio" name="scope-mode" value="own" ${currentCount<=1?'checked':''}><span><strong>이 프로젝트만 사용</strong><small>독립 계정 범위를 유지하거나, 공유 중이라면 안전하게 분리합니다.</small></span></label><label class="scope-option"><input type="radio" name="scope-mode" value="existing" ${currentCount>1?'checked':''}><span><strong>기존 프로젝트와 계정 공유</strong><small>선택한 프로젝트들과 사용자 계정과 소셜 로그인 키를 함께 사용합니다.</small></span></label></div><label class="field" id="scope-target-wrap"><span>공유할 기존 범위</span><select class="select" id="scope-target"><option value="">선택하세요</option>${options}</select><small>프로젝트 이름을 기준으로 선택합니다. 별도의 빈 그룹을 먼저 만들 필요가 없습니다.</small></label><div class="login-note"><i class="bi bi-shield-check"></i><span>이동 전 이메일·소셜 identity 충돌을 검사하며, 충돌이 있으면 저장하지 않습니다.</span></div>`,'적용');
    const radios=[...m.querySelectorAll('input[name="scope-mode"]')],target=m.querySelector('#scope-target'),wrap=m.querySelector('#scope-target-wrap');
    const sync=()=>{const mode=radios.find(r=>r.checked)?.value||'own';wrap.hidden=mode!=='existing';};radios.forEach(r=>r.onchange=sync);sync();
    m.querySelector('[data-save]').onclick=async()=>{
      const mode=radios.find(r=>r.checked)?.value||'own';
      if(mode==='own'){
        if(currentCount<=1){m.remove();return;}
        if(!confirm('이 프로젝트를 공유 계정 범위에서 분리합니다. 이 프로젝트의 로그인 세션은 재발급되며, 기존 프로젝트들은 현재 공유 범위를 유지합니다. 진행할까요?'))return;
        loading(true);try{await request(`/admin/account-groups/${encodeURIComponent(currentId)}/projects/${encodeURIComponent(projectId)}`,{method:'DELETE'});m.remove();toast('이 프로젝트를 독립 계정 범위로 분리했습니다.');await bootstrap();await projectView(projectId)}catch(e){toast(e.message,'error')}finally{loading(false)}
        return;
      }
      const targetId=String(target.value||'');if(!targetId){toast('공유할 기존 프로젝트를 선택하세요.','error');return;}
      loading(true);let preview;try{preview=await request(`/admin/account-groups/${encodeURIComponent(targetId)}/projects/${encodeURIComponent(projectId)}/preview`)}catch(e){toast(e.message,'error');return}finally{loading(false)}
      if(preview.emailConflicts||preview.identityConflicts){toast(`계정 충돌 때문에 합칠 수 없습니다. 이메일 ${preview.emailConflicts||0}건 · 소셜 identity ${preview.identityConflicts||0}건`,'error');return;}
      const targetGroup=targets.find(g=>String(g.id)===targetId); const names=(targetGroup?.projects||[]).map(x=>x.name).join(', ');
      if(!confirm(`${names||'선택한 프로젝트'}와 계정 범위를 공유합니다. 이후 사용자 계정과 소셜 로그인 키가 공통 적용됩니다. 진행할까요?`))return;
      loading(true);try{await request(`/admin/account-groups/${encodeURIComponent(targetId)}/projects/${encodeURIComponent(projectId)}`,{method:'POST',body:'{}'});m.remove();toast('계정 범위를 공유하도록 변경했습니다.');await bootstrap();await projectView(projectId)}catch(e){toast(e.message,'error')}finally{loading(false)}
    };
  }
'''
    app = must_replace(app, insert_before, scope_fn + insert_before, 'insert account scope modal')

    app = must_replace(app, "    let items=[];\n    try {\n      const data=await request('/admin/monitor/projects'); items=data.items||[];", "    let items=[]; let accountScopeGroups=[];\n    try {\n      const [data,groups]=await Promise.all([request('/admin/monitor/projects'),request('/admin/account-groups')]); items=data.items||[]; accountScopeGroups=(groups.items||[]).filter(g=>Number(g.project_count||0)>0);", 'load account scopes in create project')
    create_anchor = '</label><div id="m-monitor-selection" class="monitor-selection-line"></div><label class="field"><span>AuthHub 메모</span>'
    group_options = "${accountScopeGroups.map(g=>`<option value=\"${esc(g.id)}\">${esc((g.projects||[]).map(p=>p.name).join(' + ')||g.name)} · ${Number(g.project_count||0)}개 프로젝트</option>`).join('')}"
    create_new = '</label><div id="m-monitor-selection" class="monitor-selection-line"></div><label class="field"><span>계정 범위</span><select class="select" id="m-account-group"><option value="">이 프로젝트만 사용 · 새 독립 범위</option>' + group_options + '</select><small>기본값은 독립입니다. 기존 프로젝트와 같은 회원·소셜 키를 써야 할 때만 기존 범위를 선택하세요.</small></label><label class="field"><span>AuthHub 메모</span>'
    app = must_replace(app, create_anchor, create_new, 'create project account scope selector')
    oldpost = "const r=await request('/admin/projects',{method:'POST',body:JSON.stringify({monitorProjectId:selected.project_id,description:body.querySelector('#m-desc').value})});"
    newpost = "const accountGroupId=String(body.querySelector('#m-account-group')?.value||''); const r=await request('/admin/projects',{method:'POST',body:JSON.stringify({monitorProjectId:selected.project_id,description:body.querySelector('#m-desc').value,accountScope:accountGroupId?'existing':'own',accountGroupId})});"
    app = must_replace(app, oldpost, newpost, 'create project account scope payload')
    app = must_replace(app, "if(route==='/groups')return window.AuthHubAccountGroupsUI.render({app,state,request,toast,loading,navigate,version:cfg.version});", "if(route==='/groups'){navigate('/projects');return}", 'remove legacy group route')

write('app.js', app)

css = read('styles.css')
if 'ACCOUNT_SCOPE_UI_V3' not in css:
    css += r'''
/* ACCOUNT_SCOPE_UI_V3 — native AuthHub charcoal/indigo system only. */
.scope-members{display:flex;justify-content:flex-end;gap:6px;flex-wrap:wrap}.scope-member{display:inline-flex;align-items:center;min-height:25px;padding:0 9px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#555d68;font-size:9px;font-weight:650}.scope-member.current{border-color:#cfd0ff;background:var(--accent-soft);color:#4f50d8}.scope-choice{display:grid;gap:8px;margin-bottom:14px}.scope-option{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:10px;padding:12px;background:#fff;cursor:pointer}.scope-option:has(input:checked){border-color:#b8b9ff;background:#f8f8ff;box-shadow:0 0 0 2px rgba(91,92,240,.06)}.scope-option input{margin-top:2px;accent-color:var(--accent)}.scope-option span{display:grid;gap:3px}.scope-option strong{font-size:11px}.scope-option small{font-size:9px;color:var(--muted);line-height:1.45}#scope-target-wrap[hidden]{display:none}.badge.scope{background:var(--accent-soft);color:#4f50d8}
'''
write('styles.css', css)
write('BUILD_VERSION.txt', 'v20260907-113000-KST\n')

checks = {
    'native group nav removed': "nav('groups','그룹 관리'" not in app,
    'legacy green group renderer removed': 'AuthHubAccountGroupsUI.render' not in app,
    'legacy group assets not loaded': 'account-groups.js' not in idx and 'account-groups.css' not in idx,
    'create project asks scope': 'm-account-group' in app,
    'project page manages scope': 'data-account-scope' in app,
    'shared provider writes effective scope': '/admin/account-groups/${encodeURIComponent(effectiveGroupId)}/providers/' in app,
    'native indigo styles reused': 'var(--accent)' in css and 'ACCOUNT_SCOPE_UI_V3' in css,
}
print('DEPLOY_ACCOUNT_SCOPE_UI_CHECKS=' + str(checks))
bad = [k for k,v in checks.items() if not v]
if bad:
    raise SystemExit('failed checks: ' + ', '.join(bad))
