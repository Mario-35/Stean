/**
 * Graph for Query.
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

function showGraph(element, infos, value) {
	new Dygraph(
		document.getElementById(element),
		value, {
			title: infos[1],
			ylabel: infos[2],
			xlabel: infos[0],
			legend: 'always',
			rollPeriod: 30,
			showRangeSelector: true,
			resizable: "both",
			connectSeparatedPoints: false
		}
	);
}