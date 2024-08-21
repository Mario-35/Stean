var clickCount = 0;
var singleClickTimer = 0;

function updateWinLinks(input) {
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

function updateWinSqlQuery(input) {
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
	wins.Sql.content.innerHTML = `<div contenteditable spellcheck="false" id="wins.Sql" class='shj-lang-sql'>${highlightText(input, "sql")}</div>`;
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
					updateWinLinks(JSON.parse(` { "sqlUrl" : "${optHost.value}/${optVersion.value}/Sql?$query=${btoa(wins.Sql.content.innerText)}"}`));
				}
			}
		}
	];

	var menu = new ContextMenu(menuitems);

	wins.Sql.content.addEventListener("contextmenu", function(e) {
		menu.display(e);
	});
}

function simpleClick(link) {
	if (link.includes && optHost && link.includes(optHost.value)) {
		clear();
		decodeUrl(link);
		refresh();
		canGo = true;
	}
}
function openClick(link) {
	if (link[link.length-1] === '"') link = link.slice(0, -1);
	if (link[0] === '"') link = link.slice(1);
	console.log("===========================================================");
	console.log(link.trim());
	window.open(link.trim(), '_blank').focus();
}

function updateWinJsonResult(input, title) {
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
						simpleClick(event.target.innerHTML);
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
	jsonViewer.setRoot(optHost.value);
	jsonViewer.showJSON(input);
	wins.Json.show();
}

function updateWinCsvResult(input) {
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

function updateWinLogs(input) {
	if (!wins.Logs || wins.Logs === null || wins.Logs.content === null) {
		const temp = new Window("Result", {
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
	const lines = [];
	input.value.forEach((log) => {
		lines.push(`<dt class="collapsible-title" id="log${log["@iot.id"]} " ><button class="patrom-button--${log.code < 300 ? 'success' : 'danger'} size-xs" disabled="">${log.method}</button>&nbsp;${log["date"]} </dt>`);
		lines.push(`<dd class="collapsible-content">pipo</dd>`);
	});
	wins.Logs.content.innerHTML = `<div spellcheck="false" id="wins.Logs"> <dl class="collapsible"> ${lines.join("")} </dl> </div>`;
	wins.Logs.content.addEventListener("click", async function(event) {
		if (Array.from(event.target.classList).includes('collapsible-title') && event.target.innerHTML !== "Deleted") {
			await openLineTabLog(event.target);
		} else if (Array.from(event.target.classList).includes('patrom-button--success')) {
			const id = getId(event.target.id);
			await replayLog(id);
		} else if (Array.from(event.target.classList).includes('patrom-button--danger')) {
			const id = getId(event.target.id);
			await deleteLog(id);
		} else if (Array.from(event.target.classList).includes('patrom-button--primary')) {
			const id = getId(event.target.id);
			await patchLog(id);
		}
	});
	wins.Logs.show();
	if (isLog()) {
		const menuitems = [{
				"text": "Errors only",
				"events": { // Adds eventlisteners to the item (you can use any event there is)
					"click": function(e) {
						Logfilter = "code gt 400";
						go.onclick();
					}
				}
			},
			{
				"text": "Good Only",
				"events": {
					"click": function(e) {
						Logfilter = "code gt 199 and code lt 300";
						go.onclick();
					}
				}
			},
			{
				"text": "all",
				"events": {
					"click": function(e) {
						Logfilter = undefined;
						go.onclick();
					}
				}
			}
		];

		var menu = new ContextMenu(menuitems);

		wins.Logs.content.addEventListener("contextmenu", function(e) {
			menu.display(e);
		});
	}
}