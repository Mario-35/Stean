/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TDD for Lora API.
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

const testsKeys = ["@iot.id", "name", "deveui", "description", "properties", "@iot.selfLink", "Datastreams@iot.navigationLink", "MultiDatastreams@iot.navigationLink", "Decoder@iot.navigationLink"];

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Loras;
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
                    res.body["Decoder@iot.navigationLink"].should.contain(`${entity.name}(1)/Decoder`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`${entity.name}(1)/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`${entity.name}(1)/MultiDatastreams`);
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
        it(`Return ${entity.name} deveui: 2CF7F1202520017E`, (done) => {
            const infos = addTest({
                type: "get",
                short: "One from deveui",
                description: `Get a specific ${entity.singular} from deveui`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-entity",
                request: `${testVersion}/${entity.name}(2CF7F1202520017E)`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    res.body["@iot.id"].should.eql(2);
                    res.body["@iot.selfLink"].should.contain(`${entity.name}(2)`);
                    res.body["Decoder@iot.navigationLink"].should.contain(`${entity.name}(2)/Decoder`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`${entity.name}(2)/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`${entity.name}(2)/MultiDatastreams`);
                    addToApiDoc({
                        ...infos,
                        result: res
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
        it(`Return ${entity.name} Subentity Datastreams ${nbColor}[9.2.6]`, (done) => {
            const name = "Datastreams";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(5)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body.value[0]["@iot.id"]);
                    res.body.value[0]["@iot.selfLink"].should.contain(`${name}(${id})`);
                    res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                    res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                    res.body.value[0]["ObservedProperty@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperty`);
                    res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
                    res.body.value[0]["Loras@iot.navigationLink"].should.contain(`/${name}(${id})/Loras`);
                    done();
                });
        });
        it(`Return ${entity.name} Subentity MultiDatastreams ${nbColor}[9.2.6]`, (done) => {
            const name = "MultiDatastreams";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(4)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body.value[0]["@iot.id"]);
                    res.body.value[0]["@iot.selfLink"].should.contain(`${name}(${id})`);
                    res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                    res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                    res.body.value[0]["ObservedProperties@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperties`);
                    res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
                    res.body.value[0]["Loras@iot.navigationLink"].should.contain(`/${name}(${id})/Loras`);
                    done();
                });
        });
        it(`Return ${entity.name} Subentity Decoder ${nbColor}[9.2.6]`, (done) => {
            const name = "Decoder";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(4)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body["@iot.id"]);
                    res.body["@iot.selfLink"].should.contain(`${name}s(${id})`);
                    res.body["Loras@iot.navigationLink"].should.contain(`${name}s(${id})/Loras`);
                    done();
                });
        });
        it(`Return ${entity.name} Expand Datastreams ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Datastreams";
            const infos = addTest({
                type: "get",
                short: `Return error${entity.name} Expand ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(5)?$expand=${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body[name][0]["@iot.id"];
                    res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                    res.body[name][0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                    res.body[name][0]["ObservedProperty@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperty`);
                    res.body[name][0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
                    res.body[name][0]["Loras@iot.navigationLink"].should.contain(`/${name}(${id})/Loras`);
                    done();
                });
        });
        it(`Return ${entity.name} Expand MultiDatastreams ${nbColor}[9.3.2.1]`, (done) => {
            const name = "MultiDatastreams";
            const infos = addTest({
                type: "get",
                short: `Return error${entity.name} Expand ${name}`,
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(4)?$expand=${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body[name][0]["@iot.id"];
                    res.body[name][0]["@iot.selfLink"].should.contain(`${name}(${id})`);
                    res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
                    res.body[name][0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
                    res.body[name][0]["ObservedProperties@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperties`);
                    res.body[name][0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
                    res.body[name][0]["Loras@iot.navigationLink"].should.contain(`/${name}(${id})/Loras`);
                    done();
                });
        });

        it(`Return ${entity.name} Expand Decoder ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Decoder";
            const infos = addTest({
                type: "get",
                short: `Return error${entity.name} Expand ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(4)?$expand=${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body[name]["@iot.id"];
                    res.body[name]["@iot.selfLink"].should.contain(`${name}s(${id})`);
                    res.body[name]["Loras@iot.navigationLink"].should.contain(`/${name}s(${id})/Loras`);

                    done();
                });
        });
    });

    describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
        afterEach(() => {
            writeLog(true);
        });
        it("should return the Lora Affected multiDatastream that was added", (done) => {
            const datas = {
                "MultiDatastreams": {
                    "@iot.id": 2
                },
                "Decoder": {
                    "@iot.id": 1
                },
                "name": "Another lora Name",
                "description": "My new Lora Description",
                "deveui": "8cf9574000009L8C"
            };
            const infos = addTest({
                type: "post",
                short: "Post MultiDatastream basic",
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

        it("should return the Lora Affected datastream that was added", (done) => {
            const datas = {
                "Datastreams": {
                    "@iot.id": 14
                },
                "Decoder": {
                    "@iot.id": 3
                },
                "name": "Lora for datastream",
                "description": "My new Lora Description",
                "deveui": "70b3d5e75e014f026"
            };
            const infos = addTest({
                type: "post",
                short: "Post Datastream basic",
                description: `Post a new ${entity.name}`,
                request: `${testVersion}/${entity.name}`,
                params: datas
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

        it("should return an error because datastream not exist", (done) => {
            const datas = {
                "Datastreams": {
                    "@iot.id": 155
                },
                "Decoder": {
                    "@iot.id": 3
                },
                "name": "Lora for datastream not exist",
                "description": "My new Lora Description",
                "deveui": "70b3d5e75e014f06"
            };
            const infos = addTest({
                type: "post",
                short: "Return Error if datastream not exist",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}`
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(datas)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.body["detail"].should.contain("exist no datastream ID --> 155");
                    generateApiDoc(docs, entity.name);
                    done();
                });
        });
    });
});
