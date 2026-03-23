const createStringFunction = require("./helper/createStringFunction.js");
const message = require("./helper/message.js");
const values = require("./values/Watteco.json");
const _NAME = "Watteco";

function decode (bytes) {
    if (typeof bytes === "string") bytes = Buffer.from(bytes,'hex');

	var decoded = {
		valid: false,
		payload: "",
		messages: []
	};

    function Bytes2Float32(bytes) {
        var sign = (bytes & 0x80000000) ? -1 : 1;
        var exponent = ((bytes >> 23) & 0xFF) - 127;
        var significand = (bytes & ~(-1 << 23));
    
        if (exponent == 128) 
            return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);
    
        if (exponent == -127) {
            if (significand == 0) return sign * 0.0;
            exponent = -126;
            significand /= (1 << 22);
        } else significand = (significand | (1 << 23)) / (1 << 23);
    
        return sign * significand * Math.pow(2, exponent);
    }

	var bytes_len_	= bytes.length;
	var temp_hex_str = "";

	for( var j = 0; j < bytes_len_; j++ )

	{
		temp_hex_str = bytes[j].toString( 16 ).toUpperCase( );
		if( temp_hex_str.length == 1 )
		{
		  temp_hex_str = "0" + temp_hex_str;
		}
		decoded.payload += temp_hex_str;
		var date = new Date();
		decoded.date = date.toISOString();
	}
	
	//trame standard
	if (!(bytes[0] & 0x01) === false) {
		attributID = -1;
		cmdID = -1;
		clusterdID = -1;
		//command ID
		cmdID = bytes[1]; 
		//Cluster ID
		clusterdID = bytes[2]*256 + bytes[3]; 
		// decode report and read atrtribut response
		if((cmdID === 0x0a)|(cmdID === 0x8a)|(cmdID === 0x01)){
			//Attribut ID 
			attributID = bytes[4]*256 + bytes[5];
			//data index start
			if ((cmdID === 0x0a) | (cmdID === 0x8a))	index = 7;
			if (cmdID === 0x01)	index = 8;			
			if ((clusterdID === 0x000c ) & (attributID === 0x0055)) {
				const decodedValue = Bytes2Float32(bytes[index]*256*256*256+bytes[index+1]*256*256+bytes[index+2]*256+bytes[index+3]);
				decoded.messages.push({ 
					type : "analog",  
					measurementName: "analog", 
					measurementValue: decodedValue
				});	
				decoded.datas = decodedValue;
			}			
		}
	}
	decoded.valid=true;
	return decoded;
}

const F = new Function(["input", "nomenclature"], createStringFunction(decode.toString('utf8')));
Object(values).forEach((e, i) => {
	const test = F(e["frame"], {});
	if(i === 0 && !process.env.NODE_ENV) console.log(test);
	if (test["datas"] && test["datas"] === e["data"]["Data"]) 
	console.log(message(`Test ${_NAME} : ${i + 1} ==> OK`)); 
	else console.log(message());
});
  
module.exports = createStringFunction(decode.toString('utf8'));