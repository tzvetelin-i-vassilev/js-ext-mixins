!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";
/**
	 * [js-ext-mixins/polyfills/css-style-sheet]{@link https://github.com/tzvetelin-i-vassilev/js-ext-mixins}
	 *
	 * @namespace jsExt
	 * @version 1.0.11
	 * @author Tzvetelin Vassilev
	 * @copyright Tzvetelin Vassilev 2020-2025
	 * @license ISC
	 */const e=window.CSSStyleSheet,t=Object.getOwnPropertyNames(e.prototype).slice(1);e.prototype.replaceSync||(window.CSSStyleSheet=class{static get polyfill(){return!0}#e;constructor(){for(let n of t){let t=Object.getOwnPropertyDescriptor(e.prototype,n);"function"==typeof t.value?this.#e?this[n]=t.value.bind(this.#e):this[n]=function(...e){return t.value.apply(this.#e,e)}:Object.defineProperty(this,n,{get:()=>this.#e[n],configurable:t.configurable,enumerable:t.enumerable})}}replaceSync(e){let t=document.createElement("style");t.innerHTML=e,document.head.appendChild(t),this.#e=t.sheet}})}));
