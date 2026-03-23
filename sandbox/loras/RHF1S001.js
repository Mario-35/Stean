const createStringFunction = require("./helper/createStringFunction.js");
const message = require("./helper/message.js");
const values = require("./values/RHF1S001.json");
const _NAME = "RHF1S001";

function decode(bytes) {
	"use strict";
	function Decoder(input) {
	  const decoded = {
		valid: true,
		err: 0,
		payload: input,
		messages: []
	  };
	  const temp = input.match(/.{1,2}/g);
	  if (temp !== null) {
		if (temp[0] === "01" || temp[0] == "81") {
		  decoded.messages.push({
			type: "report_telemetry",
			measurementName: nomenclature["0610"],
			measurementValue: (parseInt(String(temp[2]) + String(temp[1]), 16) * 175.72) / 65536 - 46.85
		  });
		  decoded.messages.push({
			type: "report_telemetry",
			measurementName: nomenclature["0710"],
			measurementValue: (parseInt(temp[3], 16) * 125) / 256 - 6
		  });
		  decoded.messages.push({
			type: "upload_battery",
			measurementName: nomenclature["period"],
			measurementValue: parseInt(String(temp[5]) + String(temp[4]), 16) * 2
		  });
		  decoded.messages.push({
			type: "upload_battery",
			measurementName: nomenclature["voltage"],
			measurementValue: (parseInt(temp[8], 16) + 150) * 0.01
		  });
		  decoded.datas = {};
		  decoded.messages.map(e => decoded.datas[e.measurementName] = e.measurementValue);
		  return decoded;
		}
	  }
	  decoded["valid"] = false;
	  decoded["err"] = -1;
	  return decoded;
	}
	return Decoder(bytes);
  }
  
  
const nomenclature = { "voltage": "battery voltage", "period": "periods", "0110": "air temperature", "0210": "air humidity", "0310": "light intensity", "0410": "humidity", "0510": "barometric pressure", "0610": "soil temperature", "0700": "battery", "0710": "Volumetric Water Content" }; 

const F = new Function(["input", "nomenclature"], createStringFunction(decode.toString('utf8')));
Object(values).forEach((e, i) => {
	const test = F(e["payload_deciphered"], nomenclature);
	if(i === 0 && !process.env.NODE_ENV) console.log(test);
	if (test["messages"] && test["messages"][0] && test["messages"][0]["measurementValue"] === e["data"]["temperature"] && test["messages"][1]["measurementValue"] === e["data"]["humidity"]) 
	console.log(message(`Test ${_NAME} : ${i + 1} ==> OK`)); 
	else console.log(message());
});

module.exports = createStringFunction(decode.toString('utf8'));
