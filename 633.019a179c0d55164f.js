"use strict";(self.webpackChunktoggl_overhours=self.webpackChunktoggl_overhours||[]).push([[633],{532:(A,m,s)=>{s.r(m),s.d(m,{FileHandle:()=>E});var i=s(5861),b=s(3754);const{GONE:v}=b.errors,w=/constructor/i.test(window.HTMLElement)||window.safari||window.WebKitPoint;class E{constructor(e="unknown"){this.kind="file",this.writable=!0,this.name=e}getFile(){return(0,i.Z)(function*(){throw new DOMException(...v)})()}createWritable(e={}){var t=this;return(0,i.Z)(function*(){var l;if(e.keepExistingData)throw new TypeError("Option keepExistingData is not implemented");const y=globalThis.TransformStream||(yield s.e(397).then(s.bind(s,9397))).TransformStream,g=globalThis.WritableStream||(yield s.e(397).then(s.bind(s,9397))).WritableStream,n=yield null===(l=navigator.serviceWorker)||void 0===l?void 0:l.getRegistration(),a=document.createElement("a"),c=new y,L=c.writable;if(a.download=t.name,w||!n){let o=[];c.readable.pipeTo(new g({write(r){o.push(new Blob([r]))},close(){const r=new Blob(o,{type:"application/octet-stream; charset=utf-8"});o=[],a.href=URL.createObjectURL(r),a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),1e4)}}))}else{const{writable:o,readablePort:r}=new W(g),d=encodeURIComponent(t.name).replace(/['()]/g,escape).replace(/\*/g,"%2A"),C={"content-disposition":"attachment; filename*=UTF-8''"+d,"content-type":"application/octet-stream; charset=utf-8",...e.size?{"content-length":e.size}:{}},D=setTimeout(()=>n.active.postMessage(0),1e4);c.readable.pipeThrough(new y({transform(p,f){if(p instanceof Uint8Array)return f.enqueue(p);const j=new Response(p).body.getReader(),_=k=>j.read().then(R=>R.done?0:_(f.enqueue(R.value)));return _()}})).pipeTo(o).finally(()=>{clearInterval(D)}),n.active.postMessage({url:n.scope+d,headers:C,readablePort:r},[r]);const h=document.createElement("iframe");h.hidden=!0,h.src=n.scope+d,document.body.appendChild(h)}return L.getWriter()})()}isSameEntry(e){var t=this;return(0,i.Z)(function*(){return t===e})()}}class U{constructor(e){this._readyPending=!1,this._port=e,this._resetReady(),this._port.onmessage=t=>this._onMessage(t.data)}start(e){return this._controller=e,this._readyPromise}write(e){return this._port.postMessage({type:0,chunk:e},[e.buffer]),this._resetReady(),this._readyPromise}close(){this._port.postMessage({type:2}),this._port.close()}abort(e){this._port.postMessage({type:1,reason:e}),this._port.close()}_onMessage(e){0===e.type&&this._resolveReady(),1===e.type&&this._onError(e.reason)}_onError(e){this._controller.error(e),this._rejectReady(e),this._port.close()}_resetReady(){this._readyPromise=new Promise((e,t)=>{this._readyResolve=e,this._readyReject=t}),this._readyPending=!0}_resolveReady(){this._readyResolve(),this._readyPending=!1}_rejectReady(e){this._readyPending||this._resetReady(),this._readyPromise.catch(()=>{}),this._readyReject(e),this._readyPending=!1}}class W{constructor(e){const t=new MessageChannel;this.readablePort=t.port1,this.writable=new e(new U(t.port2))}}}}]);