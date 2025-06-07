/**
 * Common class entity
 *f
 * @copyright 2020-present Inrae
 * @review 29-01-2024
 * @author mario.adam@inrae.fr
 *
 */

import { doubleQuotesString, returnFormats } from "../../helpers/index";
import { IreturnResult, keyobj, koaContext } from "../../types";
import { removeKeyFromUrl } from "../helpers";
import { getErrorCode, info } from "../../messages";
import { log } from "../../log";
import { config } from "../../configuration";
import { EConstant, EHttpCode } from "../../enums";
import { asCsv } from "../queries";

/**
 * Common Class for all entities
 */

export class Common {
    readonly ctx: koaContext;
    public nextLinkBase: string;
    public linkBase: string;

    constructor(ctx: koaContext) {
        console.log(log.whereIam());
        this.ctx = ctx;
        this.nextLinkBase = removeKeyFromUrl(`${this.ctx.decodedUrl.root}/${this.ctx.href.split(`${ctx.service.apiVersion}/`)[1]}`, ["top", "skip"]);
        this.linkBase = `${this.ctx.decodedUrl.root}/${this.constructor.name}`;
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
        console.log(log.whereIam());
        return {
            ...{
                // id: undefined,
                selfLink: args.body && typeof args.body === "object" ? args.body["@iot.selfLink" as keyof object] : undefined,
                nextLink: args.nextLink ? (args.nextLink as string) : undefined,
                prevLink: args.prevLink ? (args.prevLink as string) : undefined,
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
        if (this.ctx.odata.limit < 1) return;
        const max: number = this.ctx.odata.limit > 0 ? +this.ctx.odata.limit : +this.ctx.service.nb_page;
        if (resLength >= max) return `${encodeURI(this.nextLinkBase)}${this.nextLinkBase.includes("?") ? "&" : "?"}$top=${this.ctx.odata.limit}&$skip=${this.ctx.odata.skip + this.ctx.odata.limit}`;
    };

    /**
     * Create the prevLink string
     *
     * @param resLength actual index
     * @returns string if correct
     */
    public prevLink = (resLength: number): string | undefined => {
        if (this.ctx.odata.limit < 1) return;
        const prev = this.ctx.odata.skip - this.ctx.odata.limit;
        if (((this.ctx.service.nb_page && resLength >= this.ctx.service.nb_page) || this.ctx.odata.limit) && prev >= 0) return `${encodeURI(this.nextLinkBase)}${this.nextLinkBase.includes("?") ? "&" : "?"}$top=${this.ctx.odata.limit}&$skip=${prev}`;
    };

    /**
     * Return all items
     *
     * @returns IreturnResult | undefined
     */
    async getAll(): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        // create query
        let sql = this.ctx.odata.getSql();
        // Return results
        if (sql) {
            switch (this.ctx.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });
                // create csv format values
                case returnFormats.csv:
                    sql = asCsv(sql, this.ctx.service.csvDelimiter);
                    config.writeLog(log.query(sql));
                    this.ctx.attachment(`${this.ctx.odata.entity?.name || "export"}.csv`);
                    return this.formatReturnResult({ body: await config.connection(this.ctx.service.name).unsafe(sql).readable() });
                default:
                    return await config
                        .executeSqlValues(this.ctx.service, sql)
                        .then(async (res: Record<string, any>) => {
                            if (this.ctx.odata.returnFormat === returnFormats.dataArray) res[0] = +Object.entries(res[1][0]["dataArray"]).length;
                            return res[0] > 0
                                ? this.formatReturnResult({
                                      "@iot.count": this.ctx.odata.returnFormat === returnFormats.dataArray ? +Object.entries(res[1][0]["dataArray"]).length : +res[0],
                                      "@iot.nextLink": this.nextLink(res[0]),
                                      "@iot.prevLink": this.prevLink(res[0]),
                                      value: res[1]
                                  })
                                : this.formatReturnResult({ body: res[0] == 0 ? [] : res[0] });
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
        console.log(log.whereIam());
        // create query
        const sql = this.ctx.odata.getSql();
        // Return results
        if (sql)
            switch (this.ctx.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });
                // return only GeoJSON values
                case returnFormats.GeoJSON:
                    return await config.executeSqlValues(this.ctx.service, sql).then((res: Record<string, any>) => {
                        return this.formatReturnResult({ body: res[0] });
                    });
                // json values
                default:
                    return await config
                        .executeSqlValues(this.ctx.service, sql)
                        .then((res: Record<string, any>) => {
                            if (this.ctx.odata.query.select && this.ctx.odata.onlyValue === true) {
                                this.ctx.odata.returnFormat = typeof res[0] === "object" ? returnFormats.json : returnFormats.txt;
                                return res[0];
                            }
                            return isNaN(res[0]) || +res[0] === 0
                                ? undefined
                                : this.formatReturnResult({
                                      nextLink: this.nextLink(res[0]),
                                      prevLink: this.prevLink(res[0]),
                                      body: this.ctx.odata.single === true ? res[1][0] : { value: res[1] }
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
        console.log(log.whereIam());
        // TODO
        // stop save to log cause if datainput too big
        if (this.ctx.log) this.ctx.log.datas = { datas: info.MultilinesNotSaved };
        // create queries
        const sqls: string[] = Object(dataInput).map((datas: Record<string, any>) => {
            const modifiedDatas = this.formatDataInput(datas);
            if (modifiedDatas) {
                const sql = this.ctx.odata.postSql(modifiedDatas);
                if (sql) return sql;
            }
        });
        // return results
        const results: Record<string, any>[] = [];
        // execute query
        await config
            .executeSqlValues(this.ctx.service, sqls.join(";"))
            .then((res: Record<string, any>) => results.push(res[0 as keyobj]))
            .catch((error: Error) => {
                console.log(error);
                this.ctx.throw(EHttpCode.badRequest, { code: EHttpCode.badRequest, detail: error["detail" as keyobj] });
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
        console.log(log.whereIam());

        // Format datas
        dataInput = this.formatDataInput(dataInput);
        if (!dataInput) return;

        // create query
        const sql = this.ctx.odata.postSql(dataInput);

        // Return results
        if (sql)
            switch (this.ctx.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });

                // JSON values
                default:
                    return await config
                        .executeSqlValues(this.ctx.service, sql)
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
                            const code = getErrorCode(err, 400);
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
        console.log(log.whereIam());
        if (dataInput && this.ctx.odata.entity) {
            // Format datas
            dataInput = this.formatDataInput(dataInput);
            if (dataInput)
                return await config
                    .executeSqlValues(this.ctx.service, `SELECT id FROM "${this.ctx.odata.entity.table}" WHERE "name" = '${dataInput["name" as keyof object]}'`)
                    .then((res) => {
                        // search id from name
                        this.ctx.odata.id = res[0 as keyof object];
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
        console.log(log.whereIam());

        // Format datas
        dataInput = this.formatDataInput(dataInput);
        if (!dataInput) return;

        // create Query
        const sql = this.ctx.odata.patchSql(dataInput);

        // Return results
        if (sql)
            switch (this.ctx.odata.returnFormat) {
                // return only postgres sql query as a string
                case returnFormats.sql:
                    return this.formatReturnResult({ body: sql });
                // JSON values
                default:
                    return await config
                        .executeSqlValues(this.ctx.service, sql)
                        .then((res: Record<string, any>) => {
                            if (res[0]) {
                                return this.formatReturnResult({
                                    body: res[0][0],
                                    query: sql
                                });
                            }
                        })
                        .catch((err: Error) => {
                            const code = getErrorCode(err, 400);
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
    async delete(idInput: bigint | string): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        // create Query
        const sql = `DELETE FROM ${doubleQuotesString(this.ctx.model[this.constructor.name].table)} WHERE "id" = ${idInput} RETURNING id`;
        // Return results
        switch (this.ctx.odata.returnFormat) {
            // return only postgres sql query as a string
            case returnFormats.sql:
                return this.formatReturnResult({ body: sql });
            // JSON values
            default:
                return this.formatReturnResult({
                    body: await config
                        .executeSqlValues(this.ctx.service, sql)
                        .then((res) => res)
                        .catch(() => BigInt(0))
                });
        }
    }
}
