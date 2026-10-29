export type Locale='th'|'en';
const entries=`
ภาพรวม|Overview
คลังบทสนทนา|Conversations
ถามความรู้ทีม|Ask your team
บอร์ดงาน|Task board
นำเข้าข้อมูล|Import data
หน้าตา|Appearance
AI และเซิร์ฟเวอร์|AI and server
เชื่อมต่อข้อมูล|Integrations
บัญชีและสมาชิก|Account and members
ดำเนินการไม่สำเร็จ|The action could not be completed
ตรวจสอบระบบไม่สำเร็จ กรุณาโหลดหน้าใหม่|System check failed. Please reload the page
การยืนยันความปลอดภัยไม่สำเร็จ ลองอีกครั้ง|Security verification failed. Try again
โหลดการยืนยันความปลอดภัยไม่ได้ กรุณาลองอีกครั้ง|Unable to load security verification. Please try again
โหลดการยืนยันความปลอดภัยไม่ได้ ตรวจสอบเครือข่ายแล้วลองอีกครั้ง|Unable to load verification. Check your connection and try again
เข้าสู่ระบบไม่สำเร็จ|Sign-in failed
ทุกบทสนทนา|Every conversation
ต่อยอดได้ด้วยกัน|moves us forward together
เชื่อมความรู้จากคน โค้ด และโปรเจกต์|Connect knowledge from people, code, and projects
ให้ทีมค้นพบคำตอบและเดินหน้าต่อได้|Help your team discover answers and move forward
พื้นที่ความรู้สำหรับสมาชิกในทีมเท่านั้น|A knowledge space for team members only
เข้าสู่พื้นที่ของทีม|Sign in to your team space
ใช้บัญชีที่ผู้ดูแลสร้างให้เพื่อเข้าถึงคลังความรู้ร่วมกัน|Use the account created by your administrator to access shared knowledge
กำลังตรวจสอบระบบ…|Checking system…
เข้าสู่ระบบด้วย ChatGPT|Sign in with ChatGPT
ชื่อผู้ใช้|Username
ชื่อผู้ใช้ของคุณ|Your username
รหัสผ่าน|Password
กรอกรหัสผ่าน|Enter your password
ซ่อนรหัสผ่าน|Hide password
แสดงรหัสผ่าน|Show password
โหลดการยืนยันใหม่|Reload verification
กำลังเข้าสู่ระบบ…|Signing in…
เข้าสู่ระบบ|Sign in
ยังไม่มีบัญชีหรือลืมรหัสผ่าน?|No account or forgot your password?
ติดต่อผู้ดูแลทีมของคุณ|Contact your team administrator
จัดการหน้าตา AI การรับข้อมูล และบัญชีจากที่เดียว|Manage appearance, AI, imports, and accounts in one place
ดาวน์โหลดคู่มือติดตั้ง .md|Download installation guide (.md)
AI ภายในบริษัท|On-premises AI
AI สำหรับเว็บตัวอย่าง|AI for this demo
ผู้ให้บริการ|Provider
โมเดล|Model
ยังไม่ได้ตรวจสอบ|Not checked yet
บริการ Ollama|Ollama service
เชื่อมต่อได้|Connected
ยังเชื่อมต่อไม่ได้|Not connected
รอตรวจสอบ|Awaiting check
ไฟล์โมเดล|Model files
พร้อมใช้งาน|Ready
ยังไม่พบโมเดลที่ตั้งค่า|Configured model not found
รันคำสั่งในคู่มือติดตั้งเพื่อดาวน์โหลด Qwen3 ลงเซิร์ฟเวอร์ เปลี่ยนรุ่นผ่าน OLLAMA_MODEL แล้วเริ่มบริการใหม่|Follow the installation guide to download Qwen3 to your server. Change OLLAMA_MODEL and restart the service to switch models
ตรวจสอบสถานะ|Check status
เว็บตัวอย่างบน Sites ยังเชื่อมเข้าวง LAN ของบริษัทไม่ได้ ติดตั้งชุด on-prem เพื่อใช้ Ollama โดยไม่มีค่า API รายครั้ง|This Sites demo cannot access your company LAN. Install the on-premises package to use Ollama without per-request API fees
Anthropic API key สำหรับเซสชันนี้|Anthropic API key for this session
ไม่จำเป็นสำหรับ on-prem|Not needed for on-premises use
เก็บเฉพาะหน่วยความจำของหน้านี้ ส่งไป Anthropic เฉพาะตอนถาม AI ·|Stored in this page's memory; sent to Anthropic only when asking AI ·
เซิร์ฟเวอร์ตั้งค่า key ไว้แล้ว|Server API key is configured
หากไม่ใส่ key ใช้ค้นข้อความได้|Text search works without an API key
ความรู้ของทีม|Team knowledge
นำข้อความเข้า → ค้นหาส่วนที่เกี่ยวข้อง → ส่งหลักฐานให้โมเดลตอบพร้อมอ้างอิง|Import text → Find relevant passages → Give the model evidence for cited answers
ข้อมูลใหม่เข้าสู่คลังแล้วค้นได้ทันที ไม่ต้องฝึกน้ำหนักโมเดลใหม่ทุกครั้ง|New content is searchable immediately, without retraining model weights
CPU server เริ่มที่ Qwen3 4B, context 8K และตอบพร้อมกัน 1 คำขอ ความเร็วจริงขึ้นกับ CPU และ RAM ต้องทดสอบก่อนเปิดทั้งทีม|CPU servers start with Qwen3 4B, 8K context, and one concurrent request. Performance depends on CPU and RAM; test before team rollout
ฟรีในแง่ไม่มีค่า API รายครั้ง ยังมีค่าเครื่อง ไฟฟ้า และการดูแล|No per-request API fees; hardware, electricity, and maintenance still apply
Official export · ตามต้องการ|Official export · On demand
Primary Owner เปิด Claude → Organization settings → Data and privacy → Export Data แล้วดาวน์โหลดจากอีเมล แตก ZIP และนำเข้า JSON ในหน้ารับข้อมูล|As Primary Owner, open Claude → Organization settings → Data and privacy → Export Data. Download from the email, unzip, and import the JSON file
Claude.ai OAuth สำหรับแอปนี้ไม่รองรับตามข้อกำหนด Anthropic จึงไม่มีปุ่มเชื่อมต่อที่อ้างว่าอ่านแชต Team ทั้งหมดได้|Anthropic terms do not support Claude.ai OAuth for this app, so no connection button claims access to all Team chats
อ่านข้อกำหนดการยืนยันตัวตน|Read authentication requirements
หากต้องการ API ดึงข้อมูลระดับองค์กร ให้ประเมิน Enterprise Compliance API แยกต่างหาก ยังไม่ได้ติดตั้ง connector นี้|For organization-wide access, evaluate the Enterprise Compliance API separately. This connector is not installed
เลือกโปรเจกต์ที่อนุญาต แล้วใช้ Stop hook ส่งข้อความเมื่อจบคำตอบ หรือสั่งส่งไฟล์เองเป็นครั้ง ๆ ได้ ดูตัวอย่างในคู่มือ on-prem|Choose approved projects and use a Stop hook to send completed responses, or submit files manually. See the on-premises guide
 token ใช้ส่งข้อมูลเท่านั้น อ่านแชตหรือลบข้อมูลไม่ได้ อายุ 90 วัน|Tokens only submit data; they cannot read or delete chats. Valid for 90 days
ชื่อเครื่อง collector|Collector device name
ชื่อเครื่อง เช่น alice-laptop|Device name, e.g. alice-laptop
สร้าง token|Create token
แสดงครั้งเดียว คัดลอกเก็บในไฟล์ config ของเครื่องสมาชิก|Shown once. Copy into the member device's configuration file
คัดลอก token แล้ว|Token copied
คัดลอก|Copy
ซ่อน token|Hide token
หมดอายุ|Expires
เพิกถอน token แล้ว|Token revoked
เพิกถอน|Revoke
การสร้าง token เปิดใช้บนเซิร์ฟเวอร์บริษัทหลังเข้าสู่ระบบ|Sign in to your company server to create tokens
บัญชีของคุณ|Your account
เข้าสู่ระบบ: |Signed in: 
กำลังตรวจสอบ|Checking
กรุณาเข้าสู่ระบบด้านบน|Please sign in above
คลัง on-prem เป็นพื้นที่ร่วมของบริษัท สมาชิกทุกคนเห็นข้อมูลที่นำเข้ามาร่วมกัน โปรเจกต์เป็นตัวกรอง ไม่ใช่การแบ่งสิทธิ์ลับ|The on-premises library is shared across the company. Members can see all imported content. Projects are filters, not access boundaries
เปลี่ยนรหัสผ่านแล้ว กรุณาเข้าสู่ระบบอีกครั้ง|Password changed. Please sign in again
รหัสผ่านปัจจุบัน|Current password
รหัสผ่านใหม่ (12–128 ตัวอักษร)|New password (12–128 characters)
เปลี่ยนรหัสผ่าน|Change password
ออกจากระบบ|Sign out
เว็บตัวอย่างใช้บัญชีเจ้าของ Sites คลังทีมที่แชร์กันและบัญชีสมาชิกเปิดใช้ในชุด on-prem|This demo uses the Sites owner's account. Shared team libraries and member accounts are available in the on-premises package
จัดการสมาชิก|Manage members
สร้างสมาชิกแล้ว ส่งรหัสผ่านผ่านช่องทางภายในที่ปลอดภัย|Member created. Share the password through a secure internal channel
ชื่อผู้ใช้สมาชิก|Member username
รหัสผ่านเริ่มต้น (12–128 ตัวอักษร)|Initial password (12–128 characters)
สร้างสมาชิก|Create member
ใช้งานอยู่|Active
ปิดบัญชีแล้ว|Account disabled
ยืนยันปิดบัญชี|Confirm disable account
ปิดบัญชี|Disable account
ปิด (Esc)|Close (Esc)
ปิดหน้าต่าง|Close dialog
เลือกบรรยากาศที่ใช่ แล้วโฟกัสกับสิ่งที่สำคัญ|Choose your atmosphere and focus on what matters
โหมดการแสดงผล|Display mode
สว่าง|Light
มืด|Dark
ตามระบบ|System
สีประจำพื้นที่|Workspace accent
ธีม |Theme 
ความกระชับ|Density
ปรับระยะห่างของรายการบทสนทนา|Adjust spacing in conversation lists
สบายตา|Comfortable
กระชับ|Compact
การเคลื่อนไหว|Motion
เคารพการตั้งค่าลดการเคลื่อนไหวของระบบเสมอ|Always respects your system's reduced-motion preference
เปิดการเคลื่อนไหว|Enable motion
เบราว์เซอร์ไม่อนุญาตให้บันทึก ค่าที่เลือกจะใช้เฉพาะหน้านี้|Your browser blocked storage. These settings apply only to this page
คืนค่าเริ่มต้น|Reset defaults
ใช้กับหน้านี้|Apply to this page
บันทึกอัตโนมัติบนอุปกรณ์นี้|Saved automatically on this device
ปรับพื้นที่ให้เป็นคุณ|Make this space yours
ไปที่ไหนต่อดี?|Where to next?
ค้นหาหน้า คำสั่ง หรือบทสนทนา…|Search pages, commands, or conversations…
ค้นหาคำสั่ง|Search commands
ไม่พบคำสั่ง ลองใช้คำค้นหาอื่น|No commands found. Try another search
เลือก|Select
เปิด|Open
กำลังโหลดบทสนทนา|Loading conversations
คัดลอกแล้ว พร้อมนำไปใช้ต่อ|Copied and ready to use
คัดลอกไม่สำเร็จ เบราว์เซอร์ไม่อนุญาตให้ใช้คลิปบอร์ด|Copy failed. Your browser blocked clipboard access
ดาวน์โหลดบทสนทนาเป็น Markdown แล้ว|Conversation downloaded as Markdown
กลับข้อมูลจริงเพื่อเปิดบทสนทนาของงานนี้|Return to live data to open this task's conversation
ไม่พบบทสนทนา อาจถูกลบหรือไม่มีสิทธิ์เข้าถึง|Conversation not found. It may be deleted or inaccessible
ไฟล์เกิน 5 MB กรุณาแบ่งไฟล์ก่อน|File exceeds 5 MB. Please split it first
ผลค้นหาจากข้อมูลสมมติสำหรับทดลองหน้าจอ ยังไม่ได้เรียก AI|Search results from sample data. AI has not been called
เปิดหน้า |Open page 
เปลี่ยนธีมและหน้าตา|Change theme and appearance
Light / Dark · สี · การเคลื่อนไหว|Light / Dark · Color · Motion
โปรเจกต์|Project
ทุกโปรเจกต์|All projects
เจ้าของบทสนทนา|Conversation owner
ทุกคน|Everyone
ข้ามไปเนื้อหา|Skip to content
พื้นที่ความรู้ร่วมของบริษัท|Company knowledge space
พื้นที่ส่วนตัวของ Organizer|Organizer's private workspace
สมาชิกที่เข้าสู่ระบบเห็นคลังร่วมกัน|Signed-in members share this library
เข้าถึงโดยเจ้าของเว็บไซต์|Accessible to the website owner
ค้นหาคำสั่ง (Ctrl หรือ Command K)|Search commands (Ctrl or Command K)
ค้นหาหรือไปที่…|Search or jump to…
กำลังเชื่อมต่อใหม่|Reconnecting
โหมดตัวอย่าง — ข้อมูลสมมติ ไม่ได้บันทึกลงคลังจริง|Demo mode — Sample data is not saved to the live library
กลับข้อมูลจริง|Return to live data
เข้าสู่ระบบบริษัทเพื่อเปิดคลังร่วมกัน|Sign in to your company account to open the shared library
เข้าสู่ระบบเจ้าของเว็บไซต์เพื่อเปิดคลังส่วนตัว|Sign in as the website owner to open the private library
เข้าสู่ระบบบริษัท|Company sign-in
ปิดข้อผิดพลาด|Dismiss error
ความรู้ที่ต่อยอดร่วมกันได้|Knowledge we build on together
ทุกบทสนทนา มีคุณค่าต่อทีม|Every conversation brings value to the team
รวมสิ่งที่ทีมคิด ค้นหาสิ่งที่ทีมรู้ แล้วเปลี่ยนเป็นงานที่เดินต่อได้|Bring your team's thinking together, discover what you know, and turn it into action
ดูข้อมูลจริง|View live data
ลองข้อมูลตัวอย่าง|Explore sample data
รู้ทันทุกบริบท|Understand every context
ต่อยอดทุกความคิด|Build on every idea
เชื่อมบทสนทนา โค้ด และโปรเจกต์ของทีม|Connect your team's conversations, code, and projects
ให้กลายเป็นคำตอบที่มีหลักฐาน|into answers backed by evidence
คำถามเริ่มต้นถึงความรู้ทีม|Start a question for your team
วันนี้อยากรู้อะไรจากทีม?|What would you like to learn from your team today?
เปิดผู้ช่วยความรู้ทีม|Open team knowledge assistant
คำตอบมีที่มา · เปิดอ่านต้นทางได้|Cited answers · Open original sources
บทสนทนาในคลัง|Conversations in the library
เจ้าของข้อมูล|Data owners
Tokens ที่มีในไฟล์|Tokens recorded in files
บทสนทนาล่าสุด|Recent conversations
ดูทั้งหมด|View all
เริ่มจากบทสนทนาแรกของทีม|Start with your team's first conversation
นำเข้า export จาก Claude Team หรือไฟล์ Claude Code|Import a Claude Team export or Claude Code files
แล้วความรู้ที่กระจัดกระจายจะค้นหาได้จากที่เดียว|and search scattered knowledge in one place
นำเข้าบทสนทนา|Import conversations
ความรู้ตามสายงาน|Knowledge by discipline
จัดหมวดเบื้องต้นจากคำสำคัญในบทสนทนา|Initial categories based on conversation keywords
AI ประมวลผลด้วย Ollama ในเซิร์ฟเวอร์บริษัท|AI runs with Ollama on your company server
ข้อมูลส่งให้ Claude API เฉพาะเมื่อใช้โหมด AI|Data is sent to Claude API only in AI mode
มองเห็นบริบท เจ้าของ และแหล่งที่มาของความรู้ทีม|See the context, owners, and sources of team knowledge
ค้นหาบทสนทนา|Search conversations
ค้นหาชื่อบทสนทนา คน หรือโปรเจกต์|Search titles, people, or projects
ประเภทแหล่งข้อมูล|Source type
ทุกแหล่งข้อมูล|All sources
กรองโปรเจกต์|Filter projects
บทสนทนา|Conversations
เรียงบทสนทนา|Sort conversations
นำเข้าล่าสุด|Recently imported
ตามชื่อ|By name
ข้อความมากที่สุด|Most messages
ไม่พบบทสนทนาที่ตรงกัน|No matching conversations
คลังยังว่างอยู่|Your library is empty
ลองเปลี่ยนคำค้นหาหรือตัวกรอง|Try a different search or filter
เริ่มด้วยการนำเข้าไฟล์จากหน้าการเชื่อมต่อ|Start by importing a file from Integrations
ล้างตัวกรอง|Clear filters
เชื่อมโยงสิ่งที่เคยคุย ให้เป็นคำตอบที่นำไปใช้ได้|Turn past conversations into answers you can act on
ตั้งค่า AI|AI settings
เชื่อมต่อ AI|Connect AI
ตัวอย่าง|Demo
ค้นหาแหล่งข้อมูล|Search sources
ทีมของเรารู้อะไรแล้วบ้าง?|What does our team already know?
ระบุหัวข้อที่อยากรู้ แล้วค้นข้ามบทสนทนาพร้อมหลักฐาน|Choose a topic and search across conversations with evidence
ระบบชำระเงิน มีข้อเสนออะไรบ้าง|What ideas do we have for payments?
API timeout ควรแก้อย่างไร|How should we fix API timeouts?
แผนคอนเทนต์เปิดตัวชุมชน|Community launch content plan
คำตอบจาก Veltrix|Answer from Veltrix
ผลค้นหา — ยังไม่ได้สังเคราะห์ด้วย AI|Search results — Not yet synthesized by AI
คัดลอกพร้อมที่มา|Copy with sources
เริ่มคำถามใหม่|Start a new question
แหล่งข้อมูล (|Sources (
คำถามถึงความรู้ทีม|Question for your team knowledge
ถามเกี่ยวกับงาน การตัดสินใจ หรือสิ่งที่ทีมเคยค้นพบ…|Ask about work, decisions, or your team's discoveries…
กำลังค้นหาและเรียบเรียง…|Searching and composing…
Ctrl/⌘ + Enter เพื่อส่ง · ตรวจสอบแหล่งอ้างอิงก่อนใช้|Ctrl/⌘ + Enter to send · Check sources before use
กำลังค้นหา|Searching
ถามคำถาม|Ask a question
ขอบเขตความรู้|Knowledge scope
เลือกบริบทให้คำตอบตรงกับงาน|Choose context for relevant answers
คำตอบมีที่มา|Answers with sources
ค้นข้อความที่เกี่ยวข้องก่อนส่งให้ AI พร้อมแหล่งอ้างอิงที่เปิดอ่านได้|Find relevant passages before sending to AI, with sources you can open
เพิ่มข้อมูลในคลังเพื่อขยายความรู้ ไม่ใช่การฝึกโมเดลใหม่|Add content to expand knowledge without retraining the model
ค้นสูงสุด 6,000 ช่วงข้อความล่าสุดในขอบเขต และเลือก 12 ช่วงที่ตรงคำสำคัญที่สุด|Search up to 6,000 recent passages in scope and select the 12 closest keyword matches
จากบทสนทนา สู่งานถัดไป|From conversations to next steps
ติดตามสิ่งที่ต้องทำ พร้อมบริบทจากบทสนทนาต้นทาง|Track next steps with context from their original conversations
สร้างงานแล้ว|Task created
ชื่องาน|Task title
สิ่งที่ต้องทำต่อ…|What needs to happen next…
ผู้รับผิดชอบ|Assignee
แชตต้นทาง|Source conversation
ไม่มีแชตต้นทาง|No source conversation
เพิ่มงาน|Add task
กลับข้อมูลจริงเพื่อบันทึกงาน|Return to live data to save tasks
รอดำเนินการ|To do
กำลังทำ|In progress
เสร็จแล้ว|Done
ดูบทสนทนาต้นทาง|View source conversation
สถานะ |Status 
ยังไม่มีงานในขั้นตอนนี้|No tasks in this stage
เชื่อมความรู้เข้าด้วยกัน|Bring your knowledge together
ช่องทางนำเข้าที่เหมาะกับ Claude Team ของคุณ|Import options for your Claude Team
นำเข้าแบบไฟล์|File import
เลือก JSON จาก export, Claude Code JSONL หรือ TXT / MD|Choose exported JSON, Claude Code JSONL, or TXT / MD
เจ้าของข้อมูล (ถ้าไฟล์ไม่ระบุ)|Owner (if not specified in the file)
เช่น Nicha หรืออีเมลสมาชิก|E.g. Nicha or a member's email
โปรเจกต์ (ถ้าไฟล์ไม่ระบุ)|Project (if not specified in the file)
เช่น Member platform|E.g. Member platform
เลือกไฟล์ หรือลากมาวางที่นี่|Choose a file or drop it here
สูงสุด 5 MB / 200 บทสนทนาต่อครั้ง · แตก ZIP ก่อนนำเข้า|Up to 5 MB / 200 conversations per import · Unzip first
อ่านได้|Parsed
ข้อความ|messages
ข้อมูลผู้ใช้และโปรเจกต์ในไฟล์มีลำดับความสำคัญกว่าค่าที่กรอก|User and project details in the file take precedence over these fields
ฉันมีสิทธิ์นำข้อมูลนี้มารวมในพื้นที่ความรู้ของทีม|I have permission to add this data to the team's knowledge space
กำลังนำเข้า…|Importing…
นำเข้าและสร้างคลังความรู้|Import into knowledge library
เก็บข้อความและข้อมูลอ้างอิงบนเซิร์ฟเวอร์ · ยังไม่อ่านไฟล์แนบ รูปภาพ หรือ PDF ภายในแชต|Text and references are stored on the server · Chat attachments, images, and PDFs are not processed
ใช้งานได้กับแผนของคุณ|Available on your plan
Primary Owner ส่งออกบทสนทนาทั้งองค์กรได้ ส่วน Owner เปิดสิทธิ์ให้สมาชิกส่งออกข้อมูลของตัวเองได้|Primary Owners can export organization-wide conversations. Owners can allow members to export their own data
เปิด Claude ด้วยบัญชี Primary Owner|Open Claude as Primary Owner
กด Export Data แล้วดาวน์โหลดจากอีเมล|Select Export Data and download from the email
แตก ZIP แล้วนำเข้าไฟล์บทสนทนา JSON|Unzip and import the conversation JSON file
เปิด Claude เพื่อส่งออกข้อมูล|Open Claude to export data
นำเข้าไฟล์ session .jsonl ที่สมาชิกเลือกส่งให้จาก|Import session .jsonl files shared by members from
หรือเพิ่มความรู้ของโปรเจกต์เป็น TXT / Markdown พร้อมระบุชื่อโปรเจกต์|or add project knowledge as TXT / Markdown with the project name
Tokens แสดงเฉพาะค่าที่มีในไฟล์ ไม่ใช่ยอดใช้ทั้งหมดหรือยอดเรียกเก็บเงินจริง|Token counts reflect file contents, not total usage or actual billing
การเชื่อมต่ออัตโนมัติ|Automatic connections
เวอร์ชันนี้ใช้ไฟล์ export ไม่มีปุ่ม OAuth ที่อ่านแชต Team ทั้งองค์กรได้ ช่องทาง Compliance API ต้องใช้ Enterprise และยังไม่ได้เปิดใช้งานในเว็บนี้|This version uses exported files. No OAuth button reads organization-wide Team chats. Compliance API requires Enterprise and is not enabled here
อ่านข้อกำหนด Anthropic|Read Anthropic requirements
ความรู้ทีมที่มีบริบทและที่มา|Team knowledge with context and sources
Independent workspace · ไม่ใช่ผลิตภัณฑ์ของ Anthropic|Independent workspace · Not an Anthropic product
บทสนทนาต้นทาง|Source conversation
ปิดการแจ้งเตือน|Dismiss notification
คัดลอกบทสนทนา|Copy conversation
ดาวน์โหลด Markdown|Download Markdown
สร้างงานจากแชตนี้|Create task from this chat
ลบข้อมูลสำเนาในคลัง รวมข้อความค้นหาและงานที่เชื่อมโยงแล้ว|Library copy, search passages, and linked tasks deleted
ยืนยันลบแชตและงานที่เชื่อมโยง|Confirm deletion of chat and linked tasks
ลบสำเนาในคลัง|Delete library copy
กำลังดำเนินการ…|Working…
ภาษา|Language
ภาษาที่ใช้แสดงผล|Display language
เลือกภาษาสำหรับเมนูและปุ่ม ข้อมูลของทีมจะคงเดิม|Choose a language for menus and buttons. Team content stays as entered
`;
const chatEntries=`
โหมด Cloud ส่งข้อมูลเมื่อคุณยืนยันเท่านั้น|Cloud mode sends data only after your confirmation
ภาษาแสดงผล|Interface language
โมเดลและผู้ให้บริการ|Models and providers
เลือกโมเดลสำหรับแชต เอกสาร และคลังความรู้ของทีม|Choose a model for chat, documents and team knowledge
ผู้ให้บริการ|Provider
โมเดล|Model
ยังไม่ติดตั้ง|Not installed
วาง API key ของคุณ|Paste your API key
เก็บ key ในหน่วยความจำของหน้านี้เท่านั้น ไม่บันทึกลงเบราว์เซอร์หรือฐานข้อมูล|Keys stay in this page's memory only, never in browser storage or the database
ล้าง API key|Clear API key
รับ API key / ตรวจสอบโควตา|Get an API key / check quotas
ตรวจโมเดลที่ติดตั้งอีกครั้ง|Refresh installed models
ฟรีบนเซิร์ฟเวอร์|Local, no token fee
มีโควตาฟรี|Limited free tier
API มีค่าใช้จ่าย|Paid API
ติดตั้งแล้ว|Installed
ยังไม่ติดตั้ง — ให้ผู้ดูแลติดตั้งผ่าน Ollama ก่อน|Not installed. Ask your administrator to install it in Ollama first
แชตกับ Veltrix|Chat with Veltrix
คุยต่อเนื่อง ใช้ความรู้ทีม และอ่านเอกสารในพื้นที่เดียว|Chat, use team knowledge and work with documents in one place
แชตใหม่|New chat
โมเดลแชต|Chat model
เริ่มจากสิ่งที่คุณอยากทำ|What would you like to work on?
แนบเอกสารหรือลิงก์ แล้วให้ Veltrix ช่วยสรุป เปรียบเทียบ หรือค้นหาคำตอบ|Attach a document or link, then ask Veltrix to summarize, compare or find answers
สรุปสาระสำคัญจากเอกสารที่แนบ|Summarize the attached documents
เปรียบเทียบข้อเสนอและสิ่งที่ต้องทำต่อ|Compare proposals and identify next steps
ทีมเคยตัดสินใจเรื่องนี้ไว้อย่างไร|What has the team decided about this?
คุณ|You
แหล่งอ้างอิง|Sources
คัดลอกแล้ว|Copied
คัดลอกคำตอบ|Copy answer
คัดลอกไม่สำเร็จ|Could not copy
กำลังอ่านและเรียบเรียงคำตอบ…|Reading and preparing your answer…
ตัวอักษร|characters
นำไฟล์แนบออก|Remove attachment
ลิงก์เอกสาร|Document link
อ่านลิงก์|Read link
ปิด|Close
ข้อความแชต|Chat message
ถามคำถาม หรือบอกให้ช่วยทำอะไรกับเอกสาร…|Ask a question or describe what to do with your documents…
แนบไฟล์|Attach files
แนบลิงก์|Attach link
ส่ง|Send
อนุญาตส่งข้อความ เอกสารที่แนบ และหลักฐานจากคลัง ให้ผู้ให้บริการที่เลือก|Allow chat messages, attached documents and retrieved evidence to be sent to the selected provider
ไฟล์ไม่เกิน 5 MB · สูงสุด 5 รายการ · อ่านเฉพาะข้อความ ไม่ทำ OCR · แนบเฉพาะในแชตนี้|Up to 5 items, 5 MB per file. Text extraction only; no OCR. Attachments stay in this chat
ขอบเขตความรู้ทีม|Team knowledge scope
ใช้ร่วมกับเอกสารและข้อความที่แนบ|Combined with your attached documents and messages
โปรเจกต์|Project
เลือกโมเดล|Select a model
ต้องตั้ง API key ก่อนใช้งาน|Set an API key before using this model
ตั้งค่าโมเดลและ API key|Model and API key settings
เอกสารยาวจะใช้ข้อความบางส่วนที่เกี่ยวข้อง ควรเปิดตรวจหลักฐานก่อนใช้งานจริง|Long documents use relevant excerpts. Check source evidence before relying on the answer
แนบได้สูงสุด 5 ไฟล์หรือลิงก์|Attach at most 5 files or links
ตั้ง API key และยืนยันการส่งข้อมูลให้ผู้ให้บริการก่อน|Set an API key and confirm sending data to the provider first
ส่งคำถามไม่สำเร็จ|Could not send your question
`;
export const uiTranslations:Record<string,string>=Object.fromEntries((entries+'\n'+chatEntries).trim().split('\n').filter(line=>line.includes('|')).map(line=>{const separator=line.indexOf('|');return [line.slice(0,separator).trimStart(),line.slice(separator+1)];}));
export function translateUi(text:string,locale:Locale):string{
 if(locale==='th')return text;
 const exact=uiTranslations[text];if(exact!==undefined)return exact;
 const trimmed=text.trim();const translated=uiTranslations[trimmed];
 return translated===undefined?text:text.replace(trimmed,translated);
}
