# Commons

พื้นที่ความรู้จากบทสนทนาของทีม: นำเข้าข้อมูล ค้นหา ถาม AI พร้อมหลักฐาน และสร้างงานจากบริบท

## เลือกการติดตั้ง

| แบบ | Identity / data | AI |
|---|---|---|
| Sites preview | บัญชีเจ้าของ Sites, D1 แยกเจ้าของ | ค้นข้อความ หรือ Anthropic key ที่ผู้ใช้ใส่ใน Settings |
| On-premises | Node 24 + SQLite, admin/member, คลังร่วมของบริษัท | Ollama + Qwen3 4B บน CPU ไม่มี paid fallback |

คู่มือ IT ภาษาไทย 500+ บรรทัด: [ON_PREM_DEPLOYMENT.md](ON_PREM_DEPLOYMENT.md) ครอบคลุม server requirements, ติดตั้ง, TLS, data flow, collectors, model setup, backup/restore, recovery และ acceptance checks

## เริ่ม On-prem

1. อ่านคู่มือและกำหนด LAN IP / DNS / certificate trust
2. ตั้ง `deployment/.env` ตาม `deployment/environment.example` และ bootstrap password secret
3. รัน Docker Compose ตามคู่มือและดาวน์โหลด `qwen3:4b` ลงเครื่องบริษัท
4. Settings → บัญชีและสมาชิก เพื่อสร้างผู้ใช้
5. นำเข้า official Claude export หรือเปิด opt-in Claude Code collector เฉพาะ project ที่อนุญาต

```text
npm ci
npm run build:onprem
npm run start:onprem
```

สำหรับ native start ต้องกำหนด PUBLIC_ORIGIN, ADMIN_PASSWORD_FILE และ OLLAMA_URL ก่อน ดูรายละเอียดในคู่มือ Backend ไม่มี npm runtime dependencies เพิ่ม; ใช้ Node.js 24 built-ins

## Data connectors

- Claude Team: Primary Owner export จาก Organization settings → Data and privacy แล้วแตก ZIP / นำเข้า JSON ตามต้องการ
- Claude Code: `scripts/collectors/claude-code.mjs` แบบ Stop hook หรือ manual command พร้อม project/transcript allowlist และ ingestion token
- AI ใช้ retrieval จากข้อความที่นำเข้า ไม่ fine-tune weights อัตโนมัติ
- Claude.ai OAuth สำหรับแอปนี้ไม่รองรับตามข้อกำหนด Anthropic จึงไม่เก็บ session credentials หรือใช้ internal scraping APIs
- Enterprise Compliance API เป็นทางเลือกที่ต้องประเมินแยก ยังไม่มี connector ในรุ่นนี้

## Frontend

Settings รวม Light/Dark/System, accent 5 สี, density, reduced motion, provider/integration/account controls เมนูลัด Ctrl/Cmd+K, ถามด้วย Ctrl/Cmd+Enter, copy answer+citation, Markdown transcript export, responsive navigation และ native modal dialogs

## Tests และ builds

```text
npm test
npx tsc --noEmit
npm run build:onprem
node <Sites-plugin>/scripts/build-site.mjs
```

Ollama adapter tests ใช้ local HTTP fixture; ไม่แทนการวัดคุณภาพ/ความเร็วของ model weights จริง Docker/TLS/company host ต้องทดสอบในสภาพแวดล้อมที่จะใช้งานก่อน rollout

## Runtime boundaries

On-prem เป็น shared workspace: ทุกสมาชิกที่เข้าสู่ระบบอ่านคลังรวมได้ Project เป็นตัวกรอง ไม่ใช่ ACL; ผู้นำเข้าหรือ admin เท่านั้นลบแชตได้ สมาชิกแก้สถานะงานร่วมกันได้ ไม่มี MFA/SSO/SCIM/HA หรือ embeddings index ในรุ่นนี้

Default import limits: 5 MB, 200 conversations, 1,500 chunks ต่อครั้ง; 250,000 ตัวอักษรต่อ conversation; แตก ZIP เอง ไม่อ่านไฟล์แนบ/รูปภาพ/PDF ค้นสูงสุด 6,000 chunks ล่าสุดต่อ scope

ห้ามเผยแพร่ Worker ของ Sites โดยไม่มี gateway identity ของ Sites และห้ามเอา Node on-prem data directory หรือ collector tokens เข้า Git ระบบ on-prem ใช้ HTTPS proxy + local cookie auth ของตัวเอง ไม่เชื่อ authenticated-user headers จาก client
