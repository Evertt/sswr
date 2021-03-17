import{SWR as D}from"swrev";import{writable as S}from"svelte/store";import{CacheItem as h,DefaultCache as v}from"swrev";var u=class extends v{constructor(){super();if(typeof window!="undefined"){for(let e=0;e<localStorage.length;e++){let s=window.sessionStorage.key(e),t=s.replace(/^sswr-/,"");if(s===t)continue;let r=window.sessionStorage.getItem(s),i=JSON.parse(r);this.elements.set(t,new h({data:i.data,expiresAt:i.expiresAt?new Date(i.expiresAt):null}))}setInterval(()=>this.purge(),15e3)}}purge(){for(let e=0;e<localStorage.length;e++){let s=window.sessionStorage.key(e),t=s.replace(/^sswr-/,"");if(s===t)continue;let r=window.sessionStorage.getItem(s),i=JSON.parse(r);!i.expiresAt||new Date(i.expiresAt).getTime()>=new Date().getTime()||this.remove(t,{broadcast:!1})}}remove(e,s){super.remove(e,s),typeof window!="undefined"&&window.sessionStorage.removeItem(`sswr-${e}`)}resolve(e,s){Promise.resolve(s.data).then(t=>{if(t==null)return this.remove(e);s.data=t,typeof window!="undefined"&&window.sessionStorage.setItem(`sswr-${e}`,JSON.stringify(s)),this.broadcast(e,t)})}};var d=class extends D{useSvelte(e,s){let t=()=>{},r=S(this.get(this.resolveKey(e)),()=>()=>t()),i=S(void 0,()=>()=>t()),p=n=>r.set(n),f=n=>i.set(n);return t=this.use(e,p,f,s).unsubscribe,r.then=n=>new Promise(l=>{let m,c=()=>{};c=r.subscribe(a=>{if(a!==void 0){c(),m=a;let w=n?.(a);l(w||a)}}),m&&c()}),{data:r,error:i,mutate:(n,l)=>this.mutate(this.resolveKey(e),n,l),revalidate:n=>this.revalidate(this.resolveKey(e),n),clear:n=>this.clear(this.resolveKey(e),n),unsubscribe:t,then:n=>{r.then(n).then(()=>t())}}}},R=(o={})=>{let e=new d({cache:new u,...o});return{useSWR:(s,t)=>e.useSvelte(s,t),mutate:(s,t,r)=>e.mutate(s,t,r),revalidate:(s,t)=>e.revalidate(s,t),clear:(s,t)=>e.clear(s,t)}};export{d as SSWR,R as createSWR};
