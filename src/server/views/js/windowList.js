/**
 * windowList for Query.
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

var clickCount = 0;
var singleClickTimer = 0;

function simpleClick(link) {
	if (link.includes && optHost && link.includes(optHost.value)) {
		clear();
		decodeUrl(link);
		refresh();
		canGo = true;
	}
}

function openClick(link) {
	if (link[link.length - 1] === '"') link = link.slice(0, -1);
	if (link[0] === '"') link = link.slice(1);
	window.open(link.trim(), '_blank').focus();
}

function urlWindow(input) {
	if (!wins.Links || wins.Links === null || wins.Links.content === null) {
		const temp = new Window("Links", {
			state: WindowState.NORMAL,
			size: {
				width: 750,
				height: 250
			},
			selected: true,
			minimizable: false,
			always_on_top: true,
			container: two,
			lang: "json"
		});
		wins.Links = temp;
	}
	let str = '<div class="linkCcontainer"> <center> ';
	if (input.direct) str += `<br> <button id="btnDirect" class="clipboard">Click me to copy current Url</button> <br> <br>  <a href="${input.direct}" target="_blank" class="buttonLink">${input.direct}</a> <br> <hr> <br>`;

	if (input.query) str += `<a href="${input.query}" target="_self" class="loadInQuery">Load in query</a>`;
	if (input.sqlUrl) {
		str += `<a href="${input.sqlUrl}" target="_blank" class="buttonLink">Sql Query</a>`;
		str += "<hr>";
		str += `<input type="text" class="urlForm" v-model="url" value="${input.sqlUrl}"/>`;
	}
	str += "</center> </div>";
	wins.Links.content.innerHTML = str;
	wins.Links.show();

	if (input.direct) {
		btnDirect.addEventListener("click", () => {
			if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(input.direct).then(() => {
					alert("url copied");
				});
			}
		});
	}
}

function sqlWindow(input) {
	if (!wins.Sql || wins.Sql === null || wins.Sql.content === null) {
		const temp = new Window("Script SQL", {
			state: WindowState.NORMAL,
			size: {
				width: 750,
				height: 500
			},
			selected: true,
			minimizable: false,
			always_on_top: true,
			container: two,
			lang: "sql"
		});
		wins.Sql = temp;
	}
	wins.Sql.show();
	wins.Sql.content.innerText = input;
	// wins.Sql.content.innerHTML =  Prism.highlight(input, Prism.languages.sql, 'sql');
	const menuitems = [{
			"text": "Execute script",
			"events": { // Adds eventlisteners to the item (you can use any event there is)
				"click": function(e) {
					executeSqlValues(e);
				}
			}
		},
		{
			"text": "Encoded html",
			"events": {
				"click": function(e) {
					urlWindow(JSON.parse(` { "sqlUrl" : "${optHost.value}/${optVersion.value}/Sql?$query=${btoa(wins.Sql.content.innerText)}"}`));
				}
			}
		}
	];

	var menu = new ContextMenu(menuitems);

	wins.Sql.content.addEventListener("contextmenu", function(e) {
		menu.display(e);
	});
}

function jsonWindow(input, title) {
	if (!wins.Json || wins.Json === null || wins.Json.content === null) {
		wins.Json = new Window(title, {
			state: getWinActives() ? WindowState.NORMAL : WindowState.MAXIMIZED,
			size: {
				width: 750,
				height: 500
			},
			selected: true,
			minimizable: false,
			container: two,
			lang: "sql"
		});
	} else wins.Json.setTitle(title);
	wins.Json.content.innerHTML = `<pre class="json-viewer" id="jsonRenderer" </pre>`;
	jsonRenderer.addEventListener("click", function(event) {
		clickCount++;
		if (clickCount === 1) {
			if (Array.from(event.target.classList).includes('type-url-')) {
				if (Array.from(event.target.classList).includes('type-url-link')) {
					singleClickTimer = setTimeout(function() {
						clickCount = 0;
						simpleClick(event.target.innerText);
					}, 400);
				} else {
					singleClickTimer = setTimeout(function() {
						clickCount = 0;
					}, 400);
				}
			}
		} else if (clickCount === 2) {
			clearTimeout(singleClickTimer);
			clickCount = 0;
			if (Array.from(event.target.classList).includes('type-url-link')) {
				simpleClick(event.target.innerHTML);
				go.onclick();
			} else if (Array.from(event.target.classList).includes('type-url-external')) {
				openClick(event.target.innerHTML);
			}
		}
	});

	jsonRenderer.appendChild(jsonViewer.getContainer());
	if (getElement("optHost")) jsonViewer.setRoot(optHost.value);
	jsonViewer.showJSON(input);
	wins.Json.show();
}

function csvWindow(input) {
	if (!wins.Csv || wins.Csv === null || wins.Csv.content === null) {
		const temp = new Window("Csv file", {
			state: getWinActives() ? WindowState.NORMAL : WindowState.MAXIMIZED,
			size: {
				width: 750,
				height: 500
			},
			selected: true,
			minimizable: false,
			container: two,
			lang: "sql"
		});
		wins.Csv = temp;
	}
	wins.Csv.content.innerHTML = `<div id="csvRenderer" class="patrom-table-container"></div>`;
	buildTableWithCsv(input, ";", csvRenderer);
	wins.Csv.show();
}

function decoderWindow(input, serviceName) {
	if (!wins.Logs || wins.Logs === null || wins.Logs.content === null) {
		const temp = new Window(`Decoder : ${input.name}`, {
			state: getWinActives() ? WindowState.NORMAL : WindowState.MAXIMIZED,
			size: {
				width: 750,
				height: 500
			},
			selected: true,
			minimizable: false,
			container: two,
			lang: "any"
		});
		wins.Logs = temp;
	}
	const lines = [
		`<div class="tabs">`,
		`<input type="hidden" id="optDecoderId" name="${serviceName}"/>`,
		`  <input type="radio" name="tabs" id="tabone" checked="checked">`,
		`  	<label for="tabone">Code Javascript</label>`,
		`  		<div class="tab">`,
		`			<div id="jsonDecoderCodeContainer">`,
		`			<div contenteditable spellcheck="false" id="jsonDecoderCode" class='blakkAll shj-lang-js'></div>`,
		`			</div>`,
		`		</div>`,
		``,
		`  <input type="radio" name="tabs" id="tabtwo">`,
		`  <label for="tabtwo">Nomenclature</label>`,
		`  		<div class="tab">`,
		`			<div id="jsonDecoderNomenclatureContainer">`,
		`			<div contenteditable spellcheck="false" id="jsonDecoderNomenclature" class='blakkAll shj-lang-js'></div>`,
		`		</div>`,
		`	</div>`,
		``,
		`  <input type="radio" name="tabs" id="tabthree">`,
		`  <label for="tabthree">Tests and ...</label>`,
		`  <div class="tab">`,
		`  		<div class="pro-form">`,
		`       	<div class="patrom-row">`,
		`               <div class="patrom-col patrom-col-span-2">`,
		`					<div class="field">`,
		`						<label for="optDecoderName">Name</label>`,
		`						<input id="optDecoderName" name="optDecoderName" type="text" class="patrom-text-input"_100-100>`,
		`						<input id="optDecoderId" name="optDecoderId" type="hidden" _100-100>`,
		`					</div>`,
		`               </div>`,
		`               <div class="patrom-col patrom-col-span-2">`,
		`               	<div class="field">`,
		`                        <label for="optPayload">Payload for testing</label>`,
		`                        <input id="optPayload" name="optPayload" type="text" class="patrom-text-input"_100-100>`,
		`                    </div>`,
		`                </div>`,
		`                <div class="patrom-col patrom-col-span-2">`,
		`                   <label for="testDecoder">Tests</label>`,
		`					<button id="testDecoder" onclick="testDecoder()"> test </button>`,
		`				</div>`,
		`                <div class="patrom-col patrom-col-span-2">`,
		`                   <label for="testDecoder">Save</label>`,
		`					<button id="saveDecoder" onclick="saveDecoder()"> Save </button>`,
		`				</div>`,
		`                <div class="patrom-col patrom-col-span-2">`,
		`                   <label for="deleteDecoder">Delete</label>`,
		`					<button id="deleteDecoder" onclick="deleteDecoder()"> Delete </button>`,
		`				</div>`,
		`            </div>`,
		`          </div>`,


		`<div class="patrom-row">`,
		`<div class="patrom-col patrom-col-span-12">`,
		`  <div class="field">`,
		`	<label for="jsonDecoderResult">Result :</label>`,
		`		<div id="jsonDecoderResultContainer">`,
		`			<div contenteditable spellcheck="false" id="jsonDecoderResult" class='blakkAll shj-lang-js'></div>`,
		`		</div>`,
		`  </div>`,
		`</div>`,
		`</div>`,

		`</div>`
	];
	wins.Logs.content.innerHTML = lines.join("");
	wins.Logs.name = serviceName;
	wins.Logs.show();
	wins.Logs.normalSize();
	getElement("optDecoderName").value = input.name;
	getElement("optDecoderId").value = input["@iot.id"];
	beautifyDatas(getElement("jsonDecoderCode"), input.code, "js");
	beautifyDatas(getElement("jsonDecoderNomenclature"), input.nomenclature, "json");
}