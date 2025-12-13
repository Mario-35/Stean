/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TDD for Decoder API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import {
    IApiDoc,
    generateApiDoc,
    IApiInput,
    prepareToApiDoc,
    identification,
    limitResult,
    apiInfos,
    showHide,
    nbColor,
    nbColorTitle,
    testVersion,
    _RAWDB,
    infos,
    listOfColumns
} from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { addStartNewTest, addTest, writeLog } from "./tests";
import { EConstant } from "../../server/enums";
import { executeQuery, last } from "./executeQuery";

const testsKeys = ["@iot.id", "name", "hash", "code", "nomenclature", "nomenclature", "@iot.selfLink", "Loras@iot.navigationLink"];

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];

const entity: Ientity = _RAWDB.Decoders;
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};

addToApiDoc({
    type: "infos",
    short: "Presentation Extension",
    description: infos[entity.name].definition,
    reference: infos[entity.name].reference,
    result: ""
});

describe("endpoint : Lora", () => {
    let token = "";
    const myId = 0;
    before((done) => {
        addStartNewTest(entity.name);
        chai.request(server)
            .post(`/test/${testVersion}/login`)
            .send(identification)
            .end((err: Error, res: any) => {
                token = String(res.body["token"]);
                done();
            });
    });

    describe(`{get} ${entity.name} ${nbColorTitle}[9.2]`, () => {
        afterEach(() => {
            writeLog(true);
        });

        it(`Return all ${entity.name} ${nbColor}[9.2.2]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "All",
                description: `Retrieve all ${entity.name}.${showHide(`Get${entity.name}`, apiInfos["9.2.2"])}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-collection-entities",
                request: `${testVersion}/${entity.name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });
                    docs[docs.length - 1].error = JSON.stringify(
                        {
                            "code": 404,
                            "message": "Not Found"
                        },
                        null,
                        4
                    );

                    done();
                });
        });
        it(`Return ${entity.name} id: 1 ${nbColor}[9.2.3]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "One",
                description: `Get a specific ${entity.singular}.${apiInfos["9.2.3"]}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-entity",
                request: `${testVersion}/${entity.name}(1)`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    res.body["@iot.id"].should.eql(1);
                    res.body["@iot.selfLink"].should.contain(`${entity.name}(1)`);
                    res.body["Loras@iot.navigationLink"].should.contain(`${entity.name}(1)/Loras`);
                    addToApiDoc({
                        ...infos,
                        result: res
                    });

                    done();
                });
        });
        it(`Return error ${entity.singular} not found`, (done) => {
            const infos = addTest({
                type: "get",
                short: "Return error not found",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.singular}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    done();
                });
        });
        it(`Return error if ${entity.name} not exist ${nbColor}[9.2.4]`, (done) => {
            const infos = addTest({
                type: "error",
                short: "Return error if not exist",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4).replace(Number.MAX_SAFE_INTEGER.toString(), "1");
                    done();
                });
        });
        it(`Return error ${entity.singular} not found`, (done) => {
            const infos = addTest({
                type: "get",
                short: "Return error not found",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.singular}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    done();
                });
        });
        it(`Return ${entity.name} Subentity Loras ${nbColor}[9.2.6]`, (done) => {
            const name = "Loras";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(1)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body.value[0]["@iot.id"]);
                    res.body.value[0]["@iot.selfLink"].should.contain(`${name}(${id})`);
                    res.body.value[0]["Datastreams@iot.navigationLink"].should.contain(`/${name}(${id})/Datastreams`);
                    res.body.value[0]["MultiDatastreams@iot.navigationLink"].should.contain(`/${name}(${id})/MultiDatastreams`);
                    res.body.value[0]["Decoder@iot.navigationLink"].should.contain(`/${name}(${id})/Decoder`);
                    done();
                });
        });
        it(`Return ${entity.name} Expand Loras ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Loras";
            const infos = addTest({
                type: "get",
                short: `Return error${entity.name} Expand ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(1)?$expand=${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body[name][0]["@iot.id"];
                    res.body[name][0]["Datastreams@iot.navigationLink"].should.contain(`/${name}(${id})/Datastreams`);
                    res.body[name][0]["MultiDatastreams@iot.navigationLink"].should.contain(`/${name}(${id})/MultiDatastreams`);
                    res.body[name][0]["Decoder@iot.navigationLink"].should.contain(`/${name}(${id})/Decoder`);
                    done();
                });
        });
    });

    describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it("should return the added decoder", (done) => {
            const datas =         {
            "name": "OwnDecoder",
            "hash": "942065525",
            "code": 'function decode(bytes) {\t"use strict";\tfunction Decoder(input) { const decoded = { valid: true, err: 0, payload: input, messages: [] }; const temp = input.match(/.{1,2}/g); if (temp !== null) { if (temp[0] === "01" || temp[0] == "81") { decoded.messages.push({ type: "report_telemetry", measurementName: nomenclature["0610"], measurementValue: (parseInt(String(temp[2]) + String(temp[1]), 16) * 175.72) / 65536 - 46.85 }); decoded.messages.push({ type: "report_telemetry", measurementName: nomenclature["0710"], measurementValue: (parseInt(temp[3], 16) * 125) / 256 - 6 }); decoded.messages.push({ type: "upload_battery", measurementName: nomenclature["period"], measurementValue: parseInt(String(temp[5]) + String(temp[4]), 16) * 2 }); decoded.messages.push({ type: "upload_battery", measurementName: nomenclature["voltage"], measurementValue: (parseInt(temp[8], 16) + 150) * 0.01 }); decoded.datas = {}; decoded.messages.map(e => decoded.datas[e.measurementName] = e.measurementValue); return decoded; } } decoded["valid"] = false; decoded["err"] = -1; return decoded;\t}\treturn Decoder(bytes); }; return decode(input, nomenclature);',
            "nomenclature": {
                "voltage": "battery voltage",
                "period": "periods",
                "0110": "air temperature",
                "0210": "air humidity",
                "0310": "light intensity",
                "0410": "humidity",
                "0510": "barometric pressure",
                "0610": "soil temperature",
                "0700": "battery",
                "0710": "soil moisture"
            }
        };
            const infos = addTest({
                type: "post",
                short: "Post Decoder basic",
                description: `Post a new ${entity.name}`,
                request: `${testVersion}/${entity.name}`,
                params: datas,
                structure: listOfColumns(entity)
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.header.location.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    done();
                });
        });
    });

    describe(`{patch} ${entity.name} ${nbColorTitle}[10.3]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it(`Return updated ${entity.name} ${nbColor}[10.3.1]`, (done) => {
            executeQuery(`SELECT * FROM "${entity.table}" ORDER BY id desc LIMIT 1`).then((decoders: Record<string, any>) => {
                const datas = {
                    "name": "New bOwnDecoder",
                };
                const infos = addTest({
                    type: "patch",
                    short: "Basic",
                    description: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
                    reference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
                    request: `${testVersion}/${entity.name}(${decoders["id"]})`,
                    params: datas
                });
                chai.request(server)
                    .patch(`/test/${infos.request}`)
                    .send(infos.params)
                    .set("Cookie", `${EConstant.appName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(201);
                        res.header.location.should.contain(entity.name);
                        res.type.should.equal("application/json");
                        res.body.should.include.keys(testsKeys);
                        const newThingObject = res.body;
                        newThingObject.name.should.not.eql(decoders["name"]);
                        addToApiDoc({
                            ...infos,
                            result: limitResult(res)
                        });
                        done();
                    });
            });
        });

        it(`Return Error if the ${entity.name} not exist`, (done) => {
            const datas = {
                "name": "New Decoder Patch",
            };
            const infos = addTest({
                type: "patch",
                short: "Return Error not exist",
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
            });
            chai.request(server)
                .patch(`/test/${infos.request}`)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .send(datas)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4).replace(Number.MAX_SAFE_INTEGER.toString(), String(myId));
                    done();
                });
        });
    });

    describe(`{delete} ${entity.name} ${nbColorTitle}[10.4]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it(`Delete ${entity.name} return no content with code 204 ${nbColor}[10.4.1]`, (done) => {
            executeQuery(`SELECT (SELECT count(id) FROM "${entity.table}") as count, (${last(entity.table)}) as id `).then((beforeDelete: Record<string, any>) => {
                const infos = addTest({
                    type: "delete",
                    short: "One",
                    description: `Delete a ${entity.singular}.${showHide(`Delete${entity.name}`, apiInfos["10.4"])}`,
                    reference: "https://docs.ogc.org/is/18-088/18-088.html#_request_3",
                    request: `${testVersion}/${entity.name}(${beforeDelete["id" as keyof object]})`
                });
                chai.request(server)
                    .delete(`/test/${infos.request}`)
                    .set("Cookie", `${EConstant.appName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(204);
                        executeQuery(`SELECT count(id) FROM "${entity.table}"`).then((afterDelete: Record<string, any>) => {
                            Number(afterDelete["count"]).should.eql(+beforeDelete["count"] - 1);
                            done();
                        });
                    });
            });
        });
        it(`Return Error if the ${entity.name} not exist`, (done) => {
            const infos = addTest({
                type: "delete",
                short: "Return Error if not exist",
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
            });
            chai.request(server)
                .delete(`/test/${infos.request}`)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4).replace(Number.MAX_SAFE_INTEGER.toString(), String(myId));
                    generateApiDoc(docs, entity.name);
                    done();
                });
        });
    });
});
