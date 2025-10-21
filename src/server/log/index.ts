import { _DEBUG, appVersion, timestampNow } from "../constants";
import { EChar, EColor, EConstant, EInfos } from "../enums";
import util from "util";
import { logToHtml } from "../helpers";
import { paths } from "../paths";

export class LoggingResult {
    _toFile: string | undefined = undefined;
    _toString: string | undefined = undefined;

    constructor(input: string) {
        if (input.trim() !== "") {
            this._toFile = logToHtml(input);
            this._toString = input + `\x1b[${EColor.Reset}m${EConstant.return}`;
        }
        Logging._s = "";
    }

    file() {
        if (this._toFile) paths.logFile.writeStream(this._toFile);
        return this;
    }

    log() {
        if (this._toString) process.stdout.write(this._toString);
        return this;
    }

    text() {
        return this._toString;
    }

    result(test: boolean) {
        return test;
    }
}

// class to logCreate configs environements
export class Logging {
    static _s: string;
    static can: boolean = false;
    init(state: boolean = true) {
        Logging._s = "";
        Logging.can = state;
        return this;
    }

    private add(input: any) {
        if (input) Logging._s += input;
    }

    return() {
        this.add(EConstant.return);
    }

    color(col?: number) {
        this.add(`\x1b[${col || EColor.White}m`);
        return this;
    }

    text(text: string, col?: number) {
        this.color(col);
        this.add(this.objet(text));
        return this;
    }

    line(nb: number, col?: number) {
        this.color(col);
        this.add("■".repeat(nb));
        return this;
    }

    space(text?: string) {
        this.add(text ? ` ${text} ` : " ");
        return this;
    }

    head<T>(cle: string) {
        this.init(Logging.can);
        if (Logging.can === true) {
            this.line(12, EColor.Blue);
            this.color(EColor.White);
            this.space(cle);
            this.line(12, EColor.Blue);
        }
        return this;
    }

    whereIam(input?: string) {
        // important to preserve catch console log error
        if (_DEBUG === true) {
            this.init(Logging.can);
            this.text("■■■► ", EColor.Red);
            this.message(
                new Error().stack?.split(EConstant.return)[2].trim().split("(")[0].split("at ")[1].trim() || "Error",
                input?.split(EConstant.return)[2].trim().split("(")[0].split("at ")[1].trim(),
                "FROM"
            );
            this.text(" ◀■■■", EColor.Red);
            return this.to().text();
        }
        return undefined;
    }

    sep(input?: string, col?: number) {
        this.color(col || EColor.Cyan);
        this.add(` ${input || ":"} `);
        return this;
    }

    date(col?: number) {
        this.color(col || EColor.Green);
        this.add(` ${new Date().toLocaleDateString()} : ${timestampNow()} `);
        return this;
    }

    separator(title: string, col: number = EColor.Cyan, end?: boolean) {
        this.init(Logging.can);
        if (Logging.can === true) {
            if (end) this.text("◀", col);
            this.line(20, col);
            this.space(title);
            this.line(20, col);
            if (end) this.text("► ");
        }
        return this;
    }

    objet(input: any) {
        return typeof input === "object" ? util.inspect(input, { showHidden: false, depth: null, colors: true }) : input;
    }

    // function to be used in catch

    error<T>(message: string = "Error", error: T) {
        this.separator(message, EColor.Red);
        this.return();
        this.add(this.objet(error));
        return this;
    }

    /**
     *
     * @param cle key message
     * @param infos  message
     * @returns formated string
     */
    public message<T>(cle: string, infos: T, sep?: string) {
        if (Logging.can === true) {
            this.text(cle, EColor.Green);
            this.sep(sep);
            this.color(EColor.White);
            this.add(this.objet(infos));
        }
        return this;
    }

    write(test: boolean) {
        if (test === true && Logging._s) {
            const tmp = this.toString();
            process.stdout.write(tmp + EConstant.return);
            // write in stream file
            paths.logFile.writeStream(logToHtml(tmp + EConstant.return));
        }
        return this;
    }

    /**
     *
     * @param sql sql query
     * @returns formated string
     */
    query(src: string, sql: unknown) {
        this.init(Logging.can);
        if (Logging.can === true) {
            this.separator("[ Query " + src + " ]", EColor.Blue);
            this.add(EConstant.return);
            this.color(EColor.Sql);
            this.add(this.objet(sql));
        }
        return this;
    }

    start() {
        this.init();
        this.line(20, EColor.Magenta);
        this.color(EColor.Cyan);
        this.space(`START ${EConstant.appName} ${EInfos.ver} : ${appVersion.version}`);
        this.text("du");
        this.color(EColor.Yellow);
        this.space(`${appVersion.date} [${process.env.NODE_ENV}]`);
        this.line(20, EColor.Magenta);
        return this;
    }

    logo() {
        this.color(EColor.Blue);
        this.return();
        this.text(` ____ __________    _     _   _`, EColor.Green);
        this.return();
        this.text(`/ ___|_ __  ____|  / \\   | \\ | |`, EColor.Green);
        this.return();
        this.text(`\\___ \\| | |  _|   / _ \\  |  \\| |`, EColor.Green);
        this.return();
        this.text(` ___) | | | |___ / ___ \\ | |\\  |`, EColor.Green);
        this.return();
        this.text(`|____/|_| |_____|_/   \\_\\|_| \\_|`, EColor.Green);
        this.space();
        this.text(`run API ${EChar.arrowright}`, EColor.Blue);
        this.text(` ${appVersion.version} du ${appVersion.date}`, EColor.Green);
        this.return();
        this.space(EChar.web);
        this.text("https://github.com/Mario-35/Stean/", EColor.White);
        this.space(EChar.mail);
        this.text("mario.adam@inrae.fr", EColor.Yellow);
        this.return();
        return this;
    }

    to() {
        return new LoggingResult(Logging.can === true ? Logging._s : "");
    }

    debug(force?: boolean) {
        Logging.can = force || _DEBUG;
        return this;
    }

    status(test: boolean, cle: string, car: string = EChar.arrowright) {
        this.init();
        this.text(" ".repeat(4));
        this.color(EColor.Blue);
        this.space(car);
        this.color(EColor.Default);
        this.space(cle);
        this.text(test ? EChar.ok : EChar.notOk);
        return this;
    }

    force(data: any, separator?: boolean) {
        this.init(true);
        if (separator) this.add("=".repeat(50));
        this.add(this.objet(data));
        process.stdout.write(Logging._s + `\x1b[${EColor.Reset}m${EConstant.return}`);
    }
}
export const logging = new Logging();
