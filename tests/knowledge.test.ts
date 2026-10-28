import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseImport, rankChunks, authorize } from '../lib/knowledge.ts';
test('Claude export retains speaker, project and user', () => {
 const r=parseImport(JSON.stringify([{uuid:'c1',name:'Deployment',account:{email_address:'a@team.test'},project_uuid:'p1',chat_messages:[{sender:'human',text:'deploy API'},{sender:'assistant',content:[{type:'text',text:'Use staging'}]}]}]),'export.json',{});
 assert.equal(r.length,1); assert.equal(r[0].person,'a@team.test'); assert.equal(r[0].project,'p1'); assert.equal(r[0].messages[1].text,'Use staging');
});
test('Code JSONL splits sessions and captures numeric usage',()=>{
 const raw=[{sessionId:'s1',type:'user',message:{content:'fix login'}},{sessionId:'s1',type:'assistant',message:{content:[{type:'text',text:'fixed'}],usage:{input_tokens:12,output_tokens:8}}},{sessionId:'s2',type:'user',message:{content:'write docs'}}].map(x=>JSON.stringify(x)).join('\n');
 const r=parseImport(raw,'code.jsonl',{person:'Dev',project:'App'}); assert.equal(r.length,2);assert.equal(r[0].tokens,20);assert.equal(r[0].source,'code');
});
test('repeat imports have stable ids; different people do not collide',()=>{
 const raw='User: hello\nAssistant: hi';const a=parseImport(raw,'chat.txt',{person:'A'});assert.equal(a[0].sourceId,parseImport(raw,'chat.txt',{person:'A'})[0].sourceId);assert.notEqual(a[0].sourceId,parseImport(raw,'chat.txt',{person:'B'})[0].sourceId);
});
test('rejects unknown and malformed structured files',()=>{assert.throws(()=>parseImport('{','x.json',{}));assert.throws(()=>parseImport('{"no":"chat"}','x.json',{}));});
test('ranks Thai content and excludes unrelated excerpts',()=>{
 const rows=[{text:'à¸§à¸²à¸‡à¹à¸œà¸™à¸£à¸°à¸šà¸šà¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™ à¸£à¸­à¸‡à¸£à¸±à¸šà¹‚à¸­à¸™à¹€à¸‡à¸´à¸™',id:'a'},{text:'à¹€à¸¥à¸·à¸­à¸à¸ªà¸µà¹‚à¸¥à¹‚à¸à¹‰',id:'b'}];assert.equal(rankChunks('à¸£à¸°à¸šà¸šà¸Šà¸³à¸£à¸°à¹€à¸‡à¸´à¸™',rows)[0].id,'a');assert.equal(rankChunks('kubernetes',rows).length,0);
});
test('authorization rejects anonymous and cross-origin mutation',()=>{
 assert.throws(()=>authorize(null,'https://evil.test','https://good.test',true));assert.throws(()=>authorize('a','https://evil.test','https://good.test',true));assert.equal(authorize('a','https://good.test','https://good.test',true),'a');
});
test('id-less conversations remain distinct and stable when export changes',()=>{
 const a={name:'One',messages:[{role:'user',text:'alpha'}]},b={name:'Two',messages:[{role:'user',text:'beta'}]};
 const first=parseImport(JSON.stringify([a,b]),'export.json',{person:'A'});
 assert.notEqual(first[0].sourceId,first[1].sourceId);
 assert.equal(first[0].sourceId,parseImport(JSON.stringify([a]),'export.json',{person:'A'})[0].sourceId);
});

