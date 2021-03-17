"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _swrev = require('swrev');var _store = require('svelte/store');var a="sswr-",p=class extends _swrev.DefaultCache{constructor(){super();let e=this.storage();if(!!e){for(let s=0;s<e.length;s++){let t=e.key(s);if(t.slice(0,a.length)!==a)continue;let o=t.slice(a.length),c=e.getItem(t),i=JSON.parse(c);this.elements.set(o,new (0, _swrev.CacheItem)({data:i.data,expiresAt:i.expiresAt?new Date(i.expiresAt):null}))}setInterval(()=>this.purge(),15e3)}}storage(){return typeof window!="undefined"&&"sessionStorage"in window&&window.sessionStorage||null}purge(){this.elements.forEach((e,s)=>{e.hasExpired()&&this.remove(s,{broadcast:!1})})}remove(e,s){super.remove(e,s),_optionalChain([this, 'access', _ => _.storage, 'call', _2 => _2(), 'optionalAccess', _3 => _3.removeItem, 'call', _4 => _4(a+e)])}resolve(e,s){Promise.resolve(s.data).then(t=>{if(t==null)return this.remove(e);s.data=t,_optionalChain([this, 'access', _5 => _5.storage, 'call', _6 => _6(), 'optionalAccess', _7 => _7.setItem, 'call', _8 => _8(a+e,JSON.stringify(s))]),this.broadcast(e,t)})}};var m=class extends _swrev.SWR{useSvelte(e,s){let t=()=>{},n=_store.writable.call(void 0, this.get(this.resolveKey(e)),()=>()=>t()),o=_store.writable.call(void 0, void 0,()=>()=>t()),c=r=>n.set(r),i=r=>o.set(r);return t=this.use(e,c,i,s).unsubscribe,n.then=r=>new Promise(d=>{let v,h=()=>{};h=n.subscribe(l=>{if(l!==void 0){h(),v=l;let S=_optionalChain([r, 'optionalCall', _9 => _9(l)]);d(S||l)}}),v&&h()}),{data:n,error:o,mutate:(r,d)=>this.mutate(this.resolveKey(e),r,d),revalidate:r=>this.revalidate(this.resolveKey(e),r),clear:r=>this.clear(this.resolveKey(e),r),unsubscribe:t,then:r=>{n.then(r).then(()=>t())}}}},g= exports.createSWR =(u={})=>{let e=new m({cache:new p,...u});return{useSWR:(s,t)=>e.useSvelte(s,t),mutate:(s,t,n)=>e.mutate(s,t,n),revalidate:(s,t)=>e.revalidate(s,t),clear:(s,t)=>e.clear(s,t)}};exports.SSWR = m; exports.createSWR = g;
