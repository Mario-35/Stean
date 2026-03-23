const mqtt = require("async-mqtt");


async function essai(service, username, password) {
    const options = {
        username: username,
        password: password,
        keepalive: 60,
        // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        protocolId: 'MQTT',
        protocolVersion: 3,
        clean: true,
        reconnectPeriod: 0,
        connectTimeout: 30 * 1000,
      }
// const mqttClient = mqtt.connect('http://localhost:1883/test/v1.1/login', { username: "stean", password: "stean" });
console.log("====================================START====================================");
const mqttClient = mqtt.connect(`ws://localhost:1883/${service}/v1.1/login`, options);
const queryTopic = `/${service}/v1.1/Datastreams(1)/Observations`;
const obj = {
    "result": 453,
    "phenomenonTime": "2015-02-06T17:00:00Z"
  }

mqttClient.on('message', (topic, message) => {
    console.log(`Received response for topic [${topic}] from server : `, message.toString());
});

mqttClient.on('close', () => {
    console.log('Disconnected');
});

mqttClient.on('error', (error) => {
    console.log('=========================================== error ===========================================');
    console.log(error);
});

const doStuff = async () => {

	console.log("Starting");
	try {
		await mqttClient.subscribe(queryTopic);
		const test = await mqttClient.publish(queryTopic, JSON.stringify(obj), { qos:1 });
        console.log(test);
		// This line doesn't run until the server responds to the publish
		await mqttClient.end();
		// This line doesn't run until the client has disconnected without error
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}

mqttClient.on('connect',  (connack) => {
    // console.log(`Client connected : ${mqttClient.options.clientId}`)
    if (connack) {
        doStuff();
    }
});   
}

// essai("test", "stean", "stean");
essai("agrhys", "sensorapi", "postgres");