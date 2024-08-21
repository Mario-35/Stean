/**
 * MqttSerer Routes for API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- MqttSerer Routes for API -----------------------------------!");

import Aedes, { AedesPublishPacket, Client, PublishPacket, Subscription } from 'aedes';
import { serverConfig } from '../configuration';
import { log } from '../log';
import { color, setDebug } from '../constants';
import { EColor } from '../enums';
import { errors, infos } from '../messages';
import { loginUser } from '../authentication';
import { createServer } from 'aedes-server-factory';


export class MqttSerer {
    broker: Aedes;
    constructor(ports: {wsPort : number, tcpPort  : number}) {        
        setDebug(true);
        this.broker = new Aedes();
        const mqttServer  = createServer(this.broker, { ws: true });
        mqttServer.listen(ports.wsPort,() => {
            serverConfig.messageListen("MQTT Broker on WS", String(ports.wsPort));
        });
        const mqttTcpServer  = createServer(this.broker);
        mqttTcpServer.listen(ports.tcpPort, () => {
            serverConfig.messageListen("MQTT Broker on TCP", String(ports.tcpPort));
        });
    }
    
    sendMessage(client: Client,  topic: string, message: string) {
        const packet: PublishPacket = {
            cmd: "publish", 
            dup: true,
            qos: 1,
            retain: true,
            topic: topic,
            payload: message
        }
        client.publish(packet, (e) => {
            console.log(e);            
        });
    }

    apiCaller(packet: PublishPacket, client: Client) {
        console.log(log.whereIam());
        return new Promise(async (resolve, reject) => {
            try {
                const api = await fetch(`http://localhost:8029${packet.topic}`, {
                    method: "POST",
                    headers: {
                        'Authorization': this.broker.id, 
                        "Host": "mqtt",
                        "Content-Type": "application/json",
                    },
                    body: packet.payload.toString(),
                })
                if (api) {
                    serverConfig.writeLog(log.debug_infos(`[MESSAGE_PUBLISHED] Client ${(client ? client.id : 'BROKER_' + this.broker.id)} has published message on ${packet.topic} to broker`, this.broker.id));
                    api.json().then((e: JSON) => {
                        client.emit("message", e);
                        resolve(e);
                    });
                }             
            } catch (error) {
                reject(error);                
            }
        });
    }

    init() {
        // authenticate the connecting client
        this.broker.authenticate = async (client: Client | null, username: any, password: any, callback: any) => {
            console.log(log.whereIam());            
            if ( client && client.req && client.req.url ) {
                const url =  client.req.url.trim().split("/").filter((e: string )=> e !== "");
                if (url[url.length -1] === "login") {                    
                   return await loginUser(undefined,{configName: url[0], username: String(username), password: Buffer.from(password, 'base64').toString()}).then((user) => {
                        serverConfig.writeLog(log.debug_infos(`${color(user ? EColor.Green : EColor.Red)}${color(EColor.Cyan)}${(user ? infos.authSuccess : errors.authFailed)} to broker`, this.broker.id));
                        return callback(user ? null : new Error(errors.authFailed), user ? true : false);
                    }).catch((error: Error) => {                
                        serverConfig.writeLog(log.error(errors.authFailed, error));
                        return callback(error, false);
                    });
                }
            } else {
                if ( client && client["_parser" as keyof object]) {
                    const paket = client["_parser" as keyof object]["settings"];
                    if (paket["cmd" as keyof object] === "connect") {                    
                        return await loginUser(undefined,{configName: String(paket["clientId" as keyof object]).split("_")[0], username: String(paket["username" as keyof object]), password: Buffer.from(paket["password" as keyof object], 'base64').toString()}).then((user) => {
                            serverConfig.writeLog(log.debug_infos(`${color(user ? EColor.Green : EColor.Red)}${color(EColor.Cyan)}${(user ? infos.authSuccess : errors.authFailed)} to broker`, this.broker.id));
                            return callback(user ? null : new Error(errors.authFailed), user ? true : false);
                        }).catch((error: Error) => {                
                            serverConfig.writeLog(log.error(errors.authFailed, error));
                            return callback(error, false);
                        });
                    }
                }
            }
            return callback(null, false);
        }
        
        // authorizing client to publish on a message topic
        this.broker.authorizePublish = (client: Client | null, packet: PublishPacket, callback: any) => {
            console.log(log.whereIam("authorizePublish"));
            return callback( (client && packet.topic.trim() !== "")  ? null : new Error('You are not authorized to publish on this message topic.'));
        }

        this.broker.published = (packet: AedesPublishPacket, client: Client | null, callback: any) => {
            if (client) {
                console.log(log.whereIam('published'));
                if (client) serverConfig.writeLog(log.debug_infos(`${color(EColor.Green)}[PUBLISHED] ${color(EColor.Cyan)}${(client ? client.id : client)}`, packet.payload.toString()));
            }
        }

        // emitted when a client connects to the broker
        this.broker.on('client', (client: Client | null) => {
            if (client) {
                console.log(log.whereIam(`client : ${client ? client.id : client}`));
                serverConfig.writeLog(log.debug_infos(`${color(EColor.Green)}[CLIENT_CONNECTED] ${color(EColor.Cyan)}${(client ? client.id : client)} connected to broker`, this.broker.id));
            }
        })
        
        // emitted when a client disconnects from the broker
        this.broker.on('clientDisconnect', (client: Client | null) => {
            if (client) {
                console.log(log.whereIam('clientDisconnect'));
                serverConfig.writeLog(log.debug_infos(`${color(EColor.Red)}[CLIENT_DISCONNECTED] ${color(EColor.Cyan)}${(client ? client.id : client)} disconnected from the broker`, this.broker.id));
            }
        })
        
        // emitted when a client subscribes to a message topic
        this.broker.on('subscribe', (subscriptions: Subscription[], client: Client | null) => {
            if (client) {
                console.log(log.whereIam('subscribe'));
                serverConfig.writeLog(log.debug_infos(`${color(EColor.Yellow)}[TOPIC_SUBSCRIBED] ${color(EColor.Green)}${(client ? client.id : client)} subscribed to topics: ${subscriptions.map((s: any )=> s.topic).join(',')} on broker`, this.broker.id));
            }
        })
        
        // emitted when a client unsubscribes from a message topic
        this.broker.on('unsubscribe', (subscriptions: any, client: Client | null) => {
            if (client) {
                console.log(log.whereIam('unsubscribe'));
                serverConfig.writeLog(log.debug_infos(`${color(EColor.Yellow)}[TOPIC_UNSUBSCRIBED] ${color(EColor.Red)}${(client ? client.id : client)} unsubscribed to topics: ${subscriptions.map((s: any )=> s.topic).join(',')} from broker`, this.broker.id));
            }
        })
        
        // emitted when a client publishes a message packet on the topic
        this.broker.on('publish', (packet: PublishPacket, client: Client | null) => {
            if (client && !packet.topic.includes("$SYS")) {
                console.log(log.whereIam('publish'));
                this.apiCaller(packet, client).then((res) => {
                    console.log(client.id);
                    res = {mqtt : res as JSON}
                    client.publish({
                        cmd: "publish", 
                        dup: true,
                        qos: 1,
                        retain: true,
                        topic: packet.topic,
                        payload: JSON.stringify(res),
                        properties: {
                            contentType: "steanResult"
                        }
                    }, (e) => {
                        console.log(e);            
                    });
                }).catch((err) =>   {
                    console.log(err);

                })
            }
        })
    }
}

