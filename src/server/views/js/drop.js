/**
 * Drop for Query.
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

function jsonDatasPasteEvent(event) {
	setTimeout(() => {
		try {
			beautifyDatas(getElement("jsonDatas"), event.explicitOriginalTarget.innerText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7F]/g, ''), "json");
			buttonGo();
		} catch (error) {
			getElement("jsonDatas").innerText = event.explicitOriginalTarget.innerText;
		}
	}, "500");
}