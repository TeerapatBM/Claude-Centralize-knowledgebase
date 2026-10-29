import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAppearance,defaults} from '../lib/appearance.ts';
test('restores valid appearance preferences',()=>{assert.deepEqual(normalizeAppearance({mode:'dark',accent:'iris',density:'compact',motion:false}),{mode:'dark',accent:'iris',density:'compact',motion:false});});
test('corrupt storage and unsupported values fall back safely',()=>{for(const v of [null,[],true,'broken',{}, {mode:'evil',accent:'url(x)',density:5,motion:'false'}])assert.deepEqual(normalizeAppearance(v),defaults);});
test('does not copy unknown values or secret fields into preferences',()=>{assert.deepEqual(Object.keys(normalizeAppearance({mode:'light',apiKey:'secret'})).sort(),['accent','density','mode','motion']);assert.equal(normalizeAppearance({mode:'light'}).mode,'light');});
