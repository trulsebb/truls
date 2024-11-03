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
  ::slotted(*) {color: green; margin: 0; padding: 0;}
</style>
<slot name="title"></slot>
<div id="gamecontainer"></div>
<div id="btnpanel"></div>
<ul id="wordlist"></ul>
`;class e extends HTMLElement{static get observedAttributes(){return["width","height"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t.content.cloneNode(!0)),console.log(this.getAttribute("heigth")),this.height=this.getAttribute("heigth")||10,this.width=this.getAttribute("width")||10,this.isStateHorizontal=!0,this.lastClicked="",localStorage.getItem("state")?this.state=localStorage.getItem("state"):this.state=[...Array(this.height).keys()].map(t=>[...Array(this.width).keys()].map(t=>"-").join("")).join(""),console.log(this.state)}clearElement=t=>t.querySelectorAll(":not(template,style,.clearKeep)").forEach(t=>t.remove());addCharToState=(t,e)=>{const i=this.state;this.state=""+i.substring(-1,t)+e+i.substring(t+1),this.renderWordList()};removeCharFromState=t=>{const e=this.state;this.state=e.substring(-1,t)+"-"+e.substring(t+1),this.renderWordList()};getCharFromState=t=>{t=this.state.charAt(t);return"-"==t?"":t};getHorizontalLines=()=>[...Array(this.height).keys()].map(e=>[...Array(this.width).keys()].map(t=>this.state[this.calcPosition(e,t)]).join(""));getVerticalLines=()=>[...Array(this.width).keys()].map(e=>[...Array(this.height).keys()].map(t=>this.state[this.calcPosition(t,e)]).join(""));getWordsFromLine=t=>t.replace(/(\-)\1+/g,"$1").split("-").filter(t=>1<t.length);getHorizontalWords=()=>this.getHorizontalLines().map(t=>this.getWordsFromLine(t)).flat();getVerticalWords=()=>this.getVerticalLines().map(t=>this.getWordsFromLine(t)).flat();saveState=()=>localStorage.setItem("state",this.state);calcPosition=(t,e)=>t*this.width+e;getCol=t=>t%this.width;getRow=t=>Math.floor(t/this.width);moveUp=()=>{let t=this.getHorizontalLines();t.push(t.shift()),this.state=t.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};moveDown=()=>{let t=this.getHorizontalLines();t.unshift(t.pop()),this.state=t.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};transpose=i=>[...i[0]].map((t,e)=>i.map(t=>t[e]).join(""));moveRight=()=>{let t=this.getVerticalLines();t.unshift(t.pop());const e=this.transpose(t);this.state=e.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};moveLeft=()=>{let t=this.getVerticalLines();t.push(t.shift());const e=this.transpose(t);this.state=e.join(""),this.renderCreatorGrid(),this.renderWordList(),this.saveState()};focusNext=(t,e)=>{const i=t?(t,e)=>t+e:(t,e)=>t-e;let s=""+i(e,1);this.isStateHorizontal||(s=""+i(e,this.width));const a=this.shadowRoot.getElementById(s);if(a)a.focus(),this.highlightCell(s);else{const o=this.shadowRoot.getElementById("0");o&&(o.focus(),this.highlightCell(0))}};highlightCell=t=>{const s=this.getCol(t),a=this.getRow(t);[...Array(this.height).keys()].map(i=>{[...Array(this.width).keys()].map(t=>{const e=this.shadowRoot.getElementById(""+this.calcPosition(i,t));e&&(this.isStateHorizontal?a==i?e.style.background="lightblue":e.style.background="none":s==t?e.style.background="lightblue":e.style.background="none")})})};renderCreatorGrid=()=>{const t=document.createElement("table");var e=[...Array(this.height).keys()].map(a=>{const t=document.createElement("tr");var e=[...Array(this.width).keys()].map(t=>{const e=document.createElement("td"),i=this.calcPosition(a,t);t=this.getCharFromState(i);const s=document.createElement("input");return s.addEventListener("mousedown",t=>{t.target.id==this.lastClicked&&(this.isStateHorizontal=!this.isStateHorizontal),this.lastClicked=t.target.id,this.highlightCell(t.target.id)}),s.addEventListener("focus",t=>{this.lastClicked=t.target.id}),s.setAttribute("type","text"),s.id=""+i,s.value=""+t,s.pattern="[A-Za-z]{1}",s.addEventListener("keydown",t=>{"Backspace"===t.key&&(0<t.target.value.length?(t.target.value="",this.removeCharFromState(i),this.saveState()):(t.preventDefault(),this.focusNext(!1,i)))}),s.addEventListener("keyup",t=>{var e;"Backspace"===t.key?t.preventDefault():(e=[...t.target.value].findLast(t=>t.match(/[A-Z|a-z|æ|ø|å|Æ|Ø|Å]/)))?(t.target.value=e,this.addCharToState(i,e),this.saveState(),t.preventDefault(),this.focusNext(!0,i)):t.target.value=""}),e.append(s),e});return t.append(...e),t});t.append(...e);const i=this.shadowRoot.getElementById("gamecontainer");this.clearElement(i),i.appendChild(t)};renderGameGrid=()=>{const r=this.getWordStartLabelsPositions(),t=document.createElement("table");var e=[...Array(this.height).keys()].map(o=>{const t=document.createElement("tr");var e=[...Array(this.width).keys()].map(t=>{const e=document.createElement("td"),i=this.calcPosition(o,t);if(0<this.getCharFromState(i).length){const s=document.createElement("input");if(s.addEventListener("mousedown",t=>{t.target.id==this.lastClicked&&(this.isStateHorizontal=!this.isStateHorizontal),this.lastClicked=t.target.id,this.highlightCell(t.target.id)}),s.addEventListener("focus",t=>{this.lastClicked=t.target.id}),s.setAttribute("type","text"),s.id=""+i,s.pattern="[A-Za-z]{1}",s.addEventListener("keydown",t=>{"Backspace"===t.key&&(0<t.target.value.length?t.target.value="":(t.preventDefault(),this.focusNext(!1,i)))}),s.addEventListener("keyup",t=>{var e;"Backspace"===t.key?t.preventDefault():(e=[...t.target.value].findLast(t=>t.match(/[A-Z|a-z|æ|ø|å|Æ|Ø|Å]/)))?(t.target.value=e,t.preventDefault(),this.focusNext(!0,i)):t.target.value=""}),r.includes(i)){const a=document.createElement("text");a.setAttribute("class","wordStartLabel"),a.textContent=r.indexOf(i)+1,e.append(a)}e.append(s)}else e.style.background="black";return e});return t.append(...e),t});t.append(...e);const i=this.shadowRoot.getElementById("gamecontainer");this.clearElement(i),i.appendChild(t)};addOrUpdateWordHint=(t,e,i,s)=>{localStorage.setItem(`w-${t}-${e}-`+i,s)};gwtWordHint=(t,e,i)=>{t=`w-${t}-${e}-`+i;return localStorage.getItem(t)?"":localStorage.getItem(t)};getHorizontalWordsWithPosition=()=>{const r=new Map;return this.getHorizontalLines().map((i,s)=>{var a,o;[...i].map((a=0,o="",(t,e)=>{"-"!=t?(0==o.length&&(a=e),o=""+o+t,e+1==i.length&&1<o.length&&(t=this.calcPosition(s,a),r.set(t,o))):(1<o.length&&(e=this.calcPosition(s,a),r.set(e,o)),o="")}))}),r};getVerticalWordsWithPosition=()=>{const r=new Map;return this.getVerticalLines().map((i,s)=>{var a,o;[...i].map((a=0,o="",(t,e)=>{"-"!=t?(0==o.length&&(a=e),o=""+o+t,e+1==i.length&&1<o.length&&(t=this.calcPosition(a,s),r.set(t,o))):(1<o.length&&(e=this.calcPosition(a,s),r.set(e,o)),o="")}))}),r};getWordStartLabelsPositions=()=>{return[...new Set([...this.getHorizontalWordsWithPosition().keys(),...this.getVerticalWordsWithPosition().keys()])].sort((t,e)=>t-e)};getWordHint=(t,e,i)=>{t=localStorage.getItem(`w-${t}-${e}-`+i);return t||""};renderWordList=()=>{const s=(e,t,i,s)=>{const a=document.createElement("li"),o=document.createElement("div"),r=(o.setAttribute("class","hintContainer"),document.createElement("label")),n=(r.setAttribute("class","actualWord"),document.createElement("text")),l=(n.setAttribute("class","gameHint"),n.style.display="none",n.textContent=this.getWordHint(e,i,s),document.createElement("input")),h=(l.setAttribute("class","gameHintInput"),l.setAttribute("type","text"),l.value=this.getWordHint(e,i,s),l.addEventListener("keyup",t=>{this.addOrUpdateWordHint(e,i,s,t.target.value),n.textContent=t.target.value}),document.createElement("text"));return h.textContent=`${t+1}${i}:`,r.textContent=""+s,o.append(h,r,l,n),a.appendChild(o),a},t=this.getWordStartLabelsPositions(),a=this.getHorizontalWordsWithPosition(),o=this.getVerticalWordsWithPosition();var e=t.map((t,e)=>{var i=a.get(t);if(i)return s(t,e,"→",i)}).filter(t=>t),i=t.map((t,e)=>{var i=o.get(t);if(i)return s(t,e,"↓",i)}).filter(t=>t);const r=this.shadowRoot.getElementById("wordlist");this.clearElement(r),r.append(...e,...i)};connectedCallback(){this.renderCreatorGrid();var t=(t,e)=>{const i=document.createElement("button");return i.textContent=t,i.addEventListener("click",e),i};const e=this.shadowRoot.getElementById("btnpanel");e.appendChild(t("Up",this.moveUp)),e.appendChild(t("Down",this.moveDown)),e.appendChild(t("Left",this.moveLeft)),e.appendChild(t("Right",this.moveRight));let i=!0;const s=document.createElement("button");s.textContent="Toggle mode",s.addEventListener("click",t=>{i?(this.renderGameGrid(),[...this.shadowRoot.querySelectorAll(".gameHintInput")].map(t=>t.style.display="none"),[...this.shadowRoot.querySelectorAll(".actualWord")].map(t=>t.style.display="none"),[...this.shadowRoot.querySelectorAll(".gameHint")].map(t=>t.style.display="")):(this.renderCreatorGrid(),[...this.shadowRoot.querySelectorAll(".gameHintInput")].map(t=>t.style.display=""),[...this.shadowRoot.querySelectorAll(".actualWord")].map(t=>t.style.display=""),[...this.shadowRoot.querySelectorAll(".gameHint")].map(t=>t.style.display="none")),i=!i}),e.appendChild(s),this.renderWordList()}disconnectedCallback(){console.log("disconnected",this)}}window.customElements.define("dumb-comp",e);