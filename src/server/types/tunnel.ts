/**
 * Typescript type definition file.
 * feel free to provide pull requests.
 * Special thanks to https://github.com/derekrliang for the initial file.
 */

import { ListenOptions } from "net";
import { ConnectConfig } from "ssh2";


/*
* SSH client related options.
* @see https://www.npmjs.com/package/ssh2?activeTab=readme#client-methods
*/
export type SshOptions = ConnectConfig;

/*
* TCP server related options.
* @see https://nodejs.org/api/net.html#net_server_listen_options_callback
*/
export type ServerOptions = ListenOptions;


/**
 * Controls be behaviour of the tunnel server.
 */
export interface TunnelOptions {
  /*
   * specifies if the tunnel should close automatically after all clients have disconnected.
   * useful for cli scripts or any other short lived processes.
   * @default false
   */
  autoClose: boolean;
}

/**
 * If the `srcAddr` or `srcPort` is not defined, the adress will be taken from the local TCP server
 */
export interface ForwardOptions {
  /*
  * The address or interface we want to listen on.
  * @default ServerOptions.address
  **/
  srcAddr?: string;
  /*
  * The port or interface we want to listen on.
  * @default ServerOptions.port
  **/
  srcPort?: number;
  /*
  * the address we want to forward the traffic to.
  * @default "0.0.0.0"
  **/
  dstAddr?: string;
  /*
  * the port we want to forward the traffic to.
  */
  dstPort: number;
}
