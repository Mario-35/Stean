const pretty = new pp();
function methodIcon(input){
  return `<span class="method meth-${input}">${input}</span>`;
}

function getMenuMain(element) {  
  while (element && !element.classList.contains("patrom-accordion-content")) {
    element = element.parentElement;
  }  
  element = element.previousElementSibling;
  if (element.classList.contains("patrom-accordion-label")) return element.innerHTML;
}

function getExamples(input, datas) {  
  const lines = ['<div class="patrom-tabs">']
  Object.keys(input).forEach((lang,i)=> {
    lines.push(`<input type="radio" name="tabs" id="tab${i}" ${ i== 0 ? 'checked="checked"' :'' }>`,
               `<label for="tab${i}">${lang}</label>`,
               `<div class="patrom-tab">`,
               `<div contenteditable="" id="datas${i}" spellcheck="false" class="shj-lang-js">`,
               `</div>`,
               `</div>`);
  });





// <div contenteditable="" spellcheck="false" id="wins.Sql" class="shj-lang-sql"><span class="shj-syn-kwd">SELECT</span> <span class="shj-syn-str">"thing"</span>.<span class="shj-syn-str">"id"</span> <span class="shj-syn-kwd">AS</span> <span class="shj-syn-str">"@iot.id"</span>,
// 		<span class="shj-syn-str">"thing"</span>.<span class="shj-syn-str">"name"</span> <span class="shj-syn-kwd">AS</span> <span class="shj-syn-str">"name"</span>,
// 		<span class="shj-syn-str">"thing"</span>.<span class="shj-syn-str">"description"</span> <span class="shj-syn-kwd">AS</span> <span class="shj-syn-str">"description"</span>,
// 		<span class="shj-syn-str">"thing"</span>.<span class="shj-syn-str">"properties"</span> <span class="shj-syn-kwd">AS</span> <span class="shj-syn-str">"properties"</span>
//  <span class="shj-syn-kwd">FROM</span> <span class="shj-syn-str">"thing"</span>
//  <span class="shj-syn-kwd">ORDER</span> <span class="shj-syn-kwd">BY</span> id
//  <span class="shj-syn-kwd">LIMIT</span> <span class="shj-syn-num">1000</span>
// </div>





  lines.push('</div>');
  return lines.join("");
}

function getContent(input) {
  return `<article class="">
    <div class="pull-left">
      <h1>${input.short}</h1>
    </div>
    ${input.description ? `<section><p>${ input.description }</p></section>` : ''}
    ${input.structure ? `<section>${ getStructure(input.structure) }</section>` : '' }
    ${input.examples ? `<section>${ getExamples(input.examples, input.params) }</section>` : ''}
    ${input.params ? `<section><div class="datasBox"> <h2 class="title">Datas</h2> <div class="view"> <div id="jsonDatasContainer"> <div contenteditable spellcheck="false" id="jsonDatas" class='blakkAll shj-lang-json'></div> </div></div> </div></section>`: ''}
    ${input.success ? '<section><div class="successBox"> <h2 class="title">Success 200</h2> <div class="view"> <div id="success"></div> </div> </div></section>' : ''}
    ${input.error ? '<section><div class="errorBox"> <h2 class="title">Error</h2> <div class="view"> <div id="error"></div> </div> </div></section>' : ''}
  </article>`;
}

function getStructure(input) {
  const lines =  ['<table>',
                  '<thead>',
                  '<tr>',
                  '<th style="width: 20%">Champ</th>',
                  '<th style="width: 5%">Requis</th>',
                  '<th style="width: 10%">Type</th>',
                  '<th style="width: 55%">Description</th>',
                  '</tr>',
                  '</thead>',
                  '<tbody>'];
  ["columns", "relations"].forEach(e => {
    Object.keys(input[e]).forEach(item => {
      lines.push('<tr>',
      `<td>${item}</td>`,
      `<td>${input[e][item].requis == true ? '✔️': '❌'}</td>`,
      `<td>${input[e][item].type}</td>`,
      `<td>${input[e][item].description}</td>`,
      '</tr>');
    });
  });
  lines.push('</tbody>', '</table>');
  return lines.join("");
}

function showDoc(event) {  
  const main = getMenuMain(event.srcElement); 
  const actual = doc[main][event.srcElement.id];
  const content = getContent(actual);

  document.getElementById("content").innerHTML = content;
  document.getElementById("two").style.overflow = 'auto';

  if (actual.params) {
    beautifyDatas(getElement("jsonDatas"), actual.params, "json");
  }

  if (actual.success) {
    const jsonViewerSuccess = new JSONViewer();
    success.appendChild(jsonViewerSuccess.getContainer());  
    jsonViewerSuccess.showJSON(JSON.parse(actual.success));
  }

  if (actual.error) {
    const jsonViewerError = new JSONViewer();
    error.appendChild(jsonViewerError.getContainer());  
    jsonViewerError.showJSON(JSON.parse(actual.error));
  }

  
  if (actual.examples) {
    Object.keys(actual.examples).forEach((lang, i) => {    
      beautifyDatas(getElement(`datas${i}`), actual.examples[lang].replace('@DATAS@', `\m${JSON.stringify(actual.params, 4, null)}\m`), "js");
    });
  }
}

function essai(event) {
  const filter = search.value;
  console.log(filter);
  
  const filtered = Object.keys()
  // const filtered = doc.filter(x => 
  //   x.some(y => 
  //       y.includes(filter))
  //   );
    console.log(filtered);
    
}

// Start
(function init() {

  // essai("Things");
  const mainMenu = [`<div class="patrom-row">
                  <div class="patrom-col col-span-10">
                    <div class="field">                      
                      <input id="search" type="text" class="patrom-text-input width75">
                      <div class="patrom-button-bar__item">
                      <button class="patrom-button-bar__button" id="btnFilter" onclick="essai(event)">filter</button>
                    </div>
                    </div>
                  </div>

                <div class="patrom-col col-span-2">
                  <label class="patrom-switch">
                    <input id="theme" type="checkbox" class="patrom-switch__input" onchange="toggleTheme()">
                    <div class="patrom-switch__theme"></div>
                  </label>
                </div>
              </div>  `];
  Object.keys(doc).forEach((mainLabel,i)=> {  
    mainMenu.push(`<div class="patrom-accordion">
      <input class="patrom-accordion-check" type="checkbox" id="chck${i}">
      <label class="patrom-accordion-label" for="chck${i}" id="Labelchck${i}">${mainLabel}</label>
      <div class="patrom-accordion-content">        
          ${Object.keys(doc[mainLabel]).map((subLabel,i)=>`<div class="patrom-row">
          <div class="patrom-col col-span-12" fullWidth">
          ${methodIcon(doc[mainLabel][subLabel]["type"])}
          <label class="menuItem" onclick="showDoc(event)" id="${i}">${doc[mainLabel][subLabel]["short"]} </label>                      
        </div>
      </div>`).join("")}  
      </div>
    </div>`);
  });
  document.getElementById("menuTabs").innerHTML =mainMenu.join("");
  wait(false);
  new SplitterBar(container, first, two);
  jsonViewer = new JSONViewer();
})();




