import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {collect} from '../scripts/collectors/claude-code.mjs';
test('collector uploads approved Stop transcript and honors disabled mode',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'collector-'));let seen:any,authorization='';const server=createServer(async(req,res)=>{let raw='';for await(const c of req)raw+=c;seen=JSON.parse(raw);authorization=req.headers.authorization||'';res.setHeader('Content-Type','application/json');res.end('{"imported":1}');});await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));
 try{const token='a'.repeat(64),tokenFile=join(dir,'token');writeFileSync(tokenFile,token);const transcript=join(dir,'session.jsonl');writeFileSync(transcript,JSON.stringify({sessionId:'s',type:'user',message:{content:'approved text'}})+'\n');const path=join(dir,'config.json'),config={enabled:true,endpoint:'http://127.0.0.1:'+(server.address() as any).port,tokenFile,projects:[{path:dir,name:'Approved'}],transcriptRoots:[dir],person:'Alice'};writeFileSync(path,JSON.stringify(config));const input={hook_event_name:'Stop',cwd:dir,transcript_path:transcript};assert.equal((await collect(path,input)).imported,1);assert.equal(authorization,'Bearer '+token);assert.equal(seen.project,'Approved');assert.ok(!JSON.stringify(seen).includes(token));writeFileSync(path,JSON.stringify({...config,enabled:false}));assert.equal((await collect(path,input)).skipped,'disabled');}finally{await new Promise<void>(r=>server.close(()=>r()));rmSync(dir,{recursive:true,force:true});}
});
