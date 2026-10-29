import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApplication} from '../onprem/server.ts';

test('on-prem workspace: authenticated team sharing, ingestion, roles and local inference',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'commons-'));const config:any={dataDir:dir,publicOrigin:'',adminUser:'admin',adminPassword:'test-password-long-123',secureCookies:false,model:'qwen3:4b',ollamaUrl:'http://127.0.0.1:1'};
 const app=createApplication(config);await new Promise<void>(r=>app.server.listen(0,'127.0.0.1',r));const address=app.server.address() as any;const base='http://127.0.0.1:'+address.port;config.publicOrigin=base;
 async function request(path:string,body?:any,cookie='',origin=base,bearer=''){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Origin:origin,...(cookie?{Cookie:cookie}:{}),...(bearer?{Authorization:'Bearer '+bearer}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json() as any,cookie:(r.headers.get('set-cookie')||'').split(';')[0]};}
 try{
 assert.equal((await request('/api/workspace')).status,401);
 assert.equal((await request('/api/auth/login',{username:'x'.repeat(5000),password:'wrong'})).status,413);
 assert.equal((await request('/api/auth/login',{username:'admin',password:'wrong'})).status,401);
 const admin=await request('/api/auth/login',{username:'admin',password:config.adminPassword});assert.equal(admin.status,200);assert.ok(admin.cookie);
 assert.equal((await request('/api/admin/users',{username:'alice',password:'alice-password-long-123'},admin.cookie,'https://evil.test')).status,403);
 assert.equal((await request('/api/admin/users',{username:'alice',password:'alice-password-long-123'},admin.cookie)).status,201);
 const alice=await request('/api/auth/login',{username:'alice',password:'alice-password-long-123'});assert.equal(alice.status,200);
 assert.equal((await request('/api/admin/users',undefined,alice.cookie)).status,403);
 const live=await fetch(base+'/api/events',{headers:{Cookie:admin.cookie}});const reader=live.body!.getReader();assert.ok(new TextDecoder().decode((await reader.read()).value).includes('connected'));
 const raw=JSON.stringify([{uuid:'shared1',name:'Payment',chat_messages:[{sender:'human',text:'payment webhook retry'},{sender:'assistant',text:'Use idempotency key'}]}]);
 assert.equal((await request('/api/workspace',{action:'import',raw,filename:'chat.json',person:'Alice',project:'Payments',confirmed:true},alice.cookie)).status,200);
 assert.ok(new TextDecoder().decode((await reader.read()).value).includes('event: change'));await reader.cancel();
 const library=await request('/api/workspace',undefined,admin.cookie);assert.equal(library.body.conversations.length,1);const id=library.body.conversations[0].id;
 assert.equal((await request('/api/workspace',{action:'ask',question:'payment',project:'wrong'},admin.cookie)).body.citations.length,0);
 const mint=await request('/api/tokens',{action:'create',label:'Alice laptop'},alice.cookie);assert.equal(mint.status,201);assert.ok(mint.body.token);
 const no=await request('/api/workspace',{action:'delete',id},'',base,mint.body.token);assert.equal(no.status,401);
 const ingest=await request('/api/ingest',{raw,filename:'chat.json',project:'Payments'},'',base,mint.body.token);assert.equal(ingest.status,200);
 assert.equal((await request('/api/workspace',undefined,admin.cookie)).body.conversations.length,2);
 await request('/api/tokens',{action:'revoke',id:mint.body.id},alice.cookie);
 assert.equal((await request('/api/ingest',{raw,filename:'chat.json'},'',base,mint.body.token)).status,401);
 assert.equal((await request('/api/workspace',{action:'delete',id},alice.cookie)).status,200);
 assert.equal((await request('/api/workspace',undefined,admin.cookie)).body.conversations.length,1);
 await request('/api/workspace',{action:'import',raw:JSON.stringify([{uuid:'admin-chat',name:'Admin-owned',messages:[{role:'user',text:'shared company data'}]}]),filename:'admin.json',confirmed:true},admin.cookie);
 const shared=await request('/api/workspace',undefined,alice.cookie);const adminChat=shared.body.conversations.find((c:any)=>c.title==='Admin-owned');assert.ok(adminChat);assert.equal((await request('/api/workspace',{action:'delete',id:adminChat.id},alice.cookie)).status,403);
 assert.equal((await request('/api/auth/logout',{},alice.cookie)).status,200);
 assert.equal((await request('/api/workspace',undefined,alice.cookie)).status,401);
 let limited=false;for(let i=0;i<62;i++){const attempt=await request('/api/auth/login',{username:'rotated-'+i,password:'wrong-password'});if(attempt.status===429){limited=true;break;}}assert.ok(limited,'aggregate address limiter blocks username rotation');
 }finally{await new Promise<void>(r=>app.server.close(()=>r()));app.close();rmSync(dir,{recursive:true,force:true});}
});
