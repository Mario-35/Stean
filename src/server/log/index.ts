import { _DEBUG, timestampNow } from "../constants";
import { color, EChar, EColor, EConstant } from "../enums";
import util from "util";
import { logToHtml } from "../helpers";
import { paths } from "../paths";

// class to logCreate configs environements
class Logging {
    static _s: string = "";

    init(input?: string, col?: number) {
        Logging._s = "";
        if (input) this.text(input, col);
        return this;
    }

    color(col?: number) {
        Logging._s += `\x1b[${col || EColor.White}m`;
        return this;
    }

    text(text: string, col?: number) {
        this.color(col);
        Logging._s += this.objet(text);
        return this;
    }

    line(nb: number, col?: number) {
        this.color(col);
        Logging._s += "▬".repeat(nb);
        return this;
    }

    space(text?: string) {
        Logging._s += text ? ` ${text} ` : " ";
        return this;
    }

    whereIam(input: string | undefined, infos?: string) {
        Logging._s = "";
        if (_DEBUG) {
            this.color(EColor.Logo);
            Logging._s += "===> ";
            this.message(
                new Error().stack?.split(EConstant.return)[2].trim().split("(")[0].split("at ")[1].trim() || "Error",
                input?.split(EConstant.return)[2].trim().split("(")[0].split("at ")[1].trim(),
                "FROM"
            );
            if (infos) this.space(infos);
            this.color(EColor.Logo);
            Logging._s += " <===";
        }
        return this;
    }

    toString() {
        const tmp = Logging._s;
        Logging._s = "";
        return tmp;
    }

    sep(input?: string, col?: number) {
        this.color(col || EColor.Cyan);
        Logging._s += ` ${input || ":"} `;
        return this;
    }

    date(col?: number) {
        this.color(col || EColor.Green);
        Logging._s += ` ${new Date().toLocaleDateString()} : ${timestampNow()} `;
        return this;
    }

    separator(title: string, col?: number) {
        Logging._s = this.init()
            .line(20, col || EColor.Red)
            .space()
            .text(title)
            .space()
            .line(20, col || EColor.Red)
            .toString();
        return this;
    }

    objet(input: any) {
        return typeof input === "object" ? util.inspect(input, { showHidden: false, depth: null, colors: true }) : input;
    }

    error<T>(cle: unknown, infos?: T) {
        this.init(String(cle), EColor.Cyan);
        this.sep();
        this.color(EColor.Magenta);
        if (infos) this.objet(infos);
        return this;
    }

    /**
     *
     * @param cle key message
     * @param infos  message
     * @returns formated string
     */
    public message<T>(cle: string, infos: T, sep?: string) {
        this.text(cle, EColor.Green).sep(sep).color(EColor.White);
        Logging._s += this.objet(infos);
        return this;
    }

    write(test: boolean) {
        if (test === true && Logging._s) {
            const tmp = this.toString();
            if (tmp) {
                process.stdout.write(tmp + EConstant.return);
                // write in stream file
                paths.logFile.writeStream(logToHtml(tmp + EConstant.return));
            }
        }
        return this;
    }

    result(test: boolean) {
        return test;
    }

    /**
     *
     * @param sql sql query
     * @returns formated string
     */
    public query(src: string, sql: unknown) {
        if (_DEBUG) {
            this.separator("[ Query " + src + " ]");
            Logging._s += EConstant.return;
            this.color(EColor.Cyan);
            Logging._s += this.objet(sql);
        }
        return this;
    }

    /**
     * format Sql error
     *
     * @param query sql query
     * @param error error message
     * @returns formated string
     */
    public queryError<T>(query: unknown, error: T) {
        this.separator("ERROR");
        Logging._s += this.objet(error);
        Logging._s += this.objet(query);
        return this;
    }

    head<T>(cle: string, col: number = EColor.Cyan) {
        Logging._s = "";
        this.line(12, col);
        this.color(EColor.White);
        this.space(cle);
        this.line(12, col);
        return this;
    }

    logo(ver: string) {
        Logging._s =
            `${color(EColor.Code)}${color(EColor.Sql)}${EConstant.return} ____ __________    _     _   _ ${EConstant.return}/ ___|_ __  ____|  / \\   | \\ | |${
                EConstant.return
            }\\___ \\| | |  _|   / _ \\  |  \\| |${EConstant.return} ___) | | | |___ / ___ \\ | |\\  |${EConstant.return}|____/|_| |_____|_/   \\_\\|_| \\_|  ${color(EColor.Blue)}run API ${
                EChar.arrowright
            } ${color(EColor.Green)} ${ver}${color(EColor.Sql)}${color(EColor.Code)}${EConstant.return}${EChar.web} ${color(EColor.White)}https://github.com/Mario-35/Stean/ ${EChar.mail} ${color(
                EColor.Yellow
            )} mario.adam@inrae.fr${color(EColor.Reset)}` + EConstant.return;
        return this;
    }

    status(cle: string, infos: string | undefined, test: boolean) {
        if (infos) {
            this.text(cle, EColor.Magenta).sep().color(EColor.White);
            Logging._s += this.objet(infos);
        } else {
            Logging._s = "    ";
            this.color(EColor.Sql);
            this.space(EChar.arrowright);
            this.color(EColor.Default);
            this.space(cle);
        }
        this.space(test ? EChar.ok : EChar.notOk);
        return this;
    }
}
export const logging = new Logging();
