import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
test('maintenance creates a consistent SQLite snapshot',()=>{const dir=mkdtempSync(join(tmpdir(),'commons-backup-'));try{const db=new DatabaseSync(join(dir,'commons.sqlite'));db.exec('CREATE TABLE sample(v TEXT); INSERT INTO sample VALUES (\'preserved\');');db.close();const target=join(dir,'snapshot.sqlite'),result=spawnSync(process.execPath,['onprem/maintenance.ts','backup',target],{env:{...process.env,DATA_DIR:dir},encoding:'utf8'});assert.equal(result.status,0,result.stderr);const copy=new DatabaseSync(target,{readOnly:true});try{assert.equal((copy.prepare('SELECT v FROM sample').get() as any).v,'preserved');}finally{copy.close();}}finally{rmSync(dir,{recursive:true,force:true});}});
