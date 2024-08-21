function jsonDatasPasteEvent(event) {
	setTimeout(() => {
		try {
			beautifyDatas(getElement("jsonDatas"), event.explicitOriginalTarget.innerText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7F]/g, ''), "json");
		} catch (error) {
			getElement("jsonDatas").innerText = event.explicitOriginalTarget.innerText;
		}
	}, "500");
}