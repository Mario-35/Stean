var themes = {
	"common": {
		"font-size": "14px",
		"font-size-half": "7px",
		"font-size-2": "12px",
		"font-size+2": "16px",
		"btn-gray-color": "#eceff1",
		"btn-gray-border": "#546e7a",
		"btn-gray-hover-border": "#78909c",
		"btn-gray-disabled-background": "#b0bec5",
		"btn-gray-disabled-border": "#90a4ae",
		"btn-gray-background": "#78909c",
		"btn-gray-hover-color": "#fff",
		"btn-gray-hover-background": "#90a4ae",
		"btn-gray-active-border": "#546e7a",
		"btn-gray-active-color": "#cfd8dc",
		"btn-gray-active-background": "#546e7a",
		"btn-primary-border": "#1e88e5",
		"btn-primary-hover-border": "#42a5f5",
		"btn-primary-disabled-background": "#90caf9",
		"btn-primary-disabled-border": "#64b5f6",
		"btn-primary-color": "#e3f2fd",
		"btn-primary-background": "#42a5f5",
		"btn-primary-hover-color": "#fff",
		"btn-primary-hover-background": "#64b5f6",
		"btn-primary-active-border": "#1e88e5",
		"btn-primary-active-color": "#bbdefb",
		"btn-primary-active-background": "#1e88e5",
		"btn-success-border": "#43A047",
		"btn-success-hover-border": "#66BB6A",
		"btn-success-disabled-background": "#A5D6A7",
		"btn-success-disabled-border": "#81C784",
		"btn-success-color": "#E8F5E9",
		"btn-success-background": "#66BB6A",
		"btn-success-hover-color": "#fff",
		"btn-success-hover-background": "#81C784",
		"btn-success-active-border": "#43A047",
		"btn-success-active-color": "#C8E6C9",
		"btn-success-active-background": "#43A047",
		"btn-info-border": "#00ACC1",
		"btn-info-hover-border": "#26C6DA",
		"btn-info-disabled-background": "#80DEEA",
		"btn-info-disabled-border": "#4DD0E1",
		"btn-info-color": "#E0F7FA",
		"btn-info-background": "#26C6DA",
		"btn-info-hover-color": "#fff",
		"btn-info-hover-background": "#4DD0E1",
		"btn-info-active-border": "#00ACC1",
		"btn-info-active-color": "#B2EBF2",
		"btn-info-active-background": "#00ACC1",
		"btn-warning-border": "#FB8C00",
		"btn-warning-hover-border": "#FFA726",
		"btn-warning-disabled-background": "#FFCC80",
		"btn-warning-disabled-border": "#FFB74D",
		"btn-warning-color": "#FFF3E0",
		"btn-warning-background": "#FFA726",
		"btn-warning-hover-color": "#fff",
		"btn-warning-hover-background": "#FFB74D",
		"btn-warning-active-border": "#FB8C00",
		"btn-warning-active-color": "#FFE0B2",
		"btn-warning-active-background": "#FB8C00",
		"btn-danger-border": "#F4511E",
		"btn-danger-hover-border": "#FF7043",
		"btn-danger-disabled-background": "#FFAB91",
		"btn-danger-disabled-border": "#FF8A65",
		"btn-danger-color": "#FBE9E7",
		"btn-danger-background": "#FF7043",
		"btn-danger-hover-color": "#fff",
		"btn-danger-hover-background": "#FF8A65",
		"btn-danger-active-border": "#F4511E",
		"btn-danger-active-color": "#FFCCBC",
		"btn-danger-active-background": "#F4511E",
	},
	"light": {
		"text-color": "#000",
		"button-border": "#cccccc",
		"content-color": "#454545",
		"button-hover": "#208103",
		"select-box-shadow": "#949696",
		"select-border-top": "#fff",
		"body-background": "#dfe2e2",
		"background-color": "#e5e9e8",
		"background-color-disabled": "#ffe1e1",
		"background-color-hover": "#f9c62a70",
		"content-background": "#e1e6e6",
		"border-focus": "#0036ff",
		"background-highlight": "#288edf",
		"background-highlight-hover": "#4ca1e4",
		"select-background": "#DDE1E1",
		"select-border-top": "#fff",
		"input-background": "#fff",
		"invalid-colour": "#ec514e",
		"color-active": "#0772c3",
		"color-hover": "#29a0fa",
		"json-number": "#073aff",
		"json-code": "#8e08a0",
		"json-url": "#DD2E2E",
		"json-string": "#116408",
		"json-date": "#CB7500"
	},
	"dark": {
		"text-color": "#fff",
		"button-border": "#6b6767",
		"select-box-shadow": "#303233",
		"select-border-top": "#666767",
		"content-color": "#c6c8c8",
		"button-hover": "#208103",
		"body-background": "#4b4d4e",
		"background-color": "#595b5b",
		"background-color-odd": "#7e8080",
		"background-color-disabled": "#685757",
		"background-color-hover": "#288edf",
		"content-background": "#444949",
		"border-focus": "#0036ff",
		"background-highlight": "#288edf",
		"background-highlight-hover": "#4ca1e4",
		"select-background": "#595B5B",
		"input-background": "#454646",
		"invalid-colour": "#ec514e",
		"color-active": "#1e7dc8",
		"color-hover": "#4ca1e4",
		"json-number": "#0cbde6",
		"json-code": "#de9ae7",
		"json-url": "#F0A1A1",
		"json-string": "#B7E4B2",
		"json-date": "#CB7500"

	}
};

 function setTheme(themeName) {
	localStorage.setItem('theme', themeName);
	document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
	if (localStorage.getItem('theme') === 'theme-dark') {
		setTheme('theme-light');
	} else {
		setTheme('theme-dark');
	}
}

fileone.addEventListener("change", function(e) {
	var fileName = "";
	try {
		if (this.files && this.files.length > 1)
			fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
		else
			fileName = e.target.value.split("\\").pop();

		if (fileName) {
			fileonelabel.querySelector("span").innerHTML = fileName;
		} else {
			fileonelabel.innerHTML = labelVal;
		}
	} catch (err) {
		notifyError("Error", err);
	} finally {
		buttonGo();
	}
});

// Immediately invoked function to set the theme on initial load
(function () {
	if (localStorage.getItem('theme') === 'theme-dark') {
		setTheme('theme-dark');
		document.getElementById('theme').checked = false;
	} else {
		setTheme('theme-light');
	  document.getElementById('theme').checked = true;
	}
})();

class PatromMultiSelect {
	constructor(select) {
		this.select = select;
		this.select.multiple = true;
		this.select.style.display = 'none';
		this.settings = this._getSettings(select);
		this.select.datas = {};
		var prefix = 'patrom-';
		this.class = {
			prefix: prefix + 'multi-select',
			rootContainer: prefix + 'multi-select-container',
			logger: 'logger',
			list: prefix + 'multi-select'
		};
		this.data = {};
		this.create();
		this.log();
	}
	_getSettings(element) {
		var settings = {};
		var defaultSettings = {
			width: 'auto',
			height: themes.common["font-size+2"],
			appendTo: '__auto__',
			className: '',
			placeholder: element.placeholder || '',
			selectAll: element.attributes["selectall"] ? true : false,
			orderby: element.attributes["orderby"] ? true : false,
		};

		var defaultSettingsKeys = Object.keys(defaultSettings);
		var i, attr, defaultSettingsKeyslen = defaultSettingsKeys.length;
		for (i = 0; i < defaultSettingsKeyslen; i++) {
			attr = defaultSettingsKeys[i];

			if (attr && settings[attr] !== undefined) continue;
			settings[attr] = defaultSettings[attr];
		}
		return settings;
	}
	_setpixel(value) {
		if (!value) {
			return;
		}
		// Here value has string return the value, otherwise px will be added.
		return isNaN(value) ? value : value + 'px';
	}
	_getTarget(appendTo) {
		var target;
		if (appendTo == '__auto__' && this.select.parentElement) {
			target = this.select.parentElement;
		} else {
			target = document.querySelector(this.settings.appendTo);
		}
		return target;
	}
	create() {
		var self = this;
		var addTarget = this._getTarget(this.settings.appendTo);
		var div = document.createElement('DIV');
		div.className = this.class.rootContainer;
		div.classList.add("full");
		div.id = this.class.prefix + (document.querySelectorAll('.' + this.class.rootContainer).length + 1);
		this._getThemeElements(div);
		// Creating common elements for both themes here.
		this._getCommonElems(div);

		this.container = div;
		if (addTarget.contains(this.select)) {
			addTarget.insertBefore(div, this.select);
		} else {
			addTarget.appendChild(div);
		}

		// add event
		document.addEventListener('click', function(event) {
			var theme2Specific = event.target.className === 'closeBtn';
			self.list.classList.add("scrollbar-width-thin");
			if (self.container.contains(event.target) || theme2Specific) {
				return;
			}
			self.list.classList.add('hidden');
			self.logger.classList.remove('open');
		});

	}
	setValue(selected = [], trigger) {
		if (!selected.length) return;

		var selectChildrenLen = this.select.children.length,
			selectedLen = selected.length,
			selectChild, listChild, selectedIndex, list;
		list = this._getSearchableLi(this.list);
		var i, j;

		for (i = 0; i < selectChildrenLen; i++) {
			for (j = 0; j < selected.length; j++) {
				selectChild = this.select.children[i];
				selectedIndex = selected[j];

				// TODO: need to change != to !==.
				if (selectChild.value != selectedIndex) continue;

				selectChild.selected = true;
				listChild = list[i];
				if (this.settings.orderby === true) selectChild.setAttribute("orderBy", listChild.children[0].getAttribute("order"));
				listChild.children[0].checked = true;
				listChild.classList.add('active');
				this.data[i] = true;
				//onchange trigger
				if (trigger) {
					if (typeof this.settings.onChange == 'function') {
						this.settings.onChange(true, selectChild.value, this);
					}
				}
				break;
			}
		}
		this.log();
	}
	removeValue(selected = [], trigger = false) {
		if (!selected.length) return;

		var selectChildrenLen = this.select.children.length,
			selectedLen = selected.length,
			selectChild, listChild, selectedIndex, list;
		list = this._getSearchableLi(this.list);
		var i, j;

		for (i = 0; i < selectChildrenLen; i++) {
			for (j = 0; j < selectedLen; j++) {
				selectChild = this.select.children[i];
				selectedIndex = selected[j];
				if (selectChild.value != selectedIndex) continue;

				selectChild.selected = false;
				listChild = list[i];
				listChild.children[0].checked = false;
				listChild.classList.remove('active');
				this.data[i] = false;
				//onchange trigger
				if (trigger) {
					if (typeof this.settings.onChange == 'function') {
						this.settings.onChange(false, selectChild.value, this);
					}
				}
				break;
			}
		}
		this.log();
	}
	log() {
      var self = this;
      var logger = self.logger;
      logger.innerHTML = '';
  
      var i, option = '',
        selectedOptions = '',
        selectedLabels, closeBtn;
      var loop_length = this.select.children.length;
  
      for (i = 0; i < loop_length; i++) {
        option = this.select.children[i];
        if (!this.data[i]) {
          continue;
        }
  
        selectedLabels = document.createElement('label');
        selectedLabels.className = 'selectedLabels';
        selectedLabels.innerHTML = option.innerText;
  
        closeBtn = document.createElement('span');
        closeBtn.className = 'closeBtn';
        closeBtn.innerHTML = '&#10005;';
        closeBtn.dataset.id = option.value;
  
        closeBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          self.removeValue([event.target.dataset.id], true);
        });
  
        selectedLabels.appendChild(closeBtn);
        logger.appendChild(selectedLabels);
  
        selectedOptions += selectedOptions ? ',' + option.innerText : option.innerText;
      }
      this.logger.dataset.value = selectedOptions;
    
	}
	getData() {
		var data = [];
		var i, selectChildrenLen = this.select.children.length;		
		for (i = 0; i < selectChildrenLen; i++) {
			if (!this.select.children[i].selected) {
				continue;
			}
			data.push(this.settings.orderby === true ? `${this.select.children[i].value}${this.select.children[i].attributes && this.select.children[i].attributes.orderby && this.select.children[i].attributes.orderby.value ? ' ' + this.select.children[i].attributes.orderby.value : ''}` : this.select.children[i].value);
		}

		return data;
	}
	selectAll(isSetValue = false) {
		var data = [];
		var i, selectedChildren, selectChildrenLen;
		selectedChildren = this.list.querySelectorAll('label:not(.hidden) li:not(.ignore) input');
		selectChildrenLen = selectedChildren.length;

		for (i = 0; i < selectChildrenLen; i++) {
			data.push(selectedChildren[i].value);
		}

		isSetValue ? this.setValue(data) : this.removeValue(data);
		//callback
		if (typeof this.settings.afterSelectAll == 'function') {
			this.settings.afterSelectAll(isSetValue, data, this);
		}
	}
	loadSourceArray(data = []) {
		if (data.length) {
			this.select.innerHTML = '';
			var i, dataLen = data.length,
				option, datum;

			for (i = 0; i < dataLen; i++) {
				option = document.createElement('OPTION');
				option.value = data[i];
				option.innerHTML = data[i];
				option.selected = false;
				this.select.appendChild(option);
			}
			this.reload();
		}
	}
	loadSource(data = []) {
		if (data.length) {
			this.select.innerHTML = '';
			var i, dataLen = data.length,
				option, datum;

			for (i = 0; i < dataLen; i++) {
				datum = data[i];
				option = document.createElement('OPTION');
				option.value = datum.value;
				option.innerHTML = datum.caption;
				option.selected = datum.selected;
				this.select.appendChild(option);
			}
			this.reload();
		}
	}
	getSource() {
		var data = [],
			children = this.select.children;
		var childrenLen = children.length,
			i, child;

		for (i = 0; i < childrenLen; i++) {
			child = children[i];
			data.push({
				value: child.value,
				caption: child.innerText,
				selected: child.selected
			});
		}
		return data;
	}
	reload() {
		this.container.remove();
		this.create();
	}
	_showAllOptions() {
		if (this.list.classList.contains('hidden')) {
			this.list.classList.remove('hidden');
		}
		var options = this._getSearchableLi(this.list);

		var i, optionsLen = options.length;
		for (i = 0; i < optionsLen; i++) {
			options[i].parentElement.classList.remove('hidden');
		}

	}
	_createButon(name) {
		var btn = document.createElement("button");
		btn.type = "button";
		btn.classList.add("buttonMini-" + name);
		btn.innerHTML = name;
		return btn;
	}

	_getCommonElems(wrapper) {
		var self = this;
		var ul, li, label, input, caption;
		var i, selectChild, selectChildrenLen = this.select.children.length;

		ul = document.createElement('UL');
		ul.className = this.class.list;
		ul.classList.add((this.settings.orderby === true)  ? "orderby" : "checked");
		ul.style.width = this.settings.width;
		ul.classList.add('hidden');

		if (this.settings.selectAll) {
			label = document.createElement("label");
			li = document.createElement("LI");
			li.classList.add("ignore");

			if (this.settings.orderby === true) {
				var buttonClear = this._createButon('clear');
				buttonClear.addEventListener('click', function() {
					self.selectAll(false);
				});
				li.appendChild(buttonClear);
			} else {
				var buttonAll = this._createButon('all');

				var buttonNone = this._createButon('none');

				buttonAll.addEventListener('click', function() {
					self.selectAll(true);
				});
				buttonNone.addEventListener('click', function() {
					self.selectAll(false);
				});

				li.appendChild(buttonAll);
				li.appendChild(buttonNone);
			}
			label.appendChild(li);
			ul.appendChild(label);
		}

		for (i = 0; i < selectChildrenLen; i++) {
			selectChild = this.select.children[i];
			label = document.createElement('label');
			li = document.createElement('LI');
			input = document.createElement('input');
			input.type = 'checkbox';
			if (this.settings.orderby === true) {
				input.classList.add("orderby");
				input.setAttribute("order", "none");
			}
			input.value = selectChild.value;

			caption = document.createTextNode(selectChild.innerText);
			if (this.settings.orderby === true) {

				input.addEventListener('click', function() {
					switch (this.getAttribute("order")) {
						case "none":
							this.setAttribute("order", "asc");
							break;
						case "asc":
							this.setAttribute("order", "desc");
							break;
						case "desc":
							this.setAttribute("order", "asc");
							break;
						default:
							this.setAttribute("order", "nono");
							break;
					}
					self.setValue([this.value]);


					if (typeof self.settings.onChange == 'function') {
						self.settings.onChange(this.checked, this.value, self);
					}
				});
			} else {
				input.addEventListener('click', function(label) {
					this.checked ? self.setValue([this.value]) : self.removeValue([this.value]);
					if (typeof self.settings.onChange == 'function') {
						self.settings.onChange(this.checked, this.value, self);
					}
				});

			}
			li.appendChild(input);
			li.appendChild(caption);

			li.className = selectChild.selected ? 'active' : '';
			input.checked = selectChild.selected;
			this.data[i] = selectChild.selected;
			label.appendChild(li);
			ul.appendChild(label);
		}

		wrapper.appendChild(ul);
		this.list = ul;
	}
	_getSearchableLi(ul) {
		return ul.querySelectorAll('li:not([class*=ignore])');
	}
	_getLi(ul, selector = 'label') {
		return ul.querySelectorAll(selector);
	}
	_getThemeElements(wrapper) {
		var logger = document.createElement('span');
		this._setLogger(logger);
		wrapper.appendChild(logger);
	}
	_setLogger(elem) {
		var self = this;
		elem.style.width = this.settings.width;
		elem.style.height = this.settings.height;
		elem.className = this.class.logger;
		this.logger = elem;

		elem.addEventListener('click', function() {
			self.list.classList.toggle('hidden');
			self.logger.classList.toggle('open');
		});
	}

}

var multiSelects = {};
	Array.prototype.forEach.call(document.getElementsByClassName("patrom-multiselect"), function(el) {
	multiSelects[el.id] = new PatromMultiSelect(el);
});class JSONViewer  {
	constructor() {
		this.Object_prototype_toString = ({}).toString;
		this.DatePrototypeAsString = this.Object_prototype_toString.call(new Date);
		this._dom_container = document.createElement("pre");
		this._dom_container.classList.add("json-viewer", "content");
		this._dom_container.addEventListener('click', this.SimulateClickEventListener);
		this.rootName = "none";
	};

	/**
	 * Visualise JSON object.
	 * 
	 * @param {Object|Array} json Input value
	 * @param {Number} [inputMaxLvl] Process only to max level, where 0..n, -1 unlimited
	 * @param {Number} [inputColAt] Collapse at level, where 0..n, -1 unlimited
	 */
	setRoot( rootName) {
		this.rootName = rootName || "none";
	}
	showJSON(jsonValue,  inputMaxLvl, inputColAt) {
		// Process only to maxLvl, where 0..n, -1 unlimited
		var maxLvl = typeof inputMaxLvl === "number" ? inputMaxLvl : -1; // max level
		// Collapse at level colAt, where 0..n, -1 unlimited
		var colAt = typeof inputColAt === "number" ? inputColAt : -1; // collapse at
		
		this._dom_container.innerHTML = "";
		this.walkJSONTree(this._dom_container, jsonValue, maxLvl, colAt, 0);
	};

	getContainer() {
		return this._dom_container;
	};

	SimulateClickEventListener(event) {
		
	}

	/**
	 * Recursive walk for input value.
	 * 
	 * @param {Element} outputParent is the Element that will contain the new DOM
	 * @param {Object|Array} value Input value
	 * @param {Number} maxLvl Process only to max level, where 0..n, -1 unlimited
	 * @param {Number} colAt Collapse at level, where 0..n, -1 unlimited
	 * @param {Number} lvl Current level
	 */
	walkJSONTree(outputParent, value, maxLvl, colAt, lvl) {
		var isDate = this.Object_prototype_toString.call(value) === this.DatePrototypeAsString;
		var realValue = !isDate && typeof value === "object" && value !== null && "toJSON" in value ? value.toJSON() : value;
		if (typeof realValue === "object" && realValue !== null && !isDate) {
			var isMaxLvl = maxLvl >= 0 && lvl >= maxLvl;
			var isCollapse = colAt >= 0 && lvl >= colAt;
			
			var isArray = Array.isArray(realValue);
			var items = isArray ? realValue : Object.keys(realValue);

			if (lvl === 0) {
				// root level
				var rootCount = this._createItemsCount(items.length);
				// hide/show
				var rootLink = this._createLink(isArray ? "[" : "{");

				if (items.length) {
					rootLink.addEventListener("click", function() {
						if (isMaxLvl) return;

						rootLink.classList.toggle("collapsed");
						rootCount.classList.toggle("hide");

						// main list
						outputParent.querySelector("ul").classList.toggle("hide");
					});

					if (isCollapse) {
						rootLink.classList.add("collapsed");
						rootCount.classList.remove("hide");
					}
				}
				else {
					rootLink.classList.add("empty");
				}

				rootLink.appendChild(rootCount);
				outputParent.appendChild(rootLink); // output the rootLink
			}

			if (items.length && !isMaxLvl) {
				var len = items.length - 1;
				var ulList = document.createElement("ul");
				ulList.setAttribute("data-level", lvl);
				ulList.classList.add("type-" + (isArray ? "array" : "object"));

				items.forEach(function(key, ind) {
					var item = isArray ? key : value[key];
					var li = document.createElement("li");

					if (typeof item === "object") {
						// null && date
						if (!item || item instanceof Date) {
							li.appendChild(document.createTextNode(isArray ? "" : key + ": "));
							li.appendChild(this.createSimpleViewOf(item ? item : null, true));
						}
						// array & object
						else {
							var itemIsArray = Array.isArray(item);
							var itemLen = itemIsArray ? item.length : Object.keys(item).length;

							// empty
							if (!itemLen) {
								li.appendChild(document.createTextNode(key + ": " + (itemIsArray ? "[]" : "{}")));
							}
							else {
								// 1+ items
								var itemTitle = (typeof key === "string" ? key + ": " : "") + (itemIsArray ? "[" : "{");
								var itemLink = this._createLink(itemTitle);
								var itemsCount = this._createItemsCount(itemLen);

								// maxLvl - only text, no link
								if (maxLvl >= 0 && lvl + 1 >= maxLvl) {
									li.appendChild(document.createTextNode(itemTitle));
								}
								else {
									itemLink.appendChild(itemsCount);
									li.appendChild(itemLink);
								}

								this.walkJSONTree(li, item, maxLvl, colAt, lvl + 1);
								li.appendChild(document.createTextNode(itemIsArray ? "]" : "}"));
								
								var list = li.querySelector("ul");
								var itemLinkCb = function() {
									itemLink.classList.toggle("collapsed");
									itemsCount.classList.toggle("hide");
									list.classList.toggle("hide");
								};

								// hide/show
								itemLink.addEventListener("click", itemLinkCb);

								// collapse lower level
								if (colAt >= 0 && lvl + 1 >= colAt) {
									itemLinkCb();
								}
							}
						}
					}
					// simple values
					else {
						// object keys with key:
						if (!isArray) {
							li.appendChild(document.createTextNode(key + ": "));
						}

						// recursive
						this.walkJSONTree(li, item, maxLvl, colAt, lvl + 1);
					}

					// add comma to the end
					if (ind < len) {
						li.appendChild(document.createTextNode(","));
					}

					ulList.appendChild(li);
				}, this);

				outputParent.appendChild(ulList); // output ulList
			}
			else if (items.length && isMaxLvl) {
				var itemsCount = _createItemsCount(items.length);
				itemsCount.classList.remove("hide");

				outputParent.appendChild(itemsCount); // output itemsCount
			}

			if (lvl === 0) {
				// empty root
				if (!items.length) {
					var itemsCount = this._createItemsCount(0);
					itemsCount.classList.remove("hide");

					outputParent.appendChild(itemsCount); // output itemsCount
				}

				// root cover
				outputParent.appendChild(document.createTextNode(isArray ? "]" : "}"));

				// collapse
				if (isCollapse) {
					outputParent.querySelector("ul").classList.add("hide");
				}
			}
		} else {
			// simple values
			outputParent.appendChild(this.createSimpleViewOf(value, isDate) );
		}
	};

	isDate(str) {
		str = str.slice(0, 10);
		if (str.length !== 10 ) return false;
		const regex = /^\d+$/.test(str[2]) 
			? /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/		
			: /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;		
		return regex.test(str);
	  }

	isUrl(string) {
		const regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#:.?+=&%@!\-/]))?/;
		return regexp.test(string);
	  }

	isExternal(string) {
		return (string.toUpperCase().endsWith(".PDF") || string.toUpperCase().endsWith(".HTML"));
	}

	isCode(string) {
		return string.startsWith("function decode(");
	}
	
	isObject(string) {
		try {
			 JSON.parse(string);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Create simple value (no object|array).
	 * 
	 * @param  {Number|String|null|undefined|Date} value Input value
	 * @return {Element}
	 */
	createSimpleViewOf(value, isDate) {
		var spanEl = document.createElement("span");
		var type = typeof value;
		var asText = "" + value;

		if (type === "string") {
			if (this.isUrl(value)) {
				type = value.includes(this.rootName) ? "url-link" : this.isExternal(value) ? "url-external" : "url";
			  } else if (this.isDate(value)) {
				type = "date";
			  } else if (this.isCode(value)) {
				type = "code";
			  } else if (this.isObject(value)) {
				type = "json";
			  }
			asText = '"' + value + '"';
		} else if (value === null) {
			type = "null";
			//asText = "null";
		} else if (isDate) {
			type = "date";
			asText = value.toLocaleString();
		} 
		spanEl.className = "type-" + type;
		spanEl.textContent = asText;
		return spanEl;
	};

	/**
	 * Create items count element.
	 * 
	 * @param  {Number} count Items count
	 * @return {Element}
	 */
	_createItemsCount(count) {
		var itemsCount = document.createElement("span");
		itemsCount.className = "items-ph hide";
		itemsCount.innerHTML = this._getItemsTitle(count);

		return itemsCount;
	};

	/**
	 * Create clickable link.
	 * 
	 * @param  {String} title Link title
	 * @return {Element}
	 */
	_createLink(title) {
		var linkEl = document.createElement("a");
		linkEl.classList.add("list-link");
		linkEl.href = "javascript:void(0)";
		linkEl.innerHTML = title || "";

		return linkEl;
	};

	/**
	 * Get correct item|s title for count.
	 * 
	 * @param  {Number} count Items count
	 * @return {String}
	 */
	_getItemsTitle(count) {
		var itemsTxt = count > 1 || count === 0 ? "items" : "item";

		return (count + " " + itemsTxt);
	};

}class ContextMenu {
	constructor (menu, options) {
		var self = this;
		var num = ContextMenu.count++;

		this.menu = menu;
		this.contextTarget = null;

		if (!(menu instanceof Array)) {
			throw new Error("Parameter 1 must be of type Array");
		}

		if (typeof options !== "undefined") {
			if (typeof options !== "object") {
				throw new Error("Parameter 2 must be of type object");
			}
		} else {
			options = {};
		}

		window.addEventListener("resize", function () {
			if (ContextUtil.getProperty(options, "close_on_resize", true)) {
				self.hide();
			}
		});

		this.setOptions = function (_options) {
			if (typeof _options === "object") {
				options = _options;
			} else {
				throw new Error("Parameter 1 must be of type object");
			}
		};

		this.changeOption = function (option, value) {
			if (typeof option === "string") {
				if (typeof value !== "undefined") {
					options[option] = value;
				} else {
					throw new Error("Parameter 2 must be set");
				}
			} else {
				throw new Error("Parameter 1 must be of type string");
			}
		};

		this.getOptions = function () {
			return options;
		};

		this.reload = function () {
			if (document.getElementById('patrom-cm-' + num) == null) {
				var cnt = document.createElement("div");
				cnt.className = "patrom-cm-container";
				cnt.id = "patrom-cm-" + num;

				document.body.appendChild(cnt);
			}

			var container = document.getElementById('patrom-cm-' + num);
			container.innerHTML = "";

			container.appendChild(renderLevel(menu));
		};

		function renderLevel(level) {
			var ul_outer = document.createElement("ul");

			level.forEach(function (item) {
				var li = document.createElement("li");
				li.menu = self;

				if (typeof item.type === "undefined") {

					var text_span = document.createElement("span");
					text_span.className = 'patrom-cm-text';

					if (ContextUtil.getProperty(item, "text", "") != "") {
						text_span.innerHTML = ContextUtil.getProperty(item, "text", "");
					} else {
						text_span.innerHTML = ContextUtil.getProperty(options, "default_text", "item");
					}

					var sub_span = document.createElement("span");
					sub_span.className = 'patrom-cm-sub_span';

					if (typeof item.sub !== "undefined") {
						if (ContextUtil.getProperty(options, "sub_icon", "") != "") {
							sub_span.innerHTML = ContextUtil.getProperty(options, "sub_icon", "");
						} else {
							sub_span.innerHTML = '&#155;';
						}
					}

					li.appendChild(text_span);
					li.appendChild(sub_span);

					if (!ContextUtil.getProperty(item, "enabled", true)) {
						li.setAttribute("disabled", "");
					} else {
						if (typeof item.events === "object") {
							var keys = Object.keys(item.events);

							for (var i = 0; i < keys.length; i++) {
								li.addEventListener(keys[i], item.events[keys[i]]);
							}
						}

						if (typeof item.sub !== "undefined") {
							li.appendChild(renderLevel(item.sub));
						}
					}
				} else {
					if (item.type == ContextMenu.DIVIDER) {
						li.className = "patrom-cm-divider";
					}
				}

				ul_outer.appendChild(li);
			});

			return ul_outer;
		}

		this.display = function (e, target) {
			if (typeof target !== "undefined") {
				self.contextTarget = target;
			} else {
				self.contextTarget = e.target;
			}

			var menu = document.getElementById('patrom-cm-' + num);

			var clickCoords = { x: e.clientX, y: e.clientY };
			var clickCoordsX = clickCoords.x;
			var clickCoordsY = clickCoords.y;

			var menuWidth = menu.offsetWidth + 4;
			var menuHeight = menu.offsetHeight + 4;

			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;

			var mouseOffset = parseInt(ContextUtil.getProperty(options, "mouse_offset", 2));

			if ((windowWidth - clickCoordsX) < menuWidth) {
				menu.style.left = windowWidth - menuWidth + "px";
			} else {
				menu.style.left = (clickCoordsX + mouseOffset) + "px";
			}

			if ((windowHeight - clickCoordsY) < menuHeight) {
				menu.style.top = windowHeight - menuHeight + "px";
			} else {
				menu.style.top = (clickCoordsY + mouseOffset) + "px";
			}

			var sizes = ContextUtil.getSizes(menu);

			if ((windowWidth - clickCoordsX) < sizes.width) {
				menu.classList.add("patrom-cm-border_right");
			} else {
				menu.classList.remove("patrom-cm-border_right");
			}

			if ((windowHeight - clickCoordsY) < sizes.height) {
				menu.classList.add("patrom-cm-border_bottom");
			} else {
				menu.classList.remove("patrom-cm-border_bottom");
			}

			menu.classList.add("display");

			if (ContextUtil.getProperty(options, "close_on_click", true)) {
				window.addEventListener("click", documentClick);
			}

			e.preventDefault();
		};

		this.hide = function () {
			document.getElementById('patrom-cm-' + num).classList.remove("display");
			window.removeEventListener("click", documentClick);
		};

		function documentClick() {
			self.hide();
		}

		this.reload();
	}
}

ContextMenu.count = 0;
ContextMenu.DIVIDER = "patrom-cm-divider";

const ContextUtil = {
	getProperty: function(options, opt, def){
		if(typeof options[opt] !== "undefined"){
			return options[opt];
		}else{
			return def;
		}
	},

	getSizes: function(obj){
		var lis = obj.getElementsByTagName('li');

		var width_def = 0;
		var height_def = 0;

		for(var i = 0; i < lis.length; i++){
			var li = lis[i];

			if(li.offsetWidth > width_def){
				width_def = li.offsetWidth;
			}

			if(li.offsetHeight > height_def){
				height_def = li.offsetHeight;
			}
		}

		var width = width_def;
		var height = height_def;

		for(var i = 0; i < lis.length; i++){
			var li = lis[i];

			var ul = li.getElementsByTagName('ul');
			if(typeof ul[0] !== "undefined"){
				var ul_size = ContextUtil.getSizes(ul[0]);

				if(width_def + ul_size.width > width){
					width = width_def + ul_size.width;
				}

				if(height_def + ul_size.height > height){
					height = height_def + ul_size.height;
				}
			}
		}

		return {
			"width": width,
			"height": height
		};
	}
};
