const pretty = new pp();

const testNull = (input) => (input.value == "<empty string>" || input.value.trim() == "" || input.value.trim()[0] == "0" || input.value.startsWith(_NONE));


// DON'T REMOVE !!!!
// @start@
// @request@

function init() {	  
	console.log(_PARAMS);
	hide(datas);
	new SplitterBar(container, first, two);
	wait(false);
	populateSelect(optVersion, _PARAMS.versions, "v1.1");
	populateMultiSelect("optionsOption", _PARAMS.options);
	populateMultiSelect("extensionsOption", _PARAMS.extensions);
	csvOption.value = ';';
	pageOption.value = '200';
	dateOption.value = "DD/MM/YYYY hh:mi:ss";
	jsonViewer = new JSONViewer();
}
init();


function buttonGo() {};

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
		const text = jsonDatas.innerText.replace(/[^\x00-\x7F]/g, '');
		console.log(text);		
		datas.innerText = text;
		document.getElementById("actionForm").requestSubmit();
	} catch (error) {
		console.error(error);
	}
};

function copyService(name) {
	const newName = window.prompt("Name of the service", "");
	if (newName !== null && newName !== "") {
		csvOption.value = _PARAMS.services[name].service.csvDelimiter;
		pageOption.value = _PARAMS.services[name].service.nb_page;
		dateOption.value = _PARAMS.services[name].service.date_format;
		populateSelect(optVersion, _PARAMS.versions, _PARAMS.services[name].service.apiVersion);
		populateMultiSelect("optionsOption", _PARAMS.options, _PARAMS.services[name].service.options);
		populateMultiSelect("extensionsOption", _PARAMS.extensions, _PARAMS.services[name].service.extensions);
		optName.value = newName;
		optPassword.value = newName;
		optRepeat.value = newName;
		updateDataService();
	}
}

function editPage(name ,elem) {
	const temp = window.prompt("Number of page for " + name, elem.textContent);
	if (temp !== null && temp !== "" && +temp > 0)elem.textContent = temp; 
}

function selectChange(name ,elem) {
	switch (elem.value) {
		case "Statistiques":
			getElement("infos"+ name).innerHTML = Object.keys(_PARAMS.services[name].stats).map(e => `<option>${e} : ${_PARAMS.services[name].stats[e]}</option>`).join("\n");
			break;
		case "Statistiques":
			getElement("infos"+ name).innerHTML = Object.keys(jsonObj.users).filter(e => e !== "postgres").map(e => `<option value="${e}">${e}</option>`).join("\n");
			break;
		default:
			getElement("infos"+ name).innerHTML = _PARAMS.services[name].service.extensions.map(e => `<option value="${e}">${e}</option>`).join("\n");

	}
}

function editCsv(name ,elem) {
	const temp = window.prompt("Csv delimiter for " + name, elem.textContent);
	if (temp === "," || temp === ";") elem.textContent = temp; 
}

async function executeSqlValues(e) {
	wait(true);
	if (e) e.preventDefault();
	try {
		const encoded = btoa(wins.Sql.content.innerText);
		const url = `${optHost.value}/${optVersion.value}/Sql?$query=${encoded}`;
		const jsonObj = await getFetchDatas(url);
		console.log(jsonObj);		
	} catch (err) {
		notifyError("Error", err);
	} finally {
		wait(false);
	}
}
btnExport.onclick = () => {
	executeSqlValues('SELECT name, datas FROM "services"');
}

function mario(name) {
	getElement("copy"+ name).style.display = _NONE;
}

async function usersService(name ,elem) {
	const url = `${_PARAMS.services[name].linkBase}/${_PARAMS.services[name].version}/infos`;
	const jsonObj = await getFetchDatas(url);
	

}
function hideList(name) {
	console.log("coucou");
	
	// getElement("list"+ name).classList.remove("show");	
}