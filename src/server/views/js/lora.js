const pretty = new pp();
const testNull = (input) => (input.value == "<empty string>" || input.value.trim() == "" || input.value.trim()[0] == "0" || input.value.startsWith(_NONE));


/**
 * Show spinner for wating
 * @param {boolean} on 
 */
function wait(on) {
	toggleShowHide(spinner, on);
}


// DON'T REMOVE !!!!
// @start@


function hide(obj) {
	obj.style.display = _NONE;
}

function show(obj) {
	obj.style.display = "table-cell";
}

function toggleShowHide(obj, test) {
	obj.style.display = test === true ? "block" : _NONE;
}

function EnabledOrDisabled(obj, test) {
	if (obj.length == undefined) obj = [obj];
	obj.forEach(e => {
		if (test) e.removeAttribute('disabled', '');
		else e.setAttribute('disabled', '');
	});
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
	if (isObservation() || queryResultFormat.value == "graph") {
		temp.push("graph");
		temp.push("graphDatas");
	}
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


function init() {
	header("==== Init ====");
	hide(datas);
	if (isDebug) console.log(_PARAMS);
	new SplitterBar(container, first, two);
	wait(false);

	if (_PARAMS.datas) datas.json_value = _PARAMS.datas;
	queryOptions.value = _PARAMS.options;
	jsonViewer = new JSONViewer();
}

init();