import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {scryptSync,randomBytes} from 'node:crypto';
const [action,target]=process.argv.slice(2);const path=resolve(process.env.DATA_DIR||'onprem-data','commons.sqlite');
if(action==='backup'&&target){mkdirSync(dirname(resolve(target)),{recursive:true});const db=new DatabaseSync(path,{readOnly:true});try{await backup(db,resolve(target));console.log('Backup complete');}finally{db.close();}}
else if(action==='integrity'){const db=new DatabaseSync(path,{readOnly:true});try{console.log(db.prepare('PRAGMA integrity_check').all());}finally{db.close();}}
else if(action==='reset-admin'&&target){const passwordFile=process.env.RESET_PASSWORD_FILE;if(!passwordFile)throw Error('Set RESET_PASSWORD_FILE to a protected file path; run with app stopped');const p=readFileSync(passwordFile,'utf8').trim();if(p.length<12||p.length>128)throw Error('Password must be 12–128 characters');const db=new DatabaseSync(path);try{const u=db.prepare('SELECT id FROM users WHERE username=? AND role=?').get(target,'admin') as any;if(!u)throw Error('Admin not found');const salt=randomBytes(16).toString('hex'),digest=scryptSync(p,salt,64).toString('hex');db.exec('BEGIN IMMEDIATE');db.prepare('UPDATE users SET password=? WHERE id=?').run(salt+':'+digest,u.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id);db.exec('COMMIT');console.log('Administrator password reset; sessions revoked');}finally{db.close();}}
else throw Error('Usage: maintenance.ts backup <file> | integrity | reset-admin <username>');
