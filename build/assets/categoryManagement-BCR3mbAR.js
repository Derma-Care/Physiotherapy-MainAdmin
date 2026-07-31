import{r as o,j as e,Q as ue,q as u}from"./index-BeDIqrBR.js";import{c as je}from"./index.esm-FFYuxYBB.js";import{C as Ne,p as we,u as ve,d as Ce}from"./CategoryAPI-Q9E_XO2Q.js";import{C as Ie}from"./ConfirmationDelete-PJmFwrEV.js";import{L as ke}from"./loader-BBK4Pa4j.js";import{b as ze}from"./DefaultLayout-DlOx962b.js";import{c as Se}from"./cil-search-Bjd2ULXB.js";import{C as De,a as Ee,b as F,c as A,d as Me,e as k}from"./CTable-0DGiQW34.js";import{E as Pe}from"./eye-BZSjugo6.js";import{P as Te}from"./pen-Cg7hCLfU.js";import{T as L}from"./trash-2-DUvAE15q.js";import{C as q,a as R,b as B,c as V}from"./CModalHeader-Do9-2MrL.js";import{C as $}from"./CModalTitle-CwFuP0xu.js";import{X as H}from"./x-Cmuy0yEH.js";import{C as ae}from"./CForm-xjb0EQIa.js";import{S as te}from"./save-U0gwb88M.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]],j=ze("tag",Fe),Ze=()=>{const se=o.useRef(null),z=o.useRef(null),[N,re]=o.useState(""),[x,oe]=o.useState([]),[w,O]=o.useState([]),[ce,U]=o.useState(!1),[W,K]=o.useState(null),[ie,S]=o.useState(!1),[m,D]=o.useState(null),[ne,E]=o.useState(!1),[le,Q]=o.useState(Date.now()),[i,c]=o.useState({categoryName:"",categoryImage:""}),[d,f]=o.useState({categoryName:"",categoryImage:null}),[de,M]=o.useState(!1),[me,ge]=o.useState(null),[l,y]=o.useState({categoryId:"",categoryName:"",categoryImage:null}),[n,g]=o.useState(1),[v,pe]=o.useState(5),C=async()=>{U(!0),K(null);try{const a=await Ne();oe(a.data),O(a.data)}catch{K("Failed to fetch category data.")}finally{U(!1)}};o.useEffect(()=>{C()},[]),o.useEffect(()=>{const a=N.toLowerCase().trim(),t=a?x.filter(s=>{var r;return(r=s.categoryName)==null?void 0:r.toLowerCase().includes(a)}):x;O(t),g(1)},[N,x]);const _=n*v,X=_-v,Y=w.slice(X,_),p=Math.ceil(w.length/v);o.useEffect(()=>{n>p&&n!==1&&g(p||1)},[w]);const b=(a,t)=>{var I;let s="";const r=((I=t==null?void 0:t.trim)==null?void 0:I.call(t))||"";return a==="categoryName"&&(r?r.length<3?s="At least 3 characters required.":/^\d+$/.test(r)?s="Cannot be only numbers.":/^[A-Za-z\s@&\-\.,()]+$/.test(r)||(s="Only letters and basic symbols allowed."):s="Category Name is required."),a==="categoryImage"&&!t&&(s="Category Image is required."),c(h=>({...h,[a]:s})),s===""},xe=()=>Array.from({length:p},(a,t)=>t+1).filter(a=>a===1||a===p||Math.abs(a-n)<=1).reduce((a,t,s,r)=>(s>0&&t-r[s-1]>1&&a.push("…"),a.push(t),a),[]),Z=a=>new Promise(t=>{const s=new FileReader;s.onloadend=()=>{var r;return t((r=s.result)==null?void 0:r.split(",")[1])},s.readAsDataURL(a)}),fe=async a=>{const t=a.target.files[0];if(!t)return;if(!t.type.startsWith("image/")){c(r=>({...r,categoryImage:"Only image files are allowed."}));return}const s=await Z(t);f(r=>({...r,categoryImage:s})),b("categoryImage",s)},ye=async a=>{const t=a.target.files[0];if(!t)return;if(!t.type.startsWith("image/")){c(r=>({...r,categoryImage:"Only image files are allowed."}));return}if(t.size>2*1024*1024){c(r=>({...r,categoryImage:"File size must be less than 2MB."}));return}const s=await Z(t);y(r=>({...r,categoryImage:s})),c(r=>({...r,categoryImage:""}))},P=async()=>{var a,t,s;if(b("categoryName",d.categoryName)&&b("categoryImage",d.categoryImage))try{await we({categoryName:d.categoryName.trim(),categoryImage:d.categoryImage}),u.success("Category added successfully!"),C(),S(!1),f({categoryName:"",categoryImage:null})}catch(r){(((s=(t=(a=r.response)==null?void 0:a.data)==null?void 0:t.message)==null?void 0:s.toLowerCase())||"").includes("exists")?c(h=>({...h,categoryName:"Category Name already exists."})):u.error("Failed to add category")}},be=a=>{y({categoryId:a.categoryId||"",categoryName:a.categoryName||"",categoryImage:a.categoryImage||null}),E(!0)},T=async()=>{var a,t,s;if(b("categoryName",l.categoryName)&&b("categoryImage",l.categoryImage))try{await ve({categoryName:l.categoryName.trim(),categoryImage:l.categoryImage},l.categoryId),u.success("Category updated successfully!"),E(!1),C()}catch(r){(((s=(t=(a=r.response)==null?void 0:a.data)==null?void 0:t.message)==null?void 0:s.toLowerCase())||"").includes("exists")?c(h=>({...h,categoryName:"Category Name already exists."})):u.error("Failed to update category")}},he=async()=>{try{const a=await Ce(me);M(!1),u.success(`${a.data}`),await C()}catch{alert("Failed to delete category.")}},G=()=>{f({categoryName:"",categoryImage:null}),c({categoryName:"",categoryImage:""}),Q(Date.now()),S(!1)},J=()=>{y({categoryId:"",categoryName:"",categoryImage:null}),c({categoryName:"",categoryImage:""}),E(!1)},ee=a=>a.replace(/[0-9]/g,"").replace(/\s+/g," ").split(" ").filter(t=>t).map(t=>t[0].toUpperCase()+t.slice(1).toLowerCase()).join(" ");return e.jsxs("div",{className:"cm-page",children:[e.jsx(ue,{}),e.jsxs("div",{className:"cm-page-header",children:[e.jsxs("div",{className:"cm-title-group",children:[e.jsx("div",{className:"cm-page-icon",children:e.jsx(j,{size:20})}),e.jsxs("div",{children:[e.jsx("h4",{className:"cm-page-title",children:"Category Management"}),e.jsxs("p",{className:"cm-page-sub",children:[x.length," categor",x.length!==1?"ies":"y"," registered"]})]})]}),e.jsx("button",{className:"cm-add-btn",onClick:()=>S(!0),children:"+ Add Category"})]}),e.jsxs("div",{className:"cm-search-wrap",children:[e.jsx(je,{icon:Se,className:"cm-search-icon"}),e.jsx("input",{className:"cm-search-input",type:"text",placeholder:"Search by category name…",value:N,onChange:a=>re(a.target.value)})]}),ce?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:200},children:e.jsx(ke,{message:"Loading categories…"})}):W?e.jsx("div",{className:"cm-error",children:W}):e.jsx("div",{className:"cm-table-wrapper",children:e.jsxs(De,{className:"cm-table",children:[e.jsx(Ee,{children:e.jsxs(F,{children:[e.jsx(A,{className:"cm-th",style:{width:60},children:"S.No"}),e.jsx(A,{className:"cm-th",children:"Category Name"}),e.jsx(A,{className:"cm-th",style:{width:130},children:"Actions"})]})}),e.jsx(Me,{children:Y.length>0?Y.map((a,t)=>e.jsxs(F,{className:"cm-tr",children:[e.jsx(k,{className:"cm-td cm-td-num",children:X+t+1}),e.jsx(k,{className:"cm-td",children:e.jsx("span",{className:"cm-cat-name",children:a.categoryName})}),e.jsx(k,{className:"cm-td",children:e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx("button",{className:"cm-action-btn cm-view-btn",title:"View",onClick:()=>D(a),children:e.jsx(Pe,{size:14})}),e.jsx("button",{className:"cm-action-btn cm-edit-btn",title:"Edit",onClick:()=>be(a),children:e.jsx(Te,{size:14})}),e.jsx("button",{className:"cm-action-btn cm-delete-btn",title:"Delete",onClick:()=>{ge(a.categoryId),M(!0)},children:e.jsx(L,{size:14})})]})})]},a.categoryId)):e.jsx(F,{children:e.jsx(k,{colSpan:3,children:e.jsxs("div",{className:"cm-empty",children:[e.jsx(j,{size:38,className:"cm-empty-icon"}),e.jsx("p",{children:N?"No matching categories found.":"No categories available."})]})})})})]})}),w.length>0&&e.jsxs("div",{className:"cm-pagination",children:[e.jsxs("div",{className:"cm-rows-select",children:[e.jsx("span",{children:"Rows per page:"}),e.jsx("select",{className:"cm-select",value:v,onChange:a=>{pe(Number(a.target.value)),g(1)},children:[5,10,25,50].map(a=>e.jsx("option",{value:a,children:a},a))})]}),e.jsxs("div",{className:"cm-page-controls",children:[e.jsx("button",{className:"cm-page-btn",disabled:n===1,onClick:()=>g(n-1),children:"‹ Prev"}),xe().map((a,t)=>a==="…"?e.jsx("span",{style:{fontSize:"12px",color:"#9ca3af",padding:"0 4px"},children:"…"},`e${t}`):e.jsx("button",{className:`cm-page-btn cm-page-num ${n===a?"cm-page-btn--active":""}`,onClick:()=>g(a),children:a},a)),e.jsx("button",{className:"cm-page-btn",disabled:n===p,onClick:()=>g(n+1),children:"Next ›"}),e.jsxs("span",{className:"cm-page-label",children:["Page ",e.jsx("strong",{children:n})," of ",e.jsx("strong",{children:p})]})]})]}),m&&e.jsxs(q,{visible:!!m,onClose:()=>D(null),backdrop:"static",alignment:"center",children:[e.jsx(R,{style:{borderBottom:"0.5px solid #d0dce9",padding:"16px 20px"},children:e.jsxs($,{style:{fontSize:15,fontWeight:600,color:"#0c447c",display:"flex",alignItems:"center",gap:8},children:[e.jsx(j,{size:16,color:"#185fa5"})," Category Details"]})}),e.jsx(B,{style:{padding:"20px"},children:e.jsxs("div",{className:"cm-view-body",children:[m.categoryImage&&e.jsx("div",{className:"cm-view-img-wrap",children:e.jsx("img",{src:`data:image/png;base64,${m.categoryImage}`,alt:"Category",className:"cm-view-img"})}),e.jsxs("div",{className:"cm-view-grid",children:[e.jsxs("div",{className:"cm-view-field",children:[e.jsx("span",{className:"cm-view-label",children:"Category ID"}),e.jsx("span",{className:"cm-view-value",children:m.categoryId||"N/A"})]}),e.jsxs("div",{className:"cm-view-field",children:[e.jsx("span",{className:"cm-view-label",children:"Category Name"}),e.jsx("span",{className:"cm-view-value",children:m.categoryName||"N/A"})]})]})]})}),e.jsx(V,{style:{borderTop:"0.5px solid #d0dce9",padding:"12px 20px"},children:e.jsxs("button",{className:"cm-btn-cancel",onClick:()=>D(null),children:[e.jsx(H,{size:13})," Close"]})})]}),e.jsxs(q,{visible:ie,onClose:G,backdrop:"static",alignment:"center",children:[e.jsx(R,{style:{borderBottom:"0.5px solid #d0dce9",padding:"16px 20px"},children:e.jsxs($,{style:{fontSize:15,fontWeight:600,color:"#0c447c",display:"flex",alignItems:"center",gap:8},children:[e.jsx(j,{size:16,color:"#185fa5"})," Add New Category"]})}),e.jsx(B,{style:{padding:"20px"},children:e.jsxs(ae,{onSubmit:a=>{a.preventDefault(),P()},children:[e.jsxs("div",{className:"cm-field",children:[e.jsxs("label",{className:"cm-label",children:["Category Name ",e.jsx("span",{className:"cm-required",children:"*"})]}),e.jsx("input",{className:"cm-input",type:"text",placeholder:"Enter category name",value:d.categoryName,onChange:a=>{const t=ee(a.target.value);f(s=>({...s,categoryName:t})),i.categoryName&&c(s=>({...s,categoryName:""}))},onKeyDown:a=>{a.key==="Enter"&&(a.preventDefault(),P())}}),i.categoryName&&e.jsx("span",{className:"cm-error-text",children:i.categoryName})]}),e.jsxs("div",{className:"cm-field",children:[e.jsxs("label",{className:"cm-label",children:["Category Image ",e.jsx("span",{className:"cm-required",children:"*"})]}),e.jsx("input",{className:"cm-input",type:"file",accept:"image/*",ref:se,onChange:fe},le),d.categoryImage&&e.jsxs("div",{className:"cm-img-preview-wrap",children:[e.jsx("img",{src:`data:image/png;base64,${d.categoryImage}`,alt:"Preview",className:"cm-img-preview"}),e.jsx("button",{type:"button",className:"cm-img-remove",onClick:()=>{f(a=>({...a,categoryImage:null})),Q(Date.now())},children:e.jsx(L,{size:13})})]}),i.categoryImage&&e.jsx("span",{className:"cm-error-text",children:i.categoryImage})]})]})}),e.jsxs(V,{style:{borderTop:"0.5px solid #d0dce9",padding:"12px 20px",gap:8},children:[e.jsxs("button",{className:"cm-btn-cancel",onClick:G,children:[e.jsx(H,{size:13})," Cancel"]}),e.jsxs("button",{className:"cm-btn-save",onClick:P,children:[e.jsx(te,{size:13})," Add"]})]})]}),e.jsxs(q,{visible:ne,onClose:J,backdrop:"static",alignment:"center",children:[e.jsx(R,{style:{borderBottom:"0.5px solid #d0dce9",padding:"16px 20px"},children:e.jsxs($,{style:{fontSize:15,fontWeight:600,color:"#0c447c",display:"flex",alignItems:"center",gap:8},children:[e.jsx(j,{size:16,color:"#185fa5"})," Edit Category"]})}),e.jsx(B,{style:{padding:"20px"},children:e.jsxs(ae,{onSubmit:a=>{a.preventDefault(),T()},children:[e.jsxs("div",{className:"cm-field",children:[e.jsxs("label",{className:"cm-label",children:["Category Name ",e.jsx("span",{className:"cm-required",children:"*"})]}),e.jsx("input",{className:"cm-input",type:"text",placeholder:"Enter category name",value:l.categoryName,onChange:a=>{const t=ee(a.target.value);y(s=>({...s,categoryName:t})),i.categoryName&&c(s=>({...s,categoryName:""}))},onKeyDown:a=>{a.key==="Enter"&&(a.preventDefault(),T())}}),i.categoryName&&e.jsx("span",{className:"cm-error-text",children:i.categoryName})]}),e.jsxs("div",{className:"cm-field",children:[e.jsxs("label",{className:"cm-label",children:["Category Image ",e.jsx("span",{className:"cm-required",children:"*"})]}),e.jsx("input",{className:"cm-input",type:"file",accept:"image/*",ref:z,onChange:ye}),l.categoryImage?e.jsxs("div",{className:"cm-img-preview-wrap",children:[e.jsx("img",{src:`data:image/png;base64,${l.categoryImage}`,alt:"Preview",className:"cm-img-preview"}),e.jsx("button",{type:"button",className:"cm-img-remove",onClick:()=>{y(a=>({...a,categoryImage:null})),z.current&&(z.current.value=null)},children:e.jsx(L,{size:13})})]}):e.jsx("span",{style:{fontSize:12,color:"#9ca3af",display:"block",marginTop:6},children:"No image available"}),i.categoryImage&&e.jsx("span",{className:"cm-error-text",children:i.categoryImage})]})]})}),e.jsxs(V,{style:{borderTop:"0.5px solid #d0dce9",padding:"12px 20px",gap:8},children:[e.jsxs("button",{className:"cm-btn-cancel",onClick:J,children:[e.jsx(H,{size:13})," Cancel"]}),e.jsxs("button",{className:"cm-btn-save",onClick:T,children:[e.jsx(te,{size:13})," Update"]})]})]}),e.jsx(Ie,{isVisible:de,message:"Are you sure you want to delete this category? This action cannot be undone.",onConfirm:he,onCancel:()=>M(!1)}),e.jsx("style",{children:`
        /* Page layout */
        .cm-page { padding: 4px 0; }

        /* Header */
        .cm-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          margin-bottom: 18px; padding-bottom: 14px;
          border-bottom: 0.5px solid #d0dce9;
        }
        .cm-title-group { display: flex; align-items: center; gap: 12px; }
        .cm-page-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #e6f1fb; display: flex; align-items: center;
          justify-content: center; color: #185fa5; flex-shrink: 0;
        }
        .cm-page-title { font-size: 17px; font-weight: 600; color: #0c447c; margin: 0; }
        .cm-page-sub   { font-size: 12px; color: #6b7280; margin: 0; }

        .cm-add-btn {
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 8px 18px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: filter 0.15s; white-space: nowrap;
        }
        .cm-add-btn:hover { filter: brightness(0.9); }

        /* Search */
        .cm-search-wrap {
          position: relative; margin-bottom: 16px; max-width: 320px;
        }
        .cm-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; width: 15px; height: 15px; pointer-events: none;
        }
        .cm-search-input {
          width: 100%; padding: 8px 12px 8px 34px;
          font-size: 13px; color: #374151;
          border: 0.5px solid #d0dce9; border-radius: 8px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cm-search-input:focus {
          border-color: #185fa5;
          box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12);
        }

        /* Table */
        .cm-table-wrapper {
          border: 0.5px solid #d0dce9; border-radius: 10px;
          overflow: hidden; overflow-x: auto; margin-bottom: 12px;
        }
        .cm-table { margin-bottom: 0 !important; font-size: 13px; }
        .cm-th {
          background: #185fa5 !important; color: #fff !important;
          font-size: 12px !important; font-weight: 600 !important;
          padding: 11px 14px !important; white-space: nowrap; border: none !important;
        }
        .cm-tr { transition: background 0.12s; }
        .cm-tr:hover { background: #f0f5fb !important; }
        .cm-td {
          padding: 11px 14px !important; vertical-align: middle !important;
          font-size: 13px; color: #374151;
          border-bottom: 0.5px solid #eef2f7 !important; border-top: none !important;
        }
        .cm-td-num  { color: #9ca3af; font-size: 12px; }
        .cm-cat-name { font-weight: 600; color: #0c447c; }

        /* Action buttons */
        .cm-action-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: none; border-radius: 7px;
          cursor: pointer; transition: filter 0.12s, transform 0.1s; flex-shrink: 0;
        }
        .cm-action-btn:hover  { filter: brightness(0.88); transform: scale(1.07); }
        .cm-action-btn:active { transform: scale(0.95); }
        .cm-view-btn   { background: #e6f1fb; color: #185fa5; }
        .cm-edit-btn   { background: #eaf3de; color: #3b6d11; }
        .cm-delete-btn { background: #fcebeb; color: #a32d2d; }

        /* Empty state */
        .cm-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 40px 0; color: #9ca3af; font-size: 14px;
        }
        .cm-empty-icon { color: #d0dce9; }
        .cm-error { color: #a32d2d; padding: 20px; text-align: center; }

        /* Pagination */
        .cm-pagination {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; padding: 10px 0;
        }
        .cm-rows-select { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; }
        .cm-select {
          font-size: 12px; padding: 5px 8px; border: 0.5px solid #d0dce9;
          border-radius: 6px; outline: none; color: #374151; background: #fff;
        }
        .cm-page-controls { display: flex; align-items: center; gap: 4px; }
        .cm-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border: 0.5px solid #d0dce9; border-radius: 6px;
          background: #fff; color: #374151;
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .cm-page-num { min-width: 32px; padding: 0; }
        .cm-page-btn:hover:not(:disabled) { background: #e6f1fb; color: #185fa5; border-color: #b5d4f4; }
        .cm-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cm-page-btn--active { background: #185fa5 !important; color: #fff !important; border-color: #185fa5 !important; font-weight: 700 !important; }
        .cm-page-label { font-size: 12px; color: #6b7280; margin-left: 6px; }

        /* Modal field */
        .cm-field { margin-bottom: 16px; }
        .cm-label {
          display: block; font-size: 11px; font-weight: 600;
          color: #374151; margin-bottom: 5px;
        }
        .cm-required { color: #e24b4a; }
        .cm-input {
          width: 100%; padding: 7px 10px; font-size: 12.5px; color: #374151;
          background: #fff; border: 0.5px solid #d0dce9; border-radius: 7px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cm-input:focus {
          border-color: #185fa5;
          box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12);
        }
        .cm-error-text { font-size: 11px; color: #e24b4a; display: block; margin-top: 4px; }

        /* Image preview */
        .cm-img-preview-wrap {
          position: relative; display: inline-block; margin-top: 10px;
        }
        .cm-img-preview {
          width: 120px; height: 120px; object-fit: cover;
          border-radius: 8px; border: 0.5px solid #d0dce9;
          display: block;
        }
        .cm-img-remove {
          position: absolute; top: -8px; right: -8px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #fcebeb; color: #a32d2d; border: 0.5px solid #f5c6c6;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.12s;
        }
        .cm-img-remove:hover { background: #f5c6c6; }

        /* View modal body */
        .cm-view-body { display: flex; flex-direction: column; gap: 16px; }
        .cm-view-img-wrap {
          display: flex; justify-content: center;
          padding: 16px; background: #f0f5fb; border-radius: 10px;
        }
        .cm-view-img {
          max-width: 160px; border-radius: 10px;
          border: 0.5px solid #d0dce9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .cm-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cm-view-field { display: flex; flex-direction: column; gap: 3px; }
        .cm-view-label {
          font-size: 10.5px; font-weight: 600; color: #185fa5;
          text-transform: uppercase; letter-spacing: 0.3px;
        }
        .cm-view-value { font-size: 13px; color: #374151; font-weight: 500; }

        /* Footer buttons */
        .cm-btn-cancel {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; color: #374151; border: 0.5px solid #d0dce9;
          border-radius: 8px; padding: 7px 16px;
          font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s;
        }
        .cm-btn-cancel:hover { background: #f3f4f6; }
        .cm-btn-save {
          display: inline-flex; align-items: center; gap: 5px;
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 7px 18px;
          font-size: 12px; font-weight: 600; cursor: pointer; transition: filter 0.15s;
        }
        .cm-btn-save:hover { filter: brightness(0.9); }
      `})]})};export{Ze as default};
