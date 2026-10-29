import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApplication} from '../onprem/server.ts';
test('static routes distinguish SPA navigation, missing assets and fonts',async()=>{const dir=mkdtempSync(join(tmpdir(),'commons-static-'));mkdirSync(join(dir,'web','fonts'),{recursive:true});writeFileSync(join(dir,'web','index.html'),'<main>Commons</main>');writeFileSync(join(dir,'web','fonts','test.ttf'),'fixture');const config={dataDir:join(dir,'data'),staticDir:join(dir,'web'),publicOrigin:'http://localhost',adminUser:'admin',adminPassword:'synthetic-test-password',secureCookies:false,model:'qwen3:4b',ollamaUrl:'http://127.0.0.1:1'};const app=createApplication(config);await new Promise<void>(r=>app.server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+(app.server.address() as any).port;try{assert.equal((await fetch(base+'/settings')).status,200);assert.equal((await fetch(base+'/missing.js')).status,404);assert.equal((await fetch(base+'/fonts/test.ttf')).headers.get('content-type'),'font/ttf');}finally{await new Promise<void>(r=>app.server.close(()=>r()));app.close();rmSync(dir,{recursive:true,force:true});}});
