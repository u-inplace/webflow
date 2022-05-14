/*! For license information please see StepCleaning.js.LICENSE.txt */
!function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)e[n]=i[n]}return e}var t=function t(i,n){function r(t,r,s){if("undefined"!=typeof document){"number"==typeof(s=e({},n,s)).expires&&(s.expires=new Date(Date.now()+864e5*s.expires)),s.expires&&(s.expires=s.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var o="";for(var c in s)s[c]&&(o+="; "+c,!0!==s[c]&&(o+="="+s[c].split(";")[0]));return document.cookie=t+"="+i.write(r,t)+o}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],n={},r=0;r<t.length;r++){var s=t[r].split("="),o=s.slice(1).join("=");try{var c=decodeURIComponent(s[0]);if(n[c]=i.read(o,c),e===c)break}catch(e){}}return e?n[e]:n}},remove:function(t,i){r(t,"",e({},i,{expires:-1}))},withAttributes:function(i){return t(this.converter,e({},this.attributes,i))},withConverter:function(i){return t(e({},this.converter,i),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(i)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"}),i=t;const n="/booking",r="/booking/services",s="/booking/cleaning",o="__booking";class c{#e;list;constructor(e){const t=i.get(o);if(t){const e=JSON.parse(t);this.list=e.seq}else this.init({});this.current=e}init({ironing:e=!1,cleaning:t=!1}={}){let i=[n,r];e&&i.push("/booking/ironing"),t&&i.push(s),i=i.concat(["/booking/duration","/booking/availability","/booking/confirmation"]),this.list=i,this.setCookies()}setCookies(){i.set(o,JSON.stringify({seq:this.list}),{secure:!0,sameSite:"strict"})}next(){return this.list[this.#e+1]}prev(){return this.list[this.#e-1]}get total(){return this.list.length}get current(){return this.list[this.#e]}set current(e){const t=Object.values(this.list).findIndex((t=>t===e));t>=0&&(this.#e=t)}get currentIndex(){return this.#e}}class a{static id(e){return document.getElementById(e)}static q(e){return document.querySelector(e)}static qall(e){return document.querySelectorAll(e)}static toast(e){const t=a.id(e);return t.classList.add("active"),setTimeout((()=>{t.classList.remove("active")}),4e3)}static set nextButtonDisabled(e){const t=document.querySelector(".next-button-flow");t&&(t.disabled=e,e?t.classList.add("disabled"):t.classList.remove("disabled"))}static queryOptions(e,t=!1){return Array.from(document.querySelectorAll(`input[id*='${e}']${t?":checked":""}`))}static getRadio(e,t=!1){return this.q(`input[name*="${e}"]${t?":checked":""}`)}static queryRadio(e,t=!1){return Array.from(this.qall(`input[name*='${e}']${t?":checked":""}`))}static getOption(e,t=!1){return this.q(`input[id*='${e}']${t?":checked":""}`)}}var u=a;class h{sequence;constructor({formId:e="wf-form-step",sequence:t=new c}){this.sequence=t,u.id(e)&&(u.id(e).onsubmit=this.onNext.bind(this)),u.id("back-button")?.addEventListener("click",this.onBack.bind(this)),window.onpopstate=this.onBack.bind(this)}restart(){window.location.href=r}goto(e){window.location.href=e}onNext(e){e.preventDefault(),history.pushState({},null,location.href),window.location.href=this.sequence.next()}onBack(){window.location.href=this.sequence.prev()}}const l=(e,t)=>e.replace(new RegExp(`^${t}`),"");class d{cookie;ops;constructor(){this.cookie=window.FpCookie,this.ops=this.cookie.store}get isValid(){return Object.keys(this.ops).length>0}#t(e){return Object.entries(this.ops).filter((([t,i])=>t.startsWith(e))).reduce(((t,[i,n])=>(t[l(i,e)]=n,t)),{})}#i(e,t){return Object.entries(this.ops).filter((([i,n])=>i.startsWith(e)&&(void 0===t||n===t))).map((([t,i])=>l(t,e)))}get cleaning(){return this.ops["service-cleaning"]?this.#t("cleaning-"):{}}get extras(){return this.ops["service-cleaning"]?this.#i("extra-",!0):[]}get extra(){return this.ops["service-cleaning"]?this.#t("extra-"):{}}get ironing(){return this.ops["service-ironing"]?this.ops.ironing.replace("ironing-size-",""):""}get postalCode(){return this.ops["postal-code"]}get services(){return this.#i("service-",!0)}get service(){return this.#t("service-")}get duration(){return this.ops?.duration}get recurrence(){return this.ops?.frequency}get start(){return new Date(this.ops["start-timestamp"])}get end(){return new Date(this.ops["end-timestamp"])}get teamMember(){return{id:this.ops["team-member"],name:this.ops["team-member-name"],firstName:this.ops["team-member-first-name"]}}}class p extends class{form;nav;ops;constructor(e,t="wf-form-step"){this.form=u.id(t),this.nav=new h({formId:t,sequence:new c(e)}),this.ops=new d,this.validateState()}init(){this.setupInputHandlers(),u.nextButtonDisabled=!0,this.toggleNext(),this.updateNav()}setupInputHandlers(){this.form.querySelectorAll("input").forEach((e=>{if("submit"===e.type)return;const t={radio:"click",number:"input"}[e.type]||"change";e.addEventListener(t,this.toggleNext.bind(this)),e.checked=!1}))}validateState(){this.ops.isValid&&this.ops.postalCode?0===this.ops.services.length&&this.nav.goto(r):this.nav.goto(n)}toggleNext(){u.nextButtonDisabled=this.isNextDisabled}get isNextDisabled(){return!1}updateNav(){u.id("step-nav").innerHTML=`Step ${this.nav.sequence.currentIndex}/${this.nav.sequence.total-1}`}}{constructor(){super(s)}get isNextDisabled(){return!(u.getOption("supplies-conf",!0)&&u.getRadio("home-bathrooms",!0)&&u.getRadio("home-bedrooms",!0))}}var g=g||window.Webflow||[];g.push((()=>{(new p).init()}))}();
//# sourceMappingURL=StepCleaning.js.map