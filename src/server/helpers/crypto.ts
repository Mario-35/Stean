/**
 * crypto
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- crypto -----------------------------------!");

import crypto from "crypto";
import { APP_KEY } from "../constants";

/**
 * 
 * @param input string 
 * @returns encrypted string
 */
export const encrypt = (input: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-ctr", APP_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
  return `${iv.toString("hex")}.${encrypted.toString("hex")}`;
};

/**
 * 
 * @param input string 
 * @returns decrypted string
 */
export const decrypt = (input: string): string => {  
  input = input.split("\r\n").join("");
  if (typeof input === "string" && input[32] == ".") {      
    try {
        const decipher = crypto.createDecipheriv( "aes-256-ctr", APP_KEY, Buffer.from(input.substring(32, 0), "hex") );
        const decrpyted = Buffer.concat([ decipher.update(Buffer.from(input.slice(33), "hex")), decipher.final(), ]);
        return decrpyted.toString();
    } catch (error) {
      console.log(error);
    }
  }
  return input;
};