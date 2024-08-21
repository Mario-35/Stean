// ===============================================================================
// |                                     CSV                                     |
// ===============================================================================
/**
 * 
 * @param {*} input csv Array Input
 * @param {*} separator seprator
 */

buildTableWithCsv = (input, separator, container) => {
	var tableArea = getElement(container);
	var allRows = input.split(/\r?\n|\r/).filter((row) => row !== "");

	var old = getElement("tablewrapper");
	if (old) tableArea.removeChild(old);

	var _wrapper = document.createElement("div");
	_wrapper.setAttribute("id", "tablewrapper");
	_wrapper.classList.add("patrom-table-container");

	var _table = document.createElement("table");
	_table.setAttribute("id", "csv");
	var _thead = document.createElement("thead");
	var _tbody = document.createElement("tbody");

	// _tr = document.createElement(singleRow === 0 ? "thead" : "tr"); 
	for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
		var _tr = document.createElement("tr");
		const rowCells = allRows[singleRow].split(separator);
		for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
			const _td = document.createElement(singleRow === 0 ? "th" : "td");
			const text = document.createTextNode(rowCells[rowCell].replace(/\"/g, ""));
			_td.appendChild(text);
			_tr.appendChild(_td);
		}
		if (singleRow === 0) _thead.appendChild(_tr);
		else _tbody.appendChild(_tr);
	}
	_table.appendChild(_thead);
	_table.appendChild(_tbody);
	_wrapper.appendChild(_table);
	tableArea.appendChild(_wrapper);
};