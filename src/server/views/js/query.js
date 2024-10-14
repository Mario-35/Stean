const pretty = new pp();
const SubOrNot = () => _PARAMS.admin === false && subentityOption.value !== _NONE ? subentityOption.value : entityOption.value;
const isObservation = () => entityOption.value == "Observations" || subentityOption.value == "Observations";
const isLog = () => resultFormatOption.value === "logs";

const testNull = (input) => (input.value == "<empty string>" || input.value.trim() == "" || input.value.trim()[0] == "0" || input.value.startsWith(_NONE));


// DON'T REMOVE !!!!
// @start@

function setChecked(objName, state) {
	const elemId = getElement(objName);
	if (elemId) elemId.checked = state;														
}

function getIfChecked(objName) {
	const elemId = getElement(objName);
	if (elemId) return (elemId.checked === true);
	return false;
}

function getIfId(objName) {
	const index = Number(nb.value);
	return (index > 0);
}

function getDefaultValue(obj, list) {
	return obj.value != "" && list.includes(obj.value) ? obj.value : list[0];
}

function getFormatOptions() {
	let temp = importFile ? ["json"] : ["json", "csv", "txt", "dataArray", "sql"];
	if (isObservation() || resultFormatOption.value == "graph") {
		temp.push("graph");
		temp.push("graphDatas");
	}
	if (entityOption.value === "Logs") temp.push("logs");
	if (entityOption.value === "Locations" || entityOption.value === "FeaturesOfInterest") temp.push("GeoJSON");
	return temp;
}

function tabEnabledDisabled(objName, test) {
	const elemId = (typeof objName === "string") ? document.getElementsByName(objName)[0] : objName;
	if (typeof(elemId) != 'undefined' && elemId != null) {
		if (test === true) elemId.removeAttribute("disabled");
		else {
			elemId.setAttribute('disabled', '');
			elemId.checked = false;
		}
	}
}




function canShowQueryButton() {
	EnabledOrDisabled([go, btnShowLinks], (!testNull(subentityOption) && testNull(idOption)) ? false : true);
}

// ===============================================================================
// |                                  GO Button                                  |
// ===============================================================================

function buttonGo() {
	if (importFile === true) {
		hide(go);
		show(submit);
	} else {
		show(go);
		canShowQueryButton();
		hide(submit);
	}
}

async function editDataClicked(id, _PARAMS) {
	const name = _PARAMS.seriesName;
	const when = _PARAMS.name;
	const myUrl = `${optHost.value}/${optVersion.value}/Observations(${id})`;
	let getEditData = await fetch(myUrl, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const editData = await getEditData.json();

	new Prompt({
		title: `Editing  ${name}`,
		submitText: "Valid",
		content: `date : ${when}`,
		placeholderText: (typeof editData.result === "object") ? `${editData.result[name]}` : `${editData.result}`,
	});
}

// ===============================================================================
// |                                    OPTIONS                                  |
// ===============================================================================

function createOptionsLine() {
	const temp = [];
	for (var key in listOptions) {
		temp.push("$" + key + "=" + listOptions[key]);
	}
	return temp.join("&");
}

function ToggleOption(test, key, value, deleteFalse) {
	if (test) addOption(key, value, deleteFalse);
	else delete listOptions[key];
}

var addOption = function(key, value, deleteFalse) {
	if ((deleteFalse && value.toUpperCase() === deleteFalse) || !value || value === "" || value === "<empty string>")
		delete listOptions[key];
	else listOptions[key] = value;
	queryOptions.value = createOptionsLine();
};

var deleteOption = function(key) {
	delete listOptions[key];
	queryOptions.value = createOptionsLine();
};

function clear() {
	entityOption.value = _NONE;
	subentityOption.value = _NONE;
	topOption.value = 0;
	skipOption.value = 0;
	idOption.value = 0;
	idSubOption.value = 0;
	resultFormatOption.value = "JSON";
	methodOption.value = "GET";
}

function init() {
	header("==== Init ====");
	hide(datas);
	hide(btnShowGeo);
	isAdmin = _PARAMS.decodedUrl.service === "admin";
	if (isDebug) console.log(_PARAMS);
	new SplitterBar(container, first, two);
	wait(false);
	const tempEntity = _PARAMS.entity ? _PARAMS.entity : isAdmin === true ? "Configs" : "Things";	
	populateSelect(entityOption, getEntityList(), tempEntity);
	const subs = getRelationsList(tempEntity);
	header("==== ICI ====");
	populateSelect(subentityOption, subs, subs.includes(_PARAMS.subentityOption) ? _PARAMS.subentityOption : _NONE, true);

	populateSelect(entityOption, Object.keys(_PARAMS._DATAS), tempEntity);
	populateSelect(services, Object.keys(_PARAMS.services), _PARAMS.decodedUrl.root.split("/").pop());

	populateSelect(methodOption, entityOption.value == "Loras" ? ["GET", "POST"] : _PARAMS.methods, _PARAMS.method ? _PARAMS.method : "GET");
	idOption.value = _PARAMS.decodedUrl.idStr | _PARAMS.decodedUrl.id;
	idSubOption.value = 0;

	refresh();
	optVersion.value = `${_PARAMS.decodedUrl.version}`;
	optHost.value = _PARAMS.decodedUrl.linkbase;
	if (_PARAMS.datas) datas.json_value = _PARAMS.datas;
	queryOptions.value = _PARAMS.options;
	console.log(window.location.href);
	if (window.location.href.includes('Query?')) decodeUrl(window.location.href);
	jsonViewer = new JSONViewer();
}
init();



