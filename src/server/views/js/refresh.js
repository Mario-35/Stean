
function updateForm() {
	header("updateForm");
	toggleShowHide(logout, _PARAMS.user.canPost);
	buttonGo();
	const tempOptions = getFormatOptions();
	populateSelect(resultFormatOption, tempOptions, getDefaultValue(resultFormatOption, tempOptions));
	getElement("actionForm").action = `${optHost.value}/${optVersion.value}/${entityOption.value}${entityOption.value === "CreateObservations" || isObservation() ? "" : `` }`;
	tabEnabledDisabled("propertyTab", (idOption.value != ""));
	tabEnabledDisabled("toolsTab", _PARAMS.user.canPost, true);	
	tabEnabledDisabled("importTab", _PARAMS.user.canPost, true);
	tabEnabledDisabled("observationsTab", isObservation());
	tabEnabledDisabled("AdminTab", (_PARAMS.user.admin || _PARAMS.user.superAdmin));
	ended("updateForm");
}

function refresh() {
	header("refresh");
	const tempEntity = SubOrNot();
	populateMultiSelect("selectOption", getColumnsList(tempEntity).filter(e => !e.includes("_")), "all");
	populateMultiSelect("orderbyOption", getColumnsList(tempEntity));
	populateSelect(propertyOption, getColumnsList(tempEntity), _PARAMS.property != undefined ? _PARAMS.property : _NONE, true);
	populateMultiSelect("expandOption", getRelationsList(tempEntity));
	updateForm();
	updateBuilder();
	canShowQueryButton();
	toggleShowHide(getElement("payloadPartTab"), entityOption.value === "Decoders");
	ended("refresh");
}

function refresh_entity() {
	const relations = getRelationsList(entityOption.value);
	if (!relations.includes(subentityOption.value)) {
		subentityOption.options.length = 0;
		if ((entityOption.value.includes("createDB") && _PARAMS.user.canCreateDb == true) || importFile) methodOption.value = "POST";
		else if (entityOption.value === "createDB") methodOption.value = "POST";
		else {
			if (relations) populateSelect(subentityOption, relations, relations.includes(_PARAMS.subentityOption) ? _PARAMS.subentityOption : _NONE, true);
			populateSelect(methodOption, entityOption.value == "Loras" ? ["GET", "POST"] : _PARAMS.methods, methodOption.value !== "" ? methodOption.value : "GET");
		}
	}
}

