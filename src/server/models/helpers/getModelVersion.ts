/**
 * getModelVersion
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- getModelVersion -----------------------------------!\n");

import { EVersion } from "../../enums"

export function  getModelVersion(name: string): EVersion {
    switch (name) {
      case "v0.0":
        return EVersion.v0_0
      case "v1.1":
      case "1.1":
        return EVersion.v1_1
      default:
        return EVersion.v1_0
    }
  }