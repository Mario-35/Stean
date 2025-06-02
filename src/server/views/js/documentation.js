function methodIcon(input) {
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
	Object.keys(input).forEach((lang, i) => {
		lines.push(`<input type="radio" name="tabs" id="tab${i}" ${ i== 0 ? 'checked="checked"' :'' }>`,
			`<label for="tab${i}">${lang}</label>`,
			`<div class="patrom-tab">`,
			`<code class='language-${lang}'>`,
			input[lang],
			`</code>`,
			`</div>`);
	});
	lines.push('</div>');
	return lines.join("");
}

function getContent(input) {
	return `<article class="">
    <div class="pull-left">
      <h1>${input.short}</h1>
    </div>
    ${input.description ? `<section><p>${ input.description }</p></section>` : ''}
    ${getDatasTabs(input)}    
    ${input.examples ? `<section>${ getExamples(input.examples, input.params) }</section>` : ''}
  </article>`;
}

function getDatasTabs(input) {
	let index = 0;

	function createTab(name, content) {
		index = index + 1;
		return `<li class="tab__item">
              <input class="tab__radio" type="radio" name="tab" id="tab_id_${index}" ${index === 1 ? 'checked="checked"' : ''}/>
              <label class="tab__label" for="tab_id_${index}">${name}</label>
              <div class="tab__content">
                ${content}                 
              </div>
            </li>`
	}
	const lines = `
          <div class="tab">
            <div class="tab__body">
              <ul class="tab__list">
                ${input.params ? createTab('Params', `<div class="view"> <div id="params"></div></div>`) : ''}
                ${input.success ? createTab('Success', `<div class="view"> <div id="success"></div></div>`) : ''}
                ${input.error ? createTab('Error', `<div class="view"> <div id="error"></div></div>`) : ''}
                ${input.structure ? createTab('Structure', `<div class="view">${ getStructure(input.structure) }</div>`) : ''}
              </ul>
            </div>
          </div>`;
	return index === 0 ? '' : lines;
}

function getStructure(input) {
	const lines = ['<table>',
		'<thead>',
		'<tr>',
		'<th style="width: 20%">Champ</th>',
		'<th style="width: 5%">Requis</th>',
		'<th style="width: 10%">Type</th>',
		'<th style="width: 55%">Description</th>',
		'</tr>',
		'</thead>',
		'<tbody>'
	];
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

	// if (actual.params) {
	// 	beautifyDatas(getElement("jsonDatas"), actual.params, "json");
	// }

	if (actual.params) {
	  const jsonViewerParams = new JSONViewer();
	  params.appendChild(jsonViewerParams.getContainer());  
	  jsonViewerParams.showJSON(JSON.parse(actual.params));
	}  

	if (actual.success) {
		const jsonViewerSuccess = new JSONViewer();
		success.appendChild(jsonViewerSuccess.getContainer());
		try {
			jsonViewerSuccess.showJSON(JSON.parse(actual.success));
		} catch (error) {
			console.log("--------getid-----");
			console.log(error);
			
		}
		
	}

	if (actual.error) {
		const jsonViewerError = new JSONViewer();
		error.appendChild(jsonViewerError.getContainer());
		jsonViewerError.showJSON(JSON.parse(actual.error));
	}
}

function filterDoc() {
	const filter = search.value;
	console.log(`filter -> ${filter}`);

	Object.keys(doc).forEach(main => {
		console.log(main);

		let lessOne = false;
		Object.keys(doc[main]).forEach((index) => {
			console.log(index);
			let find = false;
			if (doc[main][index].description.includes(filter)) {
				find = true;
				lessOne = true;
			}
			const elem = getElement(`${main}-${index}`);
			if (lessOne == false)
				elem.classList.add("hide")
			else elem.classList.remove("hide");
			if (lessOne == false)
				elem.parentElement.parentElement.classList.add("hide")
			else elem.parentElement.parentElement.classList.remove("hide");
		})
	});
}

function createSideBar() {
	const lines = [`<div class="patrom-row">
                    <div class="patrom-col col-span-12 fullWidth">
                      <input type="text" id="search" class="patrom-text-input" value="" placeholder="filter">
                      <button class="patrom-icon-button" onclick="filterDoc(event)"> 🔎 </button>
                      <label class="patrom-switch">
                        <input id="theme" type="checkbox" class="patrom-switch__input" onchange="localStorage.setItem('theme', localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'); document.documentElement.className = localStorage.getItem('theme');">
                        <div class="patrom-switch__theme"></div>
                      </label>
                    </div>
                    </div>
                  </div>  `];
	Object.keys(doc).forEach((mainLabel, i) => {
		lines.push(`<div class="patrom-accordion">
  <input class="patrom-accordion-check" type="checkbox" id="chck${i}">
  <label class="patrom-accordion-label" for="chck${i}" id="Labelchck${i}">${mainLabel}</label>
  <div class="patrom-accordion-content">        
  ${Object.keys(doc[mainLabel]).map((subLabel,j)=>`<div class="patrom-row"  id="${mainLabel}-${j}">
  <div class="patrom-col col-span-12" fullWidth">
  ${methodIcon(doc[mainLabel][subLabel]["type"])}
  <label class="menuItem" onclick="showDoc(event)" id="${j}">${doc[mainLabel][subLabel]["short"]} </label>                      
  </div>
  </div>`).join("")}  
  </div>
  </div>`);
	});
	return lines.join("");
}

// Start
(function init() {
	new SplitterBar(container, first, two);
	document.getElementById("menuTabs").innerHTML = createSideBar();
	jsonViewer = new JSONViewer(); // TODO patrom start
	wait(false);
})();