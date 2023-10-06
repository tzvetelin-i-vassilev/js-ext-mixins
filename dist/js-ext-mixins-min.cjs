"use strict";
/**
 * [js-ext-mixins]{@link https://github.com/tzvetelin-i-vassilev/js-ext-mixins}
 *
 * @namespace jsExt
 * @version 1.0.8
 * @author Tzvetelin Vassilev
 * @copyright Tzvetelin Vassilev 2020-2023
 * @license ISC
 */class t{static overrides=["toString"];static extend(t,e=this){let r;return"string"==typeof t?(r=t,t=globalThis[r]):r=t.name,t?(this.debug&&console.log("extend",t.name,e.name),Object.getOwnPropertyNames(e.prototype).filter((t=>"constructor"!=t)).forEach((r=>{!(r in t.prototype)||e.overrides.includes(r)?(this.debug&&(e.overrides.includes(r)?console.log(`%coverride ${r}`,"color: chartreuse"):console.log(`%cdefine ${r}`,"color: green")),Object.defineProperty(t.prototype,r,{value:e.prototype[r],configurable:!0})):this.debug&&console.log(`%cexclude ${r}`,"color: red")})),Object.getOwnPropertyNames(e).forEach((r=>{"function"==typeof e[r]&&"extend"!=r&&(!(r in t)||e.overrides.includes(r)?(this.debug&&(e.overrides.includes(r)?console.log(`%coverride static ${r}`,"color: chartreuse"):console.log(`%cdefine static ${r}`,"color: orange")),t[r]=e[r]):this.debug&&console.log(`%cexclude static ${r}`,"color: red"))})),e.properties&&Object.keys(e.properties).forEach((r=>{r in t.prototype?this.debug&&console.log(`%cexclude prop ${r}`,"color: red"):e.properties[r]&&(this.debug&&console.log(`%cdefine prop ${r}`,"color: darkseagreen"),Object.defineProperty(t.prototype,r,e.properties[r]))})),e.classProperties&&Object.keys(e.classProperties).forEach((r=>{r in t?this.debug&&console.log(`%cexclude static prop ${r}`,"color: red"):e.classProperties[r]&&(this.debug&&console.log(`%cdefine static prop ${r}`,"color: chocolate"),Object.defineProperty(t,r,e.classProperties[r]))})),!0):(this.debug&&console.warn(`Class ${r} not found`),!1)}}class e{constructor(t,e,r){Object.defineProperty(this,"type",{value:t,enumerable:!0}),Object.defineProperty(this,"name",{value:e,enumerable:!0}),Object.defineProperty(this,"value",{value:r,enumerable:!0})}toString(){return this.name}}class r extends t{static classProperties={MAX_INT32:{value:2147483647,enumerable:!0},MAX_UINT32:{value:4294967295,enumerable:!0},MAX_INT64:"undefined"==typeof BigInt?void 0:{value:0x7FFFFFFFFFFFFFFFn,enumerable:!0},MAX_UINT64:"undefined"==typeof BigInt?void 0:{value:0xFFFFFFFFFFFFFFFFn,enumerable:!0}};format(t){if(!Number.isInteger(this)||this<0)throw new Error(`Underlying number ${this} should be positive integer`);return this.toString().length<t.length?t.substring(0,t.length-this.toString().length)+this:this.toString()}}class i extends t{static fromArrayBuffer(t){if(!(t instanceof ArrayBuffer))throw new Error("ArrayBuffer is expected");let e=new Uint8Array(t),r=new SharedArrayBuffer(t.byteLength);return new Uint8Array(r).set(e),r}}const s=["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64","BigInt64","BigUint64"];let n,o,a,h,l=class t{constructor(t,e){this.width=t,this.height=e}toJSON(){return{width:this.width,height:this.height}}toString(){return`size(${this.width}, ${this.height})`}static fromSize(e){if(e instanceof t)return e;if("string"==typeof e){if(!e.startsWith("size("))throw new Error("Invalid value found. Expected template - size(width, height).");{let t=e.substring(e.indexOf("(")+1,e.indexOf(")")).split(/,\s*/g);e={width:parseFloat(t[0]),height:parseFloat(t[1])}}}if(isNaN(e.width))throw new Error("Invalid width found, expected number");if(isNaN(e.height))throw new Error("Invalid height found, expected number");return new t(e.width,e.height)}};class f extends t{static overrides=t.overrides.concat(["fromMatrix","multiply","multiplySelf","transformPoint"]);static properties={tx:{get:function(){return this.e},set:function(t){this.e=t},enumerable:!0},ty:{get:function(){return this.f},set:function(t){this.f=t},enumerable:!0},dx:{get:function(){return this.e},set:function(t){this.e=t},enumerable:!0},dy:{get:function(){return this.f},set:function(t){this.f=t},enumerable:!0},multiplicationType:{value:"POST",enumerable:!0,writable:!0}};static classProperties={MultiplicationType:{value:{PRE:"PRE",POST:"POST"},enumerable:!0}};preMultiply(t){let e=t.postMultiply(this);return e.multiplicationType=this.multiplicationType,e}postMultiply(t){return a.call(this,t)}multiply(t){if(t instanceof DOMMatrix||(t=DOMMatrix.fromMatrix(t)),this.multiplicationType==DOMMatrix.MultiplicationType.POST)return this.postMultiply(t);{let e=this.preMultiply(t);return e.multiplicationType=DOMMatrix.MultiplicationType.PRE,e}}postMultiplySelf(t){return h.call(this,t)}multiplySelf(t){return t instanceof DOMMatrix||(t=DOMMatrix.fromMatrix(t)),this.multiplicationType==DOMMatrix.MultiplicationType.POST?this.postMultiplySelf(t):this.preMultiplySelf(t)}transformPoint(t){return DOMPoint.fromPoint(t).matrixTransform(this)}invert(){return this.inverse()}decompose(){return{translate:{x:this.tx,y:this.ty},rotate:{angle:Math.atan2(this.b,this.a)},skew:{angleX:Math.tan(this.c),angleY:Math.tan(this.b)},scale:{x:Math.sqrt(this.a*this.a+this.c*this.c),y:Math.sqrt(this.d*this.d+this.b*this.b)},matrix:this}}toString(t=!1){if(!t)return o.call(this);let e=t=>((t<0?"":" ")+t.toPrecision(6)).substring(0,8);return" Matrix 4x4\n"+"-".repeat(39)+`\n${e(this.m11)}, ${e(this.m21)}, ${e(this.m31)}, ${e(this.m41)}`+`\n${e(this.m12)}, ${e(this.m22)}, ${e(this.m32)}, ${e(this.m42)}`+`\n${e(this.m13)}, ${e(this.m23)}, ${e(this.m33)}, ${e(this.m43)}`+`\n${e(this.m14)}, ${e(this.m24)}, ${e(this.m34)}, ${e(this.m44)}`}static fromMatrix(t,e){let r;return"string"==typeof t?r=new DOMMatrix(t):("e"in t||(t.e=t.tx||t.dx),"f"in t||(t.f=t.ty||t.dy),r=n(t)),r.multiplicationType=e||t.multiplicationType||DOMMatrix.MultiplicationType.POST,r}static fromTranslate(t){let e=isFinite(t)?{tx:t,ty:t}:{tx:t.x,ty:t.y};return DOMMatrix.fromMatrix(e)}static fromRotate(t,e){let r=Math.sin(t),i=Math.cos(t),s={a:i,b:r,c:-r,d:i};return e&&(s.tx=e.x-e.x*i+e.y*r,s.ty=e.y-e.x*r-e.y*i),DOMMatrix.fromMatrix(s)}static fromScale(t,e){isFinite(t)&&(t={x:t,y:t});let r={a:t.x,d:t.y};return e&&(r.tx=e.x-e.x*t.x,r.ty=e.y-e.y*t.y),DOMMatrix.fromMatrix(r)}static fromPoints(t,e){let r=DOMMatrix.fromMatrix({m11:t[0].x,m21:t[1].x,m31:t[2].x,m12:t[0].y,m22:t[1].y,m32:t[2].y,m13:1,m23:1,m33:1}),i=DOMMatrix.fromMatrix({m11:e[0].x,m21:e[1].x,m31:e[2].x,m12:e[0].y,m22:e[1].y,m32:e[2].y,m13:1,m23:1,m33:1}),s=r.invert().preMultiply(i);return DOMMatrix.fromMatrix({a:s.m11,b:s.m12,c:s.m21,d:s.m22,tx:s.m31,ty:s.m32})}static extend(){if("undefined"==typeof DOMMatrix||n)return!1;n=DOMMatrix.fromMatrix,o=DOMMatrix.prototype.toString,a=DOMMatrix.prototype.multiply,h=DOMMatrix.prototype.multiplySelf,t.extend("DOMMatrix",this)}}var c=Object.freeze({__proto__:null,ArrayBufferExt:class extends t{toBase64(){if(!String.fromCharArray)throw new Error("String extension is required");let t=new Uint8Array(this);return btoa(String.fromCharArray(t))}static fromBase64(t){if(!String.prototype.toCharArray)throw new Error("String extension is required");return atob(t).toCharArray(!0).buffer}static isTypedArray(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}},ArrayExt:class extends t{static properties={first:{get:function(){return this[0]},configurable:!0},last:{get:function(){return this[this.length-1]},configurable:!0}};clear(){this.length=0}clone(){if(!Object.clone)throw new Error("Object extension is required");return this.map((t=>Object.clone(t)))}unique(){return this.filter(((t,e)=>this.indexOf(t)==e))}insert(t,e=0){this.splice(e,0,t)}indicesOf(t){let e=[],r=this.indexOf(t);if(-1!=r){e.push(r);let i=this.lastIndexOf(t);for(;i>r;)r=this.indexOf(t,r+1),e.push(r)}return e}remove(...t){return(t=>{let e=[],r=-1;return t.forEach((t=>{r-t!=1&&e.push([]),e.last.push(t),r=t})),e})(t.map((t=>this.indicesOf(t))).flat().sort(((t,e)=>e-t))).forEach((t=>this.removeAt(t.last,t.length))),this}removeAt(t,e=1){return t>-1&&this.splice(t,e),this}replace(t,e,r=!1){let i=this.indexOf(t);return i>-1&&(!r&&e instanceof Array?this.splice(i,1,...e):this.splice(i,1,e)),this}static from(t){return Array.prototype.slice.call(t)}},CSSStyleSheetExt:class extends t{findRule(t){let e,r=this.cssRules;for(let i of r)if(i.selectorText==t){e=i;break}return e}findRules(t){return Array.from(this.cssRules).filter((e=>e.selectorText==t))}toTextList(){return Array.from(this.cssRules).map((t=>t.cssText))}toString(){return Array.from(this.cssRules).map((t=>t.cssText)).join("\n")}},DOMMatrixExt:f,DOMPointExt:class extends t{transform(t){return t instanceof DOMMatrix||(t=DOMMatrix.fromMatrix(t)),this.matrixTransform(t)}toString(){return`point(${this.x}, ${this.y}, ${this.z})`}},DOMRectExt:class extends t{static properties={size:{get:function(){return new l(this.width,this.height)},configurable:!0},center:{get:function(){return new DOMPoint((this.left+this.right)/2,(this.top+this.bottom)/2)},configurable:!0}};union(t){return t?DOMRect.ofEdges(Math.min(this.left,t.left),Math.min(this.top,t.top),Math.max(this.right,t.right),Math.max(this.bottom,t.bottom)):this}intersect(t){if(!t)return;let e=DOMRect.ofEdges(Math.max(this.left,t.left),Math.max(this.top,t.top),Math.min(this.right,t.right),Math.min(this.bottom,t.bottom));return e.width>0&&e.height>0?e:void 0}intersects(t){return this.left<=t.right&&this.right>=t.left&&this.top<=t.bottom&&this.bottom>=t.top}ceil(t=!1){let e=Math.floor(this.left),r=Math.floor(this.top),i=Math.ceil(this.right),s=Math.ceil(this.bottom);if(t){let t=this.width,n=this.height;t+=t%2,n+=n%2,i=e+t,s=r+n}return DOMRect.ofEdges(e,r,i,s)}floor(t=!1){let e=Math.ceil(this.left),r=Math.ceil(this.top),i=Math.floor(this.right),s=Math.floor(this.bottom);if(t){let t=this.width,n=this.height;t-=t%2,n-=n%2,i=e+t,s=r+n}return DOMRect.ofEdges(e,r,i,s)}contains(t){return this.left<=t.x&&this.right>=t.x&&this.top<=t.y&&this.bottom>=t.y}includes(t){return this.left<=t.left&&this.right>=t.right&&this.top<=t.top&&this.bottom>=t.bottom}transform(t){t instanceof DOMMatrix||(t=DOMMatrix.fromMatrix(t));let e=DOMPoint.fromPoint({x:this.left,y:this.top}).transform(t),r=DOMPoint.fromPoint({x:this.right,y:this.top}).transform(t),i=DOMPoint.fromPoint({x:this.left,y:this.bottom}).transform(t),s=DOMPoint.fromPoint({x:this.right,y:this.bottom}).transform(t),n=Math.min(e.x,r.x,i.x,s.x),o=Math.min(e.y,r.y,i.y,s.y),a=Math.max(e.x,r.x,i.x,s.x),h=Math.max(e.y,r.y,i.y,s.y);return DOMRect.ofEdges(n,o,a,h)}toPath(){let t=[];return t.push(this.left,this.top),t.push(this.right,this.top),t.push(this.right,this.bottom),t.push(this.left,this.bottom),t.push(this.left,this.top),t.toFloat32Array()}toString(){return`rect(${this.x}, ${this.y}, ${this.width}, ${this.height})`}static ofEdges(t,e,r,i){return new DOMRect(t,e,r-t,i-e)}static extend(){t.extend("DOMRect",this)&&(globalThis.DOMSize=l)}},DateExt:class extends t{format(t){let e=t;function r(t,r){let i=RegExp(`${t}+`).exec(e);if(i){let s=i[0],n=s.replace(new RegExp(s.substring(0,1),"g"),"0");"Y"==t&&"YY"==s&&(r=parseInt(r.toString().substring(2))),e=e.replace(s,r.format(n))}}if(r("Y",this.getFullYear()),r("M",this.getMonth()+1),r("D",this.getDate()),r("h",this.getHours()),r("m",this.getMinutes()),r("s",this.getSeconds()),r("S",this.getMilliseconds()),e.match(/[a-zA-Z]/))throw new Error(`Invalid pattern found in ${t}: ${e.match(/[a-zA-Z]+/)[0]}`);return e}static format(t,e=Date.now()){return new Date(e).format(t)}},FunctionExt:class extends t{static properties={body:{get:function(){let t=this.toString();return t=t.substring(t.indexOf("{")+1,t.lastIndexOf("}")),t},configurable:!0}};createClass(t,e,r={}){let i=r.args||{};return new Function(e.name,...Object.keys(i),`return class ${t} extends ${e.name} {\n\t\t\tconstructor() {\n\t\t\t\tsuper(...arguments);\n\t\t\t\t${r.constructorSrc||""}\n\t\t\t}\n\t\t\t${r.methods||""}\n\t\t}`)(e,...Object.values(i))}},HTMLElementExt:class extends t{static properties={computedStyle:{get:function(){return window.getComputedStyle(this)},configurable:!0}};getClientOffset(t=!1){let e=this,r=0,i=0;do{r+=e.offsetLeft,i+=e.offsetTop,e=e.offsetParent}while(e);let s=this,n=0,o=0;if(!t)do{if("fixed"==s.computedStyle.position){n=0,o=0;break}n+=s.scrollLeft,o+=s.scrollTop,s=s.parentNode,s&&s.host&&(s=s.host)}while(s!=document);return new DOMPoint(r-n,i-o)}toRect(){let t=this.style.display,e=this.style.visibility;"none"==t&&(this.style.visibility="hidden",this.style.display="");let r=window.getComputedStyle(this),i=parseFloat(r.marginLeft),s=parseFloat(r.marginTop),n=parseFloat(r.marginRight),o=parseFloat(r.marginBottom),a=this.offsetWidth+i+n,h=this.offsetHeight+s+o,l=new DOMRect(this.offsetLeft,this.offsetTop,this.offsetWidth,this.offsetHeight);return l.outerSize=new DOMSize(a,h),"none"==t&&(this.style.visibility=e,this.style.display="none"),l}},HTMLImageElementExt:class extends t{toDataURL(t="png"){let e=document.createElement("canvas");return e.width=this.width,e.height=this.height,e.getContext("2d").drawImage(this,0,0),e.toDataURL(`image/${t}`)}toBlob(t="png"){return new Blob([this.toArrayBuffer(t)],{type:`image/${t}`})}toArrayBuffer(t){if(!ArrayBuffer.fromBase64)throw new Error("ArrayBuffer extension is required");let e=this.toDataURL(t).split(",")[1];return ArrayBuffer.fromBase64(e)}},ImageExt:class extends t{static async fromBytes(t,e="png",r=new Image){return new Promise(((i,s)=>{r.onload=()=>{URL.revokeObjectURL(r.src),i(r)},r.onerror=s,r.src=URL.createObjectURL(new Blob([t.buffer||t],{type:`image/${e}`}))}))}},LocationExt:class extends t{static get properties(){return{query:{get:function(){if(!this._query){let t=Object.assign({},...this.search.substring(1).split("&").filter((t=>t)).map((t=>t.split("="))).map((t=>({[t[0]]:decodeURIComponent(t[1])}))));Object.defineProperty(this,"_query",{value:t})}return this._query},configurable:!0}}}},NumberExt:r,ObjectExt:class extends t{static equals(t,e){if(t===e)return!0;if(!(t instanceof Object&&e instanceof Object))return!1;if(t.constructor!==e.constructor)return!1;if(t instanceof Array||ArrayBuffer.isTypedArray(t))return t.length==e.length&&t.every(((t,r)=>Object.equals(t,e[r])));for(let r in t)if(t.hasOwnProperty(r)){if(!e.hasOwnProperty(r))return!1;if(t[r]!==e[r]){if("object"!=typeof t[r])return!1;if(!Object.equals(t[r],e[r]))return!1}}for(let r in e)if(e.hasOwnProperty(r)&&!t.hasOwnProperty(r))return!1;return!0}static clone(t,e=!1){let r=new Array;return function t(i){if(null===i)return null;if("object"!=typeof i||i.immutable)return i;if("function"==typeof i.clone)return i.clone();for(let t=0;t<r.length;t++)if(r[t][0]===i)return r[t][1];let s=Object.create(Object.getPrototypeOf(i));r.push([i,s]);for(let r in i)e&&"function"==typeof i[r]||i.hasOwnProperty(r)&&(s[r]=t(i[r]));return s}(t)}static defineEnum(t,r,i){if(t[r])throw new Error(`Already exist property: ${r}`);let s={name:r,values:i.map(((t,i)=>new e(r,t,i)))};return s.values.forEach((t=>{Object.defineProperty(s,t.name,{value:t,enumerable:!0}),Object.defineProperty(s,t.value,{value:t,enumerable:!0})})),Object.defineProperty(t,r,{value:s,enumerable:!0}),s}},ScreenExt:class extends t{static properties={size:{get:()=>new l(Math.floor(screen.width),Math.floor(screen.height)),configurable:!0},resolution:{get:()=>new l(Math.floor(screen.width*devicePixelRatio),Math.floor(screen.height*devicePixelRatio)),configurable:!0}}},SetExt:class extends t{map(t){let e=new Set;for(let r of this)r=t(r),r&&e.add(r);return e}filter(t){let e=new Set;for(let r of this)t(r)&&e.add(r);return e}},ShadowRootExt:class extends t{adoptStyleSheet(t){let e;if(this.adoptedStyleSheets)e=new CSSStyleSheet,e.replaceSync(t),this.adoptedStyleSheets.push(e);else{let r=document.createElement("style");r.innerHTML=t,this.appendChild(r),e=r.sheet}return e}},SharedArrayBufferExt:i,StringExt:class extends t{padStart(t,e="-"){return this.length<t?new Array(t-this.length+1).join(e)+this:this.toString()}toCharArray(t=!1){let e=[],r=!0;for(let t=0;t<this.length;t++){let i=this.charCodeAt(t);i>255&&(r=!1),e[t]=i}if(t){if(!r)throw new Error("Current value is not byte string");e=new Uint8Array(e)}return e}static fromCharArray(t){let e="";try{e=String.fromCharCode.apply(null,t)}catch(r){for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r])}return e}},TypedArrayExt:class extends t{clone(){if("undefined"!=typeof SharedArrayBuffer&&this.buffer instanceof SharedArrayBuffer){let t=new SharedArrayBuffer(this.byteLength),e=new this.constructor(t);return e.set(this,this.byteOffset),e}return new this.constructor(this,this.byteOffset,this.length)}concat(...t){let e,r=this.length,i=this.length;return t.forEach((t=>{if(this.constructor!=t.constructor)throw new Error(`Concat array from wrong type detected - expected ${this.constructor.name}, found ${t.constructor.name}`);r+=t.length})),e="undefined"!=typeof SharedArrayBuffer&&this.buffer instanceof SharedArrayBuffer?this.constructor.createSharedInstance(r):new this.constructor(r),e.set(this),t.forEach((t=>{e.set(t,i),i+=t.length})),e}toArray(){return Array.from(this)}static createSharedInstance(t=0){if(t instanceof this)return"undefined"==typeof SharedArrayBuffer||t.buffer instanceof SharedArrayBuffer?t:new this(i.fromArrayBuffer(t.buffer));if("number"!=typeof t&&!Array.isArray(t))throw new Error("Expected data type is Array");let e="number"==typeof t?t:t.length;if("undefined"==typeof SharedArrayBuffer)return new this("number"==typeof t?e:t);{let r=new SharedArrayBuffer(e*this.BYTES_PER_ELEMENT);if("number"==typeof t)return new this(r);{let e=new this(r);return e.set(t),e}}}static from(t){return new this(t)}static extend(){s.forEach((e=>{if(t.extend(e+"Array",this)){let t=globalThis[e+"Array"];Object.defineProperty(Array.prototype,"to"+e+"Array",{value:function(){return t.from(this)},configurable:!0})}}))}}});if("undefined"==typeof globalThis&&("undefined"!=typeof window?window.globalThis=window:"undefined"!=typeof self?self.globalThis=self:"undefined"!=typeof global&&(global.globalThis=global)),!globalThis.JS_EXT_SCOPE){const t=Object.keys(c).map((t=>t.substring(0,t.length-3)));Object.defineProperty(globalThis,"JS_EXT_SCOPE",{value:t,enumerable:!0,configurable:!0})}const u=new Function("Extension","name","Extension.extend(name)");for(let t of globalThis.JS_EXT_SCOPE){let e=c[`${t}Ext`];if(!e)throw new Error(`Extension ${t} not found`);u(e,t)}exports.Extension=t,exports.version="1.0.8";
