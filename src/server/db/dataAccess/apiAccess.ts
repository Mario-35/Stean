/**
 * Api dataAccess
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import * as entities from "../entities/index";
import { Common } from "../entities/common";
import { Icomon, IreturnResult, koaContext } from "../../types";
import { isArray } from "../../helpers";
import { models } from "../../models";
import { log } from "../../log";
import { errors } from "../../messages";

/**
 * Interface API
 */

export class apiAccess implements Icomon {
    readonly myEntity: Common | undefined;
    readonly ctx: koaContext;

    constructor(ctx: koaContext, entity?: string) {
        this.ctx = ctx;
        const entityName = entity ? models.getEntityName(this.ctx.service, entity) : this.ctx.odata.entity ? this.ctx.odata.entity.name : "none";
        console.log(log.whereIam(entityName));
        if (entityName && entityName in entities) {
            // @ts-ignore
            this.myEntity = new entities[(this.ctx, entityName)](ctx);
        } else log.error(errors.noValidEntity, entityName);
    }

    formatDataInput(input: object | undefined): object | undefined {
        console.log(log.whereIam());
        return this.myEntity ? this.myEntity.formatDataInput(input) : input;
    }

    async getAll(): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (this.myEntity) return await this.myEntity.getAll();
    }

    async getSingle(): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (this.myEntity) return await this.myEntity.getSingle();
    }

    async post(dataInput?: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (this.myEntity) return isArray(this.ctx.body) ? await this.myEntity.addMultiLines(dataInput || this.ctx.body) : await this.myEntity.post(dataInput || this.ctx.body);
    }

    async update(dataInput?: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (this.myEntity) return await this.myEntity.update(this.ctx.body);
    }

    async delete(idInput: bigint | string): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (this.myEntity) return await this.myEntity.delete(idInput);
    }

    async put(dataInput?: Record<string, any> | undefined): Promise<IreturnResult | undefined> {
        console.log(log.whereIam());
        if (this.myEntity) return isArray(this.ctx.body) ? await this.myEntity.addMultiLines(dataInput || this.ctx.body) : await this.myEntity.put(dataInput || this.ctx.body);
    }
}
