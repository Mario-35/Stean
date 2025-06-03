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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, identification, keyTokenName, getNB, listOfColumns, limitResult, infos, showHide, apiInfos, nbColorTitle, nbColor, testVersion, _RAWDB } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { testsKeys as datastreams_testsKeys } from "./routes.17_datastreams.spec";
import { executeQuery, last } from "./executeQuery";
import { addStartNewTest, addTest, writeLog } from "./tests";
export const testsKeys = ["@iot.id", "@iot.selfLink", "Datastreams@iot.navigationLink", "name", "description", "definition"];
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.ObservedProperties;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};
addToApiDoc({
    type: "infos",
    short: "Presentation",
    description: infos[entity.name].definition,
    reference: infos[entity.name].reference,
    result: ""
});
describe("endpoint : ObservedProperties", () => {
    const myId = "";
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
        it(`Return observedProperty id: 2 ${nbColor}[9.2.3]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "One",

                description: `Get a specific ${entity.singular}.${apiInfos["9.2.3"]}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-entity",
                request: `${testVersion}/${entity.name}(2)`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    res.body["@iot.selfLink"].should.contain("/ObservedProperties(2)");
                    res.body["@iot.id"].should.eql(2);
                    res.body["Datastreams@iot.navigationLink"].should.contain("/ObservedProperties(2)/Datastreams");
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

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
        it("Return observedProperty of a specific Datastream", (done) => {
            const infos = addTest({
                type: "get",
                short: "From a specific Datastream",
                description: "Get observed Property from Datastream",
                request: `${testVersion}/Datastreams(9)/ObservedProperty`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    const id = res.body["@iot.id"];
                    res.body["@iot.id"].should.eql(id);
                    res.body["@iot.selfLink"].should.contain(`/ObservedProperties(${id})`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`/ObservedProperties(${id})/Datastreams`);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it("Return observedProperty with inline related entities using $expand query option", (done) => {
            const infos = addTest({
                type: "get",
                short: "Expand Datastreams",
                description: "`Get a specific observed Property and expand Datastreams.",
                request: `${testVersion}/${entity.name}(1)?$expand=Datastreams`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("Datastreams");
                    res.body.Datastreams[0].should.include.keys(datastreams_testsKeys);
                    res.body["@iot.id"].should.eql(1);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res, "Datastreams")
                    });

                    done();
                });
        });
        it(`Retrieve specified properties for a specific ${entity.name}`, (done) => {
            const infos = addTest({
                type: "get",
                short: "From a Select",
                description: "Retrieve specified properties for a specific observed Property.",
                request: `${testVersion}/${entity.name}(1)?$select=description`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    Object.keys(res.body).length.should.eql(1);
                    res.body.should.include.keys("description");
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });
                    done();
                });
            it("Return Sensor Subentity Datastreams", (done) => {
                const name = "Datastreams";
                const infos = addTest({
                    type: "get",
                    short: `Get Subentity ${name}`,
                    description: "",
                    reference: "",
                    request: `${testVersion}/${entity.name}(11)/${name}`
                });
                chai.request(server)
                    .get(`/test/${infos.request}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.type.should.equal("application/json");
                        res.body["@iot.count"].should.eql(2);
                        const id = Number(res.body.value[0]["@iot.id"]);
                        res.body.value[0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                        res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                        res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                        res.body.value[0]["ObservedProperty@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperty`);
                        res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);

                        done();
                    });
            });
            it("Return Sensor Subentity MultiDatastreams", (done) => {
                const name = "MultiDatastreams";
                const infos = addTest({
                    type: "get",
                    short: `Get Subentity ${name}`,
                    description: "",
                    reference: "",
                    request: `${testVersion}/${entity.name}(11)/${name}`
                });
                chai.request(server)
                    .get(`/test/${infos.request}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.type.should.equal("application/json");
                        const id = Number(res.body.value[0]["@iot.id"]);
                        res.body.value[0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                        res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                        res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                        res.body.value[0]["ObservedProperties@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperties`);
                        res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);

                        done();
                    });
            });
            it("Return Sensor Expand Datastreams", (done) => {
                const name = "Datastreams";
                const infos = addTest({
                    type: "get",
                    short: `Return error${entity.name} Expand ${name}`,
                    description: "",
                    reference: "",
                    request: `${testVersion}/${entity.name}(6)?$expand=${name}`
                });
                chai.request(server)
                    .get(`/test/${infos.request}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.type.should.equal("application/json");
                        const id = Number(res.body[name][0]["@iot.id"]);
                        res.body[name][0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                        res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                        res.body[name][0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                        res.body[name][0]["ObservedProperty@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperty`);
                        res.body[name][0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);

                        done();
                    });
            });
            it("Return Sensor Expand MultiDatastreams", (done) => {
                const name = "MultiDatastreams";
                const infos = addTest({
                    type: "get",
                    short: `Return error${entity.name} Expand ${name}`,
                    description: "",
                    reference: "",
                    request: `${testVersion}/${entity.name}(6)?$expand=${name}`
                });
                chai.request(server)
                    .get(`/test/${infos.request}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.type.should.equal("application/json");
                        const id = Number(res.body[name][0]["@iot.id"]);
                        res.body[name][0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                        res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                        res.body[name][0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                        res.body[name][0]["ObservedProperties@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperties`);
                        res.body[name][0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
                        done();
                    });
            });
        });
    });
    describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it(`Return added ${entity.name} ${nbColor}[10.2.1]`, (done) => {
            const datas = {
                name: `Area ${getNB(entity.name)}`,
                description: "The degree or intensity of heat present in the area",
                definition: "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
            };
            const infos = addTest({
                type: "post",
                short: "Basic",
                description: `Post a new ${entity.name}.${showHide(`Post${entity.name}`, apiInfos["10.2"])}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#_request",
                request: `${testVersion}/${entity.name}`,
                params: datas,
                structure: listOfColumns(entity)
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.header.location.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });
                    done();
                });
        });
        it(`Return Error if the payload is malformed ${nbColor}[10.2.2]`, (done) => {
            const infos = addTest({
                type: "post",
                short: "Return Error if the payload is malformed",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}`
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send({})
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });
    describe(`{patch} ${entity.name} ${nbColorTitle}[10.3]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it(`Return updated ${entity.name} ${nbColor}[10.3.1]`, (done) => {
            executeQuery(last(entity.table, true)).then((result: Record<string, any>) => {
                const datas = {
                    name: `New PM 2.5 ${getNB(entity.name)}`
                };
                const infos = addTest({
                    type: "patch",
                    short: "One",
                    description: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
                    reference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
                    request: `${testVersion}/${entity.name}(${result["id"]})`,
                    params: datas
                });
                chai.request(server)
                    .patch(`/test/${infos.request}`)
                    .send(infos.params)
                    .set("Cookie", `${keyTokenName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(201);
                        res.header.location.should.contain(entity.name);
                        res.type.should.equal("application/json");
                        res.body.should.include.keys(testsKeys);
                        res.body.name.should.not.eql(result["name"]);
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
                "name": "New SensorWebThing Patch",
                "properties": {
                    "organization": "Mozilla",
                    "owner": "Mozilla"
                }
            };
            const infos = addTest({
                type: "patch",
                short: "Return Error if not exist",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
            });
            chai.request(server)
                .patch(`/test/${infos.request}`)
                .set("Cookie", `${keyTokenName}=${token}`)
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
            executeQuery(`SELECT (SELECT count(id) FROM "${entity.table}")::int as count, (${last(entity.table)})::int as id `).then((beforeDelete: Record<string, any>) => {
                const infos = addTest({
                    type: "delete",
                    short: "One",
                    description: `Delete a ${entity.singular}.${showHide(`Delete${entity.name}`, apiInfos["10.4"])}`,
                    reference: "https://docs.ogc.org/is/18-088/18-088.html#_request_3",
                    request: `${testVersion}/${entity.name}(${beforeDelete["id"]})`
                });
                chai.request(server)
                    .delete(`/test/${infos.request}`)
                    .set("Cookie", `${keyTokenName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(204);
                        executeQuery(`SELECT count(id)::int FROM "${entity.table}"`).then((afterDelete: Record<string, any>) => {
                            afterDelete["count"].should.eql(beforeDelete["count"] - 1);
                            addToApiDoc({
                                ...infos,
                                result: limitResult(res)
                            });

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
                .set("Cookie", `${keyTokenName}=${token}`)
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
