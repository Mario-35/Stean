/**
 * Common class entity
 *f
 * @copyright 2020-present Inrae
 * @review 29-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { returnFormats } from "../../helpers/index";
import { Id, IreturnResult, koaContext } from "../../types";
import { executeSqlValues, removeKeyFromUrl } from "../helpers";
import { logging } from "../../log";
import { config } from "../../configuration";
import { EConstant, EHttpCode, EInfos } from "../../enums";
import { queries } from "../queries";
import { _DEBUG } from "../../constants";

/**
 * Common Class for all entities
 */

export class Common {
    readonly ctx: koaContext;
    public nextLinkBase: string;
    public linkBase: string;

    constructor(ctx: koaContext) {
        console.log(logging.whereIam(new Error().stack));
        this.ctx = ctx;
        this.nextLinkBase = removeKeyFromUrl(`${this.ctx._.root()}/${this.ctx.href.split(`${ctx._.service.apiVersion}/`)[1]}`, ["top", "skip"]);
        this.linkBase = `${this.ctx._.root()}/${this.constructor.name}`;
    }

    getErrorCode(err: Error | any, actual: number): number {
        return err["where"] && err["where"].includes("verifyid") ? EHttpCode.notFound : actual;
    }

    /**
     * Get a value from key in a record
     *
     * @param input Record
     * @param key to search
     * @returns result string if exist
     */
    private getKeyValue(input: Record<string, any>, key: string): string | undefined {
        let result: string | undefined = undefined;
        if (input[key]) {
            result = input[key][EConstant.id] ? input[key][EConstant.id] : input[key];
            delete input[key];
        }
        return result;
    }

    /**
     * Get a list of values from list of keys in a record
     *
     * @param input Record
     * @param keys to search
     * @returns list of result strings if exist
     */
    public getKeysValue(input: Record<string, any>, keys: string[]): string | undefined {
        keys.forEach((key) => {
            return this.getKeyValue(input, key);
        });
        return undefined;
    }

    // Only for override
    formatDataInput(input: Record<string, any> | undefined): Record<string, any> | undefined {
        return input;
    }

    /**
     * Create a blank ReturnResult
     *
     * @param args Record
     * @returns IreturnResult
     */
    public formatReturnResult(args: Record<string, any>): IreturnResult {
        console.log(logging.whereIam(new Error().stack));
        return {
            ...{
                location: args[EConstant.selfLink] ? String(args[EConstant.selfLink]) : args.body && typeof args.body === "object" ? args.body[EConstant.selfLink] : undefined,
                [EConstant.count]: args[EConstant.count] ? +args[EConstant.count] : undefined,
                [EConstant.nextLink]: args[EConstant.nextLink] ? String(args[EConstant.nextLink]) : undefined,
                [EConstant.prevLink]: args[EConstant.selfLink] ? String(args[EConstant.selfLink]) : undefined,
                body: undefined,
                total: undefined
            },
            ...args
        };
    }

    /**
     * Create the nextLink string
     *
     * @param resLength actual index
     * @returns string if correct
     */
    public nextLink = (resLength: number): string | undefined => {
        if (this.ctx._.odata.limit < 1) return;
        const max: number = this.ctx._.odata.limit > 0 ? +this.ctx._.odata.limit : +this.ctx._.service.nb_page;
        if (resLength >= max) return `${encodeURI(this.nextLinkBase)}${this.nextLinkBase.includes("?") ? "&" : "?"}$top=${this.ctx._.odata.limit}&$skip=${this.ctx._.odata.skip + this.ctx._.odata.limit}`;
    };

    /**
     * Create the prevLink string
     *
     * @param resLength actual index
     * @returns string if correct
     */
    public prevLink = (resLength: number): string | undefined => {
        if (this.ctx._.odata.limit < 1) return;
        const prev = this.ctx._.odata.skip - this.ctx._.odata.limit;
        if (((this.ctx._.service.nb_page && resLength >= this.ctx._.service.nb_page) || this.ctx._.odata.limit) && prev >= 0)
            return `${encodeURI(this.nextLinkBase)}${this.nextLinkBase.includes("?") ? "&" : "?"}$top=${this.ctx._.odata.limit}&$skip=${prev}`;
    };

    /**
     * Return all items
     *
     * @returns IreturnResult | undefined
     */
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // create query
        let sql = this.ctx._.odata.getSql();
        // Return results
        if (sql) {
            switch (this.ctx._.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });
                // create csv format values
                case returnFormats.csv:
                    sql = queries.asCsv(sql, this.ctx._.service.csvDelimiter);
                    this.ctx.attachment(`${this.ctx._.odata.entity?.name || "export"}.csv`);
                    logging.query("Get csv", sql).toLogAndFile();
                    return this.formatReturnResult({ body: await config.connection(this.ctx._.service.name).unsafe(sql).readable() });
                default:
                    return await executeSqlValues(this.ctx._.service, sql)
                        .then(async (res: Record<string, any>) => {
                            if (this.ctx._.odata.returnFormat === returnFormats.dataArray) res[0] = +Object.entries(res[1][0]["dataArray"]).length;
                            return res[0] > 0
                                ? this.formatReturnResult({
                                      [EConstant.count]: this.ctx._.odata.returnFormat === returnFormats.dataArray ? +Object.entries(res[1][0]["dataArray"]).length : +res[0],
                                      [EConstant.nextLink]: this.nextLink(res[0]),
                                      [EConstant.prevLink]: this.prevLink(res[0]),
                                      value: res[1]
                                  })
                                : this.formatReturnResult({ body: res[0] == 0 ? { "value": [] } : res[0] });
                        })
                        .catch((err: Error) => this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: err.message }));
            }
        }
    }

    /**
     * Return one item
     *
     * @returns IreturnResult | undefined
     */
    async getSingle(): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // create query
        const sql = this.ctx._.odata.getSql();
        // Return results
        if (sql)
            switch (this.ctx._.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });
                // return only GeoJSON values
                case returnFormats.GeoJSON:
                    return await executeSqlValues(this.ctx._.service, sql).then((res: Record<string, any>) => {
                        return this.formatReturnResult({ body: res[0] });
                    });
                // json values
                default:
                    return await executeSqlValues(this.ctx._.service, sql)
                        .then((res: Record<string, any>) => {
                            if (this.ctx._.odata.query.select && this.ctx._.odata.onlyValue === true) {
                                this.ctx._.odata.returnFormat = typeof res[0] === "object" ? returnFormats.json : returnFormats.txt;
                                return res[0];
                            }
                            return isNaN(res[0]) || +res[0] === 0
                                ? undefined
                                : this.formatReturnResult({
                                      body: this.ctx._.odata.single === true ? res[1][0] : { value: res[1] }
                                  });
                        })
                        .catch((err: Error) => this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: err }));
            }
    }

    /**
     * Execute multilines SQL in one query
     *
     * @param dataInput record of queries
     * @returns IreturnResult
     */
    async addMultiLines(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // stop save to log cause if datainput too big
        if (this.ctx.log) this.ctx.log.datas = { datas: EInfos.MultilinesNotSaved };
        // create queries
        const sqls: string[] = Object(dataInput).map((datas: Record<string, any>) => {
            const modifiedDatas = this.formatDataInput(datas);
            if (modifiedDatas) {
                const sql = this.ctx._.odata.postSql(modifiedDatas);
                if (sql) return sql;
            }
        });
        // return results
        const results: Record<string, any>[] = [];
        // execute query
        await executeSqlValues(this.ctx._.service, sqls.join(";"))
            .then((res: Record<string, any>) => results.push(res[0 as keyof object]))
            .catch((error: Error) => {
                this.ctx.throw(EHttpCode.badRequest, logging.error(error).return({ code: EHttpCode.badRequest, detail: error["detail" as keyof object] }));
            });
        // Return results
        return this.formatReturnResult({
            body: results
        });
    }

    /**
     * Post an item
     *
     * @param dataInput Recocd input
     * @returns IreturnResult
     */
    async post(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));

        // Format datas
        dataInput = this.formatDataInput(dataInput);
        if (!dataInput) return;

        // create query
        const sql = this.ctx._.odata.postSql(dataInput);

        // Return results
        if (sql)
            switch (this.ctx._.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });

                // JSON values
                default:
                    return await executeSqlValues(this.ctx._.service, sql)
                        .then((res: Record<string, any>) => {
                            if (res[0]) {
                                if (res[0].duplicate)
                                    this.ctx.throw(EHttpCode.conflict, {
                                        code: EHttpCode.conflict,
                                        detail: `${this.constructor.name} already exist`,
                                        link: `${this.linkBase}(${[res[0].duplicate]})`
                                    });
                                return this.formatReturnResult({
                                    body: res[0][0],
                                    query: sql
                                });
                            }
                        })
                        .catch((err: Error) => {
                            const code = this.getErrorCode(err, 400);
                            this.ctx.throw(code, { code: code, detail: err.message });
                        });
            }
    }

    /**
     * Put an item
     *
     * @param dataInput Recocd input
     * @returns IreturnResult
     */
    async put(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        if (dataInput && this.ctx._.odata.entity) {
            // Format datas
            dataInput = this.formatDataInput(dataInput);
            if (dataInput)
                return await executeSqlValues(this.ctx._.service, queries.getIdFromName(this.ctx._.odata.entity.table, dataInput["name" as keyof object]))
                    .then((res) => {
                        // search id from name
                        this.ctx._.odata.id = res[0 as keyof object];
                        // update
                        return this.update(dataInput);
                    })
                    .catch((err: Error) => {
                        console.log(err);
                        // insert
                        return this.post(dataInput);
                    });
        }
    }

    /**
     * Update (Patch) an item
     *
     * @param dataInput Recocd input
     * @returns IreturnResult
     */
    async update(dataInput: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));

        // Format datas
        dataInput = this.formatDataInput(dataInput);
        if (!dataInput) return;

        // create Query
        const sql = this.ctx._.odata.patchSql(dataInput);

        // Return results
        if (sql)
            switch (this.ctx._.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });
                // JSON values
                default:
                    return await executeSqlValues(this.ctx._.service, sql)
                        .then((res: Record<string, any>) => {
                            if (res[0]) {
                                return this.formatReturnResult({
                                    body: res[0][0],
                                    query: sql
                                });
                            }
                        })
                        .catch((err: Error) => {
                            const code = this.getErrorCode(err, 400);
                            this.ctx.throw(code, { code: code, detail: err.message });
                        });
            }
    }

    /**
     * Delete (Patch) an item
     *
     * @param dataInput Recocd input
     * @returns IreturnResult
     */
    async delete(idInput: Id | string): Promise<IreturnResult | undefined> {
        console.log(logging.whereIam(new Error().stack));
        // create Query
        const sql = queries.deleteFromId(this.ctx._.model()[this.constructor.name].table, idInput);
        // Return results
        switch (this.ctx._.odata.returnFormat) {
            // return only postgres sql query as a string
            case returnFormats.sql:
                return this.formatReturnResult({ body: sql });
            // JSON values
            default:
                return this.formatReturnResult({
                    body: await executeSqlValues(this.ctx._.service, sql)
                        .then((res) => res)
                        .catch(() => 0)
                });
        }
    }
}
