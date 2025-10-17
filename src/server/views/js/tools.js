async function testa(obj) {
	let url = optHost.value + "/v1.1/Datastreams(1)/Observations?$top=100000";
    while (url) {
        url = await getmy(url);
    }        
    
}

async function getmy(url) {
    try {
		const response = await fetch(encodeURI(url), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await response.json();
        if( res["@iot.nextLink"]) return res["@iot.nextLink"];
	} catch (err) {
		notifyError("Error", err);
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

function cleanData(obj) {
	obj = removeProp(obj, "@iot.id");
	obj = removeProp(obj, "selfLink");
	obj = removeProp(obj, "navigationLink");

	return obj
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
        if( res["@iot.nextLink"]) return res["@iot.nextLink"];
	} catch (err) {
		notifyError("Error", err);
	}
}

async function copyFromService(obj) {
	const src = optDistHost.value;
	const dest = "http://localhost:8029/copie/v1.1/";
	const foi  = await getDatas(src + "FeaturesOfInterest?$select=id&$orderby=id asc");
	for (let i = 0; i < +foi["@iot.count"]; i++) {
		let datas  = await getDatas(src + "FeaturesOfInterest("+ foi["value"][i]["@iot.id"] +")"); 
		datas = cleanData(datas);
		await postDatas(dest+"FeaturesOfInterest", datas);
	};

	let stream  = await getDatas(src + "Datastreams?$select=id&$orderby=id asc");
	for (let i = 0; i < +stream["@iot.count"]; i++) {
		const myId = stream["value"][i]["@iot.id"];
		let datas  = await getDatas(src + "Datastreams("+ myId +")?$expand=Thing/Locations,Sensor,ObservedProperty"); 
		datas = cleanData(datas);
		console.log(datas);
		
		await postDatas(dest+"Datastreams", datas);
		// let url = optHost.value + "/v1.1/Datastreams("+ myId +")/Observations?$resultFormat=csv";
		// let url = optHost.value + "/v1.1/Datastreams("+ myId +")/Observations?$top=100000";
		// while (url) {
		// 	url = await getmy(url);
	}    

	stream  = await getDatas(src + "MultiDatastreams?$select=id&$orderby=id asc");
	for (let i = 0; i < +stream["@iot.count"]; i++) {
		const myId = stream["value"][i]["@iot.id"];
		let datas  = await getDatas(src + "MultiDatastreams("+ myId +")?$expand=Thing/Locations,Sensor,ObservedProperties"); 
		datas = cleanData(datas);
		console.log(datas);
		
		await postDatas(dest+"MultiDatastreams", datas);
		// let url = optHost.value + "/v1.1/Datastreams("+ myId +")/Observations?$top=100000";
		// while (url) {
			// 	url = await getmy(url);
		}    
		let url = src + "Observations?$expand=Datastream($select=name),MultiDatastream($select=name),FeatureOfInterest($select=name)&$orderby=phenomenonTime&$resultFormat=csv";
};

// }

// http://localhost:8029/agrhys/v1.1/Datastreams(1)/Observations?$top=10000&$skip=2250000?$debug=true
    

