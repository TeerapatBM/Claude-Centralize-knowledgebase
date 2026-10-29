import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRateLimiter} from '../onprem/rate-limit.ts';
test('full limiter admits new keys after existing windows expire',()=>{let now=0;const rate=createRateLimiter(2,()=>now);rate('a',2,100);rate('b',2,100);assert.throws(()=>rate('c',2,100));now=101;assert.doesNotThrow(()=>rate('c',2,100));});
test('limiter counts a key and resets after its own window',()=>{let now=0;const rate=createRateLimiter(10,()=>now);rate('a',1,100);assert.throws(()=>rate('a',1,100));now=101;assert.doesNotThrow(()=>rate('a',1,100));});
