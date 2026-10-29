'use client';

import {Children, Fragment, isValidElement, useEffect, useId, useRef, useState, type ReactNode, type SelectHTMLAttributes, type ChangeEvent} from 'react';
import {Check, ChevronRight} from './veltrix-icons';

type Props = SelectHTMLAttributes<HTMLSelectElement>;
type Option = {value:string; label:string; disabled:boolean};
function textOf(node:ReactNode):string {
  return Children.toArray(node).map(child => isValidElement<{children?:ReactNode}>(child) ? textOf(child.props.children) : String(child)).join('');
}
function readOptions(children:ReactNode, inheritedDisabled=false):Option[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<{children?:ReactNode; value?:string|number; label?:string; disabled?:boolean; hidden?:boolean}>(child)) return [];
    if (child.type === Fragment || child.type === 'optgroup') return readOptions(child.props.children, inheritedDisabled || !!child.props.disabled);
    if (child.type !== 'option' || child.props.hidden) return [];
    const label = child.props.label ?? textOf(child.props.children);
    return [{value:String(child.props.value ?? textOf(child.props.children)), label, disabled:inheritedDisabled || !!child.props.disabled}];
  });
}

/** A single-choice select with a themed, top-layer listbox. */
export function VeltrixSelect({children,value,defaultValue,onChange,className='',style,id,disabled,name,required,...props}:Props) {
  const generated=useId();
  const triggerId=id ?? `vx-select-${generated}`;
  const menuId=`${triggerId}-listbox`;
  const options=readOptions(children);
  const [internal,setInternal]=useState(() => String(defaultValue ?? options.find(option=>!option.disabled)?.value ?? ''));
  const selected=String(value ?? internal);
  const selectedIndex=options.findIndex(option=>option.value===selected);
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(-1);
  const trigger=useRef<HTMLButtonElement>(null);
  const menu=useRef<HTMLDivElement>(null);
  const native=useRef<HTMLSelectElement>(null);
  const search=useRef({text:'',time:0});
  const close=()=>setOpen(false);
  const enabled=options.map((option,index)=>option.disabled ? -1 : index).filter(index=>index>=0);
  const show=()=>{if(!disabled && enabled.length){setActive(selectedIndex>=0 && !options[selectedIndex].disabled ? selectedIndex : enabled[0]);setOpen(true);}};
  const choose=(index:number)=>{
    const option=options[index];
    if(!option || option.disabled)return;
    setInternal(option.value);
    if(native.current){native.current.value=option.value;native.current.dispatchEvent(new Event('change',{bubbles:true}));}
    close();
    trigger.current?.focus();
  };
  useEffect(()=>{
    if(!open)return;
    const element=menu.current;
    const button=trigger.current;
    if(!element || !button)return;
    const position=()=>{const rect=button.getBoundingClientRect();
    const gap=6, padding=8;
    const width=Math.min(Math.max(rect.width,180),window.innerWidth-padding*2);
    const below=window.innerHeight-rect.bottom-gap-padding;
    const above=rect.top-gap-padding;
    const flip=below<Math.min(240,options.length*40+12) && above>below;
    const height=Math.max(40,Math.min(320,flip?above:below));
    Object.assign(element.style,{width:`${width}px`,left:`${Math.max(padding,Math.min(rect.left,window.innerWidth-width-padding))}px`,maxHeight:`${height}px`,top:flip?'auto':`${rect.bottom+gap}px`,bottom:flip?`${window.innerHeight-rect.top+gap}px`:'auto'});};
    position();
    element.showPopover();
    const outside=(event:PointerEvent)=>{if(!button.contains(event.target as Node)&&!element.contains(event.target as Node))close();};
    const scroll=(event:Event)=>{if(!element.contains(event.target as Node))position();};
    document.addEventListener('pointerdown',outside);
    window.addEventListener('resize',position);
    window.addEventListener('scroll',scroll,true);
    return ()=>{if(element.matches(':popover-open'))element.hidePopover();document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',position);window.removeEventListener('scroll',scroll,true);};
  },[open,options.length]);
  useEffect(()=>{if(!open||!menu.current)return;const list=menu.current,item=document.getElementById(`${menuId}-${active}`);if(!item)return;const top=item.offsetTop,bottom=top+item.offsetHeight;if(top<list.scrollTop)list.scrollTop=top;else if(bottom>list.scrollTop+list.clientHeight)list.scrollTop=bottom-list.clientHeight;},[active,open,menuId]);
  useEffect(()=>{if(disabled)setOpen(false);},[disabled]);
  useEffect(()=>{
    const form=native.current?.form;
    const reset=()=>{setInternal(String(defaultValue ?? options.find(option=>!option.disabled)?.value ?? ''));close();};
    form?.addEventListener('reset',reset);
    return ()=>form?.removeEventListener('reset',reset);
  },[defaultValue,children]);
  const aria=Object.fromEntries(Object.entries(props).filter(([key])=>key.startsWith('aria-')||key.startsWith('data-')));
  return <>
    <select {...props} ref={native} value={selected} disabled={disabled} name={name} required={required} tabIndex={-1} aria-hidden="true" className="vx-select-native" onInvalid={event=>{event.preventDefault();trigger.current?.focus();}} onChange={event=>{setInternal(event.target.value);onChange?.(event as ChangeEvent<HTMLSelectElement>);}}>{children}</select>
    <button {...aria} ref={trigger} type="button" id={triggerId} className={`vx-select ${className}`} style={style} disabled={disabled} title={props.title} tabIndex={props.tabIndex} role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={menuId} aria-required={required} aria-activedescendant={open && active>=0 ? `${menuId}-${active}` : undefined} onClick={()=>open?close():show()} onBlur={event=>{close();props.onBlur?.(event as unknown as React.FocusEvent<HTMLSelectElement>);}} onFocus={event=>props.onFocus?.(event as unknown as React.FocusEvent<HTMLSelectElement>)} onKeyDown={event=>{
      if(event.key==='Tab'){close();return;}
      if(event.key==='Escape'){event.preventDefault();close();return;}
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();
        if(!open){show();if(event.key==='Home')setActive(enabled[0]??-1);if(event.key==='End')setActive(enabled.at(-1)??-1);return;}
        const current=enabled.indexOf(active);
        setActive(event.key==='Home'?enabled[0]:event.key==='End'?enabled[enabled.length-1]:enabled[(current+(event.key==='ArrowDown'?1:-1)+enabled.length)%enabled.length]);return;
      }
      if(event.key==='Enter'||event.key===' '){event.preventDefault();if(open)choose(active);else show();return;}
      if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
        event.preventDefault();const now=Date.now();search.current.text=now-search.current.time<650?search.current.text+event.key:event.key;search.current.time=now;
        const query=search.current.text.toLocaleLowerCase();const start=open?active:selectedIndex;
        const match=Array.from({length:options.length},(_,i)=>(start+i+1)%options.length).find(index=>!options[index].disabled&&options[index].label.toLocaleLowerCase().startsWith(query));
        if(match!==undefined){if(!open)show();setActive(match);}
      }
    }}><span className="vx-select-value">{options[selectedIndex]?.label ?? ''}</span><ChevronRight className="vx-select-chevron" size={16}/></button>
    <div ref={menu} id={menuId} popover="manual" className="vx-select-menu" role="listbox" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : triggerId)} onPointerDown={event=>event.preventDefault()}>
      {options.map((option,index)=><div key={`${option.value}-${index}`} id={`${menuId}-${index}`} role="option" aria-selected={option.value===selected} aria-disabled={option.disabled||undefined} className={`vx-select-option${active===index?' is-active':''}`} onPointerMove={()=>{if(!option.disabled)setActive(index);}} onClick={()=>choose(index)}><span>{option.label}</span>{option.value===selected&&<Check size={16}/>}</div>)}
    </div>
  </>;
}
