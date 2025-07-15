/**
 * createIndexes
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

// import { config } from "../../configuration";
// import { models } from "../../models";

// // this create index are executed without wait
// export const createIndexes = (name: string): void => {
//     Object.keys(models.DBFull(name)).forEach((entity: string) => {
//         const tmp = models.DBFull(name)[entity].update;
//         if (tmp) tmp.forEach(e => config
//             .connection(name)
//             .unsafe(e)
//             .catch((error: Error) => {
//                 console.error(error);
//                 console.log(error);
//                 return false;
//             }));
//     });
// }
