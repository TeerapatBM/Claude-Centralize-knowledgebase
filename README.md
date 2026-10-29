# Claude Commons

เว็บส่วนตัวสำหรับ Organizer ของ Claude Team เพื่อรวมบทสนทนาของหลายคนเป็นคลังความรู้และต่อยอดเป็นงาน

## ใช้งาน
1. เข้าเว็บไซต์ด้วยบัญชีเจ้าของ Site (ระบบล็อกอินของ Sites ไม่ใช่ Claude OAuth)
2. Primary Owner เปิด Claude → Organization settings → Data and privacy → Export Data
3. ดาวน์โหลดจากอีเมล แตก ZIP แล้วเลือก JSON บทสนทนาที่หน้า นำเข้าและเชื่อมต่อ
4. นำเข้า Claude Code JSONL หรือ TXT/MD เพิ่มได้ ระบุเจ้าของและโปรเจกต์เมื่อไฟล์ไม่มีข้อมูล
5. ค้นคลังหรือถามความรู้ทีม ใส่ Anthropic API key ในหน้าตั้งค่า AI หากต้องการคำตอบสังเคราะห์
6. เปิดบทสนทนาแล้วสร้างงาน มอบหมายชื่อผู้รับผิดชอบและเลื่อนสถานะได้ (ไม่ส่งการแจ้งเตือน)

## ขอบเขตที่ทำแล้ว
- D1 persistence; owner-scoped access; same-origin mutation checks
- JSON conversations/chat_messages/messages; JSONL sessions; TXT/Markdown
- Upsert and transactional chunk replacement; delete cascades to derived chunks/tasks
- Thai/English keyword retrieval, 12 evidence excerpts, optional Claude synthesis with citations
- Project/person/source filters; usage totals only where present in imported Code records
- Separate in-memory demo, never automatically seeded to production

## ข้อจำกัด
- ไม่มีการล็อกอิน Claude เพื่อดึง Team chats อัตโนมัติ ใช้ official export; Enterprise Compliance API ยังไม่ได้เชื่อม
- Site ส่วนตัวสำหรับ Organizer ยังไม่มี shared member RBAC, invite, live collaboration, scheduled sync หรือ OTLP collector
- ไม่มี fine-tuning/embedding semantic search; ค้นสูงสุด 6,000 chunks ล่าสุดต่อ scope
- จำกัด 5 MB, 200 conversations, 1,500 chunks ต่อ import; บทสนทนาไม่เกิน 250,000 ตัวอักษร
- ต้องแตก ZIP ก่อน; ไม่อ่านรูปภาพ PDF attachments หรือ tool payloads; project text ใช้ TXT/MD แยก
- Unknown export shapes ถูกปฏิเสธ; ต้องตรวจ format กับ export จริงขององค์กรก่อน rollout
- Export ไม่มี user/project metadata ต้องกรอกเอง; อาจเก็บ user UUID ถ้าไม่มี email
- Id-less records use content identity; text edits create new records and 32-bit fallback hashes have a residual collision risk
- ค่า tokens ไม่ใช่ billing; JSONL ที่มี duplicated streaming usage อาจนับซ้ำ ต้องตรวจ original usage format
- AI needs paid Anthropic API access separately from Team subscription. No live AI call verified without credentials.
- Documents are untrusted evidence; prompt tells model not to follow them. Review answers and citations.

## Development
Node 24+, npm ci; npm run db:generate when schema changes; npm run build.
Apply local migration:
`node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_serious_weapon_omega.sql`
`npm run dev -- --host 127.0.0.1`
`node --test tests/knowledge.test.ts`
`npx tsc --noEmit`
Local sign-in is supplied by the starter. Production identity comes only from the Sites gateway. Do not expose the built Worker directly without this trusted gateway.

## Runtime secrets
ANTHROPIC_API_KEY (optional, secret); ANTHROPIC_MODEL (default claude-sonnet-5-5). Configure hosted values through Sites environment settings. Alternatively, user enters a session-only key; stored only in React memory and sent over HTTPS with ask requests, never persisted.

## Official references checked 2026-10-28
- https://support.claude.com/en/articles/13346720-export-your-organization-s-data
- https://platform.claude.com/docs/en/manage-claude/compliance-api
- https://platform.claude.com/docs/en/manage-claude/compliance-api-access
- https://code.claude.com/docs/en/monitoring-usage

Frontend refresh: Light/Dark/System mode, 5 accent palettes, comfortable/compact density, saved device preferences, reduced motion controls, Ctrl/Cmd+K command search, Ctrl/Cmd+Enter ask, copy answers with citations, copy/download transcripts as Markdown, responsive bottom navigation, native accessible dialogs, skeleton loading and status toasts. Preferences contain no chat content or credentials.

