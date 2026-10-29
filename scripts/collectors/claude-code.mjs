import {readFile,realpath,stat} from 'node:fs/promises';
import {homedir} from 'node:os';
import {resolve,dirname,relative,isAbsolute,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
export function within(root,path){const r=relative(root,path);return r===''||(!r.startsWith('..')&&!isAbsolute(r));}
export async function collect(configPath,input,manual=false){
 const configFile=await realpath(configPath),config=JSON.parse(await readFile(configFile,'utf8'));if(config.enabled!==true)return {skipped:'disabled'};
 if(!manual&&input.hook_event_name!=='Stop')return {skipped:'not-stop'};if(input.stop_hook_active===true)return {skipped:'hook-continuation'};
 const endpoint=new URL(config.endpoint);if(endpoint.protocol!=='https:'&&!(endpoint.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(endpoint.hostname)))throw Error('Collector requires HTTPS except loopback');if(endpoint.username||endpoint.password||endpoint.search||endpoint.hash)throw Error('Invalid endpoint');
 const cwd=await realpath(String(input.cwd||''));const projects=await Promise.all((config.projects||[]).map(async p=>({...p,path:await realpath(resolve(dirname(configFile),p.path))})));const project=projects.find(p=>within(p.path,cwd));if(!project)return {skipped:'project-not-approved'};
 const transcript=await realpath(String(input.transcript_path||''));const roots=await Promise.all((config.transcriptRoots||[resolve(homedir(),'.claude','projects')]).map(p=>realpath(resolve(dirname(configFile),p))));if(!roots.some(root=>within(root,transcript))||extname(transcript)!=='.jsonl')throw Error('Transcript is outside approved transcript roots');
 const info=await stat(transcript);if(info.size>5*1024*1024)throw Error('Transcript exceeds 5 MB; split/import manually');const raw=await readFile(transcript,'utf8');if(!raw.trim())return {skipped:'empty'};
 const token=(await readFile(resolve(dirname(configFile),config.tokenFile),'utf8')).trim();if(!/^[a-f0-9]{64}$/.test(token))throw Error('Invalid ingestion token file');
 const r=await fetch(new URL('/api/ingest',endpoint),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({raw,filename:'session.jsonl',project:project.name||'Unassigned',person:String(config.person||'')}),signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Upload failed with HTTP '+r.status+'; retry next Stop or run manually');return await r.json();
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),value=flag=>{const i=args.indexOf(flag);return i>=0?args[i+1]:undefined;},manual=args.includes('--file');
 try{const config=value('--config');if(!config)throw Error('Provide --config path');let input;if(manual){input={transcript_path:value('--file'),cwd:value('--project')};if(!input.cwd)throw Error('Manual mode needs --project approved-directory');}else{let raw='';for await(const c of process.stdin){raw+=c;if(Buffer.byteLength(raw)>128*1024)throw Error('Hook input too large');}input=JSON.parse(raw);}
 const result=await collect(config,input,manual);if(manual)process.stdout.write(JSON.stringify(result)+'\n');
 }catch(e){process.stderr.write('Commons collector: '+e.message+'\n');if(manual)process.exitCode=1;}
}
