// ===============================================================================
// |                                     GUI                                     |
// ===============================================================================

function toggleShowHide(obj, test) {
	obj.style.display = test === true ? "block" : _NONE;
}

function hide(obj) {
	obj.style.display = _NONE;
}

function show(obj) {
	obj.style.display = "table-cell";
}

function EnabledOrDisabled(obj, test) {
	if (obj.length == undefined) obj = [obj];
	obj.forEach(e => {
		if (test) e.removeAttribute('disabled', '');
		else e.setAttribute('disabled', '');
	});
}

/**
 * Show spinner for wating
 * @param {boolean} on 
 */
function wait(on) {
	toggleShowHide(spinner, on);
}


/**
 * Show message popup
 * @param {*} titleMess 
 * @param {*} bodyMess 
 */
function notifyError(titleMess, err) {
	new Error({
		title: titleMess,
		content: typeof err === "object" ? err.message : err
	});
}

function notifyAlert(titleMess, message) {
	new Alert({
		title: titleMess,
		content: message
	});
}

function notifyPrompt(titleMess, message, submitText, placeholderText) {
	new Prompt({
		title: titleMess,
		content: message,
		submitText,
		placeholderText
	});
}

function notifyJson(titleMess, contentJson) {
	new ViewJson({
		title: titleMess,
		content: contentJson
	});
}

function notifyConfirm(titleMess, message) {
	new Confirm({
		title: titleMess,
		content: message
	});
}