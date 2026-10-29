'use client';
import {createContext,useContext,useRef,useState,type ReactNode} from 'react';
import {MODEL_CATALOG,type ModelEntry,type ProviderId} from '../lib/model-catalog';
export type SelectableModel=ModelEntry&{installed?:boolean};
type State={provider:ProviderId;model:string;choose:(provider:ProviderId,model?:string)=>void;keys:Partial<Record<ProviderId,string>>;setKey:(provider:ProviderId,value:string)=>void;clearKeys:()=>void;catalog:SelectableModel[];refresh:()=>Promise<void>;error:string};
const Context=createContext<State|null>(null);
export function ModelAccessProvider({children}:{children:ReactNode}){
 const [provider,setProvider]=useState<ProviderId>('ollama'),[model,setModel]=useState(''),[keys,setKeys]=useState<Partial<Record<ProviderId,string>>>({}),[catalog,setCatalog]=useState<SelectableModel[]>(MODEL_CATALOG),[error,setError]=useState('');
 const chosen=useRef(false);
 async function refresh(){try{const r=await fetch('/api/models');if(!r.ok)return;const d:any=await r.json();setCatalog(d.models);if(!chosen.current){setModel(d.defaultModel);setProvider(d.defaultProvider||'ollama');}setError('');}catch{setError('Could not refresh available models.');}}
 function choose(next:ProviderId,id?:string){chosen.current=true;setProvider(next);setModel(id||catalog.find(m=>m.provider===next&&(next!=='ollama'||m.installed))?.id||catalog.find(m=>m.provider===next)?.id||'');}
 return <Context.Provider value={{provider,model,choose,keys,setKey:(p,key)=>setKeys(old=>({...old,[p]:key})),clearKeys:()=>setKeys({}),catalog,refresh,error}}>{children}</Context.Provider>;
}
export function useModels(){const value=useContext(Context);if(!value)throw Error('ModelAccessProvider missing');return value;}
