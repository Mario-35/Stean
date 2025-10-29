async function getmy(url) {
	try {
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await response.json();
		if (res["@iot.nextLink"]) return res["@iot.nextLink"];
	} catch (err) {
		notifyError("Error", err);
	}
}

async function loop(obj) {
	let url = optDistHost.value + "Datastreams(1)/Observations?$top=" + disTopOption.value || 100000;
	while (url) {
		url = await getmy(url);
	}

}



async function getDatas(url) {
	try {
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await response.json();
	} catch (err) {
		notifyError("Error", err);
	}
}
async function postDatas(url, datas) {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(datas),
		});
		return response.status;
	} catch (err) {
		notifyError("Error", err);
	}
}

function removeProp(obj, propToDelete) {
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (obj[property] == null) delete obj[property];
			if (typeof obj[property] == "object") {
				removeProp(obj[property], propToDelete);
			} else if (property.includes(propToDelete)) delete obj[property];
		}
	}
	return obj;
}

function renameProp(obj, propOldName, propNewName) {
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (obj[property] == null) {
				delete obj[property];
			}
			if (typeof obj[property] == "object") {
				renameProp(obj[property], propOldName, propNewName);
			} else if (property.includes(propOldName)) {
				obj[propNewName] = obj[propOldName];
				delete obj[propOldName];
			}
		}
	}
	return obj;
}


function cleanData(obj) {
	obj = removeProp(obj, "@iot.id");
	obj = removeProp(obj, "selfLink");
	obj = removeProp(obj, "navigationLink");
	obj = removeProp(obj, "@iot.selfLink");
	return obj;
}

async function getObservations(url) {
	try {
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await response.json();
		if (res["@iot.nextLink"]) return res["@iot.nextLink"];
	} catch (err) {
		notifyError("Error", err);
	}
}

async function copyEntity(src, dest, entity, debug) {
	let flux = await getDatas(src + entity + "?$select=id&$orderby=id asc");
	setProgression(0);
	for (let i = 0; i < +flux["@iot.count"]; i++) {
		let datas = await getDatas(src + entity + "(" + flux["value"][i]["@iot.id"] + ")");
		datas = cleanData(datas);
		const d = debug ? '?$debug=true' : '';
		await postDatas(dest + entity + d, datas);
	};
}

async function copyFromService() {
	if (optDistHost.value.trim() === "") {
		notifyError("Error", "Distant root can't be empty");
		return;
	}

	const src = optDistHost.value;
	const dest = `${optHost.value}/${optVersion.value}/`;
	const root = await getDatas(src);
	console.log(root);
	let loras = undefined;
	root.value.forEach(element => {
		if (element.name === 'Loras') loras = true;
	});
	copyEntity(src, dest, "FeaturesOfInterest");
	copyEntity(src, dest, "Decoders");

	let stream = await getDatas(src + "Datastreams?$select=id&$orderby=id asc");
	maxProg = +stream["@iot.count"];
	for (let i = 0; i < +stream["@iot.count"]; i++) {
		setProgression(i + 1);
		const myId = stream["value"][i]["@iot.id"];
		let datas = await getDatas(src + "Datastreams(" + myId + ")?$expand=Thing/Locations,Sensor,ObservedProperty");
		datas = cleanData(datas);
		await postDatas(dest + "Datastreams", datas);
	}

	stream = await getDatas(src + "MultiDatastreams?$select=id&$orderby=id asc");
	setProgression(0);
	maxProg = +stream["@iot.count"];
	for (let i = 0; i < +stream["@iot.count"]; i++) {
		setProgression(i + 1);
		const myId = stream["value"][i]["@iot.id"];
		let datas = await getDatas(src + "MultiDatastreams(" + myId + ")?$expand=Thing/Locations,Sensor,ObservedProperties");
		datas = cleanData(datas);
		await postDatas(dest + "MultiDatastreams", datas);
	}

	if (loras) {
		setProgression(0);
		stream = await getDatas(src + "Loras?$expand=Datastreams($select=id),MultiDatastream($select=id),Decoder($select=id)&$orderby=id asc");
		console.log(stream);
		if (stream["detail"] = "la relation « datastreamlora » n'existe pas") {
			const sql = `${src}/Sql?$query=${btoa(`SELECT "lora"."id" AS "@iot.id",
		"name",
		"description",
		"properties",
		"deveui",
		(SELECT "datastream"."name" FROM "datastream" WHERE "datastream"."id" = "lora"."datastream_id") as "datastream_name", 
		(SELECT "multidatastream"."name" FROM "multidatastream" WHERE "multidatastream"."id" = "lora"."multidatastream_id") as "multidatastream_name",
		(SELECT COALESCE(ROW_TO_JSON(t), '{}') AS value
	FROM (
	SELECT "decoder"."name" AS "@iot.name"
	FROM "decoder"
	WHERE "decoder"."id" = "lora"."decoder_id"
	ORDER BY id
 ) AS t) AS "Decoder"
 FROM "lora"
 ORDER BY "lora"."id" ASC
 LIMIT 200`)}`;
			datas = await getDatas(sql);
			datas = cleanData(datas[0]);
			for (let i = 0; i < +datas.length; i++) {
				setProgression(i + 1);
				data = {
					"name": datas[i]["name"],
					"description": datas[i]["description"],
					"deveui": datas[i]["deveui"],
					"Decoder": datas[i]["Decoder"]
				}
				if (datas[i]["multidatastream_name"]&& datas[i]["multidatastream_name"] !== null)
					data["MultiDatastream"] = {
						"@iot.name": datas[i]["multidatastream_name"]
					};
				if (datas[i]["datastream_name"] && datas[i]["datastream_name"] !== null)
					data["Datastreams"] = {
						"@iot.name": datas[i]["datastream_name"]
					};
				console.log(data);
				await postDatas(dest + "Loras?$debug=true", data);
			}

		} else {
			maxProg = +stream["@iot.count"];
			for (let i = 0; i < +stream["@iot.count"]; i++) {
				setProgression(i + 1);
				const myId = stream["value"][i]["@iot.id"];
				let datas = await getDatas(src + "MultiDatastreams(" + myId + ")?$expand=Thing/Locations,Sensor,ObservedProperties");
				datas = cleanData(datas);
				await postDatas(dest + "MultiDatastreams", datas);
			}
		}

		notifyOk("Copy structure from", src);
	};
}

// copy service to actual service
async function copyFromServiceObservations() {
	setProgression(0);
	const src = optDistHost.value;
	const dest = `${optHost.value}/${optVersion.value}/`;
	let datas = await getDatas(src + "Observations?$count=true");
	if (!datas["@iot.count"]) return;
	maxProg = +datas["@iot.count"];
	let prog = 0;
	if (optDistHost.value.trim() === "") {
		notifyError("Error", "Distant root can't be empty");
		return;
	}
	if (optDistHostStep.value === "") optDistHostStep.value = 5000;
	let url = src + "Observations?$expand=Datastream($select=name),MultiDatastream($select=name),FeatureOfInterest($select=name)&$orderby=phenomenonTime&$resultFormat=dataArray&$top=" + optDistHostStep.value;
	if (optDistHostStart.value || 0 > 0) url = url + '&$skip=' + optDistHostStart.value;
	while (url) {
		try {
			prog += +optDistHostStep.value;
			datas = await getDatas(url);
			setProgression(prog);
			url = datas["@iot.nextLink"] ? datas["@iot.nextLink"] : undefined;
			// url = undefined;	
			await postDatas(dest + "Observations", datas);

		} catch (err) {
			notifyError("Error", err);
		}
	};
	notifyOk("Copy observations", src);
};
// async function copyFromServiceObservations() {
// 	if (optDistHost.value.trim() === "") {
// 		notifyError("Error", "Distant root can't be empty");
// 		return;
// 	} 
// 	if (optDistHostStep.value === "") optDistHostStep.value = 2000;
// 	const src = optDistHost.value;
// 	const dest = `${optHost.value}/${optVersion.value}/`;
// 	let url = src + "Observations?$expand=Datastream($select=name),MultiDatastream($select=name),FeatureOfInterest($select=name)&$orderby=phenomenonTime&$top="+ optDistHostStep.value;
// 	if (optDistHostStart.value || 0 > 0) url = url + '&$skip=' + optDistHostStart.value;
// 	while (url) {
// 		try {
// 			let datas  = await getDatas(url); 
// 			url = datas["@iot.nextLink"] ? datas["@iot.nextLink"] : undefined;
// 			datas = cleanData(datas["value"]);		
// 			await postDatas(dest+"Observations", renameProp(datas, "name", "@iot.name"));
// 		} catch (err) {
// 			notifyError("Error", err);
// 		}
//     };
// 	notifyOk("Copy observations", src);
// };