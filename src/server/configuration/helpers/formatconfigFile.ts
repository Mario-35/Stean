/**
 * formatconfigFile
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- formatconfigFile -----------------------------------!");

import { ADMIN, TEST } from "../../constants";
import util from "util";
import { EVersion } from "../../enums";
import { unikeList, unique } from "../../helpers";
import { errors } from "../../messages";
import { Iservice, typeExtensions, typeOptions } from "../../types";
import { getModelVersion } from "../../models/helpers";

export function formatconfigFile(name: string, input: Record<string, any>): Iservice {
    const options: typeof typeOptions = input["options"]
    ? unique([... String(input["options"]).split(",")]) as typeof typeOptions 
    : [];

    const extensions: typeof typeExtensions = input["extensions"]
      ? unique(["base", ... String(input["extensions"]).split(",")]) as typeof typeExtensions 
      : ["base"];

    if (input["extensions"]["users"]) extensions.includes("users");
    const version = name === ADMIN ? EVersion.v1_1  : String(input["apiVersion"]).trim();

    const returnValue: Iservice = {
      name: name,
      ports: name === ADMIN
          ? {
            "http": input["ports"]["http"] || 8029,
            "tcp": input["ports"]["tcp"] || 9000,
            "ws": input["ports"]["ws"] || 1883
          }
          : undefined,
      pg: {
        _ready: undefined,
        host: input["pg"] && input["pg"]["host"] ? String(input["pg"]["host"]) : `ERROR`,
        port: input["pg"] && input["pg"]["port"] ? input["pg"]["port"] : 5432,
        user: input["pg"] && input["pg"]["user"] ? input["pg"]["user"] : `ERROR`,
        password: input["pg"] && input["pg"]["password"] ? input["pg"]["password"] : `ERROR`,
        database: name && name === TEST ? "test" : input["pg"] && input["pg"]["database"] ? input["pg"]["database"] : `ERROR`,
        retry: input["retry"] ? +input["retry"] : 2,
        tunnel: input["pg"] && input["pg"]["tunnel"] ?  {
          sshConnection: {
            host: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["sshConnection"]["host"] ? input["pg"]["tunnel"]["sshConnection"]["host"] : `ERROR`,
            username: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["sshConnection"]["username"] ? input["pg"]["tunnel"]["sshConnection"]["username"] : `ERROR`,
            port: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["sshConnection"]["port"] ? input["pg"]["tunnel"]["sshConnection"]["port"] : 22,
            password: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["sshConnection"]["password"] ? input["pg"]["tunnel"]["sshConnection"]["password"] : `ERROR`,
          },
          forwardConnection: {
            srcAddr: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["forwardConnection"]["srcAddr"] ? input["pg"]["tunnel"]["forwardConnection"]["srcAddr"] : `ERROR`,
            srcPort: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["forwardConnection"]["srcPort"] ? input["pg"]["tunnel"]["forwardConnection"]["srcPort"] : 22,
            dstAddr: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["forwardConnection"]["dstAddr"] ? input["pg"]["tunnel"]["forwardConnection"]["dstAddr"] : `ERROR`,
            dstPort: input["pg"] && input["pg"]["tunnel"] &&  input["pg"]["tunnel"]["forwardConnection"]["dstPort"] ? input["pg"]["tunnel"]["forwardConnection"]["dstPort"] : 22
          }
        } : undefined 
      },
      apiVersion: getModelVersion(version),
      date_format: input["date_format"] || "DD/MM/YYYY hh:mi:ss",
      nb_page: input["nb_page"] ? +input["nb_page"] : 200,
      alias: input["alias"] ? unikeList(String(input["alias"]).split(",")) : [],
      extensions: extensions,
      options: options,
      _connection: undefined,
    };    
    if (Object.values(returnValue).includes("ERROR"))
      throw new TypeError(
        `${errors.inConfigFile} [${util.inspect(returnValue, {
          showHidden: false,
          depth: null,
        })}]`
      );
    return returnValue;
  }