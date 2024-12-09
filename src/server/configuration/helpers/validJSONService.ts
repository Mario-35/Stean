  /**
 * validJSONService
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { EConstant } from "../../enums";
import { keyobj } from "../../types";

/**
 * Verify is valid config
 * 
 * @param input record service
 * @returns true if the service is valid
 */
export function validJSONService(input: Record<string, any> ): boolean {    
  if (!input.hasOwnProperty(EConstant.admin)) return false;
  if (!input[EConstant.admin].hasOwnProperty("pg")) return false;
  const admin = input[EConstant.admin]["pg" as keyobj] as JSON;
  if (!admin.hasOwnProperty("host")) return false;
  if (!admin.hasOwnProperty("user")) return false;
  if (!admin.hasOwnProperty("password")) return false;
  if (!admin.hasOwnProperty("database")) return false;
  return true;
}