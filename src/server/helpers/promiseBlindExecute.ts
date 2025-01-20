/**
 * promiseBlindExecute
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { spawn } from "child_process";

/**
 * A promise wrapper for the child-process spawn function. Does not listen for results.
 * @param command - The command to execute.
 * @param waitTime - milisecond to wait
 */
export async function promiseBlindExecute(command: string, waitTime: number) {
    return new Promise(function (resolve, reject) {
        spawn(command, [], { shell: true, detached: true });
        setTimeout(resolve, waitTime);
    });
}
