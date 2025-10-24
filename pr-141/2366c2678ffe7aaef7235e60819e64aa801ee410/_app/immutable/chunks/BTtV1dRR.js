import{t as u,n as d,D as g,_ as y,$,G as h,a0 as v,a1 as w,a2 as E,a3 as H,F as p,a4 as O,E as R,H as _}from"./D9FjGfzk.js";function D(t,r,n=!1,o=!1,b=!1){var c=t,f="";u(()=>{var l=y;if(f===(f=r()??"")){d&&g();return}if(l.nodes_start!==null&&($(l.nodes_start,l.nodes_end),l.nodes_start=l.nodes_end=null),f!==""){if(d){h.data;for(var e=g(),m=e;e!==null&&(e.nodeType!==v||e.data!=="");)m=e,e=w(e);if(e===null)throw E(),H;p(h,m),c=O(e);return}var i=f+"";n?i=`<svg>${i}</svg>`:o&&(i=`<math>${i}</math>`);var a=R(i);if((n||o)&&(a=_(a)),p(_(a),a.lastChild),n||o)for(;_(a);)c.before(_(a));else c.before(a)}})}function N({title:t,description:r,image:n,lang:o}){return`
    <title>${s(t)} — Algorhythmics</title>
    ${r?`<meta name="description" content="${s(r)}" />`:""}
    <meta property="og:title" content="${s(t)} — Algorhythmics" />
    ${r?`<meta property="og:description" content="${s(r)}" />`:""}
    ${n?`<meta property="og:image" content="${s(n)}" />`:""}
    ${o?`<meta property="og:locale" content="${s(o)}" />`:""}
    <meta name="twitter:card" content="summary_large_image" />
  `}function s(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}export{N as H,D as h};
