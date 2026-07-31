import{r as n,g as D,j as t,n as L,B as F,X as H}from"./index-BeDIqrBR.js";import{a as $,A as _}from"./AppointmentAPI-mUePlV8Q.js";import{L as M}from"./loader-BBK4Pa4j.js";import{R as U}from"./rotate-ccw-Ddmh8xvO.js";import{C as V,a as O,b as g,c as K,d as X,e as r}from"./CTable-0DGiQW34.js";import{E as G}from"./eye-BZSjugo6.js";import{C as q,a as J}from"./chevron-right-mxUXGXZz.js";import"./DefaultLayout-DlOx962b.js";import"./index.esm-FFYuxYBB.js";const Q={Confirmed:{bg:"#dcfce7",color:"#166534",dot:"#22c55e"},"In-Progress":{bg:"#dbeafe",color:"#1e40af",dot:"#3b82f6"},Completed:{bg:"#f0fdf4",color:"#14532d",dot:"#16a34a"},Pending:{bg:"#fef9c3",color:"#854d0e",dot:"#eab308"},Rejected:{bg:"#fee2e2",color:"#991b1b",dot:"#ef4444"}},Y={"In-Progress":"Active",Completed:"Completed",Pending:"Pending",Rejected:"Rejected",Confirmed:"Confirmed"},Z=[{key:"Service & Treatment",label:"🩺 Service & Treatment"},{key:"In-clinic",label:"🏥 In-Clinic"},{key:"Video Consultation",label:"📹 Video Consultation"}],ee=[{value:"Confirmed",label:"Confirmed"},{value:"In-Progress",label:"Active"},{value:"Completed",label:"Completed"}],ce=()=>{const[x,h]=n.useState([]),[y,j]=n.useState([]),[m,I]=n.useState([]),[T,C]=n.useState(!0),[f,v]=n.useState([]),[b,S]=n.useState([]),[z,w]=n.useState(""),[l,p]=n.useState(1),[c,N]=n.useState(5),A=D(),u=async(e="")=>{var a;C(!0);try{const s=e?await $(e):await _(),o=Array.isArray(s.data)?s.data:((a=s.data)==null?void 0:a.data)||[];j(o)}catch(s){console.error("Failed to fetch appointments:",s),j([]),h([])}finally{C(!1)}},R=async()=>{try{const e=await L.get(`${F}/${H}`);e.data.success&&I(e.data.data)}catch(e){console.error("Error fetching hospitals:",e)}};n.useEffect(()=>{u(),R()},[]),n.useEffect(()=>{let e=[...y];const a=o=>o==null?void 0:o.toLowerCase().trim(),s={"Service & Treatment":"services & treatments","video Consultation":"online consultation","In-clinic":"in-clinic consultation"};if(b.length>0&&(e=e.filter(o=>b.some(i=>a(i)===a(o.status)))),f.length===1){const o=f[0];if(o==="Video Consultation")e=e.filter(i=>a(i.consultationType)==="video consultation"||a(i.consultationType)==="online consultation");else{const i=s[o];i&&(e=e.filter(W=>a(W.consultationType)===i))}}h(e),p(1)},[y,f,b]),n.useEffect(()=>{window.scrollTo(0,0)},[l]);const k=x.slice((l-1)*c,l*c),d=Math.ceil(x.length/c),P=e=>{v(a=>a.includes(e)?[]:[e])},B=e=>{const a=e.target.value;S(s=>s.includes(a)?[]:[a])},E=()=>{v([]),S([]),w(""),u("")};return t.jsxs("div",{style:{padding:"4px 0"},children:[t.jsx("style",{children:`
        .appt-filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid #1a3a6b;
          background: #fff;
          color: #1a3a6b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .appt-filter-btn:hover {
          background: #e8f0fb;
        }
        .appt-filter-btn.active {
          background: #1a3a6b;
          color: #fff;
          border-color: #1a3a6b;
        }
        .appt-table thead th {
          background: #1a3a6b !important;
          color: #ffffff !important;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4px;
          padding: 12px 14px;
          border: none;
          white-space: nowrap;
        }
        .appt-table tbody tr {
          font-size: 13px;
          transition: background 0.15s;
        }
        .appt-table tbody tr:hover {
          background-color: #eef4fb !important;
        }
        .appt-table tbody td {
          padding: 11px 14px;
          vertical-align: middle;
          border-color: #f0f0f0;
          color: #374151;
        }
        .appt-view-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid #1a3a6b;
          background: #fff;
          color: #1a3a6b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .appt-view-btn:hover {
          background: #1a3a6b;
          color: #fff;
        }
        .appt-page-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          color: #374151;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .appt-page-btn:hover { border-color: #1a3a6b; color: #1a3a6b; }
        .appt-page-btn.active {
          background: #1a3a6b;
          color: #fff;
          border-color: #1a3a6b;
        }
        .appt-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .appt-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .appt-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      `}),t.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"},children:t.jsxs("div",{children:[t.jsx("h5",{style:{color:"#1a3a6b",fontWeight:"700",margin:0,fontSize:"18px"},children:"Appointment Management"}),t.jsxs("p",{style:{color:"#6b7280",fontSize:"12px",margin:"2px 0 0"},children:[x.length," appointment",x.length!==1?"s":""," found"]})]})}),t.jsxs("div",{style:{background:"#fff",borderRadius:"14px",padding:"16px 20px",marginBottom:"16px",boxShadow:"0 2px 12px rgba(27,79,138,0.08)",border:"1px solid #e8eef5"},children:[t.jsx("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"14px"},children:Z.map(({key:e,label:a})=>t.jsx("button",{className:`appt-filter-btn ${f.includes(e)?"active":""}`,onClick:()=>P(e),children:a},e))}),t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"},children:[t.jsxs("div",{style:{display:"flex",gap:"20px",flexWrap:"wrap",alignItems:"center"},children:[t.jsx("span",{style:{fontSize:"12px",color:"#6b7280",fontWeight:"600"},children:"Status:"}),ee.map(({value:e,label:a})=>t.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",color:"#374151",cursor:"pointer"},children:[t.jsx("input",{type:"checkbox",value:e,checked:b.includes(e),onChange:B,style:{width:"15px",height:"15px",accentColor:"#1a3a6b",cursor:"pointer"}}),a]},e))]}),t.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[t.jsxs("select",{style:{padding:"7px 12px",borderRadius:"8px",border:"1.5px solid #d1d5db",fontSize:"13px",color:"#374151",minWidth:"180px",outline:"none",cursor:"pointer"},value:z,onChange:e=>{const a=e.target.value;w(a),u(a)},children:[t.jsx("option",{value:"",children:"All Clinics"}),Array.isArray(m)&&m.map(e=>t.jsx("option",{value:e.hospitalId,children:e.name},e.hospitalId))]}),t.jsxs("button",{onClick:E,style:{display:"flex",alignItems:"center",gap:"6px",padding:"7px 14px",borderRadius:"8px",border:"1.5px solid #f9c571",background:"#fffbf0",color:"#92610a",fontSize:"12px",fontWeight:"600",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"},children:[t.jsx(U,{size:13}),"Reset"]})]})]})]}),t.jsxs("div",{style:{background:"#fff",borderRadius:"14px",overflow:"hidden",boxShadow:"0 2px 12px rgba(27,79,138,0.08)",border:"1px solid #e8eef5"},children:[t.jsxs(V,{className:"appt-table mb-0",hover:!0,responsive:!0,children:[t.jsx(O,{children:t.jsx(g,{children:["S.No","H_ID","Patient Name","Consultation Type","Date","Time","Status","Action"].map(e=>t.jsx(K,{className:e==="Action"?"text-center":"",children:e},e))})}),t.jsx(X,{children:T?t.jsx(g,{children:t.jsx(r,{colSpan:"8",className:"text-center py-5",children:t.jsx(M,{message:"Loading appointments..."})})}):k.length>0?k.map((e,a)=>{const s=e.status,o=Q[s]||{bg:"#f3f4f6",color:"#374151",dot:"#9ca3af"};return t.jsxs(g,{children:[t.jsx(r,{style:{color:"#9ca3af",fontWeight:"600",fontSize:"12px"},children:(l-1)*c+a+1}),t.jsx(r,{children:t.jsx("span",{style:{background:"#eef4fb",color:"#1a3a6b",padding:"2px 8px",borderRadius:"6px",fontSize:"11px",fontWeight:"600"},children:(e==null?void 0:e.clinicId)||"-"})}),t.jsx(r,{style:{fontWeight:"500"},children:(e==null?void 0:e.name)||"-"}),t.jsx(r,{style:{color:"#6b7280"},children:(e==null?void 0:e.consultationType)||"-"}),t.jsx(r,{children:(e==null?void 0:e.serviceDate)||(e==null?void 0:e.sele)||"-"}),t.jsx(r,{children:(e==null?void 0:e.slot)||(e==null?void 0:e.servicetime)||"-"}),t.jsx(r,{children:t.jsxs("span",{className:"appt-status-badge",style:{backgroundColor:o.bg,color:o.color},children:[t.jsx("span",{className:"appt-status-dot",style:{backgroundColor:o.dot}}),Y[s]||s]})}),t.jsx(r,{className:"text-center",children:t.jsx("button",{className:"appt-view-btn",title:"View Details",onClick:()=>A(`/appointmentDetails/${e.bookingId}`,{state:{appointment:e}}),children:t.jsx(G,{size:15})})})]},`${e.id}-${a}`)}):t.jsx(g,{children:t.jsx(r,{colSpan:"8",className:"text-center py-5",children:t.jsxs("div",{style:{color:"#9ca3af",fontSize:"14px"},children:[t.jsx("div",{style:{fontSize:"32px",marginBottom:"8px"},children:"📋"}),"No appointments found."]})})})})]}),d>1&&t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",borderTop:"1px solid #f0f0f0",flexWrap:"wrap",gap:"8px"},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[t.jsx("span",{style:{fontSize:"12px",color:"#6b7280",whiteSpace:"nowrap"},children:"Rows per page:"}),t.jsx("select",{value:c,onChange:e=>{N(Number(e.target.value)),p(1)},style:{padding:"5px 8px",border:"1.5px solid #e5e7eb",borderRadius:"7px",fontSize:"12px",color:"#374151",cursor:"pointer",outline:"none",background:"#fff"},children:[5,10,25,50].map(e=>t.jsx("option",{value:e,children:e},e))})]}),t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[t.jsxs("button",{className:"appt-page-btn",disabled:l===1,onClick:()=>p(e=>e-1),children:[t.jsx(q,{size:13})," Prev"]}),Array.from({length:d},(e,a)=>a+1).filter(e=>e===1||e===d||Math.abs(e-l)<=1).reduce((e,a,s,o)=>(s>0&&a-o[s-1]>1&&e.push("..."),e.push(a),e),[]).map((e,a)=>e==="..."?t.jsx("span",{style:{fontSize:"12px",color:"#9ca3af",padding:"0 2px"},children:"…"},`ellipsis-${a}`):t.jsx("button",{className:`appt-page-btn ${l===e?"active":""}`,onClick:()=>p(e),children:e},e)),t.jsxs("button",{className:"appt-page-btn",disabled:l===d,onClick:()=>p(e=>e+1),children:["Next ",t.jsx(J,{size:13})]}),t.jsxs("span",{style:{fontSize:"12px",color:"#6b7280",marginLeft:"6px",whiteSpace:"nowrap"},children:["Page"," ",t.jsx("strong",{style:{color:"#1a3a6b"},children:l})," ","of"," ",t.jsx("strong",{style:{color:"#1a3a6b"},children:d})]})]})]})]})]})};export{ce as default};
