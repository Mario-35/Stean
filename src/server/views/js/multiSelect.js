  /**
   * 
   * @param {*} obj HTML object to fill
   * @param {*} list list of items
   * @param {*} defValue default value
   * @param {*} addNone add none at list of th list
   */
  function populateSelect(obj, list, defValue, addNone) {
  	while (obj.firstChild) {
  		obj.removeChild(obj.lastChild);
  	}
  	obj.options.length = 0;
  	if (list) {
  		const uniklist = [...new Set(list)];
  		if (addNone) uniklist.unshift("none");
  		uniklist.forEach((element) => {
  			obj.add(new Option(element));
  		});
  		obj.selectedIndex = uniklist.indexOf(defValue);
  	}
  }


  /**
   * 
   * @param {*} obj object to fill
   * @param {*} list list of items
   */
  function populateMultiSelect(obj, list, selected) {
  	const element = getElement(obj);
  	if (element) multiSelects[element.id].loadSourceArray(list, selected);
  }