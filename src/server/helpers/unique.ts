/**
 * unique
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- unique -----------------------------------!");


export function unique(input: string[]): string[]  {
    return input.filter((e: string) => e.trim() != "").reduce((unique: string[], item: string) => unique.includes(item) ? unique : [... unique, item], []);
}