import {test} from 'node:test';
import assert from 'node:assert/strict';
import {within} from '../scripts/collectors/claude-code.mjs';
import {resolve} from 'node:path';
test('collector allowlist rejects siblings and parent traversal',()=>{const root=resolve('approved');assert.equal(within(root,resolve(root,'subproject')),true);assert.equal(within(root,resolve('approved-other')),false);assert.equal(within(root,resolve(root,'..','private')),false);});
