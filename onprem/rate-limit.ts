export function createRateLimiter(capacity=5000,clock=Date.now){
 const entries=new Map<string,{count:number;expires:number}>();
 return (key:string,max:number,window:number)=>{
  const now=clock();if(entries.size>=capacity)for(const [k,v]of entries)if(v.expires<=now)entries.delete(k);
  const old=entries.get(key),entry=old&&old.expires>now?old:{count:0,expires:now+window};
  if(!entries.has(key)&&entries.size>=capacity)throw Object.assign(Error('ขณะนี้มีคำขอมากเกินไป กรุณารอสักครู่'),{status:429});
  entry.count++;entries.set(key,entry);if(entry.count>max)throw Object.assign(Error('ส่งคำขอบ่อยเกินไป กรุณารอสักครู่'),{status:429});
 };
}
