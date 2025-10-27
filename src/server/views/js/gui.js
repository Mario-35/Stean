/**
 * Gui.
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/**
 * Show / Hide object
 * @param {any} obj // object to Show / Hide
 * @param {boolean} test  
 */
function toggleShowHide(obj, test) {
	obj.style.display = test === true ? "initial" : _NONE;
}

/**
 * Hide object
 * @param {any} obj // object to Hide
 */
function hide(obj) {
	obj.style.display = _NONE;
}

/**
 * Show object
 * @param {any} obj // object to Show
 */
function show(obj) {
	// obj.style.display = "table-cell";
	obj.style.display = "initial";
}

/**
 * enabled / disabled object
 * @param {any} obj // object to enabled / disabled
 * @param {boolean} test  
 */
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
 * Show Error message popup
 * @param {*} titleMess 
 * @param {*} err 
 */
function notifyError(titleMess, err) {
	new Error({
		title: titleMess,
		content: typeof err === "object" ? err.message : err
	});
}

/**
 * Show message popup
 * @param {*} titleMess 
 * @param {*} message 
 */
function notifyOk(titleMess, message) {
	new Ok({
		title: titleMess,
		content: message
	});
}

/**
 * Show message popup
 * @param {*} titleMess 
 * @param {*} message 
 */
function notifyAlert(titleMess, message) {
	new Alert({
		title: titleMess,
		content: message
	});
}

/**
 * Show message prompt popup
 * @param {*} titleMess 
 * @param {*} message 
 * @param {*} submitText 
 * @param {*} placeholderText 
 */
function notifyPrompt(titleMess, message, submitText, placeholderText) {
	new Prompt({
		title: titleMess,
		content: message,
		submitText,
		placeholderText
	});
}

/**
 * Show message Json format
 * @param {*} titleMess 
 * @param {*} contentJson 
 */
function notifyJson(titleMess, contentJson) {
	new ViewJson({
		title: titleMess,
		content: contentJson
	});
}

/**
 * Show message cosfirmation
 * @param {*} titleMess 
 * @param {*} message 
 */
function notifyConfirm(titleMess, message) {
	new Confirm({
		title: titleMess,
		content: message
	});
}