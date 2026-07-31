import{u as Yt,g as $t,v as Bt,r as m,ag as Q,j as r,Q as Lt,q as k,B as me,n as qt}from"./index-BeDIqrBR.js";import{L as Rt,S as ee}from"./react-select.esm-Cwm9AtcL.js";import{c as Ht,C as _t}from"./ConfirmationModal-F2iTz1uk.js";import{G as Qt,S as _e,h as Gt,U as Vt}from"./DoctorAPI-DuzEixgZ.js";import{g as Xt}from"./CustomerAPI-Bln2q7Jn.js";import{L as Ut}from"./loader-BBK4Pa4j.js";import{C as Zt,s as Qe,b as fe}from"./ProcedureAPI-CRYkGdkP.js";import{U as Jt}from"./user-BrMeu9yS.js";import{b as Kt}from"./DefaultLayout-DlOx962b.js";import{C as ea,a as he}from"./CRow-B0rITcpk.js";import{C}from"./CFormInput-9bj-6Qyz.js";import{C as Ge}from"./CFormTextarea-JLG5g_z5.js";import{T as ge}from"./trash-2-DUvAE15q.js";import{P as ta}from"./pen-Cg7hCLfU.js";import{C as aa}from"./circle-plus-CZyqglC9.js";import{C as Ve,a as Xe,b as Ue,c as Ze}from"./CModalHeader-Do9-2MrL.js";import{C as Je}from"./CModalTitle-CwFuP0xu.js";import"./index.esm-FFYuxYBB.js";import"./CFormLabel-BbR234w3.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],Ke=Kt("calendar",ra),dt=6048e5,na=864e5,et=Symbol.for("constructDateFrom");function T(a,t){return typeof a=="function"?a(t):a&&typeof a=="object"&&et in a?a[et](t):a instanceof Date?new a.constructor(t):new Date(t)}function E(a,t){return T(t||a,a)}let sa={};function ne(){return sa}function X(a,t){var h,x,v,j;const n=ne(),e=(t==null?void 0:t.weekStartsOn)??((x=(h=t==null?void 0:t.locale)==null?void 0:h.options)==null?void 0:x.weekStartsOn)??n.weekStartsOn??((j=(v=n.locale)==null?void 0:v.options)==null?void 0:j.weekStartsOn)??0,o=E(a,t==null?void 0:t.in),d=o.getDay(),l=(d<e?7:0)+d-e;return o.setDate(o.getDate()-l),o.setHours(0,0,0,0),o}function re(a,t){return X(a,{...t,weekStartsOn:1})}function ct(a,t){const n=E(a,t==null?void 0:t.in),e=n.getFullYear(),o=T(n,0);o.setFullYear(e+1,0,4),o.setHours(0,0,0,0);const d=re(o),l=T(n,0);l.setFullYear(e,0,4),l.setHours(0,0,0,0);const h=re(l);return n.getTime()>=d.getTime()?e+1:n.getTime()>=h.getTime()?e:e-1}function tt(a){const t=E(a),n=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()));return n.setUTCFullYear(t.getFullYear()),+a-+n}function ia(a,...t){const n=T.bind(null,t.find(e=>typeof e=="object"));return t.map(n)}function at(a,t){const n=E(a,t==null?void 0:t.in);return n.setHours(0,0,0,0),n}function oa(a,t,n){const[e,o]=ia(n==null?void 0:n.in,a,t),d=at(e),l=at(o),h=+d-tt(d),x=+l-tt(l);return Math.round((h-x)/na)}function da(a,t){const n=ct(a,t),e=T(a,0);return e.setFullYear(n,0,4),e.setHours(0,0,0,0),re(e)}function ca(a){return a instanceof Date||typeof a=="object"&&Object.prototype.toString.call(a)==="[object Date]"}function la(a){return!(!ca(a)&&typeof a!="number"||isNaN(+E(a)))}function ua(a,t){const n=E(a,t==null?void 0:t.in);return n.setFullYear(n.getFullYear(),0,1),n.setHours(0,0,0,0),n}const pa={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},ma=(a,t,n)=>{let e;const o=pa[a];return typeof o=="string"?e=o:t===1?e=o.one:e=o.other.replace("{{count}}",t.toString()),n!=null&&n.addSuffix?n.comparison&&n.comparison>0?"in "+e:e+" ago":e};function be(a){return(t={})=>{const n=t.width?String(t.width):a.defaultWidth;return a.formats[n]||a.formats[a.defaultWidth]}}const fa={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},ha={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},ga={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},ba={date:be({formats:fa,defaultWidth:"full"}),time:be({formats:ha,defaultWidth:"full"}),dateTime:be({formats:ga,defaultWidth:"full"})},xa={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},va=(a,t,n,e)=>xa[a];function G(a){return(t,n)=>{const e=n!=null&&n.context?String(n.context):"standalone";let o;if(e==="formatting"&&a.formattingValues){const l=a.defaultFormattingWidth||a.defaultWidth,h=n!=null&&n.width?String(n.width):l;o=a.formattingValues[h]||a.formattingValues[l]}else{const l=a.defaultWidth,h=n!=null&&n.width?String(n.width):a.defaultWidth;o=a.values[h]||a.values[l]}const d=a.argumentCallback?a.argumentCallback(t):t;return o[d]}}const ya={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},wa={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},ja={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Na={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Sa={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},ka={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},Ca=(a,t)=>{const n=Number(a),e=n%100;if(e>20||e<10)switch(e%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},Ma={ordinalNumber:Ca,era:G({values:ya,defaultWidth:"wide"}),quarter:G({values:wa,defaultWidth:"wide",argumentCallback:a=>a-1}),month:G({values:ja,defaultWidth:"wide"}),day:G({values:Na,defaultWidth:"wide"}),dayPeriod:G({values:Sa,defaultWidth:"wide",formattingValues:ka,defaultFormattingWidth:"wide"})};function V(a){return(t,n={})=>{const e=n.width,o=e&&a.matchPatterns[e]||a.matchPatterns[a.defaultMatchWidth],d=t.match(o);if(!d)return null;const l=d[0],h=e&&a.parsePatterns[e]||a.parsePatterns[a.defaultParseWidth],x=Array.isArray(h)?Fa(h,g=>g.test(l)):Da(h,g=>g.test(l));let v;v=a.valueCallback?a.valueCallback(x):x,v=n.valueCallback?n.valueCallback(v):v;const j=t.slice(l.length);return{value:v,rest:j}}}function Da(a,t){for(const n in a)if(Object.prototype.hasOwnProperty.call(a,n)&&t(a[n]))return n}function Fa(a,t){for(let n=0;n<a.length;n++)if(t(a[n]))return n}function Pa(a){return(t,n={})=>{const e=t.match(a.matchPattern);if(!e)return null;const o=e[0],d=t.match(a.parsePattern);if(!d)return null;let l=a.valueCallback?a.valueCallback(d[0]):d[0];l=n.valueCallback?n.valueCallback(l):l;const h=t.slice(o.length);return{value:l,rest:h}}}const Ea=/^(\d+)(th|st|nd|rd)?/i,Oa=/\d+/i,Ia={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},za={any:[/^b/i,/^(a|c)/i]},Aa={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},Ta={any:[/1/i,/2/i,/3/i,/4/i]},Wa={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},Ya={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},$a={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},Ba={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},La={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},qa={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Ra={ordinalNumber:Pa({matchPattern:Ea,parsePattern:Oa,valueCallback:a=>parseInt(a,10)}),era:V({matchPatterns:Ia,defaultMatchWidth:"wide",parsePatterns:za,defaultParseWidth:"any"}),quarter:V({matchPatterns:Aa,defaultMatchWidth:"wide",parsePatterns:Ta,defaultParseWidth:"any",valueCallback:a=>a+1}),month:V({matchPatterns:Wa,defaultMatchWidth:"wide",parsePatterns:Ya,defaultParseWidth:"any"}),day:V({matchPatterns:$a,defaultMatchWidth:"wide",parsePatterns:Ba,defaultParseWidth:"any"}),dayPeriod:V({matchPatterns:La,defaultMatchWidth:"any",parsePatterns:qa,defaultParseWidth:"any"})},Ha={code:"en-US",formatDistance:ma,formatLong:ba,formatRelative:va,localize:Ma,match:Ra,options:{weekStartsOn:0,firstWeekContainsDate:1}};function _a(a,t){const n=E(a,t==null?void 0:t.in);return oa(n,ua(n))+1}function Qa(a,t){const n=E(a,t==null?void 0:t.in),e=+re(n)-+da(n);return Math.round(e/dt)+1}function lt(a,t){var j,g,I,W;const n=E(a,t==null?void 0:t.in),e=n.getFullYear(),o=ne(),d=(t==null?void 0:t.firstWeekContainsDate)??((g=(j=t==null?void 0:t.locale)==null?void 0:j.options)==null?void 0:g.firstWeekContainsDate)??o.firstWeekContainsDate??((W=(I=o.locale)==null?void 0:I.options)==null?void 0:W.firstWeekContainsDate)??1,l=T((t==null?void 0:t.in)||a,0);l.setFullYear(e+1,0,d),l.setHours(0,0,0,0);const h=X(l,t),x=T((t==null?void 0:t.in)||a,0);x.setFullYear(e,0,d),x.setHours(0,0,0,0);const v=X(x,t);return+n>=+h?e+1:+n>=+v?e:e-1}function Ga(a,t){var h,x,v,j;const n=ne(),e=(t==null?void 0:t.firstWeekContainsDate)??((x=(h=t==null?void 0:t.locale)==null?void 0:h.options)==null?void 0:x.firstWeekContainsDate)??n.firstWeekContainsDate??((j=(v=n.locale)==null?void 0:v.options)==null?void 0:j.firstWeekContainsDate)??1,o=lt(a,t),d=T((t==null?void 0:t.in)||a,0);return d.setFullYear(o,0,e),d.setHours(0,0,0,0),X(d,t)}function Va(a,t){const n=E(a,t==null?void 0:t.in),e=+X(n,t)-+Ga(n,t);return Math.round(e/dt)+1}function b(a,t){const n=a<0?"-":"",e=Math.abs(a).toString().padStart(t,"0");return n+e}const A={y(a,t){const n=a.getFullYear(),e=n>0?n:1-n;return b(t==="yy"?e%100:e,t.length)},M(a,t){const n=a.getMonth();return t==="M"?String(n+1):b(n+1,2)},d(a,t){return b(a.getDate(),t.length)},a(a,t){const n=a.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.toUpperCase();case"aaa":return n;case"aaaaa":return n[0];case"aaaa":default:return n==="am"?"a.m.":"p.m."}},h(a,t){return b(a.getHours()%12||12,t.length)},H(a,t){return b(a.getHours(),t.length)},m(a,t){return b(a.getMinutes(),t.length)},s(a,t){return b(a.getSeconds(),t.length)},S(a,t){const n=t.length,e=a.getMilliseconds(),o=Math.trunc(e*Math.pow(10,n-3));return b(o,t.length)}},q={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},rt={G:function(a,t,n){const e=a.getFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return n.era(e,{width:"abbreviated"});case"GGGGG":return n.era(e,{width:"narrow"});case"GGGG":default:return n.era(e,{width:"wide"})}},y:function(a,t,n){if(t==="yo"){const e=a.getFullYear(),o=e>0?e:1-e;return n.ordinalNumber(o,{unit:"year"})}return A.y(a,t)},Y:function(a,t,n,e){const o=lt(a,e),d=o>0?o:1-o;if(t==="YY"){const l=d%100;return b(l,2)}return t==="Yo"?n.ordinalNumber(d,{unit:"year"}):b(d,t.length)},R:function(a,t){const n=ct(a);return b(n,t.length)},u:function(a,t){const n=a.getFullYear();return b(n,t.length)},Q:function(a,t,n){const e=Math.ceil((a.getMonth()+1)/3);switch(t){case"Q":return String(e);case"QQ":return b(e,2);case"Qo":return n.ordinalNumber(e,{unit:"quarter"});case"QQQ":return n.quarter(e,{width:"abbreviated",context:"formatting"});case"QQQQQ":return n.quarter(e,{width:"narrow",context:"formatting"});case"QQQQ":default:return n.quarter(e,{width:"wide",context:"formatting"})}},q:function(a,t,n){const e=Math.ceil((a.getMonth()+1)/3);switch(t){case"q":return String(e);case"qq":return b(e,2);case"qo":return n.ordinalNumber(e,{unit:"quarter"});case"qqq":return n.quarter(e,{width:"abbreviated",context:"standalone"});case"qqqqq":return n.quarter(e,{width:"narrow",context:"standalone"});case"qqqq":default:return n.quarter(e,{width:"wide",context:"standalone"})}},M:function(a,t,n){const e=a.getMonth();switch(t){case"M":case"MM":return A.M(a,t);case"Mo":return n.ordinalNumber(e+1,{unit:"month"});case"MMM":return n.month(e,{width:"abbreviated",context:"formatting"});case"MMMMM":return n.month(e,{width:"narrow",context:"formatting"});case"MMMM":default:return n.month(e,{width:"wide",context:"formatting"})}},L:function(a,t,n){const e=a.getMonth();switch(t){case"L":return String(e+1);case"LL":return b(e+1,2);case"Lo":return n.ordinalNumber(e+1,{unit:"month"});case"LLL":return n.month(e,{width:"abbreviated",context:"standalone"});case"LLLLL":return n.month(e,{width:"narrow",context:"standalone"});case"LLLL":default:return n.month(e,{width:"wide",context:"standalone"})}},w:function(a,t,n,e){const o=Va(a,e);return t==="wo"?n.ordinalNumber(o,{unit:"week"}):b(o,t.length)},I:function(a,t,n){const e=Qa(a);return t==="Io"?n.ordinalNumber(e,{unit:"week"}):b(e,t.length)},d:function(a,t,n){return t==="do"?n.ordinalNumber(a.getDate(),{unit:"date"}):A.d(a,t)},D:function(a,t,n){const e=_a(a);return t==="Do"?n.ordinalNumber(e,{unit:"dayOfYear"}):b(e,t.length)},E:function(a,t,n){const e=a.getDay();switch(t){case"E":case"EE":case"EEE":return n.day(e,{width:"abbreviated",context:"formatting"});case"EEEEE":return n.day(e,{width:"narrow",context:"formatting"});case"EEEEEE":return n.day(e,{width:"short",context:"formatting"});case"EEEE":default:return n.day(e,{width:"wide",context:"formatting"})}},e:function(a,t,n,e){const o=a.getDay(),d=(o-e.weekStartsOn+8)%7||7;switch(t){case"e":return String(d);case"ee":return b(d,2);case"eo":return n.ordinalNumber(d,{unit:"day"});case"eee":return n.day(o,{width:"abbreviated",context:"formatting"});case"eeeee":return n.day(o,{width:"narrow",context:"formatting"});case"eeeeee":return n.day(o,{width:"short",context:"formatting"});case"eeee":default:return n.day(o,{width:"wide",context:"formatting"})}},c:function(a,t,n,e){const o=a.getDay(),d=(o-e.weekStartsOn+8)%7||7;switch(t){case"c":return String(d);case"cc":return b(d,t.length);case"co":return n.ordinalNumber(d,{unit:"day"});case"ccc":return n.day(o,{width:"abbreviated",context:"standalone"});case"ccccc":return n.day(o,{width:"narrow",context:"standalone"});case"cccccc":return n.day(o,{width:"short",context:"standalone"});case"cccc":default:return n.day(o,{width:"wide",context:"standalone"})}},i:function(a,t,n){const e=a.getDay(),o=e===0?7:e;switch(t){case"i":return String(o);case"ii":return b(o,t.length);case"io":return n.ordinalNumber(o,{unit:"day"});case"iii":return n.day(e,{width:"abbreviated",context:"formatting"});case"iiiii":return n.day(e,{width:"narrow",context:"formatting"});case"iiiiii":return n.day(e,{width:"short",context:"formatting"});case"iiii":default:return n.day(e,{width:"wide",context:"formatting"})}},a:function(a,t,n){const o=a.getHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.dayPeriod(o,{width:"abbreviated",context:"formatting"});case"aaa":return n.dayPeriod(o,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return n.dayPeriod(o,{width:"narrow",context:"formatting"});case"aaaa":default:return n.dayPeriod(o,{width:"wide",context:"formatting"})}},b:function(a,t,n){const e=a.getHours();let o;switch(e===12?o=q.noon:e===0?o=q.midnight:o=e/12>=1?"pm":"am",t){case"b":case"bb":return n.dayPeriod(o,{width:"abbreviated",context:"formatting"});case"bbb":return n.dayPeriod(o,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return n.dayPeriod(o,{width:"narrow",context:"formatting"});case"bbbb":default:return n.dayPeriod(o,{width:"wide",context:"formatting"})}},B:function(a,t,n){const e=a.getHours();let o;switch(e>=17?o=q.evening:e>=12?o=q.afternoon:e>=4?o=q.morning:o=q.night,t){case"B":case"BB":case"BBB":return n.dayPeriod(o,{width:"abbreviated",context:"formatting"});case"BBBBB":return n.dayPeriod(o,{width:"narrow",context:"formatting"});case"BBBB":default:return n.dayPeriod(o,{width:"wide",context:"formatting"})}},h:function(a,t,n){if(t==="ho"){let e=a.getHours()%12;return e===0&&(e=12),n.ordinalNumber(e,{unit:"hour"})}return A.h(a,t)},H:function(a,t,n){return t==="Ho"?n.ordinalNumber(a.getHours(),{unit:"hour"}):A.H(a,t)},K:function(a,t,n){const e=a.getHours()%12;return t==="Ko"?n.ordinalNumber(e,{unit:"hour"}):b(e,t.length)},k:function(a,t,n){let e=a.getHours();return e===0&&(e=24),t==="ko"?n.ordinalNumber(e,{unit:"hour"}):b(e,t.length)},m:function(a,t,n){return t==="mo"?n.ordinalNumber(a.getMinutes(),{unit:"minute"}):A.m(a,t)},s:function(a,t,n){return t==="so"?n.ordinalNumber(a.getSeconds(),{unit:"second"}):A.s(a,t)},S:function(a,t){return A.S(a,t)},X:function(a,t,n){const e=a.getTimezoneOffset();if(e===0)return"Z";switch(t){case"X":return st(e);case"XXXX":case"XX":return B(e);case"XXXXX":case"XXX":default:return B(e,":")}},x:function(a,t,n){const e=a.getTimezoneOffset();switch(t){case"x":return st(e);case"xxxx":case"xx":return B(e);case"xxxxx":case"xxx":default:return B(e,":")}},O:function(a,t,n){const e=a.getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+nt(e,":");case"OOOO":default:return"GMT"+B(e,":")}},z:function(a,t,n){const e=a.getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+nt(e,":");case"zzzz":default:return"GMT"+B(e,":")}},t:function(a,t,n){const e=Math.trunc(+a/1e3);return b(e,t.length)},T:function(a,t,n){return b(+a,t.length)}};function nt(a,t=""){const n=a>0?"-":"+",e=Math.abs(a),o=Math.trunc(e/60),d=e%60;return d===0?n+String(o):n+String(o)+t+b(d,2)}function st(a,t){return a%60===0?(a>0?"-":"+")+b(Math.abs(a)/60,2):B(a,t)}function B(a,t=""){const n=a>0?"-":"+",e=Math.abs(a),o=b(Math.trunc(e/60),2),d=b(e%60,2);return n+o+t+d}const it=(a,t)=>{switch(a){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});case"PPPP":default:return t.date({width:"full"})}},ut=(a,t)=>{switch(a){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});case"pppp":default:return t.time({width:"full"})}},Xa=(a,t)=>{const n=a.match(/(P+)(p+)?/)||[],e=n[1],o=n[2];if(!o)return it(a,t);let d;switch(e){case"P":d=t.dateTime({width:"short"});break;case"PP":d=t.dateTime({width:"medium"});break;case"PPP":d=t.dateTime({width:"long"});break;case"PPPP":default:d=t.dateTime({width:"full"});break}return d.replace("{{date}}",it(e,t)).replace("{{time}}",ut(o,t))},Ua={p:ut,P:Xa},Za=/^D+$/,Ja=/^Y+$/,Ka=["D","DD","YY","YYYY"];function er(a){return Za.test(a)}function tr(a){return Ja.test(a)}function ar(a,t,n){const e=rr(a,t,n);if(console.warn(e),Ka.includes(a))throw new RangeError(e)}function rr(a,t,n){const e=a[0]==="Y"?"years":"days of the month";return`Use \`${a.toLowerCase()}\` instead of \`${a}\` (in \`${t}\`) for formatting ${e} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const nr=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,sr=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,ir=/^'([^]*?)'?$/,or=/''/g,dr=/[a-zA-Z]/;function te(a,t,n){var j,g,I,W;const e=ne(),o=e.locale??Ha,d=e.firstWeekContainsDate??((g=(j=e.locale)==null?void 0:j.options)==null?void 0:g.firstWeekContainsDate)??1,l=e.weekStartsOn??((W=(I=e.locale)==null?void 0:I.options)==null?void 0:W.weekStartsOn)??0,h=E(a,n==null?void 0:n.in);if(!la(h))throw new RangeError("Invalid time value");let x=t.match(sr).map(N=>{const f=N[0];if(f==="p"||f==="P"){const w=Ua[f];return w(N,o.formatLong)}return N}).join("").match(nr).map(N=>{if(N==="''")return{isToken:!1,value:"'"};const f=N[0];if(f==="'")return{isToken:!1,value:cr(N)};if(rt[f])return{isToken:!0,value:N};if(f.match(dr))throw new RangeError("Format string contains an unescaped latin alphabet character `"+f+"`");return{isToken:!1,value:N}});o.localize.preprocessor&&(x=o.localize.preprocessor(h,x));const v={firstWeekContainsDate:d,weekStartsOn:l,locale:o};return x.map(N=>{if(!N.isToken)return N.value;const f=N.value;(tr(f)||er(f))&&ar(f,t,String(a));const w=rt[f[0]];return w(h,f,o.localize,v)}).join("")}function cr(a){const t=a.match(ir);return t?t[1].replace(or,"'"):a}const lr=(a=30,t=!1)=>{const n=[],e=new Date,o=new Date;o.setHours(7,0,0,0);const d=new Date;for(d.setHours(20,0,0,0);o<=d;)(!t||o>e)&&n.push(o.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0})),o.setMinutes(o.getMinutes()+a);return n};function ur(a){const t=Math.floor((Date.now()-new Date(a))/6e4);if(t<1)return"Just now";if(t<60)return`${t} min${t>1?"s":""} ago`;const n=Math.floor(t/60);if(n<24)return`${n} hr${n>1?"s":""} ago`;const e=Math.floor(n/24);return`${e} day${e>1?"s":""} ago`}function ot(a){return a&&a.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i,"").trim().split(" ").slice(0,2).map(n=>{var e;return((e=n[0])==null?void 0:e.toUpperCase())||""}).join("")||"US"}const pr=a=>new Promise((t,n)=>{const e=new FileReader;e.readAsDataURL(a),e.onload=()=>t(e.result),e.onerror=n}),ae={menuPortalTarget:typeof document<"u"?document.body:null,menuPosition:"fixed",styles:{menuPortal:a=>({...a,zIndex:99999}),control:(a,t)=>({...a,fontSize:13,minHeight:36,borderColor:t.isFocused?"#185fa5":"#d0dce9",borderWidth:"0.5px",borderRadius:8,boxShadow:"none","&:hover":{borderColor:"#185fa5"}}),option:(a,t)=>({...a,fontSize:13,backgroundColor:t.isSelected?"#185fa5":t.isFocused?"#f0f5fb":"#fff",color:t.isSelected?"#fff":"#374151"}),multiValue:a=>({...a,background:"#e6f1fb",borderRadius:20}),multiValueLabel:a=>({...a,color:"#0c447c",fontSize:12}),multiValueRemove:a=>({...a,color:"#185fa5",":hover":{background:"#b5d4f4"}}),placeholder:a=>({...a,fontSize:13,color:"#9ca3af"}),menu:a=>({...a,fontSize:13})}},F=({label:a,value:t,children:n})=>r.jsxs("div",{className:"dp-info-row",children:[r.jsx("span",{className:"dp-info-label",children:a}),n??r.jsx("span",{className:"dp-info-value",children:t||"—"})]}),zr=()=>{var Ce,Me,De,Fe,Pe,Ee,Oe,Ie,ze,Ae,Te,We,Ye,$e,Be,Le,qe,Re,He;const{state:a}=Yt(),t=$t(),{doctorId:n}=Bt(),[e,o]=m.useState((a==null?void 0:a.doctor)||{}),[d,l]=m.useState((a==null?void 0:a.doctor)||{}),h=a==null?void 0:a.branchId,x=(Ce=a==null?void 0:a.doctor)==null?void 0:Ce.hospitalId,[v,j]=m.useState(1),[g,I]=m.useState(!1),[W,N]=m.useState(!1),[f,w]=m.useState({}),[pt,se]=m.useState(!1),[xe,mt]=m.useState([]),[O,Y]=m.useState([]),[P,ft]=m.useState(new Date().toISOString().split("T")[0]),[mr,ht]=m.useState(0),[gt,bt]=m.useState([]),[xt,U]=m.useState(!1),[ie,vt]=m.useState(30),[Z,oe]=m.useState([]),[yt,R]=m.useState(!1),[ve,ye]=m.useState(null),[J,wt]=m.useState(null),[fr,jt]=m.useState({}),[Nt,St]=m.useState([]),[kt,de]=m.useState([]),[Ct,z]=m.useState([]),[H,we]=m.useState(null),[L,ce]=m.useState([]),[le,_]=m.useState([]),[je,Ne]=m.useState([]),Mt=P===new Date().toISOString().split("T")[0],ue=((Me=Array.isArray(xe)?xe.find(s=>s.date===P):null)==null?void 0:Me.availableSlots)||[];m.useEffect(()=>{!(e!=null&&e.doctorId)&&n&&Q.get(`/getDoctorById/${n}`).then(s=>{o(s.data),l(s.data)}).catch(s=>console.error(s))},[]),m.useEffect(()=>{const s=new Date;s.setHours(0,0,0,0),bt(Array.from({length:15},(i,c)=>{const u=new Date(s);return u.setDate(s.getDate()+c),{date:u,dayLabel:te(u,"EEE"),dateLabel:te(u,"dd MMM")}}))},[]),m.useEffect(()=>{e!=null&&e.doctorId&&pe()},[e==null?void 0:e.doctorId]);const pe=async()=>{if(!(!x||!h||!(e!=null&&e.doctorId)))try{const s=await Q.get(`/clinic-admin/getDoctorSlots/${x}/${h}/${e.doctorId}`);s.data.success&&mt(s.data.data)}catch(s){console.error(s)}finally{N(!1)}};m.useEffect(()=>{if(!x||!(e!=null&&e.doctorId))return;(async()=>{var i;try{const c=await Q.get(`/averageRatings/${x}/${e.doctorId}`);if(!c.data.success)return;const u=c.data.data;wt(u);const p=[...new Set(((i=u.comments)==null?void 0:i.map(S=>S.customerMobileNumber))||[])],y={};await Promise.all(p.map(async S=>{var D;try{const $=await Xt(S);y[S]=((D=$==null?void 0:$.data)==null?void 0:D.fullName)||S}catch{y[S]=S}})),jt(y)}catch(c){console.error(c)}})()},[e==null?void 0:e.doctorId,x]),m.useEffect(()=>{e!=null&&e.clinicId&&Qt(e.clinicId).then(s=>Ne(((s==null?void 0:s.data)||[]).map(i=>({value:i.branchId||i.id,label:i.branchName||i.name})))).catch(()=>Ne([]))},[e==null?void 0:e.clinicId]),m.useEffect(()=>{Zt().then(s=>St(((s==null?void 0:s.data)||[]).map(i=>({value:i.categoryId,label:i.categoryName})))).catch(console.error)},[]),m.useEffect(()=>{(async()=>{var p,y,S;if(!((p=e==null?void 0:e.category)!=null&&p.length))return;const i=e.category[0];we({value:i.categoryId,label:i.categoryName});const c=await Qe(),u=((c==null?void 0:c.data)||[]).filter(D=>D.categoryId===i.categoryId);if(de(u.map(D=>({value:D.serviceId,label:D.serviceName}))),(y=e.service)!=null&&y.length){const D=e.service.map(M=>({value:M.serviceId,label:M.serviceName}));ce(D);const K=(await Promise.all(D.map(M=>fe(M.value)))).flatMap(M=>(M==null?void 0:M.data)||[]);z(K.map(M=>({value:M.subServiceId,label:M.subServiceName}))),(S=e.subServices)!=null&&S.length&&_(e.subServices.map(M=>({value:M.subServiceId,label:M.subServiceName})))}})()},[e]),m.useEffect(()=>{l(s=>({...s,category:H?[{categoryId:H.value,categoryName:H.label}]:[]}))},[H]),m.useEffect(()=>{l(s=>({...s,services:L.map(i=>({serviceId:i.value,serviceName:i.label}))}))},[L]),m.useEffect(()=>{l(s=>({...s,subServices:le.map(i=>({subServiceId:i.value,subServiceName:i.label}))}))},[le]),m.useEffect(()=>{if(!L.length){z([]),_([]);return}(async()=>{try{const c=(await Promise.all(L.map(p=>fe(p.value)))).flatMap(p=>{const y=(p==null?void 0:p.data)||[];return Array.isArray(y)?y.flatMap(S=>S.subServices||[]):y.subServices||[]}),u=Array.from(new Map(c.map(p=>[p.subServiceId,p])).values());z(u.map(p=>({value:p.subServiceId,label:p.subServiceName})))}catch{z([])}})()},[L]);const Se=s=>{const{name:i,value:c}=s.target;l(u=>({...u,[i]:c}))},Dt=(s,i)=>{ft(te(s.date,"yyyy-MM-dd")),ht(i)},Ft=async s=>{se(!1),await Gt(s)?(k.success("Doctor deleted"),t(`/branch-details/${h}?tab=1`)):k.error("Failed to delete doctor")},Pt=async s=>{if(we(s),ce([]),_([]),de([]),z([]),!!s)try{const i=await Qe(),c=((i==null?void 0:i.data)||[]).filter(p=>p.categoryId===s.value),u=Array.from(new Map(c.map(p=>[p.serviceId,p])).values());de(u.map(p=>({value:p.serviceId,label:p.serviceName})))}catch(i){console.error(i)}},Et=async s=>{const i=Array.from(new Map((s||[]).map(c=>[c.value,c])).values());if(ce(i),_([]),!i.length){z([]);return}try{const c=new Map;for(const u of i){const p=await fe(u.value);((p==null?void 0:p.data)||[]).forEach(y=>{c.has(y.subServiceId)||c.set(y.subServiceId,y)})}z(Array.from(c.values()).map(u=>({value:u.subServiceId,label:u.subServiceName})))}catch{z([])}},Ot=()=>{const s=lr(ie,Mt).map(i=>({slot:i,available:!0}));oe(s),Y([]),k.success(`Generated ${s.length} slots of ${ie} min`)},ke=s=>Y(i=>i.includes(s)?i.filter(c=>c!==s):[...i,s]),It=async()=>{if(!(e!=null&&e.doctorId)||!h||!x){k.error("Missing required IDs");return}const s=ue.map(u=>u.slot),i=O.filter(u=>!s.includes(u));if(!i.length){k.info("No new slots to add!");return}const c={doctorId:e.doctorId,date:P,availableSlots:i.map(u=>({slot:u,slotbooked:!1}))};try{const u=await qt.post(`${me}/admin/addDoctorSlots/${x}/${h}/${e.doctorId}`,c);u.data.success?(k.success("Slots added!"),U(!1),Y([]),pe()):k.error(u.data.message||"Failed")}catch{k.error("Network error.")}},zt=()=>{var i,c,u,p,y,S,D,$,K;const s={};return/^[a-zA-Z0-9]+$/.test((i=d.doctorLicence)==null?void 0:i.trim())||(s.doctorLicence="License must be alphanumeric."),/^[A-Za-z\s.]+$/.test(d.doctorName)||(s.doctorName="Name: letters, spaces, dots only."),/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((c=d.doctorEmail)==null?void 0:c.trim())||(s.doctorEmail="Enter valid email."),/^[A-Za-z\s]+$/.test((u=d.qualification)==null?void 0:u.trim())||(s.qualification="Letters only."),/^[A-Za-z\s]+$/.test((p=d.specialization)==null?void 0:p.trim())||(s.specialization="Letters only."),/^\d+$/.test((y=String(d.experience))==null?void 0:y.trim())||(s.experience="Numbers only."),/^[6-9]\d{9}$/.test((S=d.doctorMobileNumber)==null?void 0:S.trim())||(s.doctorMobileNumber="10-digit number starting 6–9."),d.gender||(s.gender="Please select gender."),(D=d.availableTimes)!=null&&D.trim()||(s.availableTimes="Please enter timings."),/^\d+$/.test(String(($=d.doctorFees)==null?void 0:$.inClinicFee))||(s.inClinicFee="Numbers only."),/^\d+$/.test(String((K=d.doctorFees)==null?void 0:K.vedioConsultationFee))||(s.vedioConsultationFee="Numbers only."),w(s),Object.keys(s).length===0},At=async()=>{var c,u;const s={...d,branch:((c=d.branch)==null?void 0:c.map(p=>({branchId:p.branchId,branchName:p.branchName})))||[],category:d.category||[],services:((u=d.services)==null?void 0:u.map(p=>({serviceId:p.serviceId,serviceName:p.serviceName})))||[]},i=await Vt(e.doctorId,s);i.success?(k.success("Doctor updated successfully"),o(i.data.updatedDoctor),l(i.data.updatedDoctor),I(!1),t(`/branch-details/${h}?tab=1`)):k.error("Failed to update")},Tt=async()=>{zt()&&await At()};if(!e)return r.jsx("p",{children:"No doctor data found."});const Wt=[{id:1,label:"Doctor Profile",icon:Jt},{id:2,label:"Slot Management",icon:Ke},{id:3,label:"Ratings",icon:_e},{id:4,label:"Services",icon:Rt}];return r.jsxs("div",{style:{padding:"1.25rem"},children:[r.jsx(Lt,{}),r.jsxs("div",{className:"dp-hero",children:[r.jsxs("div",{className:"dp-hero-banner",children:[r.jsx("div",{className:"dp-hero-accent"}),r.jsxs("div",{className:"dp-hero-badge",children:[r.jsx("span",{className:"dp-hero-badge-dot"}),"Active Doctor"]}),r.jsx("h2",{className:"dp-hero-name",children:Ht(e.doctorName)}),r.jsxs("p",{className:"dp-hero-sub",children:[e.specialization,"  ·  ",e.qualification]})]}),r.jsxs("div",{className:"dp-hero-lower",children:[r.jsx("div",{className:"dp-hero-avatar-wrap",children:e.doctorPicture?r.jsx("img",{src:e.doctorPicture,alt:"Doctor",className:"dp-hero-avatar"}):r.jsx("div",{className:"dp-hero-avatar dp-hero-avatar-initials",children:ot(e.doctorName)})}),r.jsxs("div",{className:"dp-hero-meta",children:[r.jsxs("span",{className:"dp-hero-id",children:["ID: ",e.doctorId]}),r.jsxs("span",{className:"dp-hero-avail",children:[r.jsx("span",{className:"dp-avail-dot"}),e.availableDays||"Mon – Sat"]})]})]}),r.jsxs("div",{className:"dp-stats-row",children:[r.jsxs("div",{className:"dp-stat",children:[r.jsx("span",{className:"dp-stat-val",children:e.experience}),r.jsx("span",{className:"dp-stat-lbl",children:"Yrs Exp."})]}),r.jsxs("div",{className:"dp-stat",children:[r.jsxs("span",{className:"dp-stat-val",children:["₹",((De=e.doctorFees)==null?void 0:De.inClinicFee)||"—"]}),r.jsx("span",{className:"dp-stat-lbl",children:"In-Clinic"})]}),r.jsxs("div",{className:"dp-stat",children:[r.jsxs("span",{className:"dp-stat-val",children:["₹",((Fe=e.doctorFees)==null?void 0:Fe.vedioConsultationFee)||"—"]}),r.jsx("span",{className:"dp-stat-lbl",children:"Video Fee"})]})]})]}),r.jsx("div",{className:"dp-tabs",children:Wt.map(({id:s,label:i,icon:c})=>r.jsxs("button",{className:`dp-tab${v===s?" active":""}`,onClick:()=>j(s),children:[r.jsx(c,{size:13}),i]},s))}),v===1&&r.jsxs("div",{className:"dp-tab-panel",children:[g&&r.jsxs("div",{className:"dp-edit-section",children:[r.jsx("div",{className:"dp-section-label",children:"Category & Services"}),r.jsxs(ea,{className:"g-3",children:[r.jsxs(he,{md:4,children:[r.jsx("label",{className:"dp-label",children:"Category"}),r.jsx(ee,{...ae,options:Nt,value:H,onChange:Pt,placeholder:"Select Category"})]}),r.jsxs(he,{md:4,children:[r.jsx("label",{className:"dp-label",children:"Services"}),r.jsx(ee,{isMulti:!0,...ae,options:kt,value:L,onChange:Et,placeholder:"Select Service(s)"})]}),r.jsxs(he,{md:4,children:[r.jsx("label",{className:"dp-label",children:"Procedures"}),r.jsx(ee,{isMulti:!0,...ae,options:Ct,value:le,onChange:_,placeholder:"Select Procedures"})]})]}),r.jsxs("div",{className:"dp-photo-row",children:[d.doctorPicture&&r.jsx("img",{src:d.doctorPicture,alt:"Preview",className:"dp-photo-preview"}),r.jsxs("div",{children:[r.jsx("label",{className:"dp-label",style:{marginBottom:4},children:"Profile Photo"}),r.jsx("input",{type:"file",accept:"image/*",className:"dp-file-input",onChange:async s=>{const i=s.target.files[0];if(!i)return;if(i.size>2*1024*1024){k.error("Max 2MB");return}const c=await pr(i);l(u=>({...u,doctorPicture:c}))}})]})]})]}),r.jsxs("div",{className:"dp-info-grid",children:[r.jsxs("div",{className:"dp-info-col",children:[r.jsx("div",{className:"dp-section-label",children:"Basic Information"}),r.jsx(F,{label:"License No.",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"doctorLicence",value:d.doctorLicence,onChange:s=>{l(i=>({...i,doctorLicence:s.target.value.replace(/[^a-zA-Z0-9]/g,"")})),w(i=>({...i,doctorLicence:""}))},className:"dp-input"}),f.doctorLicence&&r.jsx("small",{className:"dp-err",children:f.doctorLicence})]}):e.doctorLicence}),r.jsx(F,{label:"Full Name",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"doctorName",value:d.doctorName,onChange:s=>{l(i=>({...i,doctorName:s.target.value.replace(/[^A-Za-z\s.]/g,"")})),w(i=>({...i,doctorName:""}))},className:"dp-input"}),f.doctorName&&r.jsx("small",{className:"dp-err",children:f.doctorName})]}):e.doctorName}),r.jsx(F,{label:"Email",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"doctorEmail",value:d.doctorEmail,onChange:s=>{l(i=>({...i,doctorEmail:s.target.value})),w(i=>({...i,doctorEmail:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.target.value)?"":"Valid email required"}))},className:"dp-input"}),f.doctorEmail&&r.jsx("small",{className:"dp-err",children:f.doctorEmail})]}):r.jsx("span",{style:{color:"#185fa5"},children:e.doctorEmail})}),r.jsx(F,{label:"Qualification",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"qualification",value:d.qualification,onChange:s=>{l(i=>({...i,qualification:s.target.value.replace(/[^A-Za-z\s]/g,"")})),w(i=>({...i,qualification:""}))},className:"dp-input"}),f.qualification&&r.jsx("small",{className:"dp-err",children:f.qualification})]}):e.qualification}),r.jsx(F,{label:"Specialization",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"specialization",value:d.specialization,onChange:s=>{l(i=>({...i,specialization:s.target.value.replace(/[^A-Za-z\s]/g,"")})),w(i=>({...i,specialization:""}))},className:"dp-input"}),f.specialization&&r.jsx("small",{className:"dp-err",children:f.specialization})]}):e.specialization}),r.jsx(F,{label:"Experience",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"experience",value:d.experience,onChange:s=>{l(i=>({...i,experience:s.target.value.replace(/[^0-9]/g,"")})),w(i=>({...i,experience:""}))},className:"dp-input"}),f.experience&&r.jsx("small",{className:"dp-err",children:f.experience})]}):`${e.experience} Years`})]}),r.jsxs("div",{className:"dp-info-col",children:[r.jsx("div",{className:"dp-section-label",children:"Contact & Schedule"}),r.jsx(F,{label:"Languages",children:g?r.jsx(C,{value:((Pe=d.languages)==null?void 0:Pe.join(", "))||"",onChange:s=>l(i=>({...i,languages:s.target.value.replace(/[^A-Za-z,\s]/g,"").split(",").map(c=>c.trim())})),className:"dp-input"}):(Ee=e.languages)==null?void 0:Ee.join(", ")}),r.jsx(F,{label:"Contact",children:g?r.jsxs(r.Fragment,{children:[r.jsx(C,{name:"doctorMobileNumber",value:d.doctorMobileNumber,onChange:s=>{l(i=>({...i,doctorMobileNumber:s.target.value.replace(/[^0-9]/g,"")})),w(i=>({...i,doctorMobileNumber:""}))},className:"dp-input"}),f.doctorMobileNumber&&r.jsx("small",{className:"dp-err",children:f.doctorMobileNumber})]}):e.doctorMobileNumber}),r.jsx(F,{label:"Gender",children:g?r.jsxs("select",{className:"dp-input dp-select",value:d.gender,onChange:s=>{l(i=>({...i,gender:s.target.value})),w(i=>({...i,gender:""}))},children:[r.jsx("option",{value:"",children:"Select"}),r.jsx("option",{children:"Male"}),r.jsx("option",{children:"Female"}),r.jsx("option",{children:"Other"})]}):e.gender}),r.jsx(F,{label:"Available Days",children:g?r.jsx(C,{name:"availableDays",value:d.availableDays,onChange:s=>{l(i=>({...i,availableDays:s.target.value.replace(/[^A-Za-z,\s\-]/g,"")})),w(i=>({...i,availableDays:""}))},className:"dp-input"}):e.availableDays}),r.jsx(F,{label:"Available Timings",children:g?r.jsx(C,{name:"availableTimes",value:d.availableTimes,onChange:Se,className:"dp-input"}):e.availableTimes}),r.jsx(F,{label:"Branch",children:g?r.jsx(ee,{isMulti:!0,...ae,options:je,value:je.filter(s=>Array.isArray(d.branch)&&d.branch.some(i=>i.branchId.toString()===s.value.toString())),onChange:s=>l(i=>({...i,branch:s.map(c=>({branchId:c.value,branchName:c.label}))})),placeholder:"Select branches…"}):Array.isArray(e.branches)&&e.branches.length>0?e.branches.map(s=>s.branchName).join(", "):"No branches"})]})]}),r.jsxs("div",{className:"dp-fees-grid",children:[r.jsxs("div",{className:"dp-fee-card clinic",children:[r.jsx("span",{className:"dp-fee-label",children:"In-Clinic Fee"}),g?r.jsxs(r.Fragment,{children:[r.jsx(C,{value:((Oe=d.doctorFees)==null?void 0:Oe.inClinicFee)||"",onChange:s=>{l(i=>({...i,doctorFees:{...i.doctorFees,inClinicFee:s.target.value.replace(/[^0-9]/g,"")}})),w(i=>({...i,inClinicFee:""}))},className:"dp-input"}),f.inClinicFee&&r.jsx("small",{className:"dp-err",children:f.inClinicFee})]}):r.jsxs("span",{className:"dp-fee-val",children:["₹",((Ie=d.doctorFees)==null?void 0:Ie.inClinicFee)||"N/A"]})]}),r.jsxs("div",{className:"dp-fee-card video",children:[r.jsx("span",{className:"dp-fee-label",children:"Video Consultation"}),g?r.jsxs(r.Fragment,{children:[r.jsx(C,{value:((ze=d.doctorFees)==null?void 0:ze.vedioConsultationFee)||"",onChange:s=>{l(i=>({...i,doctorFees:{...i.doctorFees,vedioConsultationFee:s.target.value.replace(/[^0-9]/g,"")}})),w(i=>({...i,vedioConsultationFee:""}))},className:"dp-input"}),f.vedioConsultationFee&&r.jsx("small",{className:"dp-err",children:f.vedioConsultationFee})]}):r.jsxs("span",{className:"dp-fee-val",children:["₹",((Ae=d.doctorFees)==null?void 0:Ae.vedioConsultationFee)||"N/A"]})]})]}),r.jsxs("div",{className:"dp-extras-grid",children:[r.jsxs("div",{className:"dp-extra-block",children:[r.jsx("div",{className:"dp-section-label",children:"Association / Membership"}),g?r.jsx(C,{name:"associationsOrMemberships",value:d.associationsOrMemberships,onChange:s=>l(i=>({...i,associationsOrMemberships:s.target.value.replace(/[^A-Za-z\s]/g,"")})),className:"dp-input"}):r.jsx("p",{className:"dp-extra-text",children:e.associationsOrMemberships||"—"})]}),r.jsxs("div",{className:"dp-extra-block",children:[r.jsx("div",{className:"dp-section-label",children:"Profile Description"}),g?r.jsx(C,{name:"profileDescription",value:d.profileDescription,onChange:Se,className:"dp-input"}):r.jsx("p",{className:"dp-extra-text",children:e.profileDescription||"—"})]}),r.jsxs("div",{className:"dp-extra-block",children:[r.jsx("div",{className:"dp-section-label",children:"Area of Expertise"}),g?r.jsx(Ge,{rows:4,value:((Te=d.focusAreas)==null?void 0:Te.join(`
`))||"",onChange:s=>l(i=>({...i,focusAreas:s.target.value.split(`
`).map(c=>c.trimStart().startsWith("•")?c.trim():`• ${c.trim()}`).filter(c=>c!=="•")})),className:"dp-input"}):r.jsx("ul",{className:"dp-bullet-list",children:((We=d.focusAreas)==null?void 0:We.length)>0?d.focusAreas.map((s,i)=>r.jsx("li",{children:s.replace(/^•\s*/,"")},i)):r.jsx("li",{style:{color:"#9ca3af"},children:"None"})})]}),r.jsxs("div",{className:"dp-extra-block",children:[r.jsx("div",{className:"dp-section-label",children:"Achievements"}),g?r.jsx(Ge,{rows:4,value:((Ye=d.highlights)==null?void 0:Ye.join(`
`))||"",onChange:s=>l(i=>({...i,highlights:s.target.value.split(`
`).map(c=>c.trimStart().startsWith("•")?c.trim():`• ${c.trim()}`).filter(Boolean)})),className:"dp-input"}):r.jsx("ul",{className:"dp-bullet-list",children:(($e=d.highlights)==null?void 0:$e.length)>0?d.highlights.map((s,i)=>r.jsx("li",{children:s.replace(/^•\s*/,"")},i)):r.jsx("li",{style:{color:"#9ca3af"},children:"None"})})]}),r.jsxs("div",{className:"dp-extra-block",children:[r.jsx("div",{className:"dp-section-label",children:"Doctor Signature"}),g&&r.jsx(C,{type:"file",accept:"image/jpeg,image/png",className:"dp-input",onChange:s=>{const i=s.target.files[0];if(!i)return;const c=new FileReader;c.onloadend=()=>l(u=>({...u,doctorSignature:c.result})),c.readAsDataURL(i)}}),r.jsx("div",{className:"dp-sig-box",children:(g?d.doctorSignature:e.doctorSignature)?r.jsx("img",{src:g?d.doctorSignature:e.doctorSignature,alt:"Signature",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}):r.jsx("span",{style:{fontSize:11,color:"#9ca3af",fontStyle:"italic"},children:"No signature on file"})}),f.doctorSignature&&r.jsx("small",{className:"dp-err",children:f.doctorSignature})]})]}),r.jsx("div",{className:"dp-action-row",children:g?r.jsxs(r.Fragment,{children:[r.jsx("button",{className:"dp-btn dp-btn-ghost",onClick:()=>I(!1),children:"Cancel"}),r.jsx("button",{className:"dp-btn dp-btn-primary",onClick:Tt,children:"Update Doctor"})]}):r.jsxs(r.Fragment,{children:[r.jsxs("button",{className:"dp-btn dp-btn-danger",onClick:()=>se(!0),children:[r.jsx(ge,{size:13})," Delete"]}),r.jsxs("button",{className:"dp-btn dp-btn-edit",onClick:()=>I(!0),children:[r.jsx(ta,{size:13})," Edit Profile"]})]})}),r.jsx(_t,{isVisible:pt,title:"Delete Doctor",message:"Are you sure you want to delete this doctor? This cannot be undone.",confirmText:"Yes, Delete",cancelText:"Cancel",confirmColor:"danger",cancelColor:"secondary",onConfirm:()=>Ft(e.doctorId),onCancel:()=>se(!1)})]}),v===2&&r.jsxs("div",{className:"dp-tab-panel",children:[r.jsxs("div",{className:"dp-slot-header",children:[r.jsxs("h5",{className:"dp-panel-title",children:[r.jsx(Ke,{size:16})," Slot Management"]}),r.jsxs("button",{className:"dp-btn dp-btn-primary",onClick:()=>U(!0),children:[r.jsx(aa,{size:13})," Add Slots"]})]}),r.jsx("div",{className:"dp-date-strip",children:gt.map((s,i)=>{const c=P===te(s.date,"yyyy-MM-dd");return r.jsxs("button",{className:`dp-date-btn${c?" active":""}`,onClick:()=>Dt(s,i),children:[r.jsx("span",{className:"dp-day-lbl",children:s.dayLabel}),r.jsx("span",{className:"dp-date-lbl",children:s.dateLabel})]},i)})}),W?r.jsx(Ut,{message:"Loading slots…"}):r.jsx("div",{className:"dp-slot-grid",children:ue.length===0?r.jsxs("div",{className:"dp-slot-empty",children:["No slots scheduled for ",P]}):ue.map((s,i)=>{const c=O.includes(s.slot),u=s==null?void 0:s.slotbooked;return r.jsx("div",{className:`dp-slot-chip${u?" booked":c?" selected":" available"}`,onClick:()=>{u||ke(s.slot)},title:u?"Booked":"Available",children:s.slot},i)})}),r.jsxs("div",{className:"dp-slot-legend",children:[r.jsxs("span",{children:[r.jsx("span",{className:"dp-legend-dot available-dot"}),"Available"]}),r.jsxs("span",{children:[r.jsx("span",{className:"dp-legend-dot booked-dot"}),"Booked"]}),r.jsxs("span",{children:[r.jsx("span",{className:"dp-legend-dot selected-dot"}),"Selected"]})]}),r.jsxs("div",{className:"dp-slot-actions",children:[r.jsxs("button",{className:"dp-btn dp-btn-ghost",disabled:O.length===0,onClick:()=>{ye("selected"),R(!0)},children:["Delete Selected (",O.length,")"]}),r.jsxs("button",{className:"dp-btn dp-btn-danger",onClick:()=>{ye("all"),R(!0)},children:[r.jsx(ge,{size:13})," Delete All for Date"]})]})]}),v===3&&r.jsx("div",{className:"dp-tab-panel",children:J?r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"dp-rating-summary",children:[r.jsxs("div",{className:"dp-rating-card",children:[r.jsxs("span",{className:"dp-rating-big",children:["⭐ ",J.overallDoctorRating]}),r.jsx("span",{className:"dp-rating-sub",children:"Overall Rating"})]}),r.jsxs("div",{className:"dp-rating-card",children:[r.jsx("span",{className:"dp-rating-big",children:((Be=J.comments)==null?void 0:Be.length)||0}),r.jsx("span",{className:"dp-rating-sub",children:"Total Reviews"})]})]}),r.jsx("div",{className:"dp-comments",children:(Le=J.comments)==null?void 0:Le.map((s,i)=>{var c;return r.jsxs("div",{className:"dp-comment-card",children:[r.jsx("div",{className:"dp-comment-avatar",children:ot(s.patientName)}),r.jsxs("div",{className:"dp-comment-body",children:[r.jsxs("div",{className:"dp-comment-header",children:[r.jsxs("div",{children:[r.jsx("span",{className:"dp-comment-name",children:s.patientName}),r.jsx("span",{className:"dp-comment-time",children:ur(s.dateAndTimeAtRating)})]}),r.jsxs("span",{className:"dp-comment-rating",children:["⭐ ",s.doctorRating]})]}),r.jsx("p",{className:"dp-comment-text",children:((c=s.feedback)==null?void 0:c.trim())||"No feedback provided."})]})]},i)})})]}):r.jsxs("div",{className:"dp-empty",children:[r.jsx(_e,{size:40,className:"dp-empty-icon"}),r.jsx("p",{children:"No ratings yet."})]})}),v===4&&r.jsx("div",{className:"dp-tab-panel",children:r.jsxs("div",{className:"dp-svc-grid",children:[((qe=e==null?void 0:e.category)==null?void 0:qe.length)>0&&r.jsxs("div",{className:"dp-svc-card cat",children:[r.jsx("div",{className:"dp-svc-head",children:"Categories"}),r.jsx("ul",{className:"dp-svc-list",children:e.category.map((s,i)=>r.jsx("li",{children:r.jsx("span",{className:"dp-svc-tag cat",children:s.categoryName})},i))})]}),((Re=e==null?void 0:e.service)==null?void 0:Re.length)>0&&r.jsxs("div",{className:"dp-svc-card svc",children:[r.jsx("div",{className:"dp-svc-head",children:"Services"}),r.jsx("ul",{className:"dp-svc-list",children:e.service.map((s,i)=>r.jsx("li",{children:r.jsx("span",{className:"dp-svc-tag svc",children:s.serviceName})},i))})]}),((He=e==null?void 0:e.subServices)==null?void 0:He.length)>0&&r.jsxs("div",{className:"dp-svc-card sub",children:[r.jsx("div",{className:"dp-svc-head",children:"Procedures"}),r.jsx("ul",{className:"dp-svc-list",children:e.subServices.map((s,i)=>r.jsx("li",{children:r.jsx("span",{className:"dp-svc-tag sub",children:s.subServiceName})},i))})]})]})}),r.jsxs(Ve,{visible:xt,onClose:()=>{U(!1),oe([]),Y([])},size:"lg",backdrop:"static",alignment:"center",className:"dp-modal",children:[r.jsx(Xe,{className:"dp-modal-header",children:r.jsxs(Je,{className:"dp-modal-title",children:["Add Time Slots — ",P]})}),r.jsxs(Ue,{className:"dp-modal-body",children:[r.jsxs("div",{className:"dp-slot-gen-row",children:[[10,20,30].map(s=>r.jsxs("label",{className:"dp-radio-label",children:[r.jsx("input",{type:"radio",value:s,checked:ie===s,onChange:()=>{vt(s),oe([]),Y([])}}),s," min"]},s)),r.jsx("button",{className:"dp-btn dp-btn-primary",onClick:Ot,children:"Generate Slots"})]}),Z.length>0&&r.jsxs("label",{className:"dp-select-all",children:[r.jsx("input",{type:"checkbox",checked:O.length===Z.filter(s=>s.available).length,onChange:s=>Y(s.target.checked?Z.filter(i=>i.available).map(i=>i.slot):[])}),"Select All"]}),r.jsx("div",{className:"dp-slot-pick-grid",children:Z.map((s,i)=>{const c=O.includes(s.slot);return r.jsx("button",{className:`dp-slot-pick${c?" selected":""}${s.available?"":" disabled"}`,onClick:()=>{if(!s.available){k.info("Unavailable");return}ke(s.slot)},children:s.slot},i)})})]}),r.jsxs(Ze,{className:"dp-modal-footer",children:[r.jsx("button",{className:"dp-btn dp-btn-ghost",onClick:()=>U(!1),children:"Cancel"}),r.jsxs("button",{className:"dp-btn dp-btn-primary",disabled:O.length===0,onClick:It,children:["Save Slots (",O.length,")"]})]})]}),r.jsxs(Ve,{visible:yt,onClose:()=>R(!1),alignment:"center",backdrop:"static",className:"dp-modal",children:[r.jsx(Xe,{className:"dp-modal-header",children:r.jsx(Je,{className:"dp-modal-title",children:"Confirm Delete"})}),r.jsx(Ue,{className:"dp-modal-body",children:ve==="selected"?r.jsxs("p",{children:["Delete ",r.jsx("strong",{children:O.length})," selected slot(s) for ",r.jsx("strong",{children:P}),"?"]}):r.jsxs("p",{children:["Delete ",r.jsx("strong",{children:"ALL"})," slots for ",r.jsx("strong",{children:P}),"?"]})}),r.jsxs(Ze,{className:"dp-modal-footer",children:[r.jsx("button",{className:"dp-btn dp-btn-ghost",onClick:()=>R(!1),children:"Cancel"}),r.jsxs("button",{className:"dp-btn dp-btn-danger",onClick:async()=>{try{ve==="selected"?(await Promise.all(O.map(s=>Q.delete(`${me}/doctorId/${e.doctorId}/branchId/${h}/date/${P}/slot/${s}`))),k.success("Selected slots deleted.")):(await Q.delete(`${me}/delete-by-date/${e.doctorId}/${h}/${P}`),k.success(`All slots for ${P} deleted.`)),Y([]),pe()}catch{k.error("Failed to delete slots.")}finally{R(!1)}},children:[r.jsx(ge,{size:13})," Confirm Delete"]})]})]}),r.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Hero ─────────────────────────────── */
        .dp-hero {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1rem;
          box-shadow: 0 2px 12px rgba(24,95,165,0.06);
        }
        .dp-hero-banner {
          background: linear-gradient(135deg, #042C53 0%, #185fa5 100%);
          padding: 1.5rem 1.5rem 3.25rem;
          position: relative;
          overflow: hidden;
        }
        .dp-hero-banner::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .dp-hero-banner::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: rgba(250,199,117,0.5);
        }
        .dp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 0.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.85);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .dp-hero-badge-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #9FE1CB;
          animation: dp-pulse 2s infinite;
        }
        @keyframes dp-pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .dp-hero-name {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 5px;
          position: relative;
          z-index: 1;
        }
        .dp-hero-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .dp-hero-lower {
          display: grid;
          grid-template-columns: 96px 1fr;
          align-items: flex-end;
          padding: 0 1.5rem;
          margin-top: -38px;
        }
        .dp-hero-avatar-wrap { position: relative; z-index: 2; }
        .dp-hero-avatar {
          width: 76px; height: 76px;
          border-radius: 50%;
          border: 3px solid #fff;
          object-fit: cover;
          box-shadow: 0 4px 16px rgba(24,95,165,0.2);
          display: block;
        }
        .dp-hero-avatar-initials {
          background: #e6f1fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #185fa5;
        }
        .dp-hero-meta {
          padding-top: 42px;
          padding-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dp-hero-id {
          font-size: 11px;
          background: #f1efe8;
          border: 0.5px solid #d3d1c7;
          color: #5f5e5a;
          border-radius: 20px;
          padding: 3px 10px;
          font-weight: 500;
        }
        .dp-hero-avail {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #5f5e5a;
          font-weight: 500;
        }
        .dp-avail-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #1D9E75;
        }
        .dp-stats-row {
          display: flex;
          gap: 8px;
          padding: 12px 1.5rem 1.25rem;
          flex-wrap: wrap;
        }
        .dp-stat {
          flex: 1;
          min-width: 80px;
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          border-radius: 10px;
          padding: 10px 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .dp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #0c447c;
        }
        .dp-stat-lbl {
          font-size: 10px;
          font-weight: 600;
          color: #185fa5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Tabs ──────────────────────────────── */
        .dp-tabs {
          display: flex;
          gap: 3px;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .dp-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border: none;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 500;
          color: #5f5e5a;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .dp-tab.active {
          background: #185fa5;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(24,95,165,0.25);
        }
        .dp-tab:hover:not(.active) { background: #e6f1fb; color: #185fa5; }

        /* ── Panel ─────────────────────────────── */
        .dp-tab-panel {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }

        /* ── Section label ─────────────────────── */
        .dp-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #185fa5;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 0.5px solid #e6f1fb;
        }

        /* ── Edit section ──────────────────────── */
        .dp-edit-section {
          background: #f7fafd;
          border: 0.5px solid #d0dce9;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 1.25rem;
        }
        .dp-photo-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 12px;
        }
        .dp-photo-preview {
          width: 72px; height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #b5d4f4;
        }
        .dp-file-input { font-size: 12px; }
        .dp-label {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
          display: block;
          letter-spacing: 0.02em;
        }

        /* ── Inputs ────────────────────────────── */
        .dp-input {
          height: 34px !important;
          font-size: 13px !important;
          border: 0.5px solid #d0dce9 !important;
          border-radius: 8px !important;
          margin-top: 4px;
          background: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .dp-input:focus {
          border-color: #185fa5 !important;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.1) !important;
          outline: none !important;
        }
        .dp-select {
          width: 100%;
          padding: 0 10px;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888780' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 10px center !important;
        }
        .dp-err { font-size: 11px; color: #a32d2d; margin-top: 3px; display: block; }

        /* ── Info grid ─────────────────────────── */
        .dp-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 640px) { .dp-info-grid { grid-template-columns: 1fr; } }
        .dp-info-col {}
        .dp-info-row { margin-bottom: 14px; display: flex; flex-direction: column; gap: 3px; }
        .dp-info-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #888780;
        }
        .dp-info-value { font-size: 13.5px; color: #2c2c2a; font-weight: 400; line-height: 1.4; }

        /* ── Fee cards ─────────────────────────── */
        .dp-fees-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 1.25rem;
        }
        .dp-fee-card {
          border-radius: 10px;
          padding: 14px 16px;
          border: 0.5px solid;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dp-fee-card.clinic { background: #E1F5EE; border-color: #9FE1CB; }
        .dp-fee-card.video  { background: #FAEEDA; border-color: #FAC775; }
        .dp-fee-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .dp-fee-card.clinic .dp-fee-label { color: #0F6E56; }
        .dp-fee-card.video  .dp-fee-label { color: #854F0B; }
        .dp-fee-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
        }
        .dp-fee-card.clinic .dp-fee-val { color: #085041; }
        .dp-fee-card.video  .dp-fee-val { color: #633806; }

        /* ── Extras ────────────────────────────── */
        .dp-extras-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 640px) { .dp-extras-grid { grid-template-columns: 1fr; } }
        .dp-extra-block {
          background: #f7f6f2;
          border: 0.5px solid #d3d1c7;
          border-radius: 10px;
          padding: 14px;
        }
        .dp-extra-text { font-size: 13px; color: #2c2c2a; line-height: 1.6; margin: 0; }
        .dp-bullet-list { list-style: none; margin: 6px 0 0; padding: 0; }
        .dp-bullet-list li {
          font-size: 13px;
          color: #2c2c2a;
          padding: 3px 0 3px 14px;
          position: relative;
          line-height: 1.5;
        }
        .dp-bullet-list li::before {
          content: '';
          position: absolute;
          left: 0; top: 9px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #378ADD;
        }
        .dp-sig-box {
          width: 150px; height: 70px;
          border: 0.5px solid #d3d1c7;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          margin-top: 8px;
          overflow: hidden;
        }

        /* ── Action row ────────────────────────── */
        .dp-action-row {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 0.5px solid #e6f1fb;
        }

        /* ── Buttons ───────────────────────────── */
        .dp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 9px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: 0.5px solid;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .dp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .dp-btn-primary {
          background: #185fa5;
          color: #fff;
          border-color: #185fa5;
          box-shadow: 0 2px 8px rgba(24,95,165,0.2);
        }
        .dp-btn-primary:hover:not(:disabled) { background: #0c447c; border-color: #0c447c; }
        .dp-btn-edit {
          background: #EAF3DE;
          color: #27500A;
          border-color: #C0DD97;
        }
        .dp-btn-edit:hover { background: #C0DD97; }
        .dp-btn-danger {
          background: #FCEBEB;
          color: #791F1F;
          border-color: #F7C1C1;
        }
        .dp-btn-danger:hover:not(:disabled) { background: #F7C1C1; }
        .dp-btn-ghost {
          background: #fff;
          color: #5f5e5a;
          border-color: #d0dce9;
        }
        .dp-btn-ghost:hover:not(:disabled) { background: #f1efe8; }

        /* ── Slot tab ──────────────────────────── */
        .dp-slot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .dp-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #0c447c;
          margin: 0;
        }
        .dp-date-strip {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 1rem;
          scrollbar-width: thin;
        }
        .dp-date-btn {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 54px;
          padding: 8px 6px;
          border: 0.5px solid #d0dce9;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .dp-date-btn.active { background: #185fa5; border-color: #185fa5; }
        .dp-date-btn:hover:not(.active) { border-color: #85B7EB; background: #e6f1fb; }
        .dp-day-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
        .dp-date-lbl { font-size: 11px; font-weight: 500; }
        .dp-date-btn        .dp-day-lbl, .dp-date-btn        .dp-date-lbl { color: #2c2c2a; }
        .dp-date-btn.active .dp-day-lbl, .dp-date-btn.active .dp-date-lbl { color: #fff; }
        .dp-slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 8px;
          margin-bottom: 10px;
        }
        .dp-slot-chip {
          text-align: center;
          padding: 9px 4px;
          border: 0.5px solid;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.12s;
          user-select: none;
        }
        .dp-slot-chip.available { background: #E1F5EE; color: #085041; border-color: #9FE1CB; }
        .dp-slot-chip.available:hover { background: #9FE1CB; }
        .dp-slot-chip.selected { background: #185fa5; color: #fff; border-color: #185fa5; }
        .dp-slot-chip.booked  { background: #FCEBEB; color: #791F1F; border-color: #F7C1C1; cursor: not-allowed; }
        .dp-slot-empty {
          grid-column: 1 / -1;
          text-align: center;
          color: #888780;
          font-size: 13px;
          padding: 2.5rem;
          background: #f7f6f2;
          border-radius: 10px;
          border: 0.5px solid #d3d1c7;
        }
        .dp-slot-legend {
          display: flex;
          gap: 14px;
          font-size: 11px;
          color: #5f5e5a;
          margin-bottom: 12px;
        }
        .dp-legend-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-right: 4px;
          vertical-align: middle;
        }
        .available-dot { background: #1D9E75; }
        .booked-dot    { background: #E24B4A; }
        .selected-dot  { background: #185fa5; }
        .dp-slot-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 0.5px solid #e6f1fb;
        }

        /* ── Ratings ───────────────────────────── */
        .dp-rating-summary { display: flex; gap: 10px; margin-bottom: 1.25rem; }
        .dp-rating-card {
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          border-radius: 12px;
          padding: 14px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 110px;
        }
        .dp-rating-big {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #0c447c;
          line-height: 1;
        }
        .dp-rating-sub {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #185fa5;
        }
        .dp-comments { display: flex; flex-direction: column; gap: 10px; }
        .dp-comment-card {
          display: flex;
          gap: 12px;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          padding: 14px;
          position: relative;
          overflow: hidden;
        }
        .dp-comment-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #185fa5;
        }
        .dp-comment-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #185fa5;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .dp-comment-body { flex: 1; }
        .dp-comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }
        .dp-comment-name { font-size: 13px; font-weight: 500; color: #0c447c; display: block; }
        .dp-comment-time { font-size: 11px; color: #888780; }
        .dp-comment-rating {
          font-size: 12px;
          font-weight: 600;
          color: #633806;
          background: #FAEEDA;
          border: 0.5px solid #FAC775;
          border-radius: 20px;
          padding: 2px 8px;
          white-space: nowrap;
        }
        .dp-comment-text { font-size: 13px; color: #5f5e5a; line-height: 1.6; margin: 0; }
        .dp-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 3rem; color: #888780; font-size: 13px;
        }
        .dp-empty-icon { color: #d3d1c7; }

        /* ── Services ──────────────────────────── */
        .dp-svc-grid { display: flex; flex-direction: column; gap: 10px; }
        .dp-svc-card { border: 0.5px solid; border-radius: 12px; overflow: hidden; }
        .dp-svc-head {
          padding: 10px 14px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
        }
        .dp-svc-card.cat { border-color: #b5d4f4; }
        .dp-svc-card.cat .dp-svc-head { background: #185fa5; }
        .dp-svc-card.svc { border-color: #9FE1CB; }
        .dp-svc-card.svc .dp-svc-head { background: #1D9E75; }
        .dp-svc-card.sub { border-color: #FAC775; }
        .dp-svc-card.sub .dp-svc-head { background: #BA7517; }
        .dp-svc-list {
          list-style: none; margin: 0; padding: 10px 14px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .dp-svc-tag {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          border: 0.5px solid;
        }
        .dp-svc-tag.cat { background: #e6f1fb; color: #0c447c; border-color: #b5d4f4; }
        .dp-svc-tag.svc { background: #E1F5EE; color: #085041; border-color: #9FE1CB; }
        .dp-svc-tag.sub { background: #FAEEDA; color: #633806; border-color: #FAC775; }

        /* ── Modal ─────────────────────────────── */
        .dp-modal .modal-content {
          border: 0.5px solid #d0dce9 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(4,44,83,0.14) !important;
        }
        .dp-modal-header {
          background: linear-gradient(135deg, #042C53, #185fa5) !important;
          border-bottom: none !important;
          padding: 16px 20px !important;
        }
        .dp-modal-title {
          font-family: 'Syne', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #fff !important;
        }
        .dp-modal .btn-close { filter: brightness(0) invert(1); opacity: 0.75; }
        .dp-modal-body { background: #f7f6f2 !important; padding: 1.25rem !important; }
        .dp-modal-footer {
          background: #f7f6f2 !important;
          border-top: 0.5px solid #d0dce9 !important;
          padding: 12px 1.25rem !important;
          display: flex; justify-content: flex-end; gap: 8px;
        }

        /* ── Slot modal controls ───────────────── */
        .dp-slot-gen-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .dp-radio-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
        }
        .dp-select-all {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .dp-slot-pick-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .dp-slot-pick {
          padding: 6px 10px;
          border: 0.5px solid #d0dce9;
          border-radius: 7px;
          background: #fff;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.12s;
          font-family: 'DM Sans', sans-serif;
        }
        .dp-slot-pick.selected { background: #185fa5; color: #fff; border-color: #185fa5; }
        .dp-slot-pick.disabled { background: #f1efe8; color: #888780; cursor: not-allowed; }
      `})]})};export{zr as default};
