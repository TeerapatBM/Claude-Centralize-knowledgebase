import {runInNewContext} from 'node:vm';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {appearanceBootstrap} from '../lib/appearance.ts';
function boot(raw:string|null,dark=false,denied=false){const dataset:Record<string,string>={};runInNewContext(appearanceBootstrap,{document:{documentElement:{dataset}},matchMedia:()=>({matches:dark}),localStorage:{getItem(){if(denied)throw Error('denied');return raw;}}});return dataset;}
test('prepaint script restores saved theme without browser modules',()=>{assert.deepEqual(boot(JSON.stringify({mode:'dark',accent:'rose',density:'compact',motion:false})),{theme:'dark',accent:'rose',density:'compact',motion:'off'});});
test('prepaint script follows OS and tolerates denied or corrupt storage',()=>{assert.equal(boot(null,true,true).theme,'dark');assert.equal(boot('{bad').theme,'light');assert.equal(boot(JSON.stringify({mode:'<script>',accent:'evil'})).accent,'ocean');});
