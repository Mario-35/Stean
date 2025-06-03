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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, identification, keyTokenName, listOfColumns, limitResult, infos, apiInfos, showHide, nbColor, nbColorTitle, testVersion, _RAWDB } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { executeQuery, last } from "./executeQuery";
import { addStartNewTest, addTest, writeLog } from "./tests";
export const testsKeys = ["@iot.id", "name", "description", "observationType", "@iot.selfLink", "Thing@iot.navigationLink", "Sensor@iot.navigationLink", "ObservedProperty@iot.navigationLink", "Observations@iot.navigationLink", "unitOfMeasurement", "observedArea"];
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Datastreams;
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
describe("endpoint : Datastream", () => {
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
                    res.body["@iot.selfLink"].should.contain(`/Datastreams(1)`);
                    res.body["Sensor@iot.navigationLink"].should.contain(`/Datastreams(1)/Sensor`);
                    res.body["ObservedProperty@iot.navigationLink"].should.contain(`/Datastreams(1)/ObservedProperty`);
                    res.body["Observations@iot.navigationLink"].should.contain(`/Datastreams(1)/Observations`);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it(`Return error if ${entity.name} not exist ${nbColor}[9.2.4]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "Return error if exist",

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
        it(`Return ${entity.name} of a specific Thing`, (done) => {
            const id = 6;
            const infos = addTest({
                type: "get",
                short: "From a specific Thing",
                description: "Get Datastream(s) from Things.",
                request: `${testVersion}/Things(${id})/${entity.name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("value");
                    res.body.value[0].should.include.keys(testsKeys);
                    res.body.value.length.should.eql(3);
                    const id = res.body.value[0]["@iot.id"];
                    res.body.value[0]["@iot.selfLink"].should.contain(`/Datastreams(${id})`);
                    res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/Datastreams(${id})/Sensor`);
                    res.body.value[0]["ObservedProperty@iot.navigationLink"].should.contain(`/Datastreams(${id})/ObservedProperty`);
                    res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/Datastreams(${id})/Observations`);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it(`Return ${entity.name} with inline related entities information using $expand query option`, (done) => {
            const infos = addTest({
                type: "get",
                short: "Expands",
                description: "Get a specific Datastream with expand Observations and ObservedProperty.",
                request: `${testVersion}/${entity.name}(9)?$expand=Observations,ObservedProperty`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys.filter((elem) => !["Observations@iot.navigationLink", "ObservedProperty@iot.navigationLink"].includes(elem)));
                    res.body.should.include.keys("Observations");
                    res.body.should.include.keys("ObservedProperty");
                    res.body["@iot.id"].should.eql(9);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it(`Return ${entity.name} All infos`, (done) => {
            const id = 9;
            const infos = addTest({
                type: "get",
                short: "All infos",
                description: "Get all infos of a datastream.",
                request: `${testVersion}/${entity.name}(${id})?$expand=Thing/Locations,Sensor,ObservedProperty`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body["Thing"]["@iot.id"].should.eql(7);
                    res.body["Thing"]["Locations"][0]["@iot.id"].should.eql(8);
                    res.body["Sensor"]["@iot.id"].should.eql(8);
                    res.body["ObservedProperty"]["@iot.id"].should.eql(9);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });

                    done();
                });
        });
        it(`Return error if ${entity.name} Path is invalid`, (done) => {
            const infos = addTest({
                type: "get",
                short: "Return error if Path is invalid",
                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(2)?$expand=Things/Locations,Sensor,ObservedProperty`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body["detail"].should.contain(`Invalid expand path`);

                    done();
                });
        });
        it(`Return ${entity.name} phenomenonTime search`, (done) => {
            const infos = addTest({
                type: "get",
                short: "From phenomenonTime search",
                description: "Get Datastream(s) from phenomenonTime filter.",
                request: `${testVersion}/${entity.name}?$filter=resultTime eq 2024-06-01T03:00:01Z/2024-06-03T03:45:01Z`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body["@iot.count"].should.eql(1);
                    res.body.value[0]["@iot.id"].should.eql(6);
                    addToApiDoc({
                        ...infos,
                        result: res
                    });

                    done();
                });
        });
        it(`Return ${entity.name} from an observation filter`, (done) => {
            const infos = addTest({
                type: "get",
                short: "From observations filter",
                description: "Get Datastream(s) from Observations filter.",
                request: `${testVersion}/${entity.name}?$filter=Observations/result eq 63.15`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("value");
                    res.body.value[0].should.include.keys(testsKeys);
                    res.body["@iot.count"].should.eql(1);
                    const id = res.body.value[0]["@iot.id"];
                    res.body.value.length.should.eql(1);
                    res.body.value[0]["@iot.selfLink"].should.contain(`/Datastreams(${id})`);
                    addToApiDoc({
                        ...infos,
                        result: res
                    });

                    done();
                });
        });
        it(`Return ${entity.name} Subentity Thing ${nbColor}[9.2.6]`, (done) => {
            const name = "Thing";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(2)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body["@iot.id"];
                    res.body["@iot.selfLink"].should.contain(`/${name}s(${id})`);
                    res.body["Locations@iot.navigationLink"].should.contain(`/${name}s(${id})/Locations`);
                    res.body["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}s(${id})/HistoricalLocations`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`/${name}s(${id})/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`/${name}s(${id})/MultiDatastreams`);
                    done();
                });
        });
        it(`Return ${entity.name} Subentity Sensor ${nbColor}[9.2.6]`, (done) => {
            const name = "Sensor";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(2)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body["@iot.id"];
                    res.body["@iot.selfLink"].should.contain(`/Sensors(${id})`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`/${name}s(${id})/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`/${name}s(${id})/MultiDatastreams`);

                    done();
                });
        });
        it(`Return ${entity.name} Subentity ObservedProperty ${nbColor}[9.2.6]`, (done) => {
            const name = "ObservedProperty";
            const infos = addTest({
                type: "get",
                short: `Subentity ${name}`,

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(2)/${name}`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body["@iot.id"];
                    res.body["@iot.selfLink"].should.contain(`/ObservedProperties(${id})`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`/ObservedProperties(${id})/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`/ObservedProperties(${id})/MultiDatastreams`);
                    done();
                });
        });
        it(`Return ${entity.name} Subentity Observations ${nbColor}[9.2.6]`, (done) => {
            const name = "Observations";
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
                    const id = res.body.value[0]["@iot.id"];
                    res.body.value[0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
                    res.body.value[0]["Datastream@iot.navigationLink"].should.contain(`/${name}(${id})/Datastream`);
                    res.body.value[0]["MultiDatastream@iot.navigationLink"].should.contain(`/${name}(${id})/MultiDatastream`);
                    res.body.value[0]["FeatureOfInterest@iot.navigationLink"].should.contain(`/${name}(${id})/FeatureOfInterest`);

                    done();
                });
        });
        it(`Return ${entity.name} Expand Things ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Thing";
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
                    const id = Number(res.body[name]["@iot.id"]);
                    res.body[name]["@iot.selfLink"].should.contain(`/Things(${id})`);
                    res.body[name]["Locations@iot.navigationLink"].should.contain(`Things(${id})/Locations`);
                    res.body[name]["HistoricalLocations@iot.navigationLink"].should.contain(`/Things(${id})/HistoricalLocations`);
                    res.body[name]["Datastreams@iot.navigationLink"].should.contain(`Things(${id})/Datastreams`);
                    res.body[name]["MultiDatastreams@iot.navigationLink"].should.contain(`Things(${id})/MultiDatastreams`);

                    done();
                });
        });
        it(`Return ${entity.name} Expand Sensor ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Sensor";
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
                    const id = Number(res.body[name]["@iot.id"]);
                    res.body[name]["@iot.selfLink"].should.contain(`/Sensors(${id})`);
                    res.body[name]["Datastreams@iot.navigationLink"].should.contain(`Sensors(${id})/Datastreams`);
                    res.body[name]["MultiDatastreams@iot.navigationLink"].should.contain(`Sensors(${id})/MultiDatastreams`);

                    done();
                });
        });
        it(`Return ${entity.name} Expand Observations ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Observations";
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
                    const id = Number(res.body[name][0]["@iot.id"]);
                    res.body[name][0]["@iot.selfLink"].should.contain(`/Observations(${id})`);
                    res.body[name][0]["FeatureOfInterest@iot.navigationLink"].should.contain(`/Observations(${id})/FeatureOfInterest`);
                    res.body[name][0]["Datastream@iot.navigationLink"].should.contain(`Observations(${id})/Datastream`);
                    res.body[name][0]["MultiDatastream@iot.navigationLink"].should.contain(`Observations(${id})/MultiDatastream`);

                    done();
                });
        });
        it(`Return ${entity.name} Expand ObservedProperty ${nbColor}[9.3.2.1]`, (done) => {
            const name = "ObservedProperty";
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
                    const id = Number(res.body[name]["@iot.id"]);
                    res.body[name]["@iot.selfLink"].should.contain(`/ObservedProperties(${id})`);
                    res.body[name]["Datastreams@iot.navigationLink"].should.contain(`ObservedProperties(${id})/Datastreams`);
                    res.body[name]["MultiDatastreams@iot.navigationLink"].should.contain(`ObservedProperties(${id})/MultiDatastreams`);

                    done();
                });
        });
    });
    describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
        afterEach(() => {
            writeLog(true);
        });

        it(`Return added ${entity.name} ${nbColor}[10.2.1]`, (done) => {
            const datas = {
                "unitOfMeasurement": {
                    "symbol": "μg/m³",
                    "name": "PM 2.5 Particulates (ug/m3)",
                    "definition": "http://unitsofmeasure.org/ucum.html"
                },
                "name": "Datastream Air quality readings",
                "description": "New Datastream Air quality readings for test",
                "Thing": {
                    "@iot.id": 1
                },
                "ObservedProperty": {
                    "@iot.id": 1
                },
                "Sensor": {
                    "@iot.id": 1
                }
            };
            const infos = addTest({
                type: "post",
                short: "With existing Thing",
                description: `Post a new ${entity.name}.${showHide(`Post${entity.name}`, apiInfos["10.2"])}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#link-existing-entities-when-creating",
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
        it(`Return added ${entity.name} with default FOI`, (done) => {
            const datas = {
                "unitOfMeasurement": {
                    "symbol": "μg/m³",
                    "name": "PM 2.5 Particulates (ug/m3)",
                    "definition": "http://unitsofmeasure.org/ucum.html"
                },
                "name": "Another datastream Air quality readings with default FOI",
                "description": "New Datastream Air quality readings with default FOI for test",
                "Thing": {
                    "@iot.id": 1
                },
                "ObservedProperty": {
                    "@iot.id": 1
                },
                "Sensor": {
                    "@iot.id": 1
                },
                "FeatureOfInterest": {
                    "@iot.id": 2
                }
            };
            const infos = addTest({
                type: "post",
                short: "With default FOI",
                description: `Post a new ${entity.name} with default FOI`,
                reference: "",
                request: `${testVersion}/${entity.name}`,
                params: datas
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
        it(`Return added ${entity.name} from Thing`, (done) => {
            const datas = {
                "name": "Datastream Air Air Temperature DS",
                "description": "New Datastream Air Temperature DS for test",
                "unitOfMeasurement": {
                    "name": "New Degree Celsius",
                    "symbol": "°C",
                    "definition": "http://unitsofmeasure.org/ucum.html#para-30"
                },
                "ObservedProperty": {
                    "name": "New Area Temperature",
                    "description": "The degree or intensity of heat present in the area",
                    "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
                },
                "Sensor": {
                    "name": "New Sensor DHT22",
                    "description": "DHT22 temperature sensor [1]",
                    "encodingType": "application/pdf",
                    "metadata": "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
                }
            };
            const infos = addTest({
                type: "post",
                short: "With a Thing",
                description: "POST a new Datastream with existing Thing.",
                reference: "https://docs.ogc.org/is/18-088/18-088.html#link-existing-entities-when-creating",
                request: `${testVersion}/Things(1)/${entity.name}`,
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end(async (err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.header.location.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    addToApiDoc({
                        ...infos,
                        result: limitResult(res)
                    });
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);

                    done();
                });
        });
        it(`Return added ${entity.name} from Thing`, (done) => {
            const datas = {
                "name": "Pressure sensor [70b3d5e75e014f06]",
                "description": "New datastream for pressure sensor [70b3d5e75e014f06]",
                "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                "unitOfMeasurement": {
                    "name": "New unitOfMeasurement pressure",
                    "symbol": "B",
                    "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
                },
                "ObservedProperty": {
                    "name": "New pressure ObservedProperty",
                    "description": "New pressure ObservedProperty in datastream for tests",
                    "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
                },
                "Sensor": {
                    "name": "New pressure sensor",
                    "description": "New pressure sensor in datastream for tests",
                    "encodingType": "application/pdf",
                    "metadata": "https://www.watteco.fr/download/fiche-technique-torano-lorawan/?wpdmdl=8460&refresh=6405aa1c76d491678092828"
                }
            };
            const infos = addTest({
                type: "post",
                short: "Return added from Thing",
                description: "",
                reference: "",
                request: `${testVersion}/Things(1)/${entity.name}`
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(datas)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end(async (err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.header.location.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
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
                    unitOfMeasurement: {
                        name: "Degrees Fahrenheit",
                        symbol: "degF",
                        definition: "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeFahrenheit"
                    },
                    description: "Water Temperature of Bow river"
                };
                const infos = addTest({
                    type: "patch",
                    short: "One",
                    description: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
                    reference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
                    request: `${testVersion}/${entity.name}(12)`,
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
                        const newItems = res.body;
                        newItems.description.should.not.eql(result["description"]);
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
                unitOfMeasurement: {
                    symbol: "ºC",
                    name: "Celsius",
                    definition: "http://unitsofmeasure.org/ucum.html"
                },
                observationType: "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                description: "Temp readings",
                name: "temp_readings"
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
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);
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
                                result: res
                            });

                            done();
                        });
                    });
            });
        });
        it(`Return Error if the ${entity.name} not exist`, (done) => {
            addTest({
                type: "delete",
                short: "Return Error if not exist",

                description: "",
                reference: "",
                request: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
            });
            chai.request(server)
                .delete(`/test/${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);
                    generateApiDoc(docs, entity.name);
                    done();
                });
        });
    });
});
