/**
 * escapesOdata
 *
 * @copyright 2022-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
export const escapesOdata = (input: string) : string => {
    const codes = { "/" : "%252F", "\\" : "%255C" };
    if (input.includes("%27")) {
        const pop:string[] = [];
        input.split("%27").forEach((v: string, i: number) => {
        if (i === 1) Object.keys(codes).forEach((code: string) => v = v.split(code).join(codes[code as keyof object]));      
        pop.push(v);
        });
        return pop.join("%27");
    }
    return input;
};