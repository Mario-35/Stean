/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TDD for things API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, identification, keyTokenName, defaultDelete, defaultPatch, defaultGet, listOfColumns, limitResult, infos, apiInfos, showHide, nbColorTitle, nbColor, testVersion, _RAWDB } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { testsKeys as locations_testsKeys } from "./routes.15_locations.spec";
import { executeQuery, last } from "./executeQuery";
import { addStartNewTest, addTest, writeLog } from "./tests";
const testsKeys = ["@iot.selfLink", "@iot.id", "Thing@iot.navigationLink", "Locations@iot.navigationLink", "time"];
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.HistoricalLocations;
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};
addToApiDoc({
    api: `{infos} ${entity.name} infos`,
    apiName: `Infos${entity.name}`,
    apiDescription: infos[entity.name].definition,
    apiReference: infos[entity.name].reference,
    result: ""
});
describe("endpoint : HistoricalLocations", () => {
    const temp = listOfColumns(entity);
    const success = temp.success;
    // const params = temp.params;
    let token = "";

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
                api: `{get} ${entity.name} Get all`,
                apiName: `GetAll${entity.name}`,
                apiDescription: `Retrieve all ${entity.name}.${showHide(`Get${entity.name}`, apiInfos["9.2.2"])}`,
                apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-collection-entities",
                apiExample: {
                    http: `${testVersion}/${entity.name}`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                },
                apiSuccess: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(
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
            api: `{get} ${entity.name}(:id) Get One`;
            http: `${testVersion}/${entity.name}(1)`;
            const infos = addTest({
                api: `{get} ${entity.name}(:id) Get one`,
                apiName: `GetOne${entity.name}`,
                apiDescription: `Get a specific ${entity.singular}.${apiInfos["9.2.3"]}`,
                apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-entity",
                apiExample: {
                    http: `${testVersion}/${entity.name}(1)`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    res.body["@iot.selfLink"].should.contain(`/${entity.name}(1)`);
                    res.body["@iot.id"].should.eql(1);
                    res.body["Thing@iot.navigationLink"].should.contain(`/${entity.name}(1)/Thing`);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });
                    done();
                });
        });
        it(`Return error if ${entity.name} not exist ${nbColor}[9.2.4]`, (done) => {
            const infos = addTest({
                api: `Return error if ${entity.name} not exist`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4).replace(Number.MAX_SAFE_INTEGER.toString(), "1");

                    done();
                });
        });
        it(`Return error ${entity.singular} not found`, (done) => {
            const infos = addTest({
                api: `{get} return error ${entity.singular} not found`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.singular}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    done();
                });
        });
        it(`Return ${entity.name} id: 6 and $expand Locations ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Locations";
            const infos = addTest({
                api: `{get} ${entity.name}(:id) Get Expand ${name}`,
                apiName: `Get${entity.name}Expand`,
                apiDescription: `Get Expand Locations of a specific Thing.${apiInfos["9.3.2.1"]}`,
                apiReference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
                apiExample: {
                    http: `${testVersion}/${entity.name}(6)?$expand=${name}`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys.filter((elem) => elem !== "Locations@iot.navigationLink"));
                    res.body.should.include.keys(name);
                    // res.body.Locations.length.should.eql(2);
                    res.body.Locations.length.should.eql(1);
                    res.body.Locations[0].should.include.keys(locations_testsKeys);
                    res.body["@iot.id"].should.eql(6);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it(`Return specified time of ${entity.name} id: 6`, (done) => {
            const infos = addTest({
                api: `{get} ${entity.name}(:id) Get Select`,
                apiName: `GetSelectTime${entity.name}`,
                apiDescription: "Retrieve time for a specific Historical Location.",
                apiExample: {
                    http: `${testVersion}/${entity.name}(6)?$select=time`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("time");
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it(`Return ${entity.name} Subentity Thing ${nbColor}[9.2.6]`, (done) => {
            const name = "Thing";
            const infos = addTest({
                api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(6)/${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body["@iot.id"]);
                    res.body["@iot.selfLink"].should.contain(`/${name}s(${id})`);
                    res.body["Locations@iot.navigationLink"].should.contain(`/${name}s(${id})/Location`);
                    res.body["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}s(${id})/HistoricalLocations`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`/${name}s(${id})/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`/${name}s(${id})/MultiDatastreams`);
                    done();
                });
        });
        it(`Return ${entity.name} Subentity Locations ${nbColor}[9.2.6]`, (done) => {
            const name = "Locations";
            const infos = addTest({
                api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(6)/${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body.value[0]["@iot.id"]);
                    res.body.value[0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                    res.body.value[0]["Things@iot.navigationLink"].should.contain(`/${name}(${id})/Things`);
                    res.body.value[0]["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}(${id})/HistoricalLocations`);
                    done();
                });
        });
        it(`Return ${entity.name} Expand Thing ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Thing";
            const infos = addTest({
                api: `{get} return ${entity.name} Expand ${name}`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body[name]["@iot.id"]);
                    res.body[name]["@iot.selfLink"].should.contain(`/${name}s(${id})`);
                    res.body[name]["Locations@iot.navigationLink"].should.contain(`${name}s(${id})/Location`);
                    res.body[name]["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}s(${id})/HistoricalLocations`);
                    res.body[name]["Datastreams@iot.navigationLink"].should.contain(`${name}s(${id})/Datastreams`);
                    res.body[name]["MultiDatastreams@iot.navigationLink"].should.contain(`${name}s(${id})/MultiDatastreams`);

                    done();
                });
        });
        it(`Return ${entity.name} Expand Locations ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Locations";
            const infos = addTest({
                api: `{get} return ${entity.name} Expand ${name}`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body[name][0]["@iot.id"]);
                    res.body[name][0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                    res.body[name][0]["Things@iot.navigationLink"].should.contain(`/${name}(${id})/Things`);
                    res.body[name][0]["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}(${id})/HistoricalLocations`);
                    done();
                });
        });
    });
    describe(`{patch} ${entity.name} ${nbColorTitle}[10.3]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it(`Return updated ${entity.name} ${nbColor}[10.3.1]`, (done) => {
            executeQuery(last(entity.table)).then((locations: Record<string, any>) => {
                const datas = {
                    "time": "2015-02-07T19:22:11.297Z"
                };
                const infos = addTest({
                    api: `{patch} ${entity.name} Patch one`,
                    apiName: `Patch${entity.name}`,
                    apiDescription: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
                    apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
                    apiExample: {
                        http: `${testVersion}/${entity.name}(${locations["id"]})`,
                        curl: defaultPatch("curl", "KEYHTTP", datas),
                        javascript: defaultPatch("javascript", "KEYHTTP", datas),
                        python: defaultPatch("python", "KEYHTTP", datas)
                    },
                    apiParamExample: datas
                });
                chai.request(server)
                    .patch(`/test/${infos.apiExample.http}`)
                    .send(infos.apiParamExample)
                    .set("Cookie", `${keyTokenName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(201);
                        res.header.location.should.contain(entity.name);
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
                "time": "2015-02-07T19:22:11.297Z"
            };
            const infos = addTest({
                api: `{patch} return Error if the ${entity.name} not exist`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
                }
            });
            chai.request(server)
                .patch(`/test/${infos.apiExample.http}`)
                .send(datas)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });
    describe(`{delete} ${entity.name} ${nbColorTitle}[10.4]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it(`Delete ${entity.name} return no content with code 204 ${nbColor}[10.4.1]`, (done) => {
            executeQuery(`SELECT (SELECT count(id) FROM "${entity.table}")::int as count, (${last(entity.table)})::int as id `).then((beforeDelete: Record<string, any>) => {
                const infos = addTest({
                    api: `{delete} ${entity.name} Delete one`,
                    apiName: `Delete${entity.name}`,
                    apiDescription: `Delete a ${entity.singular}.${showHide(`Delete${entity.name}`, apiInfos["10.4"])}`,
                    apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_3",
                    apiExample: {
                        http: `${testVersion}/${entity.name}(${beforeDelete["id"]})`,
                        curl: defaultDelete("curl", "KEYHTTP"),
                        javascript: defaultDelete("javascript", "KEYHTTP"),
                        python: defaultDelete("python", "KEYHTTP")
                    }
                });
                chai.request(server)
                    .delete(`/test/${infos.apiExample.http}`)
                    .set("Cookie", `${keyTokenName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(204);
                        executeQuery(`SELECT count(id)::int FROM "${entity.table}"`).then((afterDelete: Record<string, any>) => {
                            afterDelete["count"].should.eql(beforeDelete["count"] - 1);
                            addToApiDoc({
                                ...infos,
                                result: res
                            });

                            done();
                        });
                    });
            });
        });
        it(`Return Error if the ${entity.name} not exist`, (done) => {
            addTest({
                api: `{delete} return Error if the ${entity.name} not exist`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
                }
            });
            chai.request(server)
                .delete(`/test/${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    generateApiDoc(docs, `apiDoc${entity.name}.js`);
                    done();
                });
        });
    });
});
