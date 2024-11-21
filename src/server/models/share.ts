import { IKeyString } from "../types";

export class Pass {
    static pass:  {
        [key: string]: {
            constraints:  IKeyString; 
            indexes:      IKeyString;
        }
    } = {};

}