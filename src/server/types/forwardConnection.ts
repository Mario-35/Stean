/**
 * forwardConnection interface
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- forwardConnection interface -----------------------------------!");

export interface IforwardConnection {
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
