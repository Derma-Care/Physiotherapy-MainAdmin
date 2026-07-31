import{r as d,j as e,R as p}from"./index-BeDIqrBR.js";import{b as s}from"./DefaultLayout-DlOx962b.js";import{S as m}from"./stethoscope-Dne2Xvm1.js";import{B as x}from"./building-2-DDiYnadL.js";import"./index.esm-FFYuxYBB.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],b=s("layout-dashboard",h);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],g=s("monitor",f);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}]],u=s("panel-right",y),o=[{id:1,label:"Dashboard Ads",icon:b,accent:"#185fa5",bg:"#e6f1fb",border:"#b5d4f4"},{id:2,label:"Service Ads",icon:m,accent:"#1D9E75",bg:"#E1F5EE",border:"#9FE1CB"},{id:3,label:"Clinic Ads",icon:x,accent:"#BA7517",bg:"#FAEEDA",border:"#FAC775"},{id:4,label:"Doctor Web Ads",icon:g,accent:"#534AB7",bg:"#EEEDFE",border:"#CECBF6"},{id:5,label:"Doctor Web Vertical",icon:u,accent:"#993556",bg:"#FBEAF0",border:"#F4C0D1"}],D=()=>{const[t,n]=d.useState(1),a=o.find(r=>r.id===t);return e.jsxs("div",{style:{padding:"1.25rem"},children:[e.jsxs("div",{className:"am-page-header",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"am-page-title",children:"Advertisement Management"}),e.jsx("p",{className:"am-page-sub",children:"Manage all ad placements across the platform"})]}),e.jsxs("div",{className:"am-header-badge",children:[o.length," Channels"]})]}),e.jsx("div",{className:"am-tabs",children:o.map(({id:r,label:c,icon:l,accent:i,bg:w,border:v})=>e.jsxs("button",{className:`am-tab${t===r?" active":""}`,style:t===r?{background:i,borderColor:i,color:"#fff"}:{},onClick:()=>n(r),children:[e.jsx(l,{size:13}),c]},r))}),e.jsx("div",{className:"am-tab-panel",children:e.jsxs("div",{className:"am-placeholder",style:{borderColor:a.border,background:a.bg},children:[e.jsx("div",{className:"am-placeholder-icon",style:{color:a.accent},children:p.createElement(a.icon,{size:32})}),e.jsx("p",{className:"am-placeholder-label",style:{color:a.accent},children:a.label}),e.jsx("p",{className:"am-placeholder-hint",children:"Replace this block with your tab component."})]})}),e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .am-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 1.25rem;
        }
        .am-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #0c447c;
          margin: 0 0 4px;
        }
        .am-page-sub {
          font-size: 13px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .am-header-badge {
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          color: #185fa5;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .am-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .am-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 0.5px solid transparent;
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
        .am-tab:hover:not(.active) { background: #f1efe8; color: #2c2c2a; }
        .am-tab.active { font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .am-tab-panel {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          min-height: 300px;
        }
        .am-placeholder {
          border: 1.5px dashed;
          border-radius: 12px;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
        }
        .am-placeholder-icon { opacity: 0.7; }
        .am-placeholder-label {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        .am-placeholder-hint {
          font-size: 12px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
      `})]})};export{D as default};
