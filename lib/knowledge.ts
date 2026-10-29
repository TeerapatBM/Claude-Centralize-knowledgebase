export type Message = {role:string; text:string};
export type Conversation = {sourceId:string; title:string; person:string; project:string; source:string; messages:Message[]; tokens:number; date:string; category:string};
type Options = {person?:string; project?:string};
const str=(v:unknown,f='')=>typeof v==='string'?v:f;
const content=(v:any):string=>typeof v==='string'?v:Array.isArray(v)?v.filter(x=>x?.type==='text').map(x=>str(x.text)).join('\n'):'';
function hash(v:string){let a=2166136261;for(const c of v){a^=c.charCodeAt(0);a=Math.imul(a,16777619);}return (a>>>0).toString(16);}
export function category(text:string){return /code|api|bug|deploy|ระบบ|พัฒนา|โค้ด/i.test(text)?'Engineering':/campaign|marketing|ตลาด|คอนเทนต์/i.test(text)?'Marketing':/design|ux|ออกแบบ/i.test(text)?'Design':/sales|ลูกค้า|ขาย/i.test(text)?'Sales':'General';}
export function parseImport(raw:string, filename:string, options:Options):Conversation[]{
 if(new TextEncoder().encode(raw).length>5*1024*1024)throw new Error('ไฟล์เกิน 5 MB กรุณาแบ่งไฟล์ก่อนนำเข้า');
 if(!raw.trim())throw new Error('ไฟล์ไม่มีเนื้อหา');
 let items:any[]=[];let code=false;
 if(/\.jsonl$/i.test(filename)){
  code=true;const groups=new Map<string,any[]>();
  for(const line of raw.split(/\r?\n/).filter(x=>x.trim())){let row;try{row=JSON.parse(line);}catch{throw new Error('JSONL ไม่ถูกต้อง ตรวจสอบว่าทุกบรรทัดเป็น JSON');}if(!row?.message||!['user','assistant'].includes(row.type))continue;const sid=str(row.sessionId,filename);groups.set(sid,[...(groups.get(sid)||[]),row]);}
  items=[...groups].map(([id,rows])=>({uuid:id,name:content(rows[0].message.content).slice(0,90)||filename,chat_messages:rows.map(r=>({...r.message,sender:r.type})),created_at:rows[0].timestamp}));
 }else if(/\.json$/i.test(filename)){
  let data;try{data=JSON.parse(raw);}catch{throw new Error('JSON ไม่ถูกต้อง กรุณาเลือกไฟล์ที่แตกจาก export');}
  items=Array.isArray(data)?data:Array.isArray(data?.conversations)?data.conversations:Array.isArray(data?.chats)?data.chats:data?.chat_messages||data?.messages?[data]:[];
 }else if(/\.(txt|md)$/i.test(filename)){items=[{name:filename,chat_messages:[{sender:'document',text:raw}]}];}
 else throw new Error('รองรับ JSON, JSONL, TXT และ Markdown กรุณาแตก ZIP ก่อน');
 if(items.length>200)throw new Error('รองรับครั้งละ 200 บทสนทนา กรุณาแบ่ง export เป็นไฟล์ย่อย');
 const result=items.map(item=>{
  if(!item||typeof item!=='object')return null;
  const rows=item.chat_messages||item.messages;if(!Array.isArray(rows))return null;
  const messages:Message[]=rows.map((m:any)=>({role:str(m.sender||m.role,'unknown'),text:str(m.text)||content(m.content)})).filter((m:Message)=>m.text.trim());
  if(!messages.length)return null;
  if(messages.reduce((n,m)=>n+m.text.length,0)>250000)throw new Error('บทสนทนายาวเกิน 250,000 ตัวอักษร กรุณาแบ่งเป็นส่วน');
  const person=str(item.account?.email_address)||str(item.user?.email)||str(item.user?.email_address)||str(item.account?.uuid)||str(item.user_uuid)||options.person?.trim()||'ไม่ระบุเจ้าของ';
  const project=str(item.project?.name)||str(item.project_name)||str(item.project_uuid)||options.project?.trim()||'Unassigned';
  const title=str(item.name)||str(item.title)||filename;
  const source=code?'code':project!=='Unassigned'?'project':'chat';
  const sourceId=`${source}:${person}:${str(item.uuid||item.id)||hash(JSON.stringify({title,messages,date:item.created_at||null}))}`;
  const tokens=rows.reduce((sum:number,m:any)=>sum+['input_tokens','output_tokens','cache_read_input_tokens','cache_creation_input_tokens'].reduce((n,k)=>n+(Number.isFinite(m.usage?.[k])&&m.usage[k]>=0?m.usage[k]:0),0),0);
  return {sourceId,title:title.slice(0,200),person:person.slice(0,200),project:project.slice(0,200),source,messages,tokens,date:str(item.created_at),category:category(title+' '+messages.slice(0,2).map(m=>m.text).join(' '))};
 }).filter(Boolean) as Conversation[];
 if(!result.length)throw new Error('ไม่พบข้อความที่รองรับ ต้องมี chat_messages / messages หรือ Claude Code JSONL');
 return result;
}
export function chunksOf(c:Conversation){return c.messages.flatMap(m=>{const a:string[]=[];for(let i=0;i<m.text.length;i+=1400)a.push(`${m.role}: ${m.text.slice(i,i+1600)}`);return a;});}
export function rankChunks<T extends {text:string}>(query:string,rows:T[]):T[]{
 const seg=new Intl.Segmenter('th',{granularity:'word'});
 const terms=[...new Set([...seg.segment(query.toLowerCase())].filter(x=>x.isWordLike).map(x=>x.segment).filter(x=>x.length>1&&!['the','and','what','จาก','ของ','และ','อะไร','ช่วย','สรุป','ให้','มี'].includes(x)))];
 return rows.map(row=>({row,score:terms.reduce((n,t)=>n+(row.text.toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,12).map(x=>x.row);
}
export function authorize(user:string|null,origin:string|null,expected:string,mutation:boolean){
 if(!user)throw new Error('UNAUTHORIZED');if(mutation&&origin!==expected)throw new Error('FORBIDDEN');return user;
}

