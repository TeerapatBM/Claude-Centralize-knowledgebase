export async function verifyTurnstile(token:unknown,secret:string,hostname:string,send:typeof fetch=fetch){
 if(typeof token!=='string'||!token||token.length>2048)return false;
 try{
  const response=await send('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:token}),signal:AbortSignal.timeout(8000)});
  if(!response.ok)return false;
  const result=await response.json() as {success?:boolean;hostname?:string;action?:string};
  return result.success===true&&result.hostname===hostname&&result.action==='login';
 }catch{return false;}
}
