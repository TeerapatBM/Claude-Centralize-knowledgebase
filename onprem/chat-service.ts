import type {DatabaseSync} from 'node:sqlite';
import {rankChunks} from '../lib/knowledge.ts';
import {chatAttachments,chatHistory,chatCitations,type ChatCitation} from '../lib/chat-context.ts';
import {MODEL_CATALOG,type ProviderId} from '../lib/model-catalog.ts';
import {answerCloud} from '../lib/cloud-models.ts';
import {createLocalModel,EVIDENCE_LIMIT} from './model.ts';
export function createChatService(db:DatabaseSync,config:{ollamaUrl:string;model:string}){
 const local=new Map<string,ReturnType<typeof createLocalModel>>();let active=false;
 async function installed(){try{const r=await fetch(new URL('/api/tags',config.ollamaUrl),{signal:AbortSignal.timeout(3000)});if(!r.ok)return [];const data:any=await r.json();return Array.isArray(data.models)?data.models.map((m:any)=>m.name).filter((s:any)=>typeof s==='string'):[];}catch{return [];}}
 return {
  async catalog(){const names=await installed();const models=MODEL_CATALOG.map(m=>({...m,...(m.provider==='ollama'?{installed:names.includes(m.id)}:{})}));for(const id of new Set<string>([config.model,...names]))if(!models.some(m=>m.provider==='ollama'&&m.id===id))models.push({provider:'ollama',id,label:id,description:{th:'โมเดลที่ติดตั้งบนเซิร์ฟเวอร์บริษัท',en:'Model installed on the company server'},cost:'local',installed:names.includes(id)});return {models,defaultProvider:'ollama',defaultModel:config.model};},
  async ask(b:any){
   if(typeof b.question!=='string'||!b.question.trim()||b.question.length>12000)throw Error('A question is required (maximum 12,000 characters).');
   const provider:ProviderId=b.provider||'ollama',model=typeof b.model==='string'&&b.model?b.model:config.model;
   if(!['ollama','openai','anthropic','google','groq','deepseek','xai'].includes(provider))throw Error('Unsupported provider.');
   if(provider!=='ollama'&&b.cloudConfirmed!==true)throw Object.assign(Error('Confirm sending chat, attachments and evidence to the selected cloud provider.'),{status:403});
   const attachments=chatAttachments(b.attachments),history=chatHistory(b.history);const where=['1=1'],args:string[]=[];
   for(const key of ['project','person'])if(b[key]){if(typeof b[key]!=='string'||b[key].length>300)throw Error('Invalid scope.');where.push('c.'+key+'=?');args.push(b[key]);}
   const rows=db.prepare(`SELECT k.text,c.id,c.title,c.person,c.project FROM chunks k JOIN conversations c ON c.id=k.conversation_id WHERE ${where.join(' AND ')} ORDER BY c.imported_at DESC LIMIT 6000`).all(...args) as unknown as Omit<ChatCitation,'number'>[];
   const workspaceLimit=Math.min(EVIDENCE_LIMIT,8-attachments.length);
   let citations=chatCitations(b.question,rankChunks(b.question,rows).slice(0,workspaceLimit),attachments,8);
   if(provider==='ollama'){if(b.question.length>4000)throw Error('Local CPU chat accepts questions up to 4,000 characters.');const budget=Math.min(2200,Math.floor(6000/Math.max(1,citations.length)));citations=citations.map(c=>({...c,text:c.text.slice(0,budget)}));}
   if(active)throw Object.assign(Error('AI is answering another request. Please try again shortly.'),{status:429});
   active=true;try{
    let answer;
    if(provider==='ollama'){
     if(model!==config.model&&!(await installed()).includes(model))throw Error('This Ollama model is not installed. Ask an administrator to install it first.');
     if(!local.has(model))local.set(model,createLocalModel(config.ollamaUrl,model));
     answer={...await local.get(model)!.answer(b.question,citations,{history:history.slice(-4).map(h=>({...h,content:h.content.slice(0,500)})),language:b.language==='en'?'en':'th',evidenceLimit:8}),provider};
    }else answer=await answerCloud({provider,model,apiKey:typeof b.apiKey==='string'?b.apiKey:'',question:b.question,evidence:citations,history,language:b.language==='en'?'en':'th'});
    return {mode:'ai',...answer,citations};
   }finally{active=false;}
  }
 };
}
