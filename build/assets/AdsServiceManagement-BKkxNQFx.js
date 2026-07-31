import{n as y,B as v,ac as B,ad as L,ae as T,r as i,j as e,Q as $,q as l}from"./index-BeDIqrBR.js";import{C as P}from"./ConfirmationDelete-PJmFwrEV.js";import{L as O}from"./loader-BBK4Pa4j.js";import{C as R}from"./circle-plus-CZyqglC9.js";import{b as N}from"./DefaultLayout-DlOx962b.js";import{T as _}from"./trash-2-DUvAE15q.js";import{C as V,a as G,b as q,c as H}from"./CModalHeader-Do9-2MrL.js";import{C as W}from"./CModalTitle-CwFuP0xu.js";import{C as J}from"./CForm-xjb0EQIa.js";import"./index.esm-FFYuxYBB.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]],K=N("film",Q);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],u=N("image",X),Y=async()=>{console.log("service data:, response.data");try{const s=await y.get(`${v}/${B}`);return console.log("service data:",s.data),s.data}catch(s){throw console.error("Error fetching service data:",s.message),s.response&&(console.error("Error Response Data:",s.response.data),console.error("Error Response Status:",s.response.status)),s}},Z=async s=>{var t,p,d,c;try{const r={carouselId:s.carouselId||"",mediaUrlOrImage:s.mediaUrlOrImage||""};return(await y.post(`${v}/${T}`,r,{headers:{"Content-Type":"application/json"}})).data}catch(r){throw console.error("Error response:",r.response),alert(`Error: ${(t=r.response)==null?void 0:t.status} - ${((d=(p=r.response)==null?void 0:p.data)==null?void 0:d.message)||((c=r.response)==null?void 0:c.statusText)}`),r}},ee=async s=>{try{const t=await y.delete(`${v}/${L}/${s}`,{headers:{"Content-Type":"application/json"}});return console.log("advertisement deleted successfully:",t.data),t.data}catch(t){throw console.error("Error deleting advertisement:",t.response?t.response.data:t),t}},pe=()=>{var C;const[s,t]=i.useState([]),[p,d]=i.useState(!1),[c,r]=i.useState(!1),[o,m]=i.useState(null),[f,x]=i.useState(null),[S,h]=i.useState(!1),[j,A]=i.useState(null),[M,w]=i.useState(!0),b=async()=>{w(!0);try{const a=await Y();t(Array.isArray(a)?a:[])}catch{l.error("Failed to load advertisements."),t([])}finally{w(!1)}};i.useEffect(()=>{b()},[]);const D=async()=>{if(j)try{const a=await ee(j);l.success(a||"Advertisement deleted successfully!"),h(!1),await b()}catch{l.error("Failed to delete advertisement.")}},z=a=>{A(a),h(!0)},I=a=>{const n=a.target.files[0];n&&(m(n),x(URL.createObjectURL(n)))},F=async a=>{if(a.preventDefault(),!o){l.warning("Please select an image or video file.");return}r(!0);try{const n=await E(o);await Z({mediaUrlOrImage:n}),l.success("Advertisement added successfully!"),d(!1),m(null),x(null),b()}catch{l.error("Failed to add advertisement.")}finally{r(!1)}},E=a=>new Promise((n,U)=>{const g=new FileReader;g.readAsDataURL(a),g.onload=()=>n(g.result),g.onerror=U}),k=a=>a==null?void 0:a.startsWith("data:video");return e.jsxs(e.Fragment,{children:[e.jsx($,{}),e.jsxs("div",{className:"sa-header",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"sa-title",children:"Service Advertisements"}),e.jsxs("p",{className:"sa-sub",children:[s.length," ad",s.length!==1?"s":""," currently active"]})]}),e.jsxs("button",{className:"sa-btn sa-btn-primary",onClick:()=>d(!0),children:[e.jsx(R,{size:14})," Add Advertisement"]})]}),e.jsx("div",{className:"sa-table-wrap",children:e.jsxs("table",{className:"sa-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:160},children:"Carousel ID"}),e.jsx("th",{children:"Media Preview"}),e.jsx("th",{style:{width:100,textAlign:"center"},children:"Actions"})]})}),e.jsx("tbody",{children:M?e.jsx("tr",{children:e.jsx("td",{colSpan:3,className:"sa-td-center sa-td-loading",children:e.jsx(O,{message:"Loading advertisements…"})})}):s.length===0?e.jsx("tr",{children:e.jsxs("td",{colSpan:3,className:"sa-td-center sa-td-empty",children:[e.jsx(u,{size:32,style:{color:"#d3d1c7",marginBottom:8}}),e.jsx("p",{children:"No advertisements found"})]})}):s.map((a,n)=>e.jsxs("tr",{className:"sa-row",children:[e.jsx("td",{children:e.jsx("span",{className:"sa-id-badge",children:a.carouselId})}),e.jsx("td",{children:a.mediaUrlOrImage?k(a.mediaUrlOrImage)?e.jsxs("div",{className:"sa-media-wrap",children:[e.jsx("video",{src:a.mediaUrlOrImage,height:56,controls:!0,className:"sa-media"}),e.jsxs("span",{className:"sa-media-badge video",children:[e.jsx(K,{size:10})," Video"]})]}):e.jsxs("div",{className:"sa-media-wrap",children:[e.jsx("img",{src:a.mediaUrlOrImage,alt:"Ad",height:56,className:"sa-media"}),e.jsxs("span",{className:"sa-media-badge image",children:[e.jsx(u,{size:10})," Image"]})]}):e.jsx("span",{className:"sa-no-media",children:"No media"})}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("button",{className:"sa-icon-btn delete",onClick:()=>z(a.carouselId),title:"Delete advertisement",children:e.jsx(_,{size:15})})})]},n))})]})}),e.jsx(P,{isVisible:S,message:"Are you sure you want to delete this advertisement?",onConfirm:D,onCancel:()=>h(!1)}),e.jsxs(V,{visible:p,onClose:()=>{d(!1),m(null),x(null)},backdrop:"static",alignment:"center",className:"sa-modal",children:[e.jsx(G,{className:"sa-modal-header",children:e.jsx(W,{className:"sa-modal-title",children:"Add Advertisement"})}),e.jsx(q,{className:"sa-modal-body",children:e.jsxs(J,{onSubmit:F,children:[e.jsx("label",{className:"sa-dropzone",htmlFor:"sa-file-input",children:f?k(f)||(C=o==null?void 0:o.type)!=null&&C.startsWith("video")?e.jsx("video",{src:f,className:"sa-drop-preview",controls:!0}):e.jsx("img",{src:f,alt:"Preview",className:"sa-drop-preview"}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sa-drop-icon",children:e.jsx(u,{size:28})}),e.jsx("p",{className:"sa-drop-text",children:"Click to select image or video"}),e.jsx("p",{className:"sa-drop-hint",children:"JPG, PNG, MP4 supported"})]})}),e.jsx("input",{id:"sa-file-input",type:"file",accept:"image/*,video/*",style:{display:"none"},onChange:I}),o&&e.jsxs("p",{className:"sa-selected-name",children:["Selected: ",e.jsx("strong",{children:o.name})]}),e.jsxs(H,{className:"sa-modal-footer",children:[e.jsx("button",{type:"button",className:"sa-btn sa-btn-ghost",onClick:()=>{d(!1),m(null),x(null)},children:"Cancel"}),e.jsx("button",{type:"submit",className:"sa-btn sa-btn-primary",disabled:c||!o,children:c?"Uploading…":"Add Advertisement"})]})]})})]}),e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        /* Header */
        .sa-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .sa-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0c447c;
          margin: 0 0 4px;
        }
        .sa-sub {
          font-size: 12px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* Buttons */
        .sa-btn {
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
        .sa-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .sa-btn-primary {
          background: #185fa5;
          color: #fff;
          border-color: #185fa5;
          box-shadow: 0 2px 8px rgba(24,95,165,0.2);
        }
        .sa-btn-primary:hover:not(:disabled) { background: #0c447c; border-color: #0c447c; }
        .sa-btn-ghost {
          background: #fff;
          color: #5f5e5a;
          border-color: #d0dce9;
        }
        .sa-btn-ghost:hover { background: #f1efe8; }

        /* Table */
        .sa-table-wrap {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .sa-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
        }
        .sa-table thead tr {
          background: linear-gradient(135deg, #042C53, #185fa5);
        }
        .sa-table thead th {
          padding: 12px 16px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          border: none;
        }
        .sa-row {
          border-bottom: 0.5px solid #f1efe8;
          transition: background 0.12s;
        }
        .sa-row:hover { background: #f7fafd; }
        .sa-row:last-child { border-bottom: none; }
        .sa-table tbody td { padding: 12px 16px; vertical-align: middle; color: #2c2c2a; }
        .sa-td-center { text-align: center; padding: 2.5rem 1rem !important; }
        .sa-td-loading {}
        .sa-td-empty {
          color: #888780;
          font-style: italic;
          font-size: 13px;
          display: table-cell;
        }
        .sa-td-empty p { margin: 0; }

        /* ID badge */
        .sa-id-badge {
          display: inline-block;
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          color: #0c447c;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Media */
        .sa-media-wrap { display: inline-flex; align-items: center; gap: 8px; }
        .sa-media {
          border-radius: 8px;
          object-fit: cover;
          border: 0.5px solid #d3d1c7;
          display: block;
        }
        .sa-media-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
          border: 0.5px solid;
        }
        .sa-media-badge.image { background: #e6f1fb; color: #0c447c; border-color: #b5d4f4; }
        .sa-media-badge.video { background: #EEEDFE; color: #3C3489; border-color: #CECBF6; }
        .sa-no-media { font-size: 12px; color: #888780; font-style: italic; }

        /* Icon button */
        .sa-icon-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 0.5px solid;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s;
          background: transparent;
        }
        .sa-icon-btn.delete {
          color: #791F1F;
          border-color: #F7C1C1;
          background: #FCEBEB;
        }
        .sa-icon-btn.delete:hover { background: #F7C1C1; }

        /* Modal */
        .sa-modal .modal-content {
          border: 0.5px solid #d0dce9 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(4,44,83,0.14) !important;
        }
        .sa-modal-header {
          background: linear-gradient(135deg, #042C53, #185fa5) !important;
          border-bottom: none !important;
          padding: 16px 20px !important;
        }
        .sa-modal-title {
          font-family: 'Syne', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #fff !important;
        }
        .sa-modal .btn-close { filter: brightness(0) invert(1); opacity: 0.75; }
        .sa-modal-body {
          background: #f7f6f2 !important;
          padding: 1.25rem !important;
        }
        .sa-modal-footer {
          background: transparent !important;
          border-top: 0.5px solid #d0dce9 !important;
          padding: 12px 0 0 !important;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        /* Drop zone */
        .sa-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1.5px dashed #b5d4f4;
          border-radius: 12px;
          background: #f0f6fd;
          padding: 2rem 1rem;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          min-height: 140px;
          text-align: center;
          margin-bottom: 10px;
        }
        .sa-dropzone:hover { border-color: #185fa5; background: #e6f1fb; }
        .sa-drop-icon {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #fff;
          border: 0.5px solid #b5d4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #185fa5;
          margin-bottom: 4px;
        }
        .sa-drop-text {
          font-size: 13px;
          font-weight: 500;
          color: #185fa5;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .sa-drop-hint {
          font-size: 11px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .sa-drop-preview {
          max-height: 160px;
          max-width: 100%;
          border-radius: 8px;
          object-fit: contain;
        }
        .sa-selected-name {
          font-size: 12px;
          color: #5f5e5a;
          margin: 0 0 4px;
          font-family: 'DM Sans', sans-serif;
        }
        .sa-selected-name strong { color: #0c447c; }
      `})]})};export{pe as default};
