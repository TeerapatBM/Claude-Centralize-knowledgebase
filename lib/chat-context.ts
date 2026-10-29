import {rankChunks} from './knowledge.ts';
export type ChatAttachment={id:string;name:string;text:string;kind:'document'|'link';url?:string};
export type ChatCitation={id:string;title:string;text:string;person:string;project:string;number:number;kind?:'document'|'link';url?:string};
export function chatAttachments(value:unknown):ChatAttachment[]{
 if(value===undefined)return [];
 if(!Array.isArray(value)||value.length>5)throw Error('Attach at most 5 documents or links.');
 let total=0;return value.map((v:any)=>{if(!v||typeof v.name!=='string'||!v.name.trim()||v.name.length>180||typeof v.text!=='string'||!v.text.trim()||v.text.length>80000||!['document','link'].includes(v.kind))throw Error('Invalid attachment or document is too large.');total+=v.text.length;if(total>200000)throw Error('Combined documents exceed 200,000 characters.');let url:string|undefined;if(v.kind==='link'){try{const parsed=new URL(v.url);if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw Error();url=parsed.href;}catch{throw Error('Links must use HTTPS.');}}return {id:'attachment:'+crypto.randomUUID(),name:v.name,text:v.text,kind:v.kind,url};});
}
export function chatHistory(value:unknown){if(value===undefined)return [];if(!Array.isArray(value)||value.length>8)throw Error('Invalid chat history.');return value.map((v:any)=>{if(!['user','assistant'].includes(v?.role)||typeof v.content!=='string'||v.content.length>6000)throw Error('Invalid chat message.');return {role:v.role as 'user'|'assistant',content:v.content.slice(0,1600)};});}
function excerpt(question:string,text:string){
 if(text.length<=2200)return text;
 const chunks=[];for(let start=0;start<text.length;start+=1000)chunks.push({text:text.slice(start,start+1200)});
 const best=rankChunks(question,chunks)[0]?.text;
 return (best||text.slice(900,2100))+'\n[Excerpt; not the entire document]\n'+text.slice(0,900);
}
export function chatCitations(question:string,workspace:Omit<ChatCitation,'number'>[],attachments:ChatAttachment[],limit=8):ChatCitation[]{
 const docs=attachments.map(a=>({id:a.id,title:a.name,text:excerpt(question,a.text),person:'Attached in this chat',project:'Current chat',kind:a.kind,url:a.url}));
 return [...docs,...workspace.map(c=>({...c,text:excerpt(question,c.text)}))].slice(0,limit).map((c,i)=>({...c,number:i+1,text:c.text.slice(0,2200)}));
}
