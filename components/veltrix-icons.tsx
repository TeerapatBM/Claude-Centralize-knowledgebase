'use client';
import {useId,type ReactNode,type SVGProps} from 'react';

type Art={body?:ReactNode;detail?:ReactNode};
const art:Record<string,Art>={
 Plus:{body:<rect x="3" y="3" width="18" height="18" rx="5"/>,detail:<path d="M12 7v10M7 12h10"/>},
 Copy:{body:<><rect x="3" y="3" width="13" height="15" rx="3"/><rect x="8" y="7" width="13" height="15" rx="3"/></>,detail:<path d="M11 11h7M11 15h7"/>},
 Download:{body:<path d="M10 3h4v9l4-3 2 3-8 7-8-7 2-3 4 3Z"/>,detail:<path d="M4 18v3h16v-3"/>},
 Upload:{body:<path d="M10 17h4V8l4 3 2-3-8-7-8 7 2 3 4-3Z"/>,detail:<path d="M4 18v3h16v-3"/>},
 Send:{body:<path d="m2 10 20-8-7 20-4-9Z"/>,detail:<path d="m11 13 7-7M3 10l8 3 4 8"/>},
 Link2:{detail:<><path d="m9 7 2-2a5 5 0 0 1 7 7l-2 2M15 17l-2 2a5 5 0 0 1-7-7l2-2"/><path d="m8 16 8-8"/></>},
 Search:{body:<circle cx="10" cy="10" r="7"/>,detail:<><circle cx="10" cy="10" r="4.5"/><path d="m15 15 6 6"/></>},
 Settings2:{body:<path d="m10 2-1 3-2 1-3-1-2 4 2 2v2l-2 2 2 4 3-1 2 1 1 3h4l1-3 2-1 3 1 2-4-2-2v-2l2-2-2-4-3 1-2-1-1-3Z"/>,detail:<circle cx="12" cy="12" r="3.5"/>},
 Folder:{body:<path d="M2 6q0-2 2-2h6l2 3h8q2 0 2 2v11H2Z"/>,detail:<path d="M3 9h18M4 5h5"/>},
 FileText:{body:<path d="M5 2h10l5 5v15H5Z"/>,detail:<path d="M14 2v6h6M8 12h9M8 16h9M8 19h6"/>},
 Terminal:{body:<rect x="2" y="4" width="20" height="17" rx="3"/>,detail:<path d="m6 9 4 3-4 3M13 16h5M3 7h18"/>},
 Database:{body:<><path d="M3 6v12c0 5 18 5 18 0V6Z"/><ellipse cx="12" cy="6" rx="9" ry="4"/></>,detail:<path d="M3 11c0 5 18 5 18 0M3 16c0 5 18 5 18 0"/>},
 BookOpen:{body:<path d="M12 5C8 2 4 2 2 3v16c3-1 6 0 10 3 4-3 7-4 10-3V3c-3-1-6-1-10 2Z"/>,detail:<path d="M12 5v16M5 7l4 1M5 11l4 1M16 8l3-1M16 12l3-1"/>},
 Users:{body:<><circle cx="9" cy="7" r="4"/><path d="M1 22v-4a8 8 0 0 1 16 0v4Z"/><circle cx="19" cy="8" r="3"/><path d="M18 14q5 0 5 8h-5"/></>,detail:<path d="M3 19q1-5 6-5M7 5q1-1 2-1"/>},
 GitBranch:{body:<><circle cx="5" cy="5" r="3"/><circle cx="19" cy="7" r="3"/><circle cx="10" cy="20" r="3"/></>,detail:<path d="M5 8v3q0 5 5 6M10 17v-2q0-8 6-8"/>},
 Sparkles:{body:<><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/><path d="m20 1 .8 2.2L23 4l-2.2.8L20 7l-.8-2.2L17 4l2.2-.8Z"/></>,detail:<path d="m8 12 4-2-1-3"/>},
 LockKeyhole:{body:<rect x="4" y="9" width="16" height="13" rx="3"/>,detail:<><path d="M7 9V6a5 5 0 0 1 10 0v3M12 14v4"/><circle cx="12" cy="14" r="1"/></>},
 ShieldCheck:{body:<path d="m12 2 10 4v6q0 7-10 11Q2 19 2 12V6Z"/>,detail:<path d="m7 12 3 3 7-7"/>},
 CheckCircle2:{body:<circle cx="12" cy="12" r="10"/>,detail:<path d="m7 12 3 3 7-7"/>},
 Check:{detail:<path d="m4 12 5 5L20 6"/>},
 X:{body:<circle cx="12" cy="12" r="10"/>,detail:<path d="m8 8 8 8M16 8l-8 8"/>},
 LoaderCircle:{detail:<><circle cx="12" cy="12" r="9" opacity=".25"/><path d="M12 3a9 9 0 0 1 9 9"/></>},
 RefreshCw:{detail:<><path d="M21 10a9 9 0 0 0-16-5L2 8M2 3v5h5M3 14a9 9 0 0 0 16 5l3-3M22 21v-5h-5"/></>},
 ArrowRight:{detail:<path d="M3 12h17m-6-6 6 6-6 6"/>},
 ArrowUpRight:{detail:<path d="m5 19 14-14M6 5h13v13"/>},
 ChevronRight:{detail:<path d="m9 5 7 7-7 7"/>},
 ArrowDownWideNarrow:{detail:<path d="M4 3v18m-3-4 3 4 3-4M10 5h12M10 10h9M10 15h6M10 20h3"/>},
 Activity:{detail:<path d="M2 12h5l3-9 4 18 3-9h5"/>},
 Moon:{body:<path d="M20 16A10 10 0 0 1 8 2 10 10 0 1 0 22 16Z"/>,detail:<path d="M6 6a8 8 0 0 0 0 12"/>},
 Sun:{body:<circle cx="12" cy="12" r="5"/>,detail:<path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>},
 Palette:{body:<path d="M22 11c0-6-5-10-11-9S1 7 2 14s8 10 11 7c2-2-2-4 1-6 2-1 8 1 8-4Z"/>,detail:<><circle cx="7" cy="9" r="1"/><circle cx="11" cy="6" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="6" cy="14" r="1"/></>},
 Monitor:{body:<rect x="2" y="3" width="20" height="15" rx="3"/>,detail:<path d="M2 14h20M9 18v4M15 18v4M7 22h10"/>},
 SlidersHorizontal:{detail:<><path d="M2 5h20M2 12h20M2 19h20"/><circle cx="7" cy="5" r="2"/><circle cx="17" cy="12" r="2"/><circle cx="9" cy="19" r="2"/></>},
 Command:{detail:<path d="M9 9V5a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V9Z"/>},
 Eye:{body:<path d="M1 12q11-16 22 0-11 16-22 0Z"/>,detail:<circle cx="12" cy="12" r="3"/>},
 EyeOff:{detail:<><path d="M3 8q9-10 19 4l-3 3M3 3l18 18M2 12q5 7 12 6M9 9a4 4 0 0 0 6 6"/></>},
 KeyRound:{body:<><circle cx="8" cy="8" r="6"/><path d="m12 12 10 10h-5l-2-2v-3h-3Z"/></>,detail:<circle cx="7" cy="7" r="1.5"/>},
 LogIn:{body:<path d="M13 2h8v20h-8v-4h4V6h-4Z"/>,detail:<path d="M2 12h12m-4-4 4 4-4 4"/>},
 LogOut:{body:<path d="M11 2H3v20h8v-4H7V6h4Z"/>,detail:<path d="M10 12h12m-4-4 4 4-4 4"/>},
 Server:{body:<><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></>,detail:<path d="M6 7h1M6 18h1M12 7h6M12 18h6"/>},
 LayoutDashboard:{body:<><rect x="2" y="2" width="8" height="11" rx="2"/><rect x="14" y="2" width="8" height="7" rx="2"/><rect x="2" y="17" width="8" height="5" rx="2"/><rect x="14" y="13" width="8" height="9" rx="2"/></>},
 MessageSquare:{body:<path d="M2 3h20v15H8l-6 4Z"/>,detail:<path d="M6 8h12M6 12h8"/>},
 Workflow:{body:<><rect x="1" y="1" width="7" height="7" rx="2"/><rect x="16" y="16" width="7" height="7" rx="2"/></>,detail:<path d="M5 8v9q0 3 3 3h8M8 5h9q3 0 3 3v8"/>},
};
type Props=SVGProps<SVGSVGElement>&{size?:number|string};
function NeonIcon({name,size=24,className='',...props}:Props&{name:string}){
 const id='ni'+useId().replace(/[^a-zA-Z0-9]/g,'');
 const [top,bottom]=name==='CheckCircle2'?['#45f5ca','#00aeb5']:name==='X'?['#ff94c2','#d51564']:name==='Sun'?['#ffe891','#ed8d18']:['#c28bff','#176bff'];
 const shape=art[name];
 return <svg width={size} height={size} viewBox="0 0 24 24" className={'veltrix-icon vx-'+name+' '+className} data-vx-icon={name} fill="none" aria-hidden="true" {...props}><defs><linearGradient id={id+'f'} x1="3" y1="1" x2="20" y2="23" gradientUnits="userSpaceOnUse"><stop stopColor={top}/><stop offset=".48" stopColor={bottom}/><stop offset="1" stopColor={name==='X'?'#b30067':'#00cce8'}/></linearGradient><linearGradient id={id+'e'} x1="2" y1="0" x2="18" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#f4dcff"/><stop offset=".45" stopColor={top}/><stop offset="1" stopColor={bottom}/></linearGradient></defs><g className="icon-solid" fill={'url(#'+id+'f)'} stroke={'url(#'+id+'e)'} strokeWidth=".7" strokeLinejoin="round">{shape?.body}</g><g className="icon-detail" stroke={'url(#'+id+'e)'} strokeWidth={shape?.body?1.6:2.2} strokeLinecap="round" strokeLinejoin="round">{shape?.detail}</g></svg>;
}
const icon=(name:string)=>function Icon(props:Props){return <NeonIcon name={name} {...props}/>;};
export const Plus=icon('Plus'),Copy=icon('Copy'),Download=icon('Download'),Upload=icon('Upload'),Send=icon('Send'),Link2=icon('Link2'),Search=icon('Search'),Settings2=icon('Settings2'),Folder=icon('Folder'),FileText=icon('FileText'),Terminal=icon('Terminal'),Database=icon('Database'),BookOpen=icon('BookOpen'),Users=icon('Users'),GitBranch=icon('GitBranch'),Sparkles=icon('Sparkles'),LockKeyhole=icon('LockKeyhole'),ShieldCheck=icon('ShieldCheck'),CheckCircle2=icon('CheckCircle2'),Check=icon('Check'),X=icon('X'),LoaderCircle=icon('LoaderCircle'),RefreshCw=icon('RefreshCw'),ArrowRight=icon('ArrowRight'),ArrowUpRight=icon('ArrowUpRight'),ChevronRight=icon('ChevronRight'),ArrowDownWideNarrow=icon('ArrowDownWideNarrow'),Activity=icon('Activity'),Moon=icon('Moon'),Sun=icon('Sun'),Palette=icon('Palette'),Monitor=icon('Monitor'),SlidersHorizontal=icon('SlidersHorizontal'),Command=icon('Command'),Eye=icon('Eye'),EyeOff=icon('EyeOff'),KeyRound=icon('KeyRound'),LogIn=icon('LogIn'),LogOut=icon('LogOut'),Server=icon('Server'),LayoutDashboard=icon('LayoutDashboard'),MessageSquare=icon('MessageSquare'),Workflow=icon('Workflow');
