import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifyTurnstile} from '../onprem/turnstile.ts';
import {createApplication} from '../onprem/server.ts';
import {mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
test('Turnstile requires valid token, exact hostname and login action; fails closed',async()=>{
 const reply=(data:object)=>(async()=>new Response(JSON.stringify(data))) as typeof fetch;
 assert.equal(await verifyTurnstile('', 'secret','cks.sysplatsec.dev',reply({success:true})),false);
 assert.equal(await verifyTurnstile('token','secret','cks.sysplatsec.dev',reply({success:true,hostname:'cks.sysplatsec.dev',action:'login'})),true);
 for(const data of [{success:false},{success:true,hostname:'evil.example',action:'login'},{success:true,hostname:'cks.sysplatsec.dev',action:'other'}])assert.equal(await verifyTurnstile('token','secret','cks.sysplatsec.dev',reply(data)),false);
 assert.equal(await verifyTurnstile('token','secret','cks.sysplatsec.dev',(async()=>{throw Error('offline');}) as typeof fetch),false);
});
test('configured login rejects a direct POST without challenge and never exposes secret',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'commons-turnstile-'));
 const config={dataDir:dir,publicOrigin:'http://127.0.0.1',adminUser:'admin',adminPassword:'test-password-long-123',secureCookies:false,model:'test',ollamaUrl:'http://127.0.0.1:1',turnstileSiteKey:'public-site-key',turnstileSecret:'private-secret'};
 assert.throws(()=>createApplication({...config,turnstileSecret:''}),/both Turnstile/);
 const app=createApplication(config);await new Promise<void>(r=>app.server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+(app.server.address() as any).port;config.publicOrigin=base;
 try{
  const runtime=await (await fetch(base+'/api/runtime')).json() as any;
  assert.equal(runtime.turnstileSiteKey,'public-site-key');assert.equal(JSON.stringify(runtime).includes('private-secret'),false);
  const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:config.adminPassword})});
  assert.equal(r.status,403);assert.equal(r.headers.get('set-cookie'),null);
  assert.equal((await fetch(base+'/api/workspace')).status,401);
 }finally{await new Promise<void>(r=>app.server.close(()=>r()));app.close();rmSync(dir,{recursive:true,force:true});}
});
