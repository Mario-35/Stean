/**
 * decode Tool
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 * NOT Use in API use to decode in command line
 *
 */
// onsole.log("!----------------------------------- decode Tool -----------------------------------!\n");

import fs from "fs";
import crypto from "crypto";

const decrypt = (input: string, key: string): string => {
  input = input.split("\r\n").join("");     
  if (typeof input === 'string' && input[32] == ".") {      
    try {
      const decipher = crypto.createDecipheriv( "aes-256-ctr", key, Buffer.from(input.substring(32, 0), "hex") );
      const decrpyted = Buffer.concat([ decipher.update(Buffer.from(input.slice(33), "hex")), decipher.final(), ]);
      return decrpyted.toString();
    } catch (error) {
      console.log(error);
    }
  }
  return input;
};

function decode(file: fs.PathOrFileDescriptor) {
  const fileTemp = fs.readFileSync(file, "utf8");
  const key = fs.readFileSync(__dirname +"/.key", "utf-8");
  return decrypt(fileTemp, key); 
}

process.stdout.write(decode(__dirname + `/configuration.json`) + "\n");