// ===============================================================================
// |                                   HELPERS                                   |
// ===============================================================================

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

const getVersion = (input) => input.replace(/[//]+/g, '/').split('/').filter((value) => value.match(/v{1}\d\.\d/g))[0];

function header(message, infos) {
	if (isDebug) console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ${message} ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
	if (isDebug && infos) typeof infos === "object" ? console.log(infos) : console.log(`==>${infos}<==`);
}

function ended(message) {
	if (isDebug) console.log(`====[END]=======> ${message}`);
}

function message(message) {
	if (isDebug && message) typeof message === "object" ? console.log(message) : console.log(`==>${message}<==`);
}

// Extract only digit to get id (from element id)
function getId(input) {
	var numb = input.match(/\d/g);
	return numb.join("");
}

// show spinner
function wait(on) {
	toggleShowHide(spinner, on);
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

const getElement = (input) => {
	const elem = (typeof input === "string") ? document.getElementById(input) : input;
	return (typeof(elem) != 'undefined' && elem != null) ? elem : undefined;
};

function getEntityName(search) {
	const testString = search
		.match(/[a-zA-Z_]/g)
		?.join("")
		.trim();

	return testString ?
		_PARAMS._DATAS.hasOwnProperty(testString) ?
		testString :
		Object.keys(_PARAMS._DATAS).filter((elem) => _PARAMS._DATAS[elem].table == testString.toLowerCase() || _PARAMS._DATAS[elem].singular == testString)[0] :
		undefined;
}

async function getFetchDatas(url, format) {
	header("getFetchDatas", url);
	const response = await fetch(encodeURI(url), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return format && ["csv", "txt", "sql"].includes(format) || url.endsWith("$value") ?
		await response.text() :
		await response.json();
}

function LoadDatas(source, lang) {
	try {
		const element = getElement(datas);
		if (element) highlightElement(source, lang);
	} catch (err) {
		notifyError("Error", err);
	} finally {
		buttonGo();
	}
}

function beautifyDatas(element, source, lang) {
	try {
		switch (lang) {
			case "sql":
				source = steanPrism.highlight(source, steanPrism.languages.Sql, 'sql');
				break;
			case "js":
				source = steanPrism.highlight(source, steanPrism.languages.javascript, 'javascript');
				break;
			default:
				source = steanPrism.highlight(source, steanPrism.languages.json, 'json');
				break;
		}
		if (element) element.innerHTML = source;
	} catch (err) {
		console.log(err);
		notifyError("Error", err);
	}
}

async function executeSqlValues(e) {
	wait(true);
	if (e) e.preventDefault();
	try {
		const encoded = btoa(wins.Sql.content.innerText);
		const url = `${optHost.value}/${optVersion.value}/Sql?$query=${encoded}`;
		const jsonObj = await getFetchDatas(url);
		jsonWindow(jsonObj, url);
	} catch (err) {
		notifyError("Error", err);
	} finally {
		wait(false);
	}
}

// epdate json datas and test valid
const setJSON = (input) => {
	if (jsonDatas.value != "" || input) {
		jsonDatas.value = JSON.stringify(input || jsonDatas.value , undefined, 4);
		jsonDatas.classList.remove("valid");
		jsonDatas.classList.remove("notValid");
		try {
			jsonDatas.value = JSON.parse(jsonDatas.value);
			jsonDatas.classList.add("valid");

		} catch (error) {
			jsonDatas.classList.add("notValid");
		}
	}
};