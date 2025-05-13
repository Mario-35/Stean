const pretty = new pp();

// DON'T REMOVE !!!!
// @start@
// @request@

// create json default configuration
function updateDataService()  {
	var obj = {
		name: optName.value,
		pg: {
            "host": "localhost",
            "port": 5432,
            "user": optName.value,
            "password": optPassword.value,
            "database": optRepeat.value,
            "retry": 2
        },
		"apiVersion": optVersion.value || "v1.1",
		"date_format": dateOption.value || "DD/MM/YYYY hh:mi:ss",
        "nb_page": pageOption.value || 200,
		"extensions": multiSelects["extensionsOption"].getData(["base"]),
        "options": multiSelects["optionsOption"].getData(),
        "csvDelimiter": csvOption.value || ";"
	}
	beautifyDatas(getElement("jsonDatas"), obj, "json");	
};

// catch click on service block
btnService.onclick = async (e) => {	
	e.preventDefault();
	updateDataService();
	if (optName.value === "") {
		notifyError("Error", "name can't be empty");
		return;
	} 
	if (optPassword.value === "") {
		notifyError("Error", "Password can't be empty");
		return;
	} 
	if (optRepeat.value === "")  {
		notifyError("Error", "Repeat can't be empty");
		return;
	} 
	if (optPassword.value !== optRepeat.value)  {
		notifyError("Error", "Password and repeat not the same");
		return;
	} 
	try {
		datas.innerText = jsonDatas.innerText.replace(/[^\x00-\x7F]/g, '');
		getElement("actionForm").action = `${_PARAMS.addUrl.split("service")[0]}admin`;
		getElement("_action").value = "addService";
		document.getElementById("actionForm").requestSubmit();
	} catch (error) {
		console.error(error);
		wait(false);
	}
};

// fill form service from another
function fillService(name, newName) {
	csvOption.value = _PARAMS.services[name].service.csvDelimiter;
	pageOption.value = _PARAMS.services[name].service.nb_page;
	dateOption.value = _PARAMS.services[name].service.date_format;
	populateSelect(optVersion, _PARAMS.versions, _PARAMS.services[name].service.apiVersion);
	populateMultiSelect("optionsOption", _PARAMS.options, _PARAMS.services[name].service.options);
	populateMultiSelect("extensionsOption", _PARAMS.extensions, _PARAMS.services[name].service.extensions);
	optName.value = newName || name;
	optPassword.value = newName || "";
	optRepeat.value = newName ||"";
	Labelchck1.innerText = "Service " + optName.value;
}

// load Log file from log select
getDatas = async (url) => {
	try {
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await response.json();
	} catch (err) {
		notifyError("Error", err);
	}
}

// fill form for create service from another
async function selectCard(name) {
	fillService(name);
	
}

// fill form for create service from another
function copyService(name) {
	const newName = window.prompt("Name of the service", "");
	if (newName !== null && newName !== "") {
		fillService(name, newName);
		updateDataService();
	}
}

// change nb Page
function editPage(name ,elem) {
	const temp = window.prompt("Number of page for " + name, elem.textContent);
	if (temp !== null && temp !== "" && +temp > 0) {
		elem.textContent = temp; 		
		fetch(`${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/nb_page`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: `{"nb_page": ${temp}}`
		});
	}
}

// edit synonyms
async function editList(name ,elem) {
	show(getElement("editList"+ name));
	hide(getElement("options"+ name));
	const lines = Object.values(_PARAMS.services[name].service.synonyms[elem]);
	const temp = window.prompt("Synonyms for " + elem, _PARAMS.services[name].service.synonyms[elem]);
	if (temp !== null && temp !== "" && temp != lines) {
		_PARAMS.services[name].service.synonyms[elem] = temp.split(',');
		await fetch(`${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/synonyms`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(_PARAMS.services[name].service.synonyms)
		});
	}


}

// change csv delimiter
async function editCsv(name ,elem) {
	const temp = window.prompt("Csv delimiter for " + name, elem.textContent);
	if (temp === "," || temp === ";") elem.textContent = temp; 
	if (temp === "," || temp === ";") {
		await fetch(`${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/csvDelimiter`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: `{"csvDelimiter": "${temp}"}`
		});
	}
}


// change card selector
async function selectChange(name ,elem) {
	switch (elem.value) {
		case "Statistiques":
			getElement("infos"+ name).innerHTML = Object.keys(_PARAMS.services[name].stats).filter(e =>  e !== "Users").map(e => `<option>${e} : ${_PARAMS.services[name].stats[e]}</option>`).join("\n");
			showInfos(name);
			break;
		case "Users":			
			getElement("infos"+ name).innerHTML = _PARAMS.services[name].stats["Users"].map(e => `<option value="${e["username"]}" onclick="showUserInfos('${name}', '${e["username"]}')">${e["username"]}</option>`).join("\n");
			break;
		case "Loras":
			const url = `${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/Decoders?$select=id,name`;		
			const datas = await getDatas(url);
			getElement("infos"+ name).innerHTML =  Object.values(datas.value).map(e => `<option value="${e.name}" onclick="showDecoderInfos('${name}','${e["@iot.id"]}')">${e.name}</option>`).join("\n");
			break;
		case "Synonyms": 
			if (_PARAMS.services[name].service)
				getElement("infos"+ name).innerHTML = Object.keys(_PARAMS.services[name].service.synonyms).map(e => `<option value="${e["username"]}" onclick="editList('${name}','${e}')">${e}</option>`).join("\n");
			break;	
		case 0: 		
			if (["canDrop", "forceHttps", "stripNull","unique"].includes(elem.textContent)) {
				if (_PARAMS.services[name].service.options.includes(elem.textContent)) {
					var index = _PARAMS.services[name].service.options.indexOf(elem.textContent);
					_PARAMS.services[name].service.options.splice(index, 1);
				} else _PARAMS.services[name].service.options.push(elem.textContent);

				await fetch(`${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/options`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(_PARAMS.services[name].service.options)
				});
			}
			showInfos(name);
			break;						
		default:
			getElement("infos"+ name).innerHTML = _PARAMS.services[name].service.extensions.map(e => `<option value="${e}">${e}</option>`).join("\n");
			showInfos(name);
	}
}

// load Log file from log select
optLogs.onclick = async () => {
	try {
		const url = `${_PARAMS.addUrl.split("service")[0]}${optLogs.value}`;
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		wrapper.classList.add("scrollable-div");
		wrapper.innerHTML = await response.text();
	} catch (err) {
		notifyError("Error", err);
	}
}

// export config
btnExport.onclick = async () => {
	const url = `${_PARAMS.addUrl.split("service")[0]}export`;	
	beautifyDatas(getElement("jsonDatas"), await getFetchDatas(url), "json");
}

// change view for user infos
function showUserInfos(service, element) {
	var obj = Object(_PARAMS.services[service].stats["Users"]).filter(e => e.username === element)[0];
	var elem = (name) => `<li class="card-list-item icon-${obj[name] === true ? "yes" : "no"}">${name}</li>`;
	getElement("options"+ service).innerHTML = `<legend>${element}</legend> <ul class="card-list"> ${[ elem("canPost"), elem("canDelete"), elem("canCreateDb"), elem("canCreateUser"), elem("admin"), elem("superAdmin") ].join("")} </ul>`;
}

// change view for standard default infos
async function showDecoderInfos(name, decoder) {
	const datas = await getDatas(`${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/Decoders(${decoder})`);
	decoderWindow(datas, name);
}

// Change view for standard default infos
function showInfos(service) {
	const li = (operation) => `<li class="card-list-item canPoint icon-${_PARAMS.services[service].service.options.includes(operation) ? "yes" : "no" }"  onclick="selectChange('${service}', this)">${operation}</li>`;
	const ul = ['<legend>Options</legend>','<ul class="card-list">'];
	["canDrop","forceHttps","stripNull","unique"].forEach( e => ul.push(li(e)));
	ul.push("</ul>");	
	getElement("options"+ service).innerHTML = ul.join("");
}

// Launch test decoder
function testDecoder() {
	const payload = getElement("optPayload").value || window.prompt("payload", "");
	if (payload !== null && payload !== "") {
		getElement("optPayload").value = payload;
		decodingPayload(payload) ;
	}
}

// Delete decoder
async function deleteDecoder() {
	const serviceName = getElement("optDecoderId").name;
	const id = getElement("optDecoderId").value;	
	if (Number(id) > 0) {
		let response = await fetch(`${_PARAMS.services[serviceName].linkBase}/${_PARAMS.services[serviceName].version}/Decoders(${id})`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status == 204)
			notifyAlert("Delete", `delete Ok`);
		else 
			notifyError("Error", `delete Error`);
	}	
}

// Save decoder as PUT http verb
async function saveDecoder() {
	const serviceName = getElement("optDecoderId").name;	
	await fetch(`${_PARAMS.services[serviceName].linkBase}/${_PARAMS.services[serviceName].version}/Decoders`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			"name": getElement("optDecoderName").value,
			"code": String(getElement("jsonDecoderCode").innerText.split("\n").join("")),
			"nomenclature": String(getElement("jsonDecoderNomenclature").innerText.split("\n").join(""))
		})
	});
}

// Decode payload test
function decodingPayload(payload) {
	try {
		const F = new Function("input", "nomenclature", `${getElement("jsonDecoderCode").innerText}; return decode(input, nomenclature);`);
		let nomenclature = JSON.parse(getElement("jsonDecoderNomenclature").innerText);
		const result = F(payload, nomenclature);
		beautifyDatas(getElement("jsonDecoderResult"), result, "json");		
	}
	catch (error) {
		notifyError("Error", error);
	}
};

// Save configs as PUT http verb
async function saveDecoder() {
	const serviceName = getElement("optDecoderId").name;	
	await fetch(`${_PARAMS.services[serviceName].linkBase}/${_PARAMS.services[serviceName].version}/Synonims`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			"name": getElement("optDecoderName").value,
			"code": String(getElement("jsonDecoderCode").innerText.split("\n").join("")),
			"nomenclature": String(getElement("jsonDecoderNomenclature").innerText.split("\n").join(""))
		})
	});
}

// Start
(function init() {
	wait(false);
	hide(datas);
	new SplitterBar(container, first, two);
	populateSelect(optVersion, _PARAMS.versions, "v1.1");
	populateSelect(optLogs, _PARAMS.logsFiles);
	populateMultiSelect("optionsOption", _PARAMS.options);
	populateMultiSelect("extensionsOption", _PARAMS.extensions);
	csvOption.value = ';';
	pageOption.value = '200';
	dateOption.value = "DD/MM/YYYY hh:mi:ss";
	jsonViewer = new JSONViewer();
	if (_PARAMS.mussage) notifyConfirm("Confirmation", _PARAMS.mussage);
}
)();