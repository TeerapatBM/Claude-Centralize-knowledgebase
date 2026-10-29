import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerCloud, type CloudRequest } from '../lib/cloud-models.ts';
import { MODEL_CATALOG } from '../lib/model-catalog.ts';

const request = (provider: CloudRequest['provider']): CloudRequest => ({provider,model:MODEL_CATALOG.find(m=>m.provider===provider)!.id,apiKey:'secret-key',question:'What happened?',evidence:[{id:'a',text:'Evidence',title:'Title',person:'A',project:'P',number:1}]});
const fixtures = {
 openai:{output:[{type:'reasoning',summary:[]},{type:'message',content:[{type:'output_text',text:'Answer [1]'}]}]},
 anthropic:{content:[{type:'thinking',thinking:'hidden'},{type:'text',text:'Answer [1]'}]},
 google:{candidates:[{content:{parts:[{thought:true,text:'hidden'},{text:'Answer [1]'}]}}]},
 groq:{choices:[{message:{content:'Answer [1]'}}]},deepseek:{choices:[{message:{content:'Answer [1]'}}]},xai:{choices:[{message:{content:'Answer [1]'}}]},
};
const endpoints = {openai:'https://api.openai.com/v1/responses',anthropic:'https://api.anthropic.com/v1/messages',google:'https://generativelanguage.googleapis.com/v1beta/models/gemini-4-argon:generateContent',groq:'https://api.groq.com/openai/v1/chat/completions',deepseek:'https://api.deepseek.com/chat/completions',xai:'https://api.x.ai/v1/chat/completions'};
for (const provider of Object.keys(fixtures) as (keyof typeof fixtures)[]) {
 test(`${provider}: fixed endpoint, authentication, schema and answer parsing`,async()=>{
  const mock:typeof fetch=async(url,init)=>{
   assert.equal(url,endpoints[provider]); assert.equal(init?.redirect,'error'); assert.ok(init?.signal);
   const headers=init?.headers as Record<string,string>; const body=JSON.parse(init?.body as string);
   assert.equal(headers[provider==='google'?'x-goog-api-key':provider==='anthropic'?'x-api-key':'Authorization'],provider==='google'||provider==='anthropic'?'secret-key':'Bearer secret-key');
   assert.ok(!String(url).includes('secret-key')); assert.ok(!JSON.stringify(body).includes('secret-key'));
   if(provider==='openai'){assert.equal(body.store,false);assert.ok(body.instructions.includes('untrusted'));assert.equal(body.input.at(-1).role,'user');}
   else if(provider==='anthropic'){assert.equal(body.max_tokens,4096);assert.equal(headers['anthropic-version'],'2023-06-01');}
   else if(provider==='google'){assert.ok(body.systemInstruction);assert.ok(body.contents[0].parts[0].text.includes('companyEvidence'));}
   else assert.equal(body.messages[0].role,'system');
   return Response.json(fixtures[provider]);
  };
  assert.deepEqual(await answerCloud(request(provider),mock),{answer:'Answer [1]',model:request(provider).model,provider});
 });
 test(`${provider}: empty and malformed responses fail`,async()=>{
  await assert.rejects(answerCloud(request(provider),async()=>Response.json({})),/no answer/);
  await assert.rejects(answerCloud(request(provider),async()=>new Response('{')),/invalid response/);
 });
}
test('validates provider, model and key before making requests',async()=>{
 const never:typeof fetch=async()=>{throw new Error('should not call');};
 await assert.rejects(answerCloud({...request('openai'),provider:'unknown' as CloudRequest['provider']},never),/Unsupported cloud provider/);
 await assert.rejects(answerCloud({...request('openai'),model:'https://evil.test'},never),/Unsupported model/);
 await assert.rejects(answerCloud({...request('openai'),apiKey:''},never),/API key/);
 await assert.rejects(answerCloud({...request('openai'),apiKey:'a\nb'},never),/API key/);
});
test('HTTP bodies and transport exceptions never leak keys',async()=>{
 for(const status of [400,401,403,404,429,500]) await assert.rejects(answerCloud(request('openai'),async()=>new Response('secret-key remote private body',{status})),error=>error instanceof Error&&!error.message.includes('secret-key')&&!error.message.includes('private'));
 await assert.rejects(answerCloud(request('google'),async()=>{throw new Error('secret-key');}),/Could not connect to the provider/);
});
test('bounds history and evidence and labels citation scope',async()=>{
 await answerCloud({...request('openai'),history:Array.from({length:20},()=>({role:'user',content:'x'.repeat(7000)})),evidence:Array.from({length:20},(_,i)=>({...request('openai').evidence[0],number:i+1,text:'x'.repeat(6000)}))},async(_url,init)=>{
  const body=JSON.parse(init?.body as string);assert.equal(body.input.length,9);assert.equal(body.input[0].content.length,6000);
  const content=JSON.parse(body.input.at(-1).content);assert.equal(content.companyEvidence.length,8);assert.equal(content.companyEvidence[0].text.length,5000);assert.ok(body.instructions.includes('1, 2, 3, 4, 5, 6, 7, 8'));
  return Response.json(fixtures.openai);
 });
});
