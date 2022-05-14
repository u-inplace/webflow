/*! For license information please see postal-code.js.LICENSE.txt */
!function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)e[n]=i[n]}return e}var t=function t(i,n){function s(t,s,r){if("undefined"!=typeof document){"number"==typeof(r=e({},n,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var o="";for(var c in r)r[c]&&(o+="; "+c,!0!==r[c]&&(o+="="+r[c].split(";")[0]));return document.cookie=t+"="+i.write(s,t)+o}}return Object.create({set:s,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],n={},s=0;s<t.length;s++){var r=t[s].split("="),o=r.slice(1).join("=");try{var c=decodeURIComponent(r[0]);if(n[c]=i.read(o,c),e===c)break}catch(e){}}return e?n[e]:n}},remove:function(t,i){s(t,"",e({},i,{expires:-1}))},withAttributes:function(i){return t(this.converter,e({},this.attributes,i))},withConverter:function(i){return t(e({},this.converter,i),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(i)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"}),i=t;const n="/booking",s="/booking/services",r="__booking";class o{#e;list;constructor(e){const t=i.get(r);if(t){const e=JSON.parse(t);this.list=e.seq}else this.init({});this.current=e}init({ironing:e=!1,cleaning:t=!1}={}){let i=[n,s];e&&i.push("/booking/ironing"),t&&i.push("/booking/cleaning"),i=i.concat(["/booking/duration","/booking/availability","/booking/confirmation"]),this.list=i,this.setCookies()}setCookies(){i.set(r,JSON.stringify({seq:this.list}),{secure:!0,sameSite:"strict"})}next(){return this.list[this.#e+1]}prev(){return this.list[this.#e-1]}get total(){return this.list.length}get current(){return this.list[this.#e]}set current(e){const t=Object.values(this.list).findIndex((t=>t===e));t>=0&&(this.#e=t)}get currentIndex(){return this.#e}}class c{static id(e){return document.getElementById(e)}static q(e){return document.querySelector(e)}static qall(e){return document.querySelectorAll(e)}static toast(e){const t=c.id(e);return t.classList.add("active"),setTimeout((()=>{t.classList.remove("active")}),4e3)}static set nextButtonDisabled(e){const t=document.querySelector(".next-button-flow");t&&(t.disabled=e,e?t.classList.add("disabled"):t.classList.remove("disabled"))}static queryOptions(e,t=!1){return Array.from(document.querySelectorAll(`input[id*='${e}']${t?":checked":""}`))}static getRadio(e,t=!1){return this.q(`input[name*="${e}"]${t?":checked":""}`)}static queryRadio(e,t=!1){return Array.from(this.qall(`input[name*='${e}']${t?":checked":""}`))}static getOption(e,t=!1){return this.q(`input[id*='${e}']${t?":checked":""}`)}}var a=c;class u{sequence;constructor({formId:e="wf-form-step",sequence:t=new o}){this.sequence=t,a.id(e)&&(a.id(e).onsubmit=this.onNext.bind(this)),a.id("back-button")?.addEventListener("click",this.onBack.bind(this)),window.onpopstate=this.onBack.bind(this)}restart(){window.location.href=s}goto(e){window.location.href=e}onNext(e){e.preventDefault(),history.pushState({},null,location.href),window.location.href=this.sequence.next()}onBack(){window.location.href=this.sequence.prev()}}const h=(e,t)=>e.replace(new RegExp(`^${t}`),"");class l{cookie;ops;constructor(){this.cookie=window.FpCookie,this.ops=this.cookie.store}get isValid(){return Object.keys(this.ops).length>0}#t(e){return Object.entries(this.ops).filter((([t,i])=>t.startsWith(e))).reduce(((t,[i,n])=>(t[h(i,e)]=n,t)),{})}#i(e,t){return Object.entries(this.ops).filter((([i,n])=>i.startsWith(e)&&(void 0===t||n===t))).map((([t,i])=>h(t,e)))}get cleaning(){return this.ops["service-cleaning"]?this.#t("cleaning-"):{}}get extras(){return this.ops["service-cleaning"]?this.#i("extra-",!0):[]}get extra(){return this.ops["service-cleaning"]?this.#t("extra-"):{}}get ironing(){return this.ops["service-ironing"]?this.ops.ironing.replace("ironing-size-",""):""}get postalCode(){return this.ops["postal-code"]}get services(){return this.#i("service-",!0)}get service(){return this.#t("service-")}get duration(){return this.ops?.duration}get recurrence(){return this.ops?.frequency}get start(){return new Date(this.ops["start-timestamp"])}get end(){return new Date(this.ops["end-timestamp"])}get teamMember(){return{id:this.ops["team-member"],name:this.ops["team-member-name"],firstName:this.ops["team-member-first-name"]}}}class d extends class{form;nav;ops;constructor(e,t="wf-form-step"){this.form=a.id(t),this.nav=new u({formId:t,sequence:new o(e)}),this.ops=new l,this.validateState()}init(){this.setupInputHandlers(),a.nextButtonDisabled=!0,this.toggleNext(),this.updateNav()}setupInputHandlers(){this.form.querySelectorAll("input").forEach((e=>{if("submit"===e.type)return;const t={radio:"click",number:"input"}[e.type]||"change";e.addEventListener(t,this.toggleNext.bind(this)),e.checked=!1}))}validateState(){this.ops.isValid&&this.ops.postalCode?0===this.ops.services.length&&this.nav.goto(s):this.nav.goto(n)}toggleNext(){a.nextButtonDisabled=this.isNextDisabled}get isNextDisabled(){return!1}updateNav(){a.id("step-nav").innerHTML=`Step ${this.nav.sequence.currentIndex}/${this.nav.sequence.total-1}`}}{coverage=["1070","1160","1082","1000","1040","1140","1190","1083","1130","1050","1090","1081","1020","1080","1120","1060","1210","1030","1180","1170","1200","1150"];constructor(){super(n)}init(){super.init(),this.nav.sequence.init(),this.pc.addEventListener("input",this.onPostalCode.bind(this))}validateState(){}get isNextDisabled(){const{pc:e}=this,{value:t}=e;return!this.coverage.includes(t)}get pc(){return a.id("postal-code")}toggleNext(){super.toggleNext(),this.isNextDisabled||a.id("next-btn").click()}onPostalCode(e){const t=e.target,{value:i}=t;i.length!==t.maxLength||this.coverage.includes(i)||(window.scrollTo({top:0,behavior:"smooth"}),a.toast("alert-area"))}updateNav(){}}var p=p||window.Webflow||[];p.push((()=>{(new d).init()}))}();
//# sourceMappingURL=postal-code.js.map