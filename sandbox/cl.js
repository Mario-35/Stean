const mqtt = require('mqtt');


function test_post(service, username, password, topic, payload) {
    return new Promise((resolve, reject) => {
        const options = {
            username: username,
            password: password,
            clientId: service + "_" + Math.random().toString(8).substr(2, 4),
            keepalive: 60,
            protocolId: 'MQTT',
            protocolVersion: 3,
            clean: true,
            reconnectPeriod: 0,
            connectTimeout: 30 * 1000,
        }
        const mqttClient = mqtt.connect(`tcp://localhost:1883/${service}/v1.1/login`, options);
        // const mqttClient = mqtt.connect(`ws://localhost:1883/${service}/v1.1/login`, options); 
        const queryTopic = `/${service}/v1.1${topic}`;

        mqttClient.on('message', (topic, message) => {
            try {
                const src = JSON.parse(message.toString());
                if (src.hasOwnProperty("mqtt")) {
                    mqttClient.end();
                    resolve(JSON.stringify(src.mqtt));
                }
            } catch (error) {
                console.log(error);
                console.log(`Received response for topic [${topic}] from server : `, message.toString());            
            }
        });
        
        mqttClient.on('close', () => {
            console.log('Disconnected');
        });

        mqttClient.on('error', (error) => {
            console.log(error);
        });

        mqttClient.on('connect', (connack) => {
            if (connack) {
                mqttClient.subscribe(queryTopic, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        mqttClient.publish(queryTopic, JSON.stringify(payload), { qos:1 }, (err) => {
                            if (err) resolve(err);                    
                        });
                    }
                });
            }
        });   
    })
}; 

test_post("test", "stean", "stean", "/Datastreams(1)/Observations", {
    "result": 454,
    "phenomenonTime": "2015-02-06T17:00:00Z"
}).then((res) => console.log(res))
.catch((error) => console.log(error))
// essai("agrhys", "sensorapi", "postgres");