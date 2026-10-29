import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {createLocalModel,evidenceWindow} from '../onprem/model.ts';
test('evidence window keeps a match near the end of a long chunk',()=>{const text='x'.repeat(1200)+' payment retry '+ 'y'.repeat(300);assert.ok(evidenceWindow('payment',text).includes('payment retry'));assert.ok(evidenceWindow('payment',text).length<=900);});
test('local model uses native Ollama request and bounds parallel inference',async()=>{
 let release:()=>void=()=>{};const gate=new Promise<void>(r=>release=r);let seen:any;
 const server=createServer(async(req,res)=>{let raw='';for await(const c of req)raw+=c;seen=JSON.parse(raw);await gate;res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({message:{content:'Answer [1]'}}));});
 await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const port=(server.address() as any).port;const model=createLocalModel('http://127.0.0.1:'+port,'qwen3:4b');
 try{const first=model.answer('payment',[{id:'a',title:'Test',person:'A',project:'P',number:1,text:'payment retry'}]);await assert.rejects(model.answer('q',[]),/กำลังตอบ/);release();assert.equal((await first).answer,'Answer [1]');assert.equal(seen.stream,false);assert.equal(seen.model,'qwen3:4b');assert.ok(seen.messages[1].content.includes('payment retry'));}finally{release();await new Promise<void>(r=>server.close(()=>r()));}
});
