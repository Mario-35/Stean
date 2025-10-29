/**
 * Events for Query.
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

// change service in service name select
services.addEventListener("change", () => {
	window.location.href = `${_PARAMS.services[services.value].root}/Query`;
});

// update after change expand
expandOption.addEventListener("exit", () => {
	show(subExpandOption);
	populateMultiSelect("subExpandOption", getRelationsList(expandOption.value));
});

// logout actual user
logout.onclick = () => {
	window.location.href = `${optHost.value}/${optVersion.value}/logout`;
};

// show user status
info.onclick = () => {
	window.location.href = `${optHost.value}/${optVersion.value}/status`;
};

// toggle debug
debug.onclick = () => {
	isDebug = !isDebug;
	if (isDebug)
		debug.classList.add("debug");
	else debug.classList.remove("debug");
};

// show url created links
btnShowLinks.onclick = () => {
	const temp = createUrl();
	urlWindow(JSON.parse(` { "direct" : "${temp.direct}", "query" : "${temp.query}"}`));

};

// geoJson datas
btnShowGeo.onclick = () => {
	if (valueGeo.startsWith("http://geojson")) window.location.href = valueGeo;
};


function createTemplateDatas(entity) {
	let result = "";
	const add = (input) => { result += `${(result != "") ? ',' :''} ${input}`}
	if (_PARAMS._DATAS[entity])
		Object.keys(_PARAMS._DATAS[entity].columns).forEach(e => {
			if (_PARAMS._DATAS[entity].columns[e].dataType)
				switch (_PARAMS._DATAS[entity].columns[e].dataType) {
					case 16:
						add(`"${e}": {}`);
						break;
					case 44:
						const name = getEntityName(e.split("_id")[0]);
						add(`"${e.split("_id")[0]}": ${createTemplateDatas(name)}`);
						break;
					case 32:
						add(`"${e}": ""`);
						break;

					default:
						break;
				} else console.log(e);
		});
	return `{${result}}`;
}

// templane generator
btnPostTemplate.onclick = () => {
	let result = (importFile == true) ? JSON.stringify({
		"header": true,
		"nan": true,
		"duplicates": true,
		"columns": {
			"1": {
				"datastream": "1",
				"featureOfInterest": "1"
			}
		}
	}) : {};
	// jsonDatas.value = createTemplateDatas(entityOption.value);
	jsonDatas.value = result;
	setJSON();
	buttonGo();
};

btnRoot.onclick = async () => {
	const url = `${optHost.value}/${optVersion.value}/`;
	const jsonObj = await getFetchDatas(url, "GET");
	jsonWindow(jsonObj, `[GET]:${url}`);
};

go.onclick = async (e) => {
	wait(true);
	if (e) e.preventDefault();
	const tablewrapper = getElement("tablewrapper");
	if (tablewrapper) {
		while (tablewrapper.firstChild) {
			tablewrapper.removeChild(tablewrapper.lastChild);
		}
	}
	two.classList.remove("scrolling");

	const temp = createUrl();
	let url = temp.direct;

	switch (methodOption.value) {
		case "GET":
			// ===============================================================================
			// |                                     GET                                     |
			// ===============================================================================
			if (resultFormatOption.value === "graph") {
				window.open(url);
				wait(false);
				return;
			}
			const jsonObj = await getFetchDatas(url, resultFormatOption.value);
			try {
				if (resultFormatOption.value === "sql")
					sqlWindow(jsonObj);
				else if (resultFormatOption.value === "csv")
					csvWindow(jsonObj);
				else if (resultFormatOption.value === "graph")
					updateWinGraph(jsonObj);
				else if (resultFormatOption.value === "GeoJSON") {
					jsonWindow(jsonObj, `[${methodOption.value}]:${url}`);
					show(btnShowGeo);
					valueGeo = `http://geojson.io/#data=data:application/json,${encodeURIComponent(JSON.stringify(jsonObj.value || jsonObj))}`;
				} else jsonWindow(jsonObj, `[${methodOption.value}]:${url}`);
			} catch (err) {
				notifyError("Error", err);
			} finally {
				wait(false);
			}
			break;
		case "POST":
		case "PATCH":
			// ===============================================================================
			// |                               POST $ PATCH                                  |
			// ===============================================================================
			if (entityOption.value === "createDB") {
				const response = await fetch(`${optHost.value}/${optVersion.value}/createDB`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: jsonDatas.value,
				});
				const value = await response.text();
				if (response.status == 401) {
					window.location.href = `${_PARAMS.decodedUrl.root}/login`;
				}
				wait(false);
				jsonWindow(JSON.parse(value), `[${methodOption.value}]:${url}`);
			} else {
				const response = await fetch(url, {
					method: methodOption.value,
					headers: {
						"Content-Type": "application/json",
					},
					body: jsonDatas.value,
				});
				const value = await response.json();
				if (response.status == 401) window.location.href = "/login";
				wait(false);
				jsonWindow(value, `[${methodOption.value}]:${url}`);
			}
			break;
		case "DELETE":
			// ===============================================================================
			// |                                   DELETE                                    |
			// ===============================================================================
			try {
				if (idOption.value && Number(idOption.value) > 0 || (entityOption.value === "Loras" && idOption.value !== "")) {
					let response = await fetch(url, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (response.status == 204)
						notifyAlert("Delete", `delete ${entityOption.value} id : ${idOption.value}`);
					else notifyError("Error", `delete ${entityOption.value} id : ${idOption.value}`);
				}
			} catch (err) {
				notifyError("Error", err);
			} finally {
				wait(false);
			}
			break;
		default:
			break;
	}
};

submit.onclick = () => {
	runForm();
};

idOption.addEventListener("change", () => {
	updateForm();
});

idOption.addEventListener("exit", () => {
	refresh();
});

entityOption.addEventListener("change", () => {
	refresh_entity();
	refresh();
});

subentityOption.addEventListener("change", () => {
	refresh();
});

propertyOption.addEventListener("change", () => {
	updateForm();
});

resultFormatOption.addEventListener("change", () => {
	updateForm();
});

fileone.addEventListener("change", (e) => {
	header("fileone");
	var fileName = "";
	try {
		if (this.files && this.files.length > 1)
			fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
		else
			fileName = e.target.value.split("\\").pop();

		if (fileName) {
			fileonelabel.querySelector("span").innerHTML = fileName;
			methodOption.value = "POST";
			importFile = true;
		} else {
			fileonelabel.innerHTML = labelVal;
		}
	} catch (err) {
		notifyError("Error", err);
	} finally {
		buttonGo();
	}
	entityOption.value = "CreateObservations";
	updateForm();
});

function addToResultList(key, value, plus) {
	var li = document.createElement("li");
	li.innerText = `${key}: `;
	var span = document.createElement("span");
	span.className = "json-literal";
	span.innerText = value;
	li.appendChild(span);
	getElement("listResult").appendChild(li);
	if (plus) addToResultList("-->", plus);
}

function runForm() {
	wait(true);
	try {		
		const text = jsonDatas.value.replace(/[^\x00-\x7F]/g, '');
		jsonDatas.value = text;
		document.getElementById("actionForm").requestSubmit();
	} catch (error) {
		console.error(error);
		wait(false);
	}
};

function prepareForm() {
	if (importFile === true) {
		getElement("actionForm").action = `${getElement("actionForm").action}`;
		runForm();
	}
}

// update datas after paste
jsonDatas.onpaste = function() {
	{
		setTimeout(() => {
			setJSON();
		}, 100);
	}
};
// update datas after key up
jsonDatas.onkeyup = function() {
	setJSON()
};


// copy service to actual service
btnCopyService.onclick = () => {
	copyFromService();
};
// copy service to actual service
btnCopyServiceStart.onclick = () => {
	copyFromServiceObservations();
};

