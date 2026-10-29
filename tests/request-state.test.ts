import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequestGate} from '../lib/request-state.ts';
test('scope changes invalidate an in-flight answer',()=>{const gate=createRequestGate(),ticket=gate.begin();gate.invalidate();assert.equal(gate.isCurrent(ticket),false);});
test('only latest request can publish its result',()=>{const gate=createRequestGate(),first=gate.begin(),second=gate.begin();assert.equal(gate.isCurrent(first),false);assert.equal(gate.isCurrent(second),true);});
