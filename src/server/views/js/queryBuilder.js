// ===============================================================================
// |                                QueryBuilder                                 |
// ===============================================================================

class QueryBuilder {
	constructor(element, fields) {
		// Constants
		this.conditions = {
			"general": {
				"eq": "Equal to",
				"ne": "Not equal to",
				"nu": "null",
				"nn": "Notnull",
			},
			"number": {
				"gt": "Greater than",
				"lt": "Lesser than",
				"between": "Between",
			},
			"result": {
				"gt": "Greater than",
				"lt": "Lesser than",
				"between": "Between",
			},
			"date": {
				"gt": "Greater than",
				"lt": "Lesser than",
				"between": "Between",
			},
			"text": {
				"contains": "Includes",
				"notincludes": "Does not include",
				"startswith": "Starts with",
				"endswith": "Ends with",
				"regex": "Regular expression"
			},
			"closed": {
				"isoneof": "Is one of",
				"isall": "Is all",
				"notall": "Is not all",
				"notoneof": "Is not one of",
			},
		};
		this.inputTypes = {
			"singleinput": ["eq", "ne", "contains", "notincludes", "startswith", "endswith", "gt", "lt", "regex"],
			"doubleinput": ["between"],
			"select": ["isoneof", "isall", "notall", "notoneof"],
		};
		// Variables
		// @ts-ignore
		this.fields = fields;
		if (typeof element !== "string" && !(element instanceof HTMLElement)) {
			throw TypeError("Element must be a string or element");
		}
		if (typeof element === "string") {
			this.element = getElement(element);
			if (this.element === null) {
				throw Error(`Element with id ${element} could not be found`);
			}
		} else {
			this.element = element;
		}
		this.choiceElements = [];
		this.queryContainer = null;
		this.criteriumButton = null;
		this.lastCriteria = {};
		this._query = [];
		this.setupQueryContainer();
	}


	clear(element, fields) {
		const temp = document.querySelectorAll(".remove-criterium-button");
		this.fields = fields;
		temp.forEach(e => e.click());

	}
	// Getters & Setters
	get query() {
		return this._query;
	}
	set query(value) {
		this._query = value;
		this.buildFromQuery(value);
	}

	buildResult(element) {
		const criteriumContainers = element.querySelectorAll(".criterium-container");
		const internalQuery = [];
		// Process all criteria present
		criteriumContainers.forEach((criteriumContainer) => {
			const criteriumContainerValue = [];
			const criteriums = criteriumContainer.querySelectorAll(".criterium");
			// Process all conditions for this criterium
			criteriums.forEach((criteriumElement) => {
				var _a;
				let conditionValues = null;
				const criteriumValue = criteriumElement.querySelector(".criteria-select").value;
				const conditionValue = (_a = criteriumElement.querySelector(".condition-select")) === null || _a === void 0 ? void 0 : _a.value;
				const valueInputElement = criteriumElement.querySelector(".valueinput");
				let value = null;
				// Handle different input types
				if (valueInputElement.querySelector(".value-singleinput") !== null) {
					value = valueInputElement.querySelector(".value-singleinput").innerHTML;
				} else if (valueInputElement.querySelector(".value-doubleinput") !== null) {
					value = {
						first: valueInputElement.querySelector(".doubleinput-firstvalue").value,
						second: valueInputElement.querySelector(".doubleinput-secondvalue").value,
					};
				}
				conditionValues = {
					criterium: criteriumValue,
					condition: conditionValue,
					value,
				};
				criteriumContainerValue.push(conditionValues);
			});
			internalQuery.push(criteriumContainerValue);
		});
		this._query = internalQuery;
		this.element.innerText = JSON.stringify(this.query);
	}

	setupQueryContainer() {
		// Hide the element and replace it with a container for the querybuilder
		this.element.hidden = true;
		const queryContainer = document.createElement("div");
		queryContainer.classList.add("query-container");
		queryContainer.id = `query-container`;
		this.queryContainer = this.element.parentNode.insertBefore(queryContainer, this.element);
		// create "criterium container" button
		const criteriumButton = document.createElement("button");
		criteriumButton.classList.add("criterium-button");
		criteriumButton.innerText = "+";
		criteriumButton.addEventListener("click", (e) => {
			e.preventDefault();
			this.addNewCriterium(this.addNewCriteriumContainer());
		});
		this.criteriumButton = queryContainer.appendChild(criteriumButton);
		// set eventlistener to rebuild result when something happens
		this.queryContainer.addEventListener("focusout", () => {
			this.buildResult(this.queryContainer);
			this.element.innerText = JSON.stringify(this.query);
		});
		// setup builder using existing result
		if (this.element.innerText !== "" && this.element.innerText !== undefined) {
			this.buildFromQuery(JSON.parse(this.element.innerText));
		}
		// run build result once
		this.buildResult(this.queryContainer);
	}

	addNewCriteriumContainer() {
		const criteriumContainer = document.createElement("div");
		criteriumContainer.classList.add("criterium-container");
		criteriumContainer.id = `criterium-container-${this.makeid(10)}`;
		if (this.queryContainer.querySelector(".criterium-container") !== null) {
			const linkElement = document.createElement("p");
			linkElement.classList.add("criteria-link");
			linkElement.innerText = "OR";
			this.queryContainer.insertBefore(linkElement, this.criteriumButton);
		}
		this.queryContainer.insertBefore(criteriumContainer, this.criteriumButton);
		return criteriumContainer;
	}

	addNewCriterium(criteriumContainer, criterium = null) {
		// create criterium
		// create criterium select
		const criteriumElement = document.createElement("div");
		criteriumElement.classList.add("criterium");
		criteriumElement.id = `criterium-${this.makeid(10)}`;
		// gather criterium options
		const options = [];
		this.fields.forEach((field) => {
			options.push(field.label === undefined || field.label === null ? field.value : field.label);
		});
		// build choices dropdown to select criterium
		const choiceContainer = document.createElement("div");
		choiceContainer.classList.add("criteria-choice-container");
		criteriumElement.appendChild(choiceContainer);
		const choiceSelect = document.createElement("select");
		choiceSelect.classList.add("criteria-select", "patrom-select");
		choiceContainer.appendChild(choiceSelect);
		// add listener to change events of criterium selector
		choiceSelect.addEventListener("change", (e) => {
			this.addConditionSelector(criteriumElement, choiceSelect.value);
		});
		// create choices dropdown
		// @ts-ignore
		options.forEach((key) => {
			const newOption = new Option(key, key);
			choiceSelect.add(newOption);
		});
		// add create AND button
		if (criteriumContainer.querySelector(".add-condition-button") === null) {
			criteriumContainer.appendChild(criteriumElement);
			const addConditionButton = document.createElement("button");
			addConditionButton.classList.add("add-condition-button", "patrom-button");
			addConditionButton.innerText = "+ add 'AND' condition";
			addConditionButton.addEventListener("click", (e) => {
				e.preventDefault();
				this.addNewCriterium(criteriumContainer);
			});
			criteriumContainer.appendChild(addConditionButton);
		} else {
			criteriumContainer.insertBefore(criteriumElement, criteriumContainer.querySelector(".add-condition-button"));
			const conditionsLink = document.createElement("p");
			conditionsLink.classList.add("conditions-link");
			conditionsLink.innerHTML = "AND";
			criteriumContainer.insertBefore(conditionsLink, criteriumElement);
		}
		// add criterium value selector to criterium
		if (criterium === null) {
			this.addConditionSelector(criteriumElement, choiceSelect.value);
		}
		// else {
		//     choice.setChoiceByValue(criterium.criterium);
		//     this.addConditionSelector(criteriumElement, criterium.criterium, criterium.value);
		// }
		this.addRemoveCriteriumButton(criteriumElement);
		this.buildResult(this.queryContainer);
	}

	addConditionSelector(criteriumElement, criterium, selected = null) {
		// remove old condition selector
		const oldConditionSelector = criteriumElement.querySelector(".condition-container");
		if (oldConditionSelector !== null) {
			oldConditionSelector.remove();
		}
		// create value selector container
		const conditionElement = document.createElement("div");
		conditionElement.classList.add("condition-container");
		conditionElement.id = `condition-container-${this.makeid(10)}`;
		const conditionSelect = document.createElement("select");
		conditionSelect.classList.add("condition-select", "patrom-select");
		conditionElement.appendChild(conditionSelect);
		// gather criterium options
		const criteriumType = this.fields.find((field) => field.value === criterium).type;
		let conditionOptions = Object.assign({}, this.conditions[criteriumType]);
		// Do not include the isEqual and isne options for closed questions
		if (criteriumType !== "closed") {
			conditionOptions = Object.assign(conditionOptions, this.conditions["general"]);
		}
		Object.entries(conditionOptions).forEach(([key, value]) => {
			const newOption = new Option(value, key);
			if (!Array.from(conditionSelect.options).find((option) => option.value === key)) {
				conditionSelect.add(newOption);
			}
		});
		if (criteriumElement.querySelector(".valueinput") !== null) {
			criteriumElement.insertBefore(conditionElement, criteriumElement.querySelector(".valueinput"));
		} else {
			criteriumElement.appendChild(conditionElement);
		}
		// add listener to change events of condition selector
		conditionSelect.addEventListener("change", (e) => {
			this.addValueInput(criteriumElement);
		});
		if (selected) {
			this.addValueInput(criteriumElement, selected.value);
			conditionSelect.value = selected.condition;
		} else {
			this.addValueInput(criteriumElement);
		}
	}

	addValueInput(criteriumElement, value = null) {
		const condition = criteriumElement.querySelector(".condition-select");
		if (criteriumElement.querySelector(".valueinput") !== null) {
			criteriumElement.querySelector(".valueinput").remove();
		}
		const valueInputContainer = document.createElement("div");
		valueInputContainer.classList.add("valueinput");
		criteriumElement.insertBefore(valueInputContainer, criteriumElement.querySelector(".remove-criterium-button"));
		if (this.inputTypes["singleinput"].includes(condition.value)) {
			// Everything is set up to create a new input element
			const singleValueInput = document.createElement("span");
			singleValueInput['role'] = "text";
			singleValueInput.contentEditable = "true";
			singleValueInput.classList.add("value-singleinput", "patrom-text-input");
			singleValueInput.classList.add("textarea");
			valueInputContainer.appendChild(singleValueInput);
			singleValueInput.focus();
			if (value !== null) {
				singleValueInput.textContent = value;
			}
		} else if (this.inputTypes["doubleinput"].includes(condition.value)) {
			// Everything is set up to create a new input element
			const doubleInputContainer = document.createElement("div");
			doubleInputContainer.classList.add("value-doubleinput");
			const firstInput = document.createElement("input");
			firstInput.type = "text";
			firstInput.classList.add("doubleinput-firstvalue", "patrom-text-input");
			doubleInputContainer.appendChild(firstInput);
			if (value !== null) {
				firstInput.value = value.first;
			}
			const separator = document.createElement("p");
			separator.innerHTML = "and";
			doubleInputContainer.appendChild(separator);
			const secondInput = document.createElement("input");
			secondInput.type = "text";
			secondInput.classList.add("doubleinput-secondvalue", "patrom-text-input");
			doubleInputContainer.appendChild(secondInput);
			if (value !== null) {
				secondInput.value = value.second;
			}
			valueInputContainer.appendChild(doubleInputContainer);
			firstInput.focus();
		} else if (this.inputTypes["select"].includes(condition.value)) {
			const conditionSelect = document.createElement("select");
			conditionSelect.multiple = true;
			conditionSelect.classList.add("value-select", "patrom-select");
			valueInputContainer.appendChild(conditionSelect);
			const criterium = criteriumElement.querySelector(".criteria-select").value;
			const field = this.fields.find((singleField) => singleField.value === criterium);
			// @ts-ignore
			let options = [];
			if (field !== undefined) {
				options = field.values.map((singleField) => {
					if (typeof value === "string") {
						return {
							label: this.capitalizeFirstLetter(singleField),
							value: singleField,
						};
					} else {
						return {
							label: singleField.label,
							value: singleField.value,
						};
					}
				});
			}
			// @ts-ignore
			// const choices = new Choices(conditionSelect, {
			//     choices: options,
			//     allowHTML: true,
			//     itemSelectText: '',
			// });
			// if (value !== null) {
			//     if (!(value instanceof Array)) {
			//         value = [value];
			//     }
			//     choices.setChoices(value);
			//     choices.setChoiceByValue(value);
			// }
			// this.choiceElements[criteriumElement.id] = choices;
		}
	}

	addRemoveCriteriumButton(criteriumElement) {
		const removeCriteriumButton = document.createElement("button");
		removeCriteriumButton.classList.add("remove-criterium-button", "patrom-button", "patrom-button--danger");
		removeCriteriumButton.innerHTML = "✕";
		criteriumElement.appendChild(removeCriteriumButton);
		removeCriteriumButton.addEventListener("click", (e) => {
			e.preventDefault();
			const linkElement = criteriumElement.previousElementSibling;
			if (linkElement !== null && linkElement.classList.contains("criteria-link")) {
				linkElement.remove();
			}
			const siblings = criteriumElement.parentElement.children;
			// If this is the last element, remove the entire element, otherwise remove only this one
			if (siblings.length === 2) {
				if (criteriumElement.parentElement.previousElementSibling !== null) {
					// remove the OR text
					criteriumElement.parentElement.previousElementSibling.remove();
				} else if (criteriumElement.parentElement.nextElementSibling.classList.contains("criteria-link")) {
					// remove the OR text if it is first element
					criteriumElement.parentElement.nextElementSibling.remove();
				}
				// remove criterium container
				criteriumElement.parentElement.remove();
			} else {
				if (criteriumElement.previousSibling !== null) {
					// remove the AND text that links the criteriums
					criteriumElement.previousSibling.remove();
				} else {
					// remove the AND text if it is the first element
					criteriumElement.nextSibling.remove();
				}
				// remove criterium container
				criteriumElement.remove();
			}
			this.buildResult(this.queryContainer);
		});
	}

	buildFromQuery(query) {
		query.forEach((criteriumContainer) => {
			const container = this.addNewCriteriumContainer();
			criteriumContainer.forEach((criterium) => {
				this.addNewCriterium(container, criterium);
			});
		});
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	formatName(name) {
		return this.capitalizeFirstLetter(name).replace("_", " ");
	}

	makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() *
				charactersLength));
		}
		return result;
	}
}

function updateBuilder() {
	const ent = getEntityName(SubOrNot());
	if (!ent) return;
	const columns = getColumnsList(ent);
	const fields = [];
	columns.forEach(e => {
		fields.push({
			"value": e,
			"label": e,
			"type": _PARAMS._DATAS[ent].columns[e] && _PARAMS._DATAS[ent].columns[e].type ? _PARAMS._DATAS[ent].columns[e].type : "text",
		});
	});
	if (builder) builder.clear("query-builder", fields);
	else builder = new QueryBuilder("query-builder", fields);
}