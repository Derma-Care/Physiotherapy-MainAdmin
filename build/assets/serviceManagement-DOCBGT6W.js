import{r as t,j as e,Q as je,q as u}from"./index-BeDIqrBR.js";import{c as Ne}from"./index.esm-FFYuxYBB.js";import{g as we,a as Se,p as Ie,u as Ce,d as ke}from"./ServiceAPI-DfoepYUL.js";import{C as ze}from"./CategoryAPI-Q9E_XO2Q.js";import{L as N,S as De}from"./react-select.esm-Cwm9AtcL.js";import{L as Me}from"./loader-BBK4Pa4j.js";import{C as qe}from"./ConfirmationDelete-PJmFwrEV.js";import{c as Ee}from"./cil-search-Bjd2ULXB.js";import{C as Le,a as Pe,b as F,c as w,d as Re,e as h}from"./CTable-0DGiQW34.js";import{E as Ae}from"./eye-BZSjugo6.js";import{P as Fe}from"./pen-Cg7hCLfU.js";import{T as ee}from"./trash-2-DUvAE15q.js";import{C as T,a as V,b as B,c as O}from"./CModalHeader-Do9-2MrL.js";import{C as W}from"./CModalTitle-CwFuP0xu.js";import{X as $}from"./x-Cmuy0yEH.js";import{S as se}from"./save-U0gwb88M.js";import"./DefaultLayout-DlOx962b.js";const ss=()=>{const q=t.useRef(null),E=t.useRef(null),[S,ae]=t.useState(""),[p,ie]=t.useState([]),[I,re]=t.useState([]),[L,te]=t.useState([]),[oe,H]=t.useState(!1),[U,ne]=t.useState(null),[ce,C]=t.useState(!1),[g,le]=t.useState(null),[de,P]=t.useState(!1),[me,k]=t.useState(!1),[pe,R]=t.useState(!1),[ge,xe]=t.useState(null),[b,y]=t.useState(1),[z,fe]=t.useState(5),[x,l]=t.useState({serviceName:"",categoryId:"",description:"",serviceImage:""}),[f,n]=t.useState({}),[c,d]=t.useState({serviceName:"",categoryId:"",description:"",serviceImage:null}),[o,v]=t.useState({ServiceId:"",ServiceName:"",categoryId:"",description:"",serviceImage:null,existingImageName:""}),D=async()=>{var s;H(!0);try{const[a,i]=await Promise.all([we(),ze()]);ie(((s=a.data)==null?void 0:s.data)||a.data),re(i.data)}catch{ne("Failed to fetch data"),u.error("Error loading data")}finally{H(!1)}};t.useEffect(()=>{D()},[]),t.useEffect(()=>{const s=S.toLowerCase().trim();te(s?p.filter(a=>{var i,r;return((i=a.serviceName)==null?void 0:i.toLowerCase().includes(s))||((r=a.categoryName)==null?void 0:r.toLowerCase().includes(s))}):p),y(1)},[S,p]);const K=b*z,Q=K-z,Z=L.slice(Q,K),M=Math.ceil(L.length/z),ue=async s=>{const a=await Se(s);le(a),P(!0)},X=s=>new Promise(a=>{const i=new FileReader;i.readAsDataURL(s),i.onloadend=()=>{var r;return a((r=i.result)==null?void 0:r.split(",")[1])}}),ve=async s=>{const a=s.target.files[0];if(!a)return;if(!a.type.startsWith("image/")){l(r=>({...r,serviceImage:"Only image files allowed"}));return}const i=await X(a);d(r=>({...r,serviceImage:i})),l(r=>({...r,serviceImage:""}))},Y=async()=>{const s={},a=c.serviceName.trim(),i=c.description.trim();if(a?/^[A-Za-z\s@&\-\.,()]+$/.test(a)?a.length<3&&(s.serviceName="Minimum 3 characters required."):s.serviceName="Only letters and basic symbols allowed.":s.serviceName="Service Name is required.",i?i.length<10&&(s.description="Minimum 10 characters required."):s.description="Description is required.",c.categoryId||(s.categoryId="Category is required."),c.serviceImage||(s.serviceImage="Service image is required."),Object.keys(s).length){l(s);return}if(p.some(r=>{var j;return((j=r.serviceName)==null?void 0:j.toLowerCase())===a.toLowerCase()})){l({serviceName:"Service already exists."});return}try{await Ie({...c,serviceName:a,description:i}),u.success("Service added successfully!"),C(!1),d({serviceName:"",categoryId:"",description:"",serviceImage:null}),D()}catch{u.error("Failed to add service")}},he=s=>{v({ServiceId:s.serviceId,ServiceName:s.serviceName,categoryId:s.categoryId||"",description:s.description||"",serviceImage:s.serviceImage,existingImageName:s.serviceImage?"Existing image":""}),n({}),k(!0)},A=async()=>{const s={},a=o.ServiceName.trim(),i=o.description.trim();if(a?/^[A-Za-z\s@&\-\.,()]+$/.test(a)?a.length<3&&(s.ServiceName="Minimum 3 characters required."):s.ServiceName="Only letters and basic symbols allowed.":s.ServiceName="Service Name is required.",i?i.length<5&&(s.description="Minimum 5 characters required."):s.description="Description is required.",o.categoryId||(s.categoryId="Category is required."),!o.serviceImage&&!o.existingImageName&&(s.serviceImage="Service image is required."),Object.keys(s).length){n(s);return}if(p.some(j=>{var J;return((J=j.serviceName)==null?void 0:J.toLowerCase())===a.toLowerCase()&&j.serviceId!==o.ServiceId})){n({ServiceName:"Service already exists."});return}let r=o.serviceImage;r&&typeof r!="string"?r=await X(r):r!=null&&r.includes("base64,")&&(r=r.split(",")[1]);try{await Ce({serviceId:o.ServiceId,serviceName:a,categoryId:o.categoryId,description:i,serviceImage:r},o.ServiceId),u.success("Service updated successfully!"),k(!1),D()}catch{u.error("Failed to update service")}},be=async()=>{try{await ke(ge),u.success("Service deleted successfully!"),R(!1),D()}catch{u.error("Failed to delete service")}},_=(I==null?void 0:I.map(s=>({value:s.categoryId,label:s.categoryName})))||[],ye={control:(s,a)=>({...s,fontSize:13,minHeight:36,borderColor:a.isFocused?"#185fa5":"#d0dce9",borderWidth:"0.5px",borderRadius:7,boxShadow:"none","&:hover":{borderColor:"#185fa5"}}),option:(s,a)=>({...s,fontSize:13,backgroundColor:a.isSelected?"#185fa5":a.isFocused?"#f0f5fb":"#fff",color:a.isSelected?"#fff":"#374151"}),menu:s=>({...s,fontSize:13,zIndex:9999}),placeholder:s=>({...s,fontSize:13,color:"#9ca3af"})},m=({label:s,required:a,error:i,children:r})=>e.jsxs("div",{className:"sm-field",children:[e.jsxs("label",{className:"sm-label",children:[s,a&&e.jsx("span",{className:"sm-required",children:"*"})]}),r,i&&e.jsx("span",{className:"sm-error-text",children:i})]}),G=({src:s,onRemove:a})=>e.jsxs("div",{className:"sm-img-preview-wrap",children:[e.jsx("img",{src:s,alt:"Preview",className:"sm-img-preview"}),e.jsx("button",{type:"button",className:"sm-img-remove",onClick:a,children:e.jsx(ee,{size:13})})]});return e.jsxs("div",{className:"sm-page",children:[e.jsx(je,{}),e.jsxs("div",{className:"sm-page-header",children:[e.jsxs("div",{className:"sm-title-group",children:[e.jsx("div",{className:"sm-page-icon",children:e.jsx(N,{size:20})}),e.jsxs("div",{children:[e.jsx("h4",{className:"sm-page-title",children:"Service Management"}),e.jsxs("p",{className:"sm-page-sub",children:[p.length," service",p.length!==1?"s":""," registered"]})]})]}),e.jsxs("div",{className:"sm-header-right",children:[e.jsxs("div",{className:"sm-search-wrap",children:[e.jsx(Ne,{icon:Ee,className:"sm-search-icon"}),e.jsx("input",{className:"sm-search-input",type:"text",placeholder:"Search service / category…",value:S,onChange:s=>ae(s.target.value)})]}),e.jsx("button",{className:"sm-add-btn",onClick:()=>C(!0),children:"+ Add Service"})]})]}),oe?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:200},children:e.jsx(Me,{message:"Loading services…"})}):U?e.jsx("div",{className:"sm-error",children:U}):e.jsx("div",{className:"sm-table-wrapper",children:e.jsxs(Le,{className:"sm-table",children:[e.jsx(Pe,{children:e.jsxs(F,{children:[e.jsx(w,{className:"sm-th",style:{width:60},children:"S.No"}),e.jsx(w,{className:"sm-th",children:"Service Name"}),e.jsx(w,{className:"sm-th",children:"Category"}),e.jsx(w,{className:"sm-th",children:"Description"}),e.jsx(w,{className:"sm-th",style:{width:120},children:"Actions"})]})}),e.jsx(Re,{children:Z.length>0?Z.map((s,a)=>e.jsxs(F,{className:"sm-tr",children:[e.jsx(h,{className:"sm-td sm-td-num",children:Q+a+1}),e.jsx(h,{className:"sm-td",children:e.jsx("span",{className:"sm-name",children:s.serviceName})}),e.jsx(h,{className:"sm-td sm-muted",children:s.categoryName}),e.jsx(h,{className:"sm-td sm-muted",style:{maxWidth:260},children:e.jsx("span",{className:"sm-desc",children:s.description||"N/A"})}),e.jsx(h,{className:"sm-td",children:e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx("button",{className:"sm-action-btn sm-view-btn",title:"View",onClick:()=>ue(s.serviceId),children:e.jsx(Ae,{size:14})}),e.jsx("button",{className:"sm-action-btn sm-edit-btn",title:"Edit",onClick:()=>he(s),children:e.jsx(Fe,{size:14})}),e.jsx("button",{className:"sm-action-btn sm-delete-btn",title:"Delete",onClick:()=>{xe(s.serviceId),R(!0)},children:e.jsx(ee,{size:14})})]})})]},s.serviceId||a)):e.jsx(F,{children:e.jsx(h,{colSpan:5,children:e.jsxs("div",{className:"sm-empty",children:[e.jsx(N,{size:38,className:"sm-empty-icon"}),e.jsx("p",{children:S?"No matching services found.":"No services available."})]})})})})]})}),L.length>0&&e.jsxs("div",{className:"sm-pagination",children:[e.jsxs("div",{className:"sm-rows-select",children:[e.jsx("span",{children:"Rows per page:"}),e.jsx("select",{className:"sm-select",value:z,onChange:s=>{fe(Number(s.target.value)),y(1)},children:[5,10,25,50].map(s=>e.jsx("option",{value:s,children:s},s))})]}),e.jsxs("div",{className:"sm-page-controls",children:[e.jsx("button",{className:"sm-page-btn",onClick:()=>y(s=>Math.max(s-1,1)),disabled:b===1,children:"‹ Prev"}),[...Array(M)].map((s,a)=>e.jsx("button",{className:`sm-page-btn sm-page-num ${a+1===b?"sm-page-btn--active":""}`,onClick:()=>y(a+1),children:a+1},a)),e.jsx("button",{className:"sm-page-btn",onClick:()=>y(s=>Math.min(s+1,M)),disabled:b===M,children:"Next ›"}),e.jsxs("span",{className:"sm-page-label",children:["Page ",e.jsx("strong",{children:b})," of ",e.jsx("strong",{children:M})]})]})]}),e.jsxs(T,{visible:de,onClose:()=>P(!1),backdrop:"static",alignment:"center",children:[e.jsx(V,{style:{borderBottom:"0.5px solid #d0dce9",padding:"16px 20px"},children:e.jsxs(W,{style:{fontSize:15,fontWeight:600,color:"#0c447c",display:"flex",alignItems:"center",gap:8},children:[e.jsx(N,{size:16,color:"#185fa5"})," Service Details"]})}),e.jsx(B,{style:{padding:"20px"},children:g?e.jsxs("div",{className:"sm-view-body",children:[g.serviceImage&&e.jsx("div",{className:"sm-view-img-wrap",children:e.jsx("img",{src:`data:image/jpeg;base64,${g.serviceImage}`,alt:g.serviceName,className:"sm-view-img"})}),e.jsxs("div",{className:"sm-view-grid",children:[e.jsxs("div",{className:"sm-view-field",children:[e.jsx("span",{className:"sm-view-label",children:"Service Name"}),e.jsx("span",{className:"sm-view-value",children:g.serviceName})]}),e.jsxs("div",{className:"sm-view-field",children:[e.jsx("span",{className:"sm-view-label",children:"Category"}),e.jsx("span",{className:"sm-view-value",children:g.categoryName})]}),e.jsxs("div",{className:"sm-view-field",style:{gridColumn:"1/-1"},children:[e.jsx("span",{className:"sm-view-label",children:"Description"}),e.jsx("span",{className:"sm-view-value",children:g.description||"N/A"})]})]})]}):e.jsx("p",{style:{color:"#9ca3af",textAlign:"center"},children:"No details available"})}),e.jsx(O,{style:{borderTop:"0.5px solid #d0dce9",padding:"12px 20px"},children:e.jsxs("button",{className:"sm-btn-cancel",onClick:()=>P(!1),children:[e.jsx($,{size:13})," Close"]})})]}),e.jsxs(T,{visible:ce,onClose:()=>{C(!1),d({serviceName:"",categoryId:"",description:"",serviceImage:null}),l({})},backdrop:"static",alignment:"center",children:[e.jsx(V,{style:{borderBottom:"0.5px solid #d0dce9",padding:"16px 20px"},children:e.jsxs(W,{style:{fontSize:15,fontWeight:600,color:"#0c447c",display:"flex",alignItems:"center",gap:8},children:[e.jsx(N,{size:16,color:"#185fa5"})," Add New Service"]})}),e.jsxs(B,{style:{padding:"20px"},children:[e.jsx(m,{label:"Category",required:!0,error:x.categoryId,children:e.jsx(De,{styles:ye,options:_,isClearable:!0,value:_.find(s=>s.value===c.categoryId)||null,onChange:s=>{d(a=>({...a,categoryId:(s==null?void 0:s.value)||""})),x.categoryId&&l(a=>({...a,categoryId:""}))},placeholder:"Search or select a category"})}),e.jsx(m,{label:"Service Name",required:!0,error:x.serviceName,children:e.jsx("input",{className:"sm-input",type:"text",value:c.serviceName,onChange:s=>{d(a=>({...a,serviceName:s.target.value})),x.serviceName&&l(a=>({...a,serviceName:""}))}})}),e.jsx(m,{label:"Description",required:!0,error:x.description,children:e.jsx("input",{className:"sm-input",type:"text",value:c.description,onChange:s=>{d(a=>({...a,description:s.target.value})),x.description&&l(a=>({...a,description:""}))},onKeyDown:s=>{s.key==="Enter"&&(s.preventDefault(),Y())}})}),e.jsxs(m,{label:"Service Image",required:!0,error:x.serviceImage,children:[e.jsx("input",{className:"sm-input",type:"file",accept:"image/*",ref:q,onChange:ve}),c.serviceImage&&e.jsx(G,{src:`data:image/png;base64,${c.serviceImage}`,onRemove:()=>{d(s=>({...s,serviceImage:null})),q.current&&(q.current.value="")}})]})]}),e.jsxs(O,{style:{borderTop:"0.5px solid #d0dce9",padding:"12px 20px",gap:8},children:[e.jsxs("button",{className:"sm-btn-cancel",onClick:()=>{C(!1),d({serviceName:"",categoryId:"",description:"",serviceImage:null}),l({})},children:[e.jsx($,{size:13})," Cancel"]}),e.jsxs("button",{className:"sm-btn-save",onClick:Y,children:[e.jsx(se,{size:13})," Add Service"]})]})]}),e.jsxs(T,{visible:me,onClose:()=>{k(!1),n({})},backdrop:"static",alignment:"center",children:[e.jsx(V,{style:{borderBottom:"0.5px solid #d0dce9",padding:"16px 20px"},children:e.jsxs(W,{style:{fontSize:15,fontWeight:600,color:"#0c447c",display:"flex",alignItems:"center",gap:8},children:[e.jsx(N,{size:16,color:"#185fa5"})," Edit Service"]})}),e.jsxs(B,{style:{padding:"20px"},children:[e.jsx(m,{label:"Category",required:!0,error:f.categoryId,children:e.jsxs("select",{className:"sm-input",value:o.categoryId,onChange:s=>{v(a=>({...a,categoryId:s.target.value})),f.categoryId&&n(a=>({...a,categoryId:""}))},children:[e.jsx("option",{value:"",children:"Select Category"}),I.map(s=>e.jsx("option",{value:s.categoryId,children:s.categoryName},s.categoryId))]})}),e.jsx(m,{label:"Service Name",required:!0,error:f.ServiceName,children:e.jsx("input",{className:"sm-input",type:"text",value:o.ServiceName,onChange:s=>{v(a=>({...a,ServiceName:s.target.value})),f.ServiceName&&n(a=>({...a,ServiceName:""}))},onKeyDown:s=>{s.key==="Enter"&&(s.preventDefault(),A())}})}),e.jsx(m,{label:"Description",required:!0,error:f.description,children:e.jsx("input",{className:"sm-input",type:"text",value:o.description,onChange:s=>{v(a=>({...a,description:s.target.value})),f.description&&n(a=>({...a,description:""}))},onKeyDown:s=>{s.key==="Enter"&&(s.preventDefault(),A())}})}),e.jsxs(m,{label:"Service Image",required:!0,error:f.serviceImage,children:[e.jsx("input",{className:"sm-input",type:"file",accept:"image/*",ref:E,onChange:async s=>{const a=s.target.files[0];if(a){if(a.size>2*1024*1024){n(i=>({...i,serviceImage:"File size must be less than 2MB"}));return}v(i=>({...i,serviceImage:a,existingImageName:a.name})),n(i=>({...i,serviceImage:""}))}}}),(o.serviceImage||o.existingImage)&&e.jsx(G,{src:typeof o.serviceImage=="string"?o.serviceImage.startsWith("data:image")?o.serviceImage:`data:image/png;base64,${o.serviceImage}`:URL.createObjectURL(o.serviceImage),onRemove:()=>{v(s=>({...s,serviceImage:null,existingImageName:""})),E.current&&(E.current.value="")}})]})]}),e.jsxs(O,{style:{borderTop:"0.5px solid #d0dce9",padding:"12px 20px",gap:8},children:[e.jsxs("button",{className:"sm-btn-cancel",onClick:()=>{k(!1),n({})},children:[e.jsx($,{size:13})," Cancel"]}),e.jsxs("button",{className:"sm-btn-save",onClick:A,children:[e.jsx(se,{size:13})," Update"]})]})]}),e.jsx(qe,{isVisible:pe,message:"Are you sure you want to delete this service?",onConfirm:be,onCancel:()=>R(!1)}),e.jsx("style",{children:`
        .sm-page { padding: 4px 0; }

        /* Header */
        .sm-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          margin-bottom: 18px; padding-bottom: 14px;
          border-bottom: 0.5px solid #d0dce9;
        }
        .sm-title-group { display: flex; align-items: center; gap: 12px; }
        .sm-page-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #e6f1fb; display: flex; align-items: center;
          justify-content: center; color: #185fa5; flex-shrink: 0;
        }
        .sm-page-title { font-size: 17px; font-weight: 600; color: #0c447c; margin: 0; }
        .sm-page-sub   { font-size: 12px; color: #6b7280; margin: 0; }
        .sm-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        /* Search */
        .sm-search-wrap { position: relative; }
        .sm-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; width: 15px; pointer-events: none;
        }
        .sm-search-input {
          padding: 8px 12px 8px 34px; font-size: 13px; color: #374151;
          border: 0.5px solid #d0dce9; border-radius: 8px; outline: none;
          width: 260px; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sm-search-input:focus { border-color: #185fa5; box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12); }

        .sm-add-btn {
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 8px 18px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: filter 0.15s; white-space: nowrap;
        }
        .sm-add-btn:hover { filter: brightness(0.9); }

        /* Table */
        .sm-table-wrapper {
          border: 0.5px solid #d0dce9; border-radius: 10px;
          overflow: hidden; overflow-x: auto; margin-bottom: 12px;
        }
        .sm-table { margin-bottom: 0 !important; font-size: 13px; }
        .sm-th {
          background: #185fa5 !important; color: #fff !important;
          font-size: 12px !important; font-weight: 600 !important;
          padding: 11px 14px !important; white-space: nowrap; border: none !important;
        }
        .sm-tr { transition: background 0.12s; }
        .sm-tr:hover { background: #f0f5fb !important; }
        .sm-td {
          padding: 11px 14px !important; vertical-align: middle !important;
          font-size: 13px; color: #374151;
          border-bottom: 0.5px solid #eef2f7 !important; border-top: none !important;
        }
        .sm-td-num  { color: #9ca3af; font-size: 12px; }
        .sm-muted   { color: #6b7280; }
        .sm-name    { font-weight: 600; color: #0c447c; }
        .sm-desc    {
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Action buttons */
        .sm-action-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: none; border-radius: 7px;
          cursor: pointer; transition: filter 0.12s, transform 0.1s;
        }
        .sm-action-btn:hover  { filter: brightness(0.88); transform: scale(1.07); }
        .sm-action-btn:active { transform: scale(0.95); }
        .sm-view-btn   { background: #e6f1fb; color: #185fa5; }
        .sm-edit-btn   { background: #eaf3de; color: #3b6d11; }
        .sm-delete-btn { background: #fcebeb; color: #a32d2d; }

        /* Empty */
        .sm-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 40px 0; color: #9ca3af; font-size: 14px;
        }
        .sm-empty-icon { color: #d0dce9; }
        .sm-error { color: #a32d2d; padding: 20px; text-align: center; }

        /* ── Pagination (matches screenshot) ── */
        .sm-pagination {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; padding: 10px 0;
        }
        .sm-rows-select { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; }
        .sm-select {
          font-size: 12px; padding: 5px 8px;
          border: 0.5px solid #d0dce9; border-radius: 6px;
          outline: none; color: #374151; background: #fff;
        }
        .sm-page-controls { display: flex; align-items: center; gap: 4px; }
        .sm-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border: 0.5px solid #d0dce9; border-radius: 6px;
          background: #fff; color: #374151;
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .sm-page-num { min-width: 32px; padding: 0; }
        .sm-page-btn:hover:not(:disabled) { background: #e6f1fb; color: #185fa5; border-color: #b5d4f4; }
        .sm-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .sm-page-btn--active {
          background: #185fa5 !important; color: #fff !important;
          border-color: #185fa5 !important; font-weight: 700 !important;
        }
        .sm-page-label { font-size: 12px; color: #6b7280; margin-left: 6px; }

        /* Modal field */
        .sm-field { margin-bottom: 14px; }
        .sm-label { display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .sm-required { color: #e24b4a; }
        .sm-error-text { font-size: 11px; color: #e24b4a; display: block; margin-top: 4px; }
        .sm-input {
          width: 100%; padding: 7px 10px; font-size: 12.5px; color: #374151;
          background: #fff; border: 0.5px solid #d0dce9; border-radius: 7px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none; -webkit-appearance: none;
        }
        .sm-input:focus { border-color: #185fa5; box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12); }

        /* Image preview */
        .sm-img-preview-wrap { position: relative; display: inline-block; margin-top: 10px; }
        .sm-img-preview { width: 110px; height: 110px; object-fit: cover; border-radius: 8px; border: 0.5px solid #d0dce9; display: block; }
        .sm-img-remove {
          position: absolute; top: -8px; right: -8px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #fcebeb; color: #a32d2d; border: 0.5px solid #f5c6c6;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.12s;
        }
        .sm-img-remove:hover { background: #f5c6c6; }

        /* View modal */
        .sm-view-body { display: flex; flex-direction: column; gap: 16px; }
        .sm-view-img-wrap { display: flex; justify-content: center; padding: 16px; background: #f0f5fb; border-radius: 10px; }
        .sm-view-img { max-width: 160px; border-radius: 10px; border: 0.5px solid #d0dce9; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .sm-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .sm-view-field { display: flex; flex-direction: column; gap: 3px; }
        .sm-view-label { font-size: 10.5px; font-weight: 600; color: #185fa5; text-transform: uppercase; letter-spacing: 0.3px; }
        .sm-view-value { font-size: 13px; color: #374151; font-weight: 500; }

        /* Footer buttons */
        .sm-btn-cancel {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; color: #374151; border: 0.5px solid #d0dce9;
          border-radius: 8px; padding: 7px 16px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .sm-btn-cancel:hover { background: #f3f4f6; }
        .sm-btn-save {
          display: inline-flex; align-items: center; gap: 5px;
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 7px 18px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: filter 0.15s;
        }
        .sm-btn-save:hover { filter: brightness(0.9); }
      `})]})};export{ss as default};
