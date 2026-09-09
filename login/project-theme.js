const FONT_STACKS={
  inter:'Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  system:'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  'noto-sans-kr':'"Noto Sans KR",Inter,ui-sans-serif,system-ui,sans-serif'
};
const MODES=new Set(['light','dark']);
const LAYOUTS=new Set(['default','media','corporate','minimal']);
const BUTTONS=new Set(['square','soft','pill']);
const HEX=/^#[0-9a-f]{6}$/i;

function safeTheme(input){
  if(!input||typeof input!=='object'||Array.isArray(input))return {};
  const out={};
  if(MODES.has(input.mode))out.mode=input.mode;
  if(LAYOUTS.has(input.layoutPreset))out.layoutPreset=input.layoutPreset;
  if(BUTTONS.has(input.buttonStyle))out.buttonStyle=input.buttonStyle;
  for(const key of ['accent','backgroundColor','textColor','mutedTextColor','cardColor','borderColor'])if(HEX.test(String(input[key]||'')))out[key]=String(input[key]).toLowerCase();
  if(FONT_STACKS[input.fontFamily])out.fontFamily=input.fontFamily;
  for(const [key,max] of [['brandName',80],['loginHeadline',120],['signupHeadline',120],['subtitle',180]]){
    const v=String(input[key]||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);if(v)out[key]=v;
  }
  for(const key of ['logoUrl','backgroundImageUrl']){
    const v=String(input[key]||'');
    try{const u=new URL(v);if(u.protocol==='https:')out[key]=u.href}catch{}
  }
  return out;
}
function contrastText(hex){
  if(!HEX.test(hex||''))return '#ffffff';
  const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);
  return (.2126*r+.7152*g+.0722*b)>.46?'#111216':'#ffffff';
}
function setVar(root,name,value){if(value)root.style.setProperty(name,value);else root.style.removeProperty(name)}

export function applyProjectTheme(input,{root=document.documentElement,body=document.body,logo=document.getElementById('brand-logo'),projectName=document.getElementById('project-name')}={}){
  const theme=safeTheme(input);
  for(const cls of [...body.classList])if(cls.startsWith('theme-')||cls==='has-project-theme')body.classList.remove(cls);
  for(const name of ['--theme-accent','--theme-accent-text','--theme-bg','--theme-text','--theme-muted','--theme-card','--theme-border','--theme-font','--theme-bg-image'])root.style.removeProperty(name);
  root.style.colorScheme='light';
  if(logo){logo.hidden=true;logo.removeAttribute('src');logo.removeAttribute('alt')}
  if(!Object.keys(theme).length)return {applied:false,theme:{}};
  root.style.colorScheme=theme.mode||'light';
  body.classList.add('has-project-theme',`theme-mode-${theme.mode||'light'}`,`theme-layout-${theme.layoutPreset||'default'}`,`theme-buttons-${theme.buttonStyle||'soft'}`);
  setVar(root,'--theme-accent',theme.accent);
  setVar(root,'--theme-accent-text',contrastText(theme.accent));
  setVar(root,'--theme-bg',theme.backgroundColor);
  setVar(root,'--theme-text',theme.textColor);
  setVar(root,'--theme-muted',theme.mutedTextColor);
  setVar(root,'--theme-card',theme.cardColor);
  setVar(root,'--theme-border',theme.borderColor);
  setVar(root,'--theme-font',FONT_STACKS[theme.fontFamily]);
  if(theme.backgroundImageUrl)setVar(root,'--theme-bg-image',`url("${theme.backgroundImageUrl.replaceAll('"','%22')}")`);
  if(logo&&theme.logoUrl){logo.src=theme.logoUrl;logo.alt=theme.brandName||'Service logo';logo.hidden=false}
  if(projectName&&theme.brandName)projectName.textContent=theme.brandName;
  return {applied:true,theme};
}

export function themedCopy(theme,mode,fallbackTitle,fallbackSubtitle){
  const t=safeTheme(theme);
  return {
    title:(mode==='signup'?t.signupHeadline:t.loginHeadline)||fallbackTitle,
    subtitle:t.subtitle||fallbackSubtitle,
    brandName:t.brandName||''
  };
}
