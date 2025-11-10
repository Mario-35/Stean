const SubOrNot = () => subentityOption.value !== _NONE ? subentityOption.value : entityOption.value;
const isObservation = () => entityOption.value == "Observations" || subentityOption.value == "Observations";
const isLog = () => resultFormatOption.value === "logs";

// DON'T REMOVE !!!!
// @start@

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

function tabEnabledDisabled(objName, test, testLocked) {
	const elemId = (typeof objName === "string") ? document.getElementsByName(objName)[0] : objName;
	if (testLocked=== true && _PARAMS.services[_PARAMS.decodedUrl.configName].service.options.includes("locked")) test = false;
	if (typeof(elemId) != 'undefined' && elemId != null) {
		if (test === true) elemId.removeAttribute("disabled");
		else {
			elemId.setAttribute('disabled', '');
			elemId.checked = false;
		}
	}
}

function canShowQueryButton() {
	const testNull = (input) => (input.value == "<empty string>" || input.value.trim() == "" || input.value.trim()[0] == "0" || input.value.startsWith(_NONE));
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

function setTheme(themeName) {
	localStorage.setItem('theme', themeName);
	document.documentElement.className = themeName;
}

function setProgression(nb) {
	if (nb > 0) nb = (nb * 100) / maxProg;
	if (nb === 0) {
		hide(progression);
		return;
	}3
	show(progression);
	if (nb === 0) hide(progression);
	progression.style.width = nb + "%";
	progression.innerHTML = `${String(nb).split(".")[0]}%`;
}

// Start
(function init() {
	header("==== Init ====");
	if (isDebug) console.log(_PARAMS); // them color
	if (localStorage.getItem('theme')) {
		setTheme(localStorage.getItem('theme'));
	} else {
		setTheme('dark');
	}
	hide(btnShowGeo);
	// create splitter bar
	new SplitterBar(container, first, two);
	// Entity not empty
	const tempEntity = _PARAMS.entity || "Things";
	populateSelect(entityOption, getEntityList(), tempEntity);
	const subs = getRelationsList(tempEntity);
	populateSelect(subentityOption, subs, subs.includes(_PARAMS.subentityOption) ? _PARAMS.subentityOption : _NONE, true);
	populateSelect(entityOption, Object.keys(_PARAMS._DATAS), tempEntity);
	populateSelect(services, Object.keys(_PARAMS.services), _PARAMS.decodedUrl.configName);
	populateSelect(methodOption, entityOption.value == "Loras" ? ["GET", "POST"] : _PARAMS.methods, _PARAMS.method ? _PARAMS.method : "GET");

	idOption.value = _PARAMS.decodedUrl.idStr || _PARAMS.decodedUrl.id;
	idSubOption.value = 0;

	refresh();
	optVersion.value = `${_PARAMS.decodedUrl.version}`;
	optHost.value = _PARAMS.decodedUrl.linkbase;
	if (_PARAMS.datas) jsonDatas.value = _PARAMS.datas;
	queryOptions.value = _PARAMS.options;
	if (window.location.href.includes('Query?')) decodeUrl(window.location.href);
	jsonViewer = new JSONViewer();
	setProgression(0);
	wait(false);
})();