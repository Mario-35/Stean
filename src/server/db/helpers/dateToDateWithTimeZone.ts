/**
 * dateToDateWithTimeZone.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- dateToDateWithTimeZone. -----------------------------------!");

import { log } from "../../log";

export const dateToDateWithTimeZone = (value: string) => {
    console.log(log.whereIam());
    //Create Date object from ISO string
    const date = new Date(value);
    //Get ms for date
    const time = date.getTime();
    //Check if timezoneOffset is positive or negative
    if (date.getTimezoneOffset() <= 0) {
      //Convert timezoneOffset to hours and add to Date value in milliseconds
      const final = time + Math.abs(date.getTimezoneOffset() * 60000);
      //Convert from milliseconds to date and convert date back to ISO string
      return new Date(final).toISOString();
    } else {
      const final = time + -Math.abs(date.getTimezoneOffset() * 60000);
      return new Date(final).toISOString();
    }
  };