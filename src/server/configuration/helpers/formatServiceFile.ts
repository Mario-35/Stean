/**
 * formatServiceFile
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
import util from "util";
import { EConstant } from "../../enums";
import { unikeList, unique } from "../../helpers";
import { errors } from "../../messages";
import { Iservice, typeExtensions } from "../../types";

/**
 *
 * @param name configuration name
 * @param input record of the configuration
 * @returns service
 */

export function formatServiceFile(name: string, input: Record<string, any>): Iservice {
    const options = input["options"] ? unique([...String(input["options"]).split(",")]) : [];
    const extensions: typeof typeExtensions = input["extensions"] ? (unique([...String(input["extensions"]).split(",")]) as typeof typeExtensions) : ["base"];
    const version = name === EConstant.admin ? "v1.1" : String(input["version"] || input["apiVersion"]).trim();

    const returnValue: Iservice = {
        date: new Date().toLocaleString(),
        name: name,
        ports:
            name === EConstant.admin
                ? {
                      http: input["ports"]["http"] || 8029,
                      tcp: input["ports"]["tcp"] || 9000,
                      ws: input["ports"]["ws"] || 1883
                  }
                : undefined,
        pg: {
            _ready: undefined,
            host: input["pg"] && input["pg"]["host"] ? String(input["pg"]["host"]) : `ERROR`,
            port: input["pg"] && input["pg"]["port"] ? input["pg"]["port"] : 5432,
            user: input["pg"] && input["pg"]["user"] ? input["pg"]["user"] : `ERROR`,
            password: input["pg"] && input["pg"]["password"] ? input["pg"]["password"] : `ERROR`,
            database: name && name === EConstant.test ? EConstant.test : input["pg"] && input["pg"]["database"] ? input["pg"]["database"] : `ERROR`,
            retry: input["retry"] ? +input["retry"] : 2
        },
        apiVersion: version,
        date_format: input["date_format"] || "DD/MM/YYYY hh:mi:ss",
        nb_page: input["nb_page"] ? +input["nb_page"] : 200,
        alias: input["alias"] ? unikeList(String(input["alias"]).split(",")) : [],
        extensions: extensions,
        options: options,
        csvDelimiter: input["csvDelimiter"] ? input["csvDelimiter"] : ";",
        synonyms: input["synonyms"] ? input["synonyms"] : undefined,
        _connection: undefined,
        users: undefined
    };

    if (Object.values(returnValue).includes("ERROR"))
        throw new TypeError(
            `${errors.inConfigFile} [${util.inspect(returnValue, {
                showHidden: false,
                depth: null
            })}]`
        );
    return returnValue;
}
