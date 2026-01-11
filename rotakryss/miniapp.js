"use strict";const d=document.createElement("template");d.innerHTML=`
<style>
  :host {
    color-scheme: light dark;
  
    --light-bg: ghostwhite;
    --light-color: darkslategray;
    --light-highlight-bg: lightgreen;
    --light-secondary-highlight-bg: limegreen;
    --light-highlight-bg-reverse: gold;
    --light-secondary-highlight-bg-reverse: goldenrod;
  
    --dark-bg: darkslategray;
    --dark-color: ghostwhite;
    --dark-highlight-bg: forestgreen;
    --dark-secondary-highlight-bg: darkgreen;
    --dark-highlight-bg-reverse: darkgoldenrod;
    --dark-secondary-highlight-bg-reverse: saddlebrown;
  }
  * {
    background-color: light-dark(var(--light-bg), var(--dark-bg));
    color: light-dark(var(--light-color), var(--dark-color));
  }
  #userinput {
	width: 1em;
  }
  #wordlist {
    width: fit-content;
    display: flex;
    flex-direction: column;
  }
  .wordStartLabel {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    font-size: xx-small;
    background-color: transparent;
  }
  .spice {
    background-color: transparent;
    display: block;
  }
  table {
    border-collapse: collapse;
    padding: 0;
    margin: 0;
    table-layout: fixed;
    max-width: 100vw;
  }
  td {
    width: 2.2em;
    height: 2.2em;
    aspect-ratio: 1 / 1;
    position: relative;
    border: solid light-dark(var(--light-color), var(--dark-color)) 1px;
    padding: 0;
    margin: 0;
    text-align: center;
    text-transform: uppercase;
    font-size: clamp(0.1em, 1.2em, 2.5em);
  }
  td:after {
    content: '';
    display: block;
    margin-top: 0;
  }
  td.currentCell {
    background-color: light-dark(var(--light-highlight-bg), var(--dark-highlight-bg));
  }
  td.wordHighlight {
    background-color: light-dark(var(--light-secondary-highlight-bg), var(--dark-secondary-highlight-bg));
  }
  td.currentCellReverse {
    background-color: light-dark(var(--light-highlight-bg-reverse), var(--dark-highlight-bg-reverse));
  }
  td.wordHighlightReverse {
    background-color: light-dark(var(--light-secondary-highlight-bg-reverse), var(--dark-secondary-highlight-bg-reverse));
  }
  td.notInUse {
    background-color: light-dark(var(--light-color), var(--dark-color));
    opacity: 0.5;
  }
  .rotateBtn {
    min-width: 2.5em;
    min-height: 2.5em;
  }
  summary {
    margin: 0.3em;
  }
  #appcontainer {
    display: flex;
    flex-wrap: wrap;
  }
  #boardcontainer {
    display: flex;
    flex-direction: column;
  }
  #topbar {
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  #wordInfo {
    overflow-wrap: anywhere;
  }
</style>
<div id="appcontainer">
  <div id="boardcontainer">
    <div id="topbar">
      <button id="rotateLeft" class="rotateBtn">↶</button>
      <span id="wordInfo"></span>
      <input type="text" id="userinput">
      <button id="rotateRight" class="rotateBtn">↷</button>
    </div>
    <div id="matrixContainer"></div>
    <div id="btnpanel">
      <details>
        <summary>Move</summary>
        <button id="moveLeft">Left</button>
        <button id="moveRight">Right</button>
        <button id="moveUp">Up</button>
        <button id="moveDown">Down</button>
      </details>
      <details>
        <summary>Add</summary>
        <button id="addColumnLeft">Left column</button>
        <button id="addColumnRight">Right column</button>
        <button id="addRowTop">Top row</button>
        <button id="addRowBottom">Bottom row</button>
      </details>
      <details>
        <summary>Remove</summary>
        <button id="removeColumnLeft">Left column</button>
        <button id="removeColumnRight">Right column</button>
        <button id="removeRowTop">Top row</button>
        <button id="removeRowBottom">Bottom row</button>
      </details>
      <details>
        <summary>Share</summary>
        <input type="text" id="shareProgramText"></input>
        <button id="copyShareProgramBtn">Copy</button>
      </details>
      <button id="undo">Undo</button>
      <button id="toggleMode">Toggle mode</button>
      <button id="delete">Delete</button>
    </div>
  </div>
  <ul id="wordlist"></ul>
<div>
`;class h{static stateStack=[];static currentState=()=>this.stateStack[this.stateStack.length-1];static removeLastState=()=>{1<this.stateStack.length&&this.stateStack.pop()};static appendState=t=>(this.stateStack.push(t),t);static getNewState=({content:t,position:e,height:o,width:i,direction:n,rotation:r,words:a,mode:s,solution:d})=>{var c;return 0<this.stateStack.length?(c=this.currentState(),{content:t??c.content,position:e??c.position,height:o??c.height,width:i??c.width,direction:n??c.direction,rotation:r??c.rotation,words:a??c.words,mode:s??c.mode,solution:d??c.solution}):{content:t,position:e,height:o,width:i,direction:n,rotation:r,words:a,mode:s,solution:d}};static addNewState=({content:t,position:e,height:o,width:i,direction:n,rotation:r,words:a,mode:s,solution:d})=>{var c;return 0<this.stateStack.length?(c=this.currentState(),this.stateStack.push({content:t??c.content,position:e??c.position,height:o??c.height,width:i??c.width,direction:n??c.direction,rotation:r??c.rotation,words:a??c.words,mode:s??c.mode,solution:d??c.solution})):this.stateStack.push({content:t,position:e,height:o,width:i,direction:n,rotation:r,words:a,mode:s,solution:d}),this.currentState()};static saveState=(t,e)=>localStorage.setItem(e+"_rota_state",JSON.stringify(t));static loadState=t=>localStorage.getItem(t+"_rota_state")?JSON.parse(localStorage.getItem(t+"_rota_state")):null}class l{static getArrowFromDirection=(t,e=0)=>{return["→","↓","←","↑"][(t-e+4)%4]};static rotateMatrixToLeft=(t,e=1)=>{let i=t;return[...Array(e)].forEach(()=>{const o=i.map(t=>t.reverse());i=[...o[0]].map((t,e)=>o.map(t=>t[e]))}),i};static rotateMatrixToRight=(t,e=1)=>{let i=t;return[...Array(e)].forEach(()=>{const o=[...i].reverse();i=[...o[0]].map((t,e)=>o.map(t=>t[e]))}),i};static getPositionMatrix=o=>{var t=[...Array(o.height).keys()].map(e=>[...Array(o.width).keys()].map(t=>t+e*o.width));return l.rotateMatrixToLeft(t,o.rotation)};static getDirectionAdjustedPositionMatrix=t=>{let e=l.getPositionMatrix(t);return[...Array(t.direction)].forEach(()=>{e=l.rotateMatrixToLeft(e)}),e=t.direction%2!=0?e.reverse():e};static getCurrentWordPositions=e=>l.getDirectionAdjustedPositionMatrix(e).find(t=>t.includes(e.position))??[];static findHorizontalWords=n=>{const r=[],t=[...Array(n.height)].keys().map(t=>n.content.substring(t*n.width,(t+1)*n.width)),e=/[^-]+/g;return t.forEach((t,i)=>[...t.matchAll(e)].forEach(t=>{if(1<t[0].length){const e=i*n.width+t.index,o=t[0];t=n.words.find(t=>t.position==e&&t.direction%2==0&&t.word==o);t?r.push(t):r.push({position:e,positions:[...Array(o.length).keys().map(t=>e+t)],word:o,direction:0,hint:""})}})),r};static findVerticalWords=n=>{const r=[],t=[...Array(n.width)].keys().map(e=>[...[...Array(n.height)].keys().map(t=>n.content.charAt(t*n.width+e))].join("")),e=/[^-]+/g;return t.forEach((t,i)=>[...t.matchAll(e)].forEach(t=>{if(1<t[0].length){const e=t.index*n.width+i,o=t[0];t=n.words.find(t=>t.position==e&&t.direction%2!=0&&t.word==o);t?r.push(t):r.push({position:e,positions:[...Array(o.length).keys().map(t=>e+t*n.width)],word:o,direction:1,hint:""})}})),r};static getNewContentState=(o,t)=>{let i=l.getDirectionAdjustedPositionMatrix(o).flat(),n=(1<=o.mode&&(i=i.filter(t=>"-"!=o.solution.charAt(t))),0==o.mode?[...o.content]:[...o.solution]);[...t].forEach((t,e)=>{n[i[(i.indexOf(o.position)+e)%i.length]]=t});t=i[(i.indexOf(o.position)+t.length)%i.length];return 0==o.mode?{content:n.join(""),position:t}:{solution:n.join(""),position:t}};static getBackspacedState=e=>{if(0==e.mode){const t=e.content.charAt(e.position);if("-"==t){const n=l.getDirectionAdjustedPositionMatrix(e).flat();return{position:n[(n.indexOf(e.position)-1+e.content.length)%e.content.length]}}const i=[...e.content];return i[e.position]="-",{content:i.join("")}}const t=e.solution.charAt(e.position);if("+"==t){const r=l.getDirectionAdjustedPositionMatrix(e).flat().filter(t=>"-"!=e.content.charAt(t));return{position:r[(r.indexOf(e.position)-1+r.length)%r.length]}}const o=[...e.solution];return o[e.position]="+",{solution:o.join("")}};static cleanInput=t=>[...t.toLowerCase()].filter(t=>"abcdefghijklmnopqrstuvwxyzæøå".includes(t)).join("");static getSimplifiedState=t=>{const e="-abcdefghijklmnopqrstuvwxyzæøå",o=new Map;return[...e].map((t,e)=>o.set(t,e)),[...t.content].map(t=>o.get(t).toString(e.length)).join("")};static loadSimplifiedState=t=>{const e="-abcdefghijklmnopqrstuvwxyzæøå",o=new Map;return[...e].map((t,e)=>o.set(e,t)),[...t].map(t=>o.get(parseInt(t,e.length))).join("")};static getShareUrl=t=>{var e=l.getSimplifiedState(t);const o=t.words.map(t=>""+t.direction+t.hint);var i=o.join("_");const n=new URL(""+window.location.origin+window.location.pathname);return n.searchParams.set("w",t.width),n.searchParams.set("c",e),n.searchParams.set("h",encodeURIComponent(i)),n.href}}class t extends HTMLElement{static get observedAttributes(){return["width","height"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(d.content.cloneNode(!0));const t=new URLSearchParams(window.location.search);if(t.has("c")&&t.has("h")){var e=h.loadState(2),o=l.loadSimplifiedState(t.get("c"));if(e&&o==e.content)h.addNewState(e);else{const r=decodeURIComponent(t.get("h")).split("_"),a=Number(t.get("w"))||10;var e=Math.trunc(o.length/a),i={content:o,position:0,height:e,width:a,direction:0,rotation:0,mode:2,words:[],solution:[...Array(e).keys()].map(t=>[...Array(a).keys()].map(t=>"-").join("")).join("")},n=l.findHorizontalWords(i),i=l.findVerticalWords(i),n=[...n,...i].map((t,e)=>(t.hint=r[e].substring(1),t.direction=Number(r[e][0]),t));h.addNewState({content:o,position:0,height:e,width:a,direction:0,rotation:0,mode:2,words:n,solution:[...o].map(t=>"-"!=t?"+":"-").join("")})}}else{i=parseInt(this.getAttribute("height"))||10;const s=parseInt(this.getAttribute("width"))||10;e=h.loadState(0);e?h.addNewState(e):h.addNewState({content:[...Array(i).keys()].map(t=>[...Array(s).keys()].map(t=>"-").join("")).join(""),position:0,height:i,width:s,direction:0,rotation:0,mode:0,solution:[...Array(i).keys()].map(t=>[...Array(s).keys()].map(t=>"-").join("")).join("")})}}connectedCallback(){const i=h.currentState(),t=this.shadowRoot.getElementById("btnpanel"),o=(2==i.mode&&(t.style.display="none"),this.shadowRoot.getElementById("userinput"));o.addEventListener("keydown",t=>{var e=h.currentState();let o=l.getPositionMatrix(e).flat();switch(1<=i.mode&&(o=o.filter(t=>"-"!=i.solution.charAt(t))),t.key){case"ArrowUp":this.changeState(h.getNewState({position:o[(o.indexOf(e.position)-e.width+e.content.length)%e.content.length]}));break;case"ArrowDown":this.changeState(h.getNewState({position:o[(o.indexOf(e.position)+e.width)%e.content.length]}));break;case"ArrowLeft":this.changeState(h.getNewState({position:o[(o.indexOf(e.position)-1+e.content.length)%e.content.length]}));break;case"ArrowRight":this.changeState(h.getNewState({position:o[(o.indexOf(e.position)+1)%e.content.length]}));break;case"Enter":this.changeState(h.getNewState({direction:(e.direction+1)%4}));break;case"Backspace":this.changeState(h.getNewState(l.getBackspacedState(e)))}}),o.addEventListener("input",t=>{var e=l.cleanInput(o.value);o.value="",this.changeState(h.getNewState(l.getNewContentState(h.currentState(),e)))});var e=(t,e)=>{const o=this.shadowRoot.getElementById(t);o.addEventListener("click",()=>{var t=h.currentState();this.changeState(h.getNewState(e(t)))})};e("rotateLeft",t=>({rotation:(t.rotation+1)%4})),e("rotateRight",t=>({rotation:(t.rotation-1+4)%4})),e("delete",e=>({content:[...Array(e.height).keys()].map(t=>[...Array(e.width).keys()].map(t=>"-").join("")).join("")})),e("moveLeft",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).map(t=>[...t.slice(1),t[0]]),e.rotation).flat().map(t=>e.content.charAt(t)).join("")})),e("moveRight",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).map(t=>[t[t.length-1],...t.slice(0,t.length-1)]),e.rotation).flat().map(t=>e.content.charAt(t)).join("")})),e("moveUp",e=>({content:l.rotateMatrixToRight([...l.getPositionMatrix(e).slice(1),l.getPositionMatrix(e)[0]],e.rotation).flat().map(t=>e.content.charAt(t)).join("")})),e("moveDown",e=>({content:l.rotateMatrixToRight([l.getPositionMatrix(e)[e.height-1],...l.getPositionMatrix(e).slice(0,e.height-1)],e.rotation).flat().map(t=>e.content.charAt(t)).join("")})),e("addColumnLeft",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).map(t=>[-1,...t].map(t=>0<=t?e.content.charAt(t):"-")),e.rotation).flat().join(""),height:e.rotation%2==0?e.height:e.height+1,width:e.rotation%2!=0?e.width:e.width+1})),e("addColumnRight",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).map(t=>[...t,-1].map(t=>0<=t?e.content.charAt(t):"-")),e.rotation).flat().join(""),height:e.rotation%2==0?e.height:e.height+1,width:e.rotation%2!=0?e.width:e.width+1})),e("addRowTop",e=>({content:l.rotateMatrixToRight([Array(e.rotation%2==0?e.width:e.height).fill(-1),...l.getPositionMatrix(e)],e.rotation).flat().map(t=>0<=t?e.content.charAt(t):"-").join(""),height:e.rotation%2!=0?e.height:e.height+1,width:e.rotation%2==0?e.width:e.width+1})),e("addRowBottom",e=>({content:l.rotateMatrixToRight([...l.getPositionMatrix(e),Array(e.rotation%2==0?e.width:e.height).fill(-1)],e.rotation).flat().map(t=>0<=t?e.content.charAt(t):"-").join(""),height:e.rotation%2!=0?e.height:e.height+1,width:e.rotation%2==0?e.width:e.width+1})),e("removeColumnLeft",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).map(t=>[...t.slice(1)].map(t=>e.content.charAt(t))),e.rotation).flat().join(""),height:e.rotation%2==0?e.height:e.height-1,width:e.rotation%2!=0?e.width:e.width-1})),e("removeColumnRight",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).map(t=>[...t.slice(0,-1)].map(t=>e.content.charAt(t))),e.rotation).flat().join(""),height:e.rotation%2==0?e.height:e.height-1,width:e.rotation%2!=0?e.width:e.width-1})),e("removeRowTop",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).slice(1),e.rotation).flat().map(t=>e.content.charAt(t)).join(""),height:e.rotation%2!=0?e.height:e.height-1,width:e.rotation%2==0?e.width:e.width-1})),e("removeRowBottom",e=>({content:l.rotateMatrixToRight(l.getPositionMatrix(e).slice(0,-1),e.rotation).flat().map(t=>e.content.charAt(t)).join(""),height:e.rotation%2!=0?e.height:e.height-1,width:e.rotation%2==0?e.width:e.width-1}));const n=this.shadowRoot.getElementById("undo"),r=(n.addEventListener("click",()=>{h.removeLastState(),this.reDraw(h.currentState())}),this.shadowRoot.getElementById("toggleMode")),a=(r.addEventListener("click",()=>{var t=h.currentState();this.changeState(h.getNewState({mode:0==t.mode?1:0,solution:[...t.content].map(t=>"-"!=t?"+":"-").join("")}))}),this.shadowRoot.getElementById("copyShareProgramBtn"));a.addEventListener("click",async()=>{var t=this.shadowRoot.getElementById("shareProgramText");try{await navigator.clipboard.writeText(t.value)}catch(t){console.error("Failed to copy text: ",t)}}),this.changeState(h.currentState())}clearElement=t=>t.querySelectorAll(":not(template,style,.clearKeep)").forEach(t=>t.remove());getBoard=a=>{const s=a.words,d=[...new Set([...s.map(t=>t.position)])].toSorted((t,e)=>t-e),t=l.getPositionMatrix(a),c=l.getCurrentWordPositions(a),e=document.createElement("table");var o=t.map(t=>{const e=document.createElement("tr");t=t.map(i=>{const n=document.createElement("td");n.addEventListener("click",t=>{const e=this.shadowRoot.getElementById("userinput");var o;document.activeElement!==e&&e.focus(),n.classList.contains("currentCell")||n.classList.contains("currentCellReverse")?(o=(h.currentState().direction+1)%4,this.changeState(h.getNewState({direction:o}))):this.changeState(h.getNewState({position:i}))}),a.position==i?a.direction<=1?n.classList.add("currentCell"):n.classList.add("currentCellReverse"):c.includes(i)&&(a.direction<=1?n.classList.add("wordHighlight"):n.classList.add("wordHighlightReverse"));var t=(0==a.mode?a.content:a.solution).charAt(i);if("-"!=t){if(0!=a.mode&&"+"==t||(n.textContent=t),d.includes(i)){const e=document.createElement("text"),o=(e.setAttribute("class","wordStartLabel"),[d.indexOf(i)+1]),r=s.filter(t=>t.position==i);o.push(...r.map(t=>l.getArrowFromDirection(t.direction,a.rotation))),e.append(...o.map(t=>{const e=document.createElement("span");return e.classList.add("spice"),e.textContent=t,e})),n.append(e)}}else 1<=a.mode&&n.classList.add("notInUse");return n});return e.append(...t),e});return e.append(...o),e};getWordInfoContent=e=>{const t=document.createElement("span"),o=[...new Set([...e.words.map(t=>t.position)])].toSorted((t,e)=>t-e),i=e.words.filter(t=>(t.direction+e.direction+e.rotation)%2==0).find(t=>t.positions.includes(e.position))??e.words.filter(t=>(t.direction+e.direction+e.rotation)%2!=0).find(t=>t.positions.includes(e.position));if(i){var n=o.indexOf(i.position)+1;const r=document.createElement("button");r.addEventListener("click",()=>{this.changeState(h.getNewState({direction:(4+i.direction-e.rotation)%4}),!0)}),r.textContent=""+n+l.getArrowFromDirection(i.direction,e.rotation);n=0==e.mode?i.direction<2?i.word:[...i.word].reverse().join(""):i.hint;const a=document.createElement("span");a.textContent=""+n,t.append(r,a)}return t};changeState=(t,e=!1)=>{var o=l.findHorizontalWords(t),i=l.findVerticalWords(t),o=(t.words=[...o,...i],h.addNewState(t));h.saveState(o,t.mode),this.reDraw(o);const n=this.shadowRoot.getElementById("shareProgramText");if(n.value=l.getShareUrl(o),e){const r=this.shadowRoot.getElementById("userinput");document.activeElement!==r&&r.focus()}};reDraw=t=>{const e=this.shadowRoot.getElementById("wordInfo"),o=this.shadowRoot.getElementById("matrixContainer"),i=this.shadowRoot.getElementById("wordlist");[e,o,i].forEach(t=>this.clearElement(t)),e.appendChild(this.getWordInfoContent(t)),o.appendChild(this.getBoard(t)),i.append(...this.getWordListElements(t))};getWordListElements=e=>{const o=(i,n,t)=>{const e=document.createElement("li"),o=document.createElement("div"),r=(o.setAttribute("class","hintContainer"),document.createElement("label"));if(r.setAttribute("class","actualWord"),0==i.mode){const a=document.createElement("text"),s=(a.textContent=""+(t+1),document.createElement("button")),d=(s.textContent=""+l.getArrowFromDirection(n.direction,i.rotation),s.addEventListener("click",t=>{var e=i.words.findIndex(t=>t.position==n.position&&t.direction==n.direction);const o=i.words;o[e].direction=(o[e].direction+6)%4,this.changeState(h.getNewState({words:o}))}),r.textContent=""+(n.direction<2?n.word:[...n.word].reverse().join("")),document.createElement("input"));d.setAttribute("class","gameHintInput"),d.setAttribute("type","text"),d.value=n.hint,d.addEventListener("change",t=>{var e=i.words.findIndex(t=>t.position==n.position&&t.direction==n.direction);const o=i.words;o[e].hint=t.target.value,this.changeState(h.getNewState({words:o}))}),o.append(a,s,r,d)}else{const c=document.createElement("button");c.addEventListener("click",()=>{this.changeState(h.getNewState({direction:(4+n.direction-i.rotation)%4,position:n.position}),!0)}),c.textContent=""+(t+1)+l.getArrowFromDirection(n.direction,i.rotation),r.textContent=""+n.hint,o.append(c,r)}return e.appendChild(o),e},i=[...new Set([...e.words.map(t=>t.position)])].toSorted((t,e)=>t-e);var t=e.words.filter(t=>t.direction%2==0).map(t=>o(e,t,i.indexOf(t.position))),n=e.words.filter(t=>t.direction%2!=0).map(t=>o(e,t,i.indexOf(t.position)));return[...t,...n]};disconnectedCallback(){console.log("disconnected",this)}}window.customElements.define("rotakryss-comp",t);