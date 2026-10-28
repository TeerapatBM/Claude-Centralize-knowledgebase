export type Message = {role:string; text:string};
export type Conversation = {sourceId:string; title:string; person:string; project:string; source:string; messages:Message[]; tokens:number; date:string; category:string};
type Options = {person?:string; project?:string};
const str=(v:unknown,f='')=>typeof v==='string'?v:f;
const content=(v:any):string=>typeof v==='string'?v:Array.isArray(v)?v.filter(x=>x?.type==='text').map(x=>str(x.text)).join('\n'):'';
function hash(v:string){let a=2166136261;for(const c of v){a^=c.charCodeAt(0);a=Math.imul(a,16777619);}return (a>>>0).toString(16);}
export function category(text:string){return /code|api|bug|deploy|à¸£à¸°à¸šà¸š|à¸žà¸±à¸’à¸™à¸²|à¹‚à¸„à¹‰à¸”/i.test(text)?'Engineering':/campaign|marketing|à¸•à¸¥à¸²à¸”|à¸„à¸­à¸™à¹€à¸—à¸™à¸•à¹Œ/i.test(text)?'Marketing':/design|ux|à¸­à¸­à¸à¹à¸šà¸š/i.test(text)?'Design':/sales|à¸¥à¸¹à¸à¸„à¹‰à¸²|à¸‚à¸²à¸¢/i.test(text)?'Sales':'General';}
export function parseImport(raw:string, filename:string, options:Options):Conversation[]{
 if(new TextEncoder().encode(raw).length>5*1024*1024)throw new Error('à¹„à¸Ÿà¸¥à¹Œà¹€à¸à¸´à¸™ 5 MB à¸à¸£à¸¸à¸“à¸²à¹à¸šà¹ˆà¸‡à¹„à¸Ÿà¸¥à¹Œà¸à¹ˆà¸­à¸™à¸™à¸³à¹€à¸‚à¹‰à¸²');
 if(!raw.trim())throw new Error('à¹„à¸Ÿà¸¥à¹Œà¹„à¸¡à¹ˆà¸¡à¸µà¹€à¸™à¸·à¹‰à¸­à¸«à¸²');
 let items:any[]=[];let code=false;
 if(/\.jsonl$/i.test(filename)){
  code=true;const groups=new Map<string,any[]>();
  for(const line of raw.split(/\r?\n/).filter(x=>x.trim())){let row;try{row=JSON.parse(line);}catch{throw new Error('JSONL à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡ à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¸§à¹ˆà¸²à¸—à¸¸à¸à¸šà¸£à¸£à¸—à¸±à¸”à¹€à¸›à¹‡à¸™ JSON');}if(!row?.message||!['user','assistant'].includes(row.type))continue;const sid=str(row.sessionId,filename);groups.set(sid,[...(groups.get(sid)||[]),row]);}
  items=[...groups].map(([id,rows])=>({uuid:id,name:content(rows[0].message.content).slice(0,90)||filename,chat_messages:rows.map(r=>({...r.message,sender:r.type})),created_at:rows[0].timestamp}));
 }else if(/\.json$/i.test(filename)){
  let data;try{data=JSON.parse(raw);}catch{throw new Error('JSON à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡ à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¹„à¸Ÿà¸¥à¹Œà¸—à¸µà¹ˆà¹à¸•à¸à¸ˆà¸²à¸ export');}
  items=Array.isArray(data)?data:Array.isArray(data?.conversations)?data.conversations:Array.isArray(data?.chats)?data.chats:data?.chat_messages||data?.messages?[data]:[];
 }else if(/\.(txt|md)$/i.test(filename)){items=[{name:filename,chat_messages:[{sender:'document',text:raw}]}];}
 else throw new Error('à¸£à¸­à¸‡à¸£à¸±à¸š JSON, JSONL, TXT à¹à¸¥à¸° Markdown à¸à¸£à¸¸à¸“à¸²à¹à¸•à¸ ZIP à¸à¹ˆà¸­à¸™');
 if(items.length>200)throw new Error('à¸£à¸­à¸‡à¸£à¸±à¸šà¸„à¸£à¸±à¹‰à¸‡à¸¥à¸° 200 à¸šà¸—à¸ªà¸™à¸—à¸™à¸² à¸à¸£à¸¸à¸“à¸²à¹à¸šà¹ˆà¸‡ export à¹€à¸›à¹‡à¸™à¹„à¸Ÿà¸¥à¹Œà¸¢à¹ˆà¸­à¸¢');
 const result=items.map(item=>{
  if(!item||typeof item!=='object')return null;
  const rows=item.chat_messages||item.messages;if(!Array.isArray(rows))return null;
  const messages:Message[]=rows.map((m:any)=>({role:str(m.sender||m.role,'unknown'),text:str(m.text)||content(m.content)})).filter((m:Message)=>m.text.trim());
  if(!messages.length)return null;
  if(messages.reduce((n,m)=>n+m.text.length,0)>250000)throw new Error('à¸šà¸—à¸ªà¸™à¸—à¸™à¸²à¸¢à¸²à¸§à¹€à¸à¸´à¸™ 250,000 à¸•à¸±à¸§à¸­à¸±à¸à¸©à¸£ à¸à¸£à¸¸à¸“à¸²à¹à¸šà¹ˆà¸‡à¹€à¸›à¹‡à¸™à¸ªà¹ˆà¸§à¸™');
  const person=str(item.account?.email_address)||str(item.user?.email)||str(item.user?.email_address)||str(item.account?.uuid)||str(item.user_uuid)||options.person?.trim()||'à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¹€à¸ˆà¹‰à¸²à¸‚à¸­à¸‡';
  const project=str(item.project?.name)||str(item.project_name)||str(item.project_uuid)||options.project?.trim()||'Unassigned';
  const title=str(item.name)||str(item.title)||filename;
  const source=code?'code':project!=='Unassigned'?'project':'chat';
  const sourceId=`${source}:${person}:${str(item.uuid||item.id)||hash(JSON.stringify({title,messages,date:item.created_at||null}))}`;
  const tokens=rows.reduce((sum:number,m:any)=>sum+['input_tokens','output_tokens','cache_read_input_tokens','cache_creation_input_tokens'].reduce((n,k)=>n+(Number.isFinite(m.usage?.[k])&&m.usage[k]>=0?m.usage[k]:0),0),0);
  return {sourceId,title:title.slice(0,200),person:person.slice(0,200),project:project.slice(0,200),source,messages,tokens,date:str(item.created_at),category:category(title+' '+messages.slice(0,2).map(m=>m.text).join(' '))};
 }).filter(Boolean) as Conversation[];
 if(!result.length)throw new Error('à¹„à¸¡à¹ˆà¸žà¸šà¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸—à¸µà¹ˆà¸£à¸­à¸‡à¸£à¸±à¸š à¸•à¹‰à¸­à¸‡à¸¡à¸µ chat_messages / messages à¸«à¸£à¸·à¸­ Claude Code JSONL');
 return result;
}
export function chunksOf(c:Conversation){return c.messages.flatMap(m=>{const a:string[]=[];for(let i=0;i<m.text.length;i+=1400)a.push(`${m.role}: ${m.text.slice(i,i+1600)}`);return a;});}
export function rankChunks<T extends {text:string}>(query:string,rows:T[]):T[]{
 const seg=new Intl.Segmenter('th',{granularity:'word'});
 const terms=[...new Set([...seg.segment(query.toLowerCase())].filter(x=>x.isWordLike).map(x=>x.segment).filter(x=>x.length>1&&!['the','and','what','à¸ˆà¸²à¸','à¸‚à¸­à¸‡','à¹à¸¥à¸°','à¸­à¸°à¹„à¸£','à¸Šà¹ˆà¸§à¸¢','à¸ªà¸£à¸¸à¸›','à¹ƒà¸«à¹‰','à¸¡à¸µ'].includes(x)))];
 return rows.map(row=>({row,score:terms.reduce((n,t)=>n+(row.text.toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,12).map(x=>x.row);
}
export function authorize(user:string|null,origin:string|null,expected:string,mutation:boolean){
 if(!user)throw new Error('UNAUTHORIZED');if(mutation&&origin!==expected)throw new Error('FORBIDDEN');return user;
}

