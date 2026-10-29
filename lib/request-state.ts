export function createRequestGate(){let generation=0;return {begin:()=>++generation,invalidate:()=>{generation++;},isCurrent:(ticket:number)=>ticket===generation};}
