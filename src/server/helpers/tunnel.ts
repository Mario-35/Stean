import net from 'net';
import { Client, ConnectConfig, Server } from 'ssh2';
import { ForwardOptions, ServerOptions, SshOptions, TunnelOptions } from '../types';

function autoClose(server: Server, connection: any) {
    connection.on('close', () => {
        server.getConnections((error, count) => {
            if (count === 0) {
                server.close();
            }
        });
    });
}

async function createServer(options: any): Promise<net.Server> {
    let serverOptions = Object.assign({}, options);

    if (!serverOptions.port && !serverOptions.path) {
        serverOptions = null;
    }

    return new Promise((resolve, reject) => {
        let server = net.createServer();
        let errorHandler = function (error: Error) {
            reject(error);
        };
        server.on('error', errorHandler);
        process.on('uncaughtException', errorHandler);

        server.listen(serverOptions);
        server.on('listening', () => {
            process.removeListener('uncaughtException', errorHandler);
            resolve(server);
        });
    });
}

async function createSSHConnection(config: ConnectConfig): Promise<Client> {
    return new Promise(function (resolve, reject) {
        let conn = new Client();
        conn.on('ready', () => resolve(conn));
        conn.on('error', reject);
        conn.connect(config);
    });
}


/**
 * @param tunnelOptions - Controls be behaviour of the tunnel server.
 * @param serverOptions - Controls the behaviour of the tcp server on your local machine. For all possible options please refere to the official node.js documentation: https://nodejs.org/api/net.html#serverlistenoptions-callback
 * @param sshOptions - Options to tell the ssh client how to connect to your remote machine. For all possible options please refere to the ssh2 documentation: https://www.npmjs.com/package/ssh2?activeTab=readme
 * @param forwardOptions - Options to control the source and destination of the tunnel.
 */

export async function createTunnel( tunnelOptions: TunnelOptions, serverOptions: ServerOptions, sshOptions: SshOptions, forwardOptions: ForwardOptions ): Promise<[Server, Client]> {
    let sshOptionslocal = Object.assign({ port: 22, username: 'root' }, sshOptions);
    let forwardOptionsLocal = Object.assign({ dstAddr: '0.0.0.0' }, forwardOptions);
    let tunnelOptionsLocal = Object.assign({ autoClose: false, reconnectOnError: false }, tunnelOptions || {});
    let server: any, sshConnection: any;


    return new Promise(async function (resolve, reject) {
        try {
            sshConnection = await createSSHConnection(sshOptionslocal);
            addListenerSshConnection(sshConnection);
        } catch (e) {
            if (server) {
                server.close()
            }
            return reject(e);
        }
        
        try {
            server = await createServer(serverOptions);
            addListenerServer(server);
        } catch (e) {
            return reject(e);
        }

        function addListenerSshConnection(sshConnection: any) {        
            if (tunnelOptionsLocal.reconnectOnError) {
                sshConnection.on('error', async () => {
                    sshConnection.isBroken = true;
                    sshConnection = await createSSHConnection(sshOptionslocal);
                    addListenerSshConnection(sshConnection);
                });
            }
        }

        function addListenerServer(server: any) {
            if (tunnelOptionsLocal.reconnectOnError) {
                server.on('error', async () => {
                    server = await createServer(serverOptions);
                    addListenerServer(server);
                });
            }
            server.on('connection', onConnectionHandler);
            server.on('close', () => sshConnection.end());
        }

        function onConnectionHandler(clientConnection: any) {

            if (!forwardOptionsLocal.srcPort) {
                forwardOptionsLocal.srcPort =  server.address() .port;
            }
            if (!forwardOptionsLocal.srcAddr) {
                forwardOptionsLocal.srcAddr = server.address().address;
            }

            if (tunnelOptionsLocal.autoClose) {
                autoClose(server, clientConnection);
            }

            if (sshConnection.isBroken) {
                return;
            }

            sshConnection.forwardOut(
                forwardOptionsLocal.srcAddr,
                forwardOptionsLocal.srcPort,
                forwardOptionsLocal.dstAddr,
                forwardOptionsLocal.dstPort, (err: Error, stream: any) => {
                    if (err) {
                        if (server) {
                            server.close()
                        }
                        throw err;
                    } else {
                        clientConnection.pipe(stream).pipe(clientConnection);
                    }
                });

        }
        resolve([server, sshConnection]);
    });
}