const t=document.createElement("template");t.innerHTML=`
<style>
  table {
	  border-collapse: collapse;
	  padding: 0;
    margin: 0;
  }
  td {
    width: 2em;
    height: 2em;
    position: relative;
	  border: solid black 1px;
    padding: 0;
    margin: 0;
  }
  td:after {
    content: '';
    display: block;
    margin-top: 100%;
  }
  td input {
    position: absolute;
	  border: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 2em;
    height: 2em;
    text-transform:uppercase;
	  background-color: #fff0;
    text-align: center;
  }
  td input:focus {
    background-color: #fff9;
  }
  .wordStartLabel {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    font-size: xx-small;
  }
  label {
    font-size: small;
    color: grey;
  }
  #wordlist {
    width: fit-content;
    display: flex;
    flex-direction: column;
  }
  .hintContainer {
    display: flex;
    justify-content: space-between;
  }
  .gameHintInput {

  }
  ::slotted(*) {color: green; margin: 0; padding: 0;}
</style>
<slot name="title"></slot>
<div id="gamecontainer"></div>
<div id="btnpanel"></div>
<div id="shareProgramContainer" style="display: none;">
  <input type="text" id="shareProgramText"></input>
  <button id="copyShareProgramText">Copy</button>
</div>
<ul id="wordlist"></ul>
`;class e extends HTMLElement{static get observedAttributes(){return["width","height"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t.content.cloneNode(!0)),this.height=this.getAttribute("heigth")||10,this.width=this.getAttribute("width")||10,this.isStateHorizontal=!0,this.lastClicked="",localStorage.getItem("state")?this.state=localStorage.getItem("state"):this.state=[...Array(this.height).keys()].map(t=>[...Array(this.width).keys()].map(t=>"-").join("")).join("")}clearElement=t=>t.querySelectorAll(":not(template,style,.clearKeep)").forEach(t=>t.remove());addCharToState=(t,e)=>{const i=this.state;this.state=""+i.substring(-1,t)+e+i.substring(t+1),this.renderWordList()};removeCharFromState=t=>{const e=this.state;this.state=e.substring(-1,t)+"-"+e.substring(t+1),this.renderWordList()};getCharFromState=t=>{t=this.state.charAt(t);return"-"==t?"":t};getHorizontalLines=i=>[...Array(this.height).keys()].map(e=>[...Array(this.width).keys()].map(t=>i[this.calcPosition(e,t)]).join(""));getVerticalLines=i=>[...Array(this.width).keys()].map(e=>[...Array(this.height).keys()].map(t=>i[this.calcPosition(t,e)]).join(""));getWordsFromLine=t=>t.replace(/(\-)\1+/g,"$1").split("-").filter(t=>1<t.length);getHorizontalWords=t=>this.getHorizontalLines(t).map(t=>this.getWordsFromLine(t)).flat();getVerticalWords=t=>this.getVerticalLines(t).map(t=>this.getWordsFromLine(t)).flat();saveState=()=>localStorage.setItem("state",this.state);calcPosition=(t,e)=>t*this.width+e;getCol=t=>t%this.width;getRow=t=>Math.floor(t/this.width);moveUp=()=>{let t=this.getHorizontalLines(this.state);t.push(t.shift()),this.state=t.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};moveDown=()=>{let t=this.getHorizontalLines(this.state);t.unshift(t.pop()),this.state=t.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};transpose=i=>[...i[0]].map((t,e)=>i.map(t=>t[e]).join(""));moveRight=()=>{let t=this.getVerticalLines(this.state);t.unshift(t.pop());const e=this.transpose(t);this.state=e.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};moveLeft=()=>{let t=this.getVerticalLines(this.state);t.push(t.shift());const e=this.transpose(t);this.state=e.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};focusNext=(t,e)=>{const i=t?(t,e)=>t+e:(t,e)=>t-e;let s=""+i(e,1);this.isStateHorizontal||(s=""+i(e,this.width));const a=this.shadowRoot.getElementById(s);if(a)a.focus(),this.highlightCell(s);else{const o=this.shadowRoot.getElementById("0");o&&(o.focus(),this.highlightCell(0))}};highlightCell=t=>{const s=this.getCol(t),a=this.getRow(t);[...Array(this.height).keys()].map(i=>{[...Array(this.width).keys()].map(t=>{const e=this.shadowRoot.getElementById(""+this.calcPosition(i,t));e&&(this.isStateHorizontal?a==i?e.style.background="lightblue":e.style.background="none":s==t?e.style.background="lightblue":e.style.background="none")})})};renderCreatorGrid=()=>{const t=document.createElement("table");var e=[...Array(this.height).keys()].map(o=>{const t=document.createElement("tr");var e=[...Array(this.width).keys()].map(t=>{const e=document.createElement("td"),i=this.calcPosition(o,t);var s=this.getCharFromState(i);const a=document.createElement("input");return a.setAttribute("aria-label",`input for cell ${t}-`+o),a.addEventListener("mousedown",t=>{t.target.id==this.lastClicked&&(this.isStateHorizontal=!this.isStateHorizontal),this.lastClicked=t.target.id,this.highlightCell(t.target.id)}),a.addEventListener("focus",t=>{this.lastClicked=t.target.id}),a.setAttribute("type","text"),a.id=""+i,a.value=""+s,a.addEventListener("keydown",t=>{"Backspace"===t.key&&(0<t.target.value.length?(t.target.value="",this.removeCharFromState(i),this.saveState()):(t.preventDefault(),this.focusNext(!1,i)))}),a.addEventListener("keyup",t=>{var e;"Backspace"===t.key?t.preventDefault():(e=[...t.target.value].findLast(t=>t.match(/[A-Z|a-z|æ|ø|å|Æ|Ø|Å]/)))?(t.target.value=e,this.addCharToState(i,e),this.saveState(),t.preventDefault(),this.focusNext(!0,i)):t.target.value=""}),e.append(a),e});return t.append(...e),t});t.append(...e);const i=this.shadowRoot.getElementById("gamecontainer");this.clearElement(i),i.appendChild(t)};renderGameGrid=r=>{const n=this.getWordStartLabelsPositions(r),t=document.createElement("table");var e=[...Array(this.height).keys()].map(o=>{const t=document.createElement("tr");var e=[...Array(this.width).keys()].map(t=>{const e=document.createElement("td"),i=this.calcPosition(o,t);if("-"!=r.charAt(i)){const s=document.createElement("input");if(s.addEventListener("mousedown",t=>{t.target.id==this.lastClicked&&(this.isStateHorizontal=!this.isStateHorizontal),this.lastClicked=t.target.id,this.highlightCell(t.target.id)}),s.addEventListener("focus",t=>{this.lastClicked=t.target.id}),s.setAttribute("type","text"),s.id=""+i,s.addEventListener("keydown",t=>{"Backspace"===t.key&&(0<t.target.value.length?t.target.value="":(t.preventDefault(),this.focusNext(!1,i)))}),s.addEventListener("keyup",t=>{var e;"Backspace"===t.key?t.preventDefault():(e=[...t.target.value].findLast(t=>t.match(/[A-Z|a-z|æ|ø|å|Æ|Ø|Å]/)))?(t.target.value=e,t.preventDefault(),this.focusNext(!0,i)):t.target.value=""}),n.includes(i)){const a=document.createElement("text");a.setAttribute("class","wordStartLabel"),a.textContent=n.indexOf(i)+1,e.append(a)}e.append(s)}else e.style.background="black";return e});return t.append(...e),t});t.append(...e);const i=this.shadowRoot.getElementById("gamecontainer");this.clearElement(i),i.appendChild(t)};addOrUpdateWordHint=(t,e,i,s)=>{localStorage.setItem(`w-${t}-${e}-`+i,s)};gwtWordHint=(t,e,i)=>{t=`w-${t}-${e}-`+i;return localStorage.getItem(t)?"":localStorage.getItem(t)};getHorizontalWordsWithPosition=t=>{const r=new Map;return this.getHorizontalLines(t).map((i,s)=>{var a,o;[...i].map((a=0,o="",(t,e)=>{"-"!=t?(0==o.length&&(a=e),o=""+o+t,e+1==i.length&&1<o.length&&(t=this.calcPosition(s,a),r.set(t,o))):(1<o.length&&(e=this.calcPosition(s,a),r.set(e,o)),o="")}))}),r};getVerticalWordsWithPosition=t=>{const r=new Map;return this.getVerticalLines(t).map((i,s)=>{var a,o;[...i].map((a=0,o="",(t,e)=>{"-"!=t?(0==o.length&&(a=e),o=""+o+t,e+1==i.length&&1<o.length&&(t=this.calcPosition(a,s),r.set(t,o))):(1<o.length&&(e=this.calcPosition(a,s),r.set(e,o)),o="")}))}),r};getWordStartLabelsPositions=t=>{return[...new Set([...this.getHorizontalWordsWithPosition(t).keys(),...this.getVerticalWordsWithPosition(t).keys()])].sort((t,e)=>t-e)};getWordHint=(t,e,i)=>{t=localStorage.getItem(`w-${t}-${e}-`+i);return t||""};renderWordList=()=>{const s=(e,t,i,s)=>{const a=document.createElement("li"),o=document.createElement("div"),r=(o.setAttribute("class","hintContainer"),document.createElement("label")),n=(r.setAttribute("class","actualWord"),document.createElement("text")),l=(n.setAttribute("class","gameHint"),n.style.display="none",n.textContent=this.getWordHint(e,i,s),document.createElement("input")),h=(l.setAttribute("class","gameHintInput"),l.setAttribute("type","text"),l.value=this.getWordHint(e,i,s),l.addEventListener("keyup",t=>{this.addOrUpdateWordHint(e,i,s,t.target.value),n.textContent=t.target.value}),document.createElement("text"));return h.textContent=`${t+1}${i}:`,r.textContent=""+s,o.append(h,r,l,n),a.appendChild(o),a},t=this.getWordStartLabelsPositions(this.state),a=this.getHorizontalWordsWithPosition(this.state),o=this.getVerticalWordsWithPosition(this.state);var e=t.map((t,e)=>{var i=a.get(t);if(i)return s(t,e,"→",i)}).filter(t=>t),i=t.map((t,e)=>{var i=o.get(t);if(i)return s(t,e,"↓",i)}).filter(t=>t);const r=this.shadowRoot.getElementById("wordlist");this.clearElement(r),r.append(...e,...i)};renderHintList=(i,t)=>{const s=(t,e,i)=>{const s=document.createElement("li"),a=document.createElement("text");return a.setAttribute("class","gameHint"),a.textContent=`${t+1}${e}:`+i,s.appendChild(a),s},e=this.getWordStartLabelsPositions(t),a=this.getHorizontalWordsWithPosition(t),o=this.getVerticalWordsWithPosition(t);var t=e.map((t,e)=>{if(a.get(t))return s(e,"→",i.shift())}).filter(t=>t),r=e.map((t,e)=>{if(o.get(t))return s(e,"↓",i.shift())}).filter(t=>t);const n=this.shadowRoot.getElementById("wordlist");this.clearElement(n),n.append(...t,...r)};getSimplifiedState=t=>{const e=[];let i=0,s=0;return[...t].map(t=>{"-"==t?(i+=1,0<s&&(e.push("l"+s),s=0)):(s+=1,0<i&&(e.push("e"+i),i=0))}),0<i&&e.push("e"+i),0<s&&e.push("l"+s),e.join("")};loadSimplifiedState=t=>[...t.matchAll(/(l|e)(\d+)/g)].reduce((t,e)=>t+=("e"==e[1]?"-":"_").repeat(e[2]),"");getShareUrl=t=>{var e=this.getSimplifiedState(t);const i=[];this.getHorizontalWordsWithPosition(t).forEach((t,e)=>i.push(this.getWordHint(e,"→",t))),this.getVerticalWordsWithPosition(t).forEach((t,e)=>i.push(this.getWordHint(e,"↓",t)));t=i.join("_");const s=new URL(""+window.location.origin+window.location.pathname);return s.searchParams.set("s",e),s.searchParams.set("h",encodeURIComponent(t)),s.href};connectedCallback(){const t=new URLSearchParams(window.location.search);if(t.has("s")&&t.has("h")){var i=this.loadSimplifiedState(t.get("s")),s=decodeURIComponent(t.get("h")).split("_");console.log(s),this.renderGameGrid(i),this.renderHintList(s,i)}else{this.renderCreatorGrid();s=(t,e)=>{const i=document.createElement("button");return i.textContent=t,i.addEventListener("click",e),i};const a=this.shadowRoot.getElementById("btnpanel");a.appendChild(s("Up",this.moveUp)),a.appendChild(s("Down",this.moveDown)),a.appendChild(s("Left",this.moveLeft)),a.appendChild(s("Right",this.moveRight));let e=!0;const o=document.createElement("button");o.textContent="Toggle mode",o.addEventListener("click",t=>{e?(this.renderGameGrid(this.state),[...this.shadowRoot.querySelectorAll(".gameHintInput")].map(t=>t.style.display="none"),[...this.shadowRoot.querySelectorAll(".actualWord")].map(t=>t.style.display="none"),[...this.shadowRoot.querySelectorAll(".gameHint")].map(t=>t.style.display="")):(this.renderCreatorGrid(),[...this.shadowRoot.querySelectorAll(".gameHintInput")].map(t=>t.style.display=""),[...this.shadowRoot.querySelectorAll(".actualWord")].map(t=>t.style.display=""),[...this.shadowRoot.querySelectorAll(".gameHint")].map(t=>t.style.display="none")),e=!e});i=s("Share",()=>{const t=this.shadowRoot.getElementById("shareProgramContainer"),e=(t.style.display="",this.shadowRoot.getElementById("shareProgramText")),i=(e.value=this.getShareUrl(this.state),this.shadowRoot.getElementById("copyShareProgramText"));i.addEventListener("click",()=>navigator.clipboard.writeText(e.value))});a.append(o,i),this.renderWordList()}}disconnectedCallback(){console.log("disconnected",this)}}window.customElements.define("dumb-comp",e);