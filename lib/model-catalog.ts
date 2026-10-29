export type ProviderId = 'ollama' | 'openai' | 'anthropic' | 'google' | 'groq' | 'deepseek' | 'xai';
export type Localized = { th: string; en: string };
export type ModelEntry = { provider: ProviderId; id: string; label: string; description: Localized; cost: 'local' | 'free-tier' | 'paid'; cpu?: Localized };
const paid = { th: 'API มีค่าใช้จ่ายแยกจากแอปแชต ตรวจสอบสิทธิ์และโควตาบัญชี', en: 'API billing is separate from chat subscriptions; account access and limits vary.' };
export const PROVIDERS: { id: ProviderId; label: string; docs: string; keyUrl: string; freeNote: Localized }[] = [
 { id: 'ollama', label: 'Ollama · Local', docs: 'https://docs.ollama.com', keyUrl: 'https://ollama.com/download', freeNote: { th: 'ทำงานในเครื่อง ไม่ต้องใช้ API key หรือจ่ายค่าโทเคน', en: 'Runs locally; no API key or token charges.' } },
 { id: 'openai', label: 'OpenAI', docs: 'https://developers.openai.com/api/docs/models', keyUrl: 'https://platform.openai.com/api-keys', freeNote: paid },
 { id: 'anthropic', label: 'Anthropic', docs: 'https://platform.claude.com/docs/en/about-claude/models/overview', keyUrl: 'https://platform.claude.com/settings/keys', freeNote: paid },
 { id: 'google', label: 'Google Gemini', docs: 'https://ai.google.dev/gemini-api/docs/models', keyUrl: 'https://aistudio.google.com/apikey', freeNote: { th: 'บางรุ่นมี Free tier ตามประเทศและโควตา ข้อมูล Free tier อาจใช้พัฒนาผลิตภัณฑ์', en: 'Selected models offer a limited free tier, subject to region and quota. Free-tier data may improve Google products.' } },
 { id: 'groq', label: 'Groq', docs: 'https://console.groq.com/docs/models', keyUrl: 'https://console.groq.com/keys', freeNote: { th: 'ตรวจสอบ Free plan และโควตาในบัญชี บางรุ่นเป็น Enterprise', en: 'Check account free-plan eligibility and quotas; some models require Enterprise access.' } },
 { id: 'deepseek', label: 'DeepSeek', docs: 'https://api-docs.deepseek.com', keyUrl: 'https://platform.deepseek.com/api_keys', freeNote: paid },
 { id: 'xai', label: 'xAI', docs: 'https://docs.x.ai/developers/models', keyUrl: 'https://console.x.ai', freeNote: paid },
];
const uses:Record<string,Localized>={
 'qwen3:4b-instruct-2507-q4_K_M':{th:'งานถามตอบภาษาไทย สรุปเอกสาร และค้นบริบททีมบน CPU เป็นค่าเริ่มต้นที่ใช้อยู่',en:'Thai Q&A, document summaries and team context on CPU. Current default.'},
 'qwen3:1.7b':{th:'งานสั้น จัดหมวดหมู่และสรุปเบื้องต้น ใช้ RAM น้อยกว่า 4B แต่ความแม่นยำลดลง',en:'Short tasks, classification and basic summaries; less RAM than 4B, with a quality tradeoff.'},
 'gemma3:1b':{th:'งานข้อความสั้นและภาษาอังกฤษบนเครื่องทรัพยากรจำกัด ควรทดสอบคุณภาพภาษาไทยก่อน',en:'Short text and English on constrained hardware. Evaluate Thai quality first.'},
 'qwen2.5-coder:3b':{th:'ช่วยอธิบายโค้ด แก้บั๊ก และร่างโค้ดขนาดเล็ก เหมาะกับงานพัฒนามากกว่าสรุปภาษาไทย',en:'Code explanation, debugging and small code drafts; prioritize development over Thai document summaries.'},
 'gpt-6-astra':{th:'วิเคราะห์ซับซ้อน งานโค้ดหลายขั้น และการใช้เหตุผลที่ต้องการความสามารถสูง',en:'Demanding reasoning, complex analysis and multi-step coding.'},
 'gpt-6.1-sol':{th:'งานโค้ด วิเคราะห์ข้อมูล และงานความรู้ทั่วไป โดยสมดุลความสามารถกับค่าใช้จ่าย',en:'Coding, data analysis and knowledge work with a capability/cost balance.'},
 'gpt-6.1-terra':{th:'งานเอกสาร การเขียน และวิเคราะห์ข้อมูลเชิงภาพ ตัวเชื่อมต่อนี้ส่งข้อความเท่านั้น',en:'Document work, writing and visual reasoning. This connector sends extracted text only.'},
 'gpt-6-luna':{th:'จัดหมวดหมู่ สกัดข้อมูล และคำถามที่ชัดเจนจำนวนมาก เน้นประหยัด',en:'Cost-sensitive classification, extraction and focused high-volume tasks.'},
 'claude-opus-5-5':{th:'งานโค้ดซับซ้อน วิเคราะห์เชิงลึก และเอกสารหลายขั้น',en:'Complex coding, deep analysis and multi-step document work.'},
 'claude-sonnet-5-5':{th:'งานโค้ด อ่านเอกสาร วิเคราะห์ และเขียนที่ใช้ในชีวิตประจำวัน',en:'Everyday coding, document analysis and writing.'},
 'claude-haiku-5-5':{th:'คำตอบรวดเร็ว จัดหมวดหมู่ สกัดข้อมูล และงานสั้นจำนวนมาก',en:'Low-latency responses, classification, extraction and high-volume short tasks.'},
 'gemini-4-argon':{th:'วิเคราะห์ซับซ้อนและงานเอกสาร มีค่าใช้จ่าย ไม่มี Free tier',en:'Complex reasoning and document work. Paid; no free tier.'},
 'gemini-3.8-flash':{th:'สรุปเอกสาร งานโค้ด และถามตอบทั่วไป มีโควตา API ฟรีตามบัญชี',en:'Document summaries, coding and general Q&A; limited API free tier depending on the account.'},
 'gemini-3.5-flash-lite':{th:'สกัดข้อมูล จัดหมวดหมู่ และสรุปสั้น เน้นงานเบา มีโควตาฟรีตามบัญชี',en:'Lightweight extraction, classification and short summaries; account-dependent free quota.'},
 'openai/gpt-oss-120b':{th:'ใช้โมเดล open-weight ผ่าน Groq สำหรับเหตุผลและงานโค้ด ตรวจสอบแพ็กเกจและโควตาก่อน',en:'Open-weight reasoning and coding hosted by Groq. Check your plan and quotas.'},
 'openai/gpt-oss-20b':{th:'ถามตอบและงานโค้ดทั่วไปผ่าน Groq ตรวจสอบโควตา Free plan ในบัญชี',en:'General Q&A and coding through Groq. Check account free-plan quotas.'},
 'deepseek-flash':{th:'ถามตอบ อธิบายโค้ด และสรุปทั่วไปผ่าน DeepSeek API',en:'Q&A, code explanation and general summaries through the DeepSeek API.'},
 'deepseek-v4-pro':{th:'ทดลองกับงานเหตุผลและโค้ดที่ซับซ้อนกว่า ต้องใช้เครดิต API',en:'Evaluate for more demanding reasoning and coding; API credits required.'},
 'grok-4.7':{th:'งานสนทนา วิเคราะห์ และโค้ดผ่าน xAI API โหมดนี้ไม่ได้เปิดค้นเว็บหรือ X อัตโนมัติ',en:'Conversation, analysis and coding through xAI. This connector does not automatically search the web or X.'}
};
const entry = (provider: ProviderId, id: string, label: string, th: string, en: string, cost: ModelEntry['cost'] = 'paid', cpu?: Localized): ModelEntry => ({ provider, id, label, description: uses[id]||{ th, en }, cost, ...(cpu ? { cpu } : {}) });
export const MODEL_CATALOG: ModelEntry[] = [
 entry('ollama','qwen3:4b-instruct-2507-q4_K_M','Qwen3 4B · Default','รุ่นหลักที่ติดตั้งสำหรับเซิร์ฟเวอร์ CPU','Installed default for the CPU server','local',{th:'8 คอร์ RAM 16 GB ไม่มี GPU; ความเร็วขึ้นกับบริบท',en:'8 cores, 16 GB RAM, no GPU; speed depends on context.'}),
 entry('ollama','qwen3:1.7b','Qwen3 1.7B','ตัวเลือกขนาดเล็ก ต้องติดตั้งเอง','Optional smaller model; install manually','local'),
 entry('ollama','gemma3:1b','Gemma 3 1B','ตัวเลือกเบา ต้องติดตั้งเอง','Optional lightweight model; install manually','local'),
 entry('ollama','qwen2.5-coder:3b','Qwen2.5 Coder 3B','ตัวเลือกงานโค้ด ต้องติดตั้งเอง','Optional coding model; install manually','local'),
 ...['gpt-6-astra','gpt-6.1-sol','gpt-6.1-terra','gpt-6-luna'].map(id=>entry('openai',id,id,'โมเดล OpenAI ผ่าน Responses API','OpenAI model via Responses API')),
 ...['claude-opus-5-5','claude-sonnet-5-5','claude-haiku-5-5'].map(id=>entry('anthropic',id,id,'โมเดล Claude ผ่าน Messages API','Claude model via Messages API')),
 entry('google','gemini-4-argon','Gemini 4 Argon','โมเดลขั้นสูง มีค่าใช้จ่าย','Advanced paid model'),
 entry('google','gemini-3.8-flash','Gemini 3.8 Flash','มี Free tier แบบจำกัด','Limited free tier available','free-tier'),
 entry('google','gemini-3.5-flash-lite','Gemini 3.5 Flash-Lite','มี Free tier แบบจำกัด','Limited free tier available','free-tier'),
 ...['openai/gpt-oss-120b','openai/gpt-oss-20b'].map(id=>entry('groq',id,id,'ตรวจสอบแพ็กเกจและโควตา Groq','Check Groq account plan and quota')),
 ...['deepseek-flash','deepseek-v4-pro'].map(id=>entry('deepseek',id,id,'โมเดล DeepSeek','DeepSeek model')),
 entry('xai','grok-4.7','Grok 4.7','โมเดล xAI','xAI model'),
];
