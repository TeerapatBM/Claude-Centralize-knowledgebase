import {getChatGPTUser} from '../../chatgpt-auth';
import {MODEL_CATALOG} from '../../../lib/model-catalog';
export const dynamic='force-dynamic';
export async function GET(){const user=await getChatGPTUser();if(!user?.userId)return Response.json({error:'Sign in first.'},{status:401});return Response.json({models:MODEL_CATALOG.map(m=>({...m,...(m.provider==='ollama'?{installed:false}:{})})),defaultProvider:'anthropic',defaultModel:'claude-sonnet-5-5'},{headers:{'Cache-Control':'no-store'}});}
