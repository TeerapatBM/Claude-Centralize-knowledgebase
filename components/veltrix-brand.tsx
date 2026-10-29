'use client';
import {useId} from 'react';

export function BrandMark({size=40,className=''}:{size?:number;className?:string}){
 return <img className={'veltrix-mark '+className} src="/brand/veltrix-mark.svg" width={size} height={size} alt="" aria-hidden="true" draggable={false}/>;
}
export function Brand({subtitle=true}:{subtitle?:boolean}){
 return <a className="brand veltrix-brand" href="/" aria-label="Veltrix home"><BrandMark size={46}/><span className="brand-type">Veltrix{subtitle&&<span className="brand-sub">Connected intelligence</span>}</span></a>;
}
export function BrandGradients(){return <svg className="brand-definitions" aria-hidden="true" width="0" height="0"><defs><linearGradient id="veltrix-ui-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#c292ff"/><stop offset=".5" stopColor="#768aff"/><stop offset="1" stopColor="#22d7ed"/></linearGradient></defs></svg>;}
const paths={
 home:<><path d="M4 10 12 3l8 7v10H5V10Z"/><path d="M10 20v-6h4v6"/></>,
 library:<><path d="M5 3h10l4 4v14H5Z"/><path d="M14 3v5h5M8 12h8M8 16h6"/></>,
 knowledge:<><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/><path d="m20 3 .5 1.5L22 5l-1.5.5L20 7l-.5-1.5L18 5l1.5-.5Z"/></>,
 tasks:<><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="14" rx="1.5"/></>,
 sources:<><path d="M9 8H7a4 4 0 0 0 0 8h3M15 8h2a4 4 0 0 1 0 8h-3M8 12h8"/></>,
 settings:<><path d="m10 3-.5 2-2 .9-2-.6-2 3.4L5 10v3l-1.5 1.3 2 3.4 2-.6 2 .9.5 2h4l.5-2 2-.9 2 .6 2-3.4L19 13v-3l1.5-1.3-2-3.4-2 .6-2-.9L14 3Z"/><circle cx="12" cy="11.5" r="3"/></>,
};
export function VeltrixIcon({name,size=24}:{name:keyof typeof paths;size?:number}){
 const id='vx'+useId().replace(/[^a-zA-Z0-9]/g,'');
 return <svg className={'veltrix-icon icon-'+name} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id={id+'f'} x1="3" y1="3" x2="20" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#e1afff"/><stop offset=".3" stopColor="#9b56ff"/><stop offset=".68" stopColor="#295bff"/><stop offset="1" stopColor="#00d9f4"/></linearGradient><linearGradient id={id+'s'} x1="4" y1="2" x2="20" y2="23" gradientUnits="userSpaceOnUse"><stop stopColor="#f2d7ff"/><stop offset=".5" stopColor="#8983ff"/><stop offset="1" stopColor="#1edfff"/></linearGradient></defs><g fill={'url(#'+id+'f)'} fillOpacity={name==='sources'?.12:.7} stroke={'url(#'+id+'s)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</g></svg>;
}
export const OverviewIcon=({size=24}:{size?:number})=><VeltrixIcon name="home" size={size}/>;
export const LibraryIcon=({size=24}:{size?:number})=><VeltrixIcon name="library" size={size}/>;
export const KnowledgeIcon=({size=24}:{size?:number})=><VeltrixIcon name="knowledge" size={size}/>;
export const TasksIcon=({size=24}:{size?:number})=><VeltrixIcon name="tasks" size={size}/>;
export const SourcesIcon=({size=24}:{size?:number})=><VeltrixIcon name="sources" size={size}/>;
export const SettingsIcon=({size=24}:{size?:number})=><VeltrixIcon name="settings" size={size}/>;
