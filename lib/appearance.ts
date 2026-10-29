export type Appearance={mode:'system'|'light'|'dark';accent:'ocean'|'iris'|'forest'|'rose'|'amber';density:'comfortable'|'compact';motion:boolean};
export const defaults:Appearance={mode:'dark',accent:'iris',density:'comfortable',motion:true};
export const appearanceKey='commons.appearance.v1';
export function normalizeAppearance(value:unknown):Appearance{
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 return {mode:['light','dark','system'].includes(String(v.mode))?v.mode as Appearance['mode']:defaults.mode,accent:['ocean','iris','forest','rose','amber'].includes(String(v.accent))?v.accent as Appearance['accent']:defaults.accent,density:v.density==='compact'?'compact':'comfortable',motion:typeof v.motion==='boolean'?v.motion:true};
}
// Apply before paint; only validated presentation preferences touch the DOM.
export const appearanceBootstrap=`(()=>{const defaults=${JSON.stringify(defaults)};const normalizeAppearance=${normalizeAppearance.toString()};let p=defaults;try{p=normalizeAppearance(JSON.parse(localStorage.getItem('${appearanceKey}')||'null'));}catch{}const e=document.documentElement;e.dataset.theme=p.mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p.mode;e.dataset.accent=p.accent;e.dataset.density=p.density;e.dataset.motion=p.motion?'on':'off';})();`;
