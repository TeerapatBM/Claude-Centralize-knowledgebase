'use client';
import {createContext,useCallback,useContext,useEffect,useState,type ReactNode} from 'react';
import {translateUi,type Locale} from '../lib/ui-translations';
const LanguageContext=createContext<{locale:Locale;setLocale:(locale:Locale)=>void;t:(text:string)=>string}>({locale:'th',setLocale:()=>{},t:text=>text});
export function LanguageProvider({children}:{children:ReactNode}){
 const [locale,setState]=useState<Locale>('th');
 useEffect(()=>{try{const saved=localStorage.getItem('veltrix.language.v1');if(saved==='th'||saved==='en')setState(saved);}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=locale;},[locale]);
 const setLocale=useCallback((next:Locale)=>{setState(next);try{localStorage.setItem('veltrix.language.v1',next);}catch{}},[]);
 const t=useCallback((text:string)=>translateUi(text,locale),[locale]);
 return <LanguageContext.Provider value={{locale,setLocale,t}}>{children}</LanguageContext.Provider>;
}
export const useI18n=()=>useContext(LanguageContext);
