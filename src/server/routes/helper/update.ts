/**
 * Update Helpers.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { execSync } from 'child_process';

export const update = () => {
    execSync('sh ../../update.sh');
    process.exit(100);
}