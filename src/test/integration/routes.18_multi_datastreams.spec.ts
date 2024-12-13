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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, identification, keyTokenName, defaultPatch, defaultDelete, defaultGet, defaultPost, getNB, listOfColumns, limitResult, infos, apiInfos, showHide, nbColorTitle, nbColor, testVersion, _RAWDB } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { executeQuery, last } from "./executeQuery";
import { addStartNewTest, addTest, writeLog } from "./tests";
export const testsKeys = [
    "@iot.id",
    "name",
    "description",
    "@iot.selfLink",
    "Thing@iot.navigationLink",
    "Sensor@iot.navigationLink",
    "ObservedProperties@iot.navigationLink",
    "Observations@iot.navigationLink",
    "unitOfMeasurements",
    "observationType",
    "multiObservationDataTypes"
];
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.MultiDatastreams;
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};
addToApiDoc({
    api: `{infos} ${entity.name} Extension`,
    apiName: `Infos${entity.name}`,    
    apiDescription: infos[entity.name].definition,
    apiReference: infos[entity.name].reference,
    result: ""
});
describe("endpoint : MultiDatastream", () => {
    const temp = listOfColumns(entity);
    const success = temp.success;
    const params = temp.params;
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
		afterEach(() => { writeLog(true); });
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
					docs[docs.length - 1].apiErrorExample = JSON.stringify({
						"code": 404,
						"message": "Not Found"
					}, null, 4);					
					done();
				});
		});
        it(`Return ${entity.name} id: 1 ${nbColor}[9.2.3]`, (done) => {
			const infos = addTest({
				api :`{get} ${entity.name}(:id) Get one`,
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
                    res.body["@iot.id"].should.eql(1);
                    res.body["@iot.selfLink"].should.contain(`/${entity.name}(1)`);
                    res.body["Sensor@iot.navigationLink"].should.contain(`/${entity.name}(1)/Sensor`);
                    res.body["ObservedProperties@iot.navigationLink"].should.contain(`/${entity.name}(1)/ObservedProperties`);
                    res.body["Observations@iot.navigationLink"].should.contain(`/${entity.name}(1)/Observations`);
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    
                    done();
                });
        });
		it(`Return error if ${entity.name} not exist ${nbColor}[9.2.4]`, (done) => {
			const infos = addTest({
				api : `{get} return error if ${entity.name} not exist`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`,
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
				api : `{get} return error ${entity.singular} not found`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.singular}`,
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
        it(`Return ${entity.name} of a specific Thing.`, (done) => {
            const id = 11;
            
            const infos = addTest({
                api : `{get} Things(${id})/${entity.name}(:id) Get from specific Thing`,                
                apiName: `GetAllFromThing${entity.name}`,
                apiDescription: "Get Multi Datastreams(s) from Thing.",
                apiExample: {
                    http: `${testVersion}/Things(${id})/${entity.name}`,                    
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
                    res.body.should.include.keys("value");
                    res.body.value[0].should.include.keys(testsKeys);
                    res.body.value.length.should.eql(4);
                    const id = res.body.value[0]["@iot.id"];
                    res.body.value[0]["@iot.selfLink"].should.contain(`/MultiDatastreams(${id})`);
                    res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/MultiDatastreams(${id})/Sensor`);
                    res.body.value[0]["ObservedProperties@iot.navigationLink"].should.contain(`/MultiDatastreams(${id})/ObservedProperties`);
                    res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/MultiDatastreams(${id})/Observations`);
                    addToApiDoc({ ...infos, result: limitResult(res) });                    
                    done();
                });
        });
        it(`Return all informations for a ${entity.name}.`, (done) => {
            const infos = addTest({
                api : `{get} all ${entity.name} informations`,
                apiName: `GetAllFromInfos${entity.name}`,
                apiDescription: `Get all informations of a ${entity.name}.`,
                apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=Thing/Locations/FeatureOfInterest,Sensor,ObservedProperties`,                    
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
                    res.body.should.include.keys("Thing");
                    res.body["Thing"].should.include.keys("Locations");
                    res.body.should.include.keys("Sensor");
                    res.body.should.include.keys("ObservedProperties");
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    
                    done();
                });
        });
        it(`Return ${entity.name} phenomenonTime search`, (done) => {
            const infos = addTest({
                api : `{get} ${entity.name} Get From phenomenonTime search`,
                apiName: `GetPhenomenonTime${entity.name}`,
                apiDescription: "Get Datastream(s) from phenomenonTime filter.",
                apiExample: {
                    http: `${testVersion}/${entity.name}?$filter=phenomenonTime eq 2023-03-01T16:30:01Z/2023-03-01T19:15:01Z`,                    
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
                    res.body["@iot.count"].should.eql(1);
                    res.body.value[0]["@iot.id"].should.eql(3);
                    addToApiDoc({ ...infos, result: res });
                    
                    done();
                });
        });
        // it(`Return ${entity.name} from an observation filter`, (done) => {
        //     const infos = addTest({
        //         api: `{get} ${entity.name} Get From observations filter`,
        //         apiName: `GetObservationFilter${entity.name}`,
        //         apiDescription: "Get Datastream(s) from Observations filter.",
        //         apiExample: {
        //             http: `/${testVersion}/${entity.name}?$filter=Observations/result eq '[ 35, 17.5, 11.666666666666666 ]'`,
        //             curl: defaultGet("curl", "KEYHTTP"),
        //             javascript: defaultGet("javascript", "KEYHTTP"),
        //             python: defaultGet("python", "KEYHTTP")
        //         }
        //     };
        //     chai.request(server)
        //         .get(`/test/${infos.apiExample.http}`)
        //         .end((err: Error, res: any) => {
        //             console.log(res.body);
                    
        //             should.not.exist(err);
        //             res.status.should.equal(200);
        //             res.type.should.equal("application/json");
        //             res.body.should.include.keys("value");
        //             res.body.value[0].should.include.keys(testsKeys);
        //             res.body["@iot.count"].should.eql(1);
        //             res.body.value.length.should.eql(1);
        //             res.body.value[0]["@iot.id"].should.eql(10);
        //             res.body.value[0]["@iot.selfLink"].should.contain("/Datastreams(10)");
        //             addToApiDoc({ ...infos, result: res });
        //             done();
        //         });
        // });

        it(`Return ${entity.name} Subentity Thing ${nbColor}[9.2.6]`, (done) => {
            const name = "Thing";
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(6)/${name}`,
				}
			});
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
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
				api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(6)/${name}`,
				}
			});
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body["@iot.id"];
                    res.body["@iot.selfLink"].should.contain(`/Sensors(${id})`);
                    res.body["Datastreams@iot.navigationLink"].should.contain(`/Sensors(${id})/Datastreams`);
                    res.body["MultiDatastreams@iot.navigationLink"].should.contain(`/Sensors(${id})/MultiDatastreams`);                    
                    done();
                });
        });
        it(`Return ${entity.name} Subentity ObservedProperties ${nbColor}[9.2.6]`, (done) => {
            const name = "ObservedProperties";
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(6)/${name}`,
				}
			});
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = res.body.value[0]["@iot.id"];
                    res.body.value[0]["@iot.selfLink"].should.contain(`/ObservedProperties(${id})`);
                    res.body.value[0]["Datastreams@iot.navigationLink"].should.contain(`/ObservedProperties(${id})/Datastreams`);
                    res.body.value[0]["MultiDatastreams@iot.navigationLink"].should.contain(`/ObservedProperties(${id})/MultiDatastreams`);
                    done();
                });
        });
        it(`Return ${entity.name} Subentity Observations ${nbColor}[9.2.6]`, (done) => {
            const name = "Observations";
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(6)/${name}`,
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
                    res.body.value[0]["Datastream@iot.navigationLink"].should.contain(`/${name}(${id})/Datastream`);
                    res.body.value[0]["MultiDatastream@iot.navigationLink"].should.contain(`/${name}(${id})/MultiDatastream`);
                    res.body.value[0]["FeatureOfInterest@iot.navigationLink"].should.contain(`/${name}(${id})/FeatureOfInterest`);
                    
                    done();
                });
        });
        it(`Return ${entity.name} Expand Things ${nbColor}[9.3.2.1]`, (done) => {
            const name = "Thing";
			const infos = addTest({
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`,
				}
			});
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
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
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`,
				}
			}); 
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
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
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`,
				}
			});
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
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
        it(`Return ${entity.name} Expand ObservedProperties ${nbColor}[9.3.2.1]`, (done) => {
            const name = "ObservedProperties";
			const infos = addTest({
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`,
				}
			});
            chai.request(server)
                .get(`/test/${infos.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    const id = Number(res.body[name][0]["@iot.id"]);
                    res.body[name][0]["@iot.selfLink"].should.contain(`/ObservedProperties(${id})`);
                    res.body[name][0]["Datastreams@iot.navigationLink"].should.contain(`ObservedProperties(${id})/Datastreams`);
                    res.body[name][0]["MultiDatastreams@iot.navigationLink"].should.contain(`ObservedProperties(${id})/MultiDatastreams`);
                    
                    done();
                });
        });
        it(`Return ${entity.name} phenomenonTime select & order`, (done) => {
            const infos = addTest({
                api : `{get} ${entity.name} Get From phenomenonTime select & order`,
                apiName: `Get${entity.name}SelectAndOrderPhenomenonTime`,
                apiDescription: `Get ${entity.name} phenomenonTime order by phenomenonTime.`,
                apiExample: {
                    http: `${testVersion}/${entity.name}?$select=phenomenonTime&$orderby=phenomenonTime%20desc`,                    
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
                    res.body["@iot.count"].should.eql(9);
                    res.body.value[0]["phenomenonTime"].should.eql('2024-06-03T05:15:01Z/2024-06-05T04:15:01Z');
                    addToApiDoc({ ...infos, result: res });
                    
                    done();
                });
        });
    });
    describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
		afterEach(() => { writeLog(true); });
        it(`Return added ${entity.name} ${nbColor}[10.2.1]`, (done) => {
            const datas = {
                "description": "Air quality readings",
                "name": `Air quality readings ${getNB(entity.name)}`,
                "Thing": {
                    "@iot.id": 2
                },
                "Sensor": {
                    "@iot.id": 1
                },
                "multiObservationDataTypes": ["Measurement", "Measurement"],
                "unitOfMeasurements": [
                    {
                        "symbol": "%",
                        "name": `${getNB("humidity")}`,
                        "definition": "http://unitsofmeasure.org/ucum.html"
                    },
                    {
                        "name": `${getNB("Temperature")}`,
                        "symbol": "°",
                        "definition": "http://unitsofmeasure.org/blank.html"
                    }
                ],
                "ObservedProperties": [
                    {
                        "name": `${getNB("humidity")}`,
                        "definition": "humidity",
                        "description": "valeur en pourcentage du taux d'humidity de l'air"
                    },
                    {
                        "name": `${getNB("Temperature")}`,
                        "definition": "Temperature",
                        "description": "valeur en degré de la Temperature de l'air"
                    }
                ]
            };
            const infos = addTest({
                api : `{post} ${entity.name} Post with existing Thing And Sensor`,
                apiName: `PostExistingThing${entity.name}`,
                apiDescription: `Post a new ${entity.name}.${showHide(`Post${entity.name}`, apiInfos["10.2"])}`,
                apiReference: "https://docs.ogc.org/is/18-088/18-088.html#link-existing-entities-when-creating",
                apiExample: {
                    http: `${testVersion}/${entity.name}`,                    
                    curl: defaultPost("curl", "KEYHTTP", datas),
                    javascript: defaultPost("javascript", "KEYHTTP", datas),
                    python: defaultPost("python", "KEYHTTP", datas)
                },
                apiParam: params,
                apiParamExample: datas
            });
            chai.request(server)
                .post(`/test/${infos.apiExample.http}`)
                .send(infos.apiParamExample)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
					res.header.selflink.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    
                    done();
                });
        });
        it(`Return Error if the payload is malformed ${nbColor}[10.2.2]`, (done) => {
            const infos = addTest({
                api : `{post} return Error if the payload is malformed`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}`,
				}
			});
            chai.request(server)
                .post(`/test/${infos.apiExample.http}`)
                .send({})
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    
                    done();
                });
        });
        it(`Return added ${entity.name} with created Thing`, (done) => {
            const datas = {
                description: "Air quality readings",
                name: `Air quality readings ${getNB(entity.name)}`,
                Thing: {
                    description: "A New SensorWeb thing",
                    name:`SensorWebThing ${getNB("Thing")}`,
                    properties: {
                        organization: "Mozilla",
                        owner: "Mozilla"
                    }
                },
                Sensor: {
                    name: "DHT72",
                    description: `DHT72 ${getNB("soil temperature")}`,
                    encodingType: "application/pdf",
                    metadata: "https://cdn-shop.adafruit.com/datasheets/DHT72.pdf"
                },
                multiObservationDataTypes: ["Measurement", "Measurement"],
                unitOfMeasurements: [
                    {
                        symbol: "%",
                        name: `Soil ${getNB("soil humidity")}`,
                        definition: "http://unitsofmeasure.org/ucum.html"
                    },
                    {
                        name: `Soil ${getNB("soil temperature")}`,
                        symbol: "°",
                        definition: "http://unitsofmeasure.org/blank.html"
                    }
                ],
                ObservedProperties: [
                    {
                        name: `${getNB("humidity")}`,
                        definition: "humidity",
                        description: "valeur en pourcentage du taux d'humidity de l'air"
                    },
                    {
                        name: `${getNB("Temperature")}`,
                        definition: "Temperature",
                        description: "valeur en degré de la Temperature de l'air"
                    }
                ]
            };
            const infos = addTest({
                api : `{post} ${entity.name} Post With Thing and Sensor`,
                apiName: `PostThingSensor${entity.name}`,
                apiDescription: "Post a new Multi Datastream With New Thing and Sensor.",
                apiReference: "https://docs.ogc.org/is/18-088/18-088.html#create-related-entities",
                apiExample: {
                    http: `${testVersion}/${entity.name}`,
                    curl: defaultPost("curl", "KEYHTTP", datas),
                    javascript: defaultPost("javascript", "KEYHTTP", datas),
                    python: defaultPost("python", "KEYHTTP", datas)
                },
                apiParamExample: datas
            });
            chai.request(server)
                .post(`/test/${infos.apiExample.http}`)
                .send(infos.apiParamExample)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
					res.header.selflink.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    
                    done();
                });
        });
        it("Return Error if ObservedProperties length not equal multiObservationDataTypes", (done) => {
            const datas = {
                description: "Air quality readings",
                name: "air_quality_readings",
                Thing: {
                    "@iot.id": 2
                },
                Sensor: {
                    "@iot.id": 1
                },
                multiObservationDataTypes: ["Measurement", "Measurement"],
                unitOfMeasurements: [
                    {
                        symbol: "%",
                        name: "humidity",
                        definition: "http://unitsofmeasure.org/ucum.html"
                    },
                    {
                        name: "Temperature",
                        symbol: "°",
                        definition: "http://unitsofmeasure.org/blank.html"
                    }
                ],
                ObservedProperties: [
                    {
                        name: "humidity",
                        definition: "humidity",
                        description: "valeur en pourcentage du taux d'humidity de l'air"
                    }
                ]
            };
            const infos = addTest({
                api : `{post} ${entity.name} return Error if ObservedProperties length not equal multiObservationDataTypes`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
				apiExample: {
                    http: `${testVersion}/MultiDatastreams`,
				}
			});
            chai.request(server)
                .post(`/test/${infos.apiExample.http}`)
                .send(datas)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.body["detail"].should.eql("Size of list of ObservedProperties (1) is not equal to size of multiObservationDataTypes (2)");
                    
                    done();
                });
        });
        it("Return Error if unitOfMeasurements length not equal multiObservationDataTypes", (done) => {
            const datas = {
                name: `Air quality readings ${getNB(entity.name)}`,
                description: "Air quality readings",
                Thing: {
                    "@iot.id": 2
                },
                Sensor: {
                    "@iot.id": 1
                },
                multiObservationDataTypes: ["Measurement", "Measurement"],
                unitOfMeasurements: [
                    {
                        symbol: "%",
                        name: `${getNB("humidity")}`,
                        definition: "http://unitsofmeasure.org/ucum.html"
                    }
                ],
                ObservedProperties: [
                    {
                        name: `${getNB("humidity")}`,
                        definition: "humidity",
                        description: "valeur en pourcentage du taux d'humidity de l'air"
                    },
                    {
                        name: `${getNB("Temperature")}`,
                        definition: "Temperature",
                        description: "valeur en degré de la Temperature de l'air"
                    }
                ]
            };
            const infos = addTest({
                api : `{post} ${entity.name} return Error if unitOfMeasurements length not equal multiObservationDataTypes`,
                apiName: "",
                apiDescription: "",
                apiReference: "",
				apiExample: {
                    http: `${testVersion}/MultiDatastreams`,
				}
			});
            chai.request(server)
                .post(`/test/${infos.apiExample.http}`)
                .send(datas)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.body["detail"].should.eql("Size of list of unitOfMeasurements (1) is not equal to size of multiObservationDataTypes (2)");
                    
                    done();
                });
        });
        it(`Return added ${entity.name} with default FOI`, (done) => {
            const datas = {
                description: "Air quality readings",
                name: `Air quality readings ${getNB(entity.name)}`,
                Thing: {
                    "@iot.id": 2
                },
                Sensor: {
                    "@iot.id": 1
                },
                multiObservationDataTypes: ["Measurement", "Measurement"],
                unitOfMeasurements: [
                    {
                        symbol: "%",
                        name: `${getNB("humidity")}`,
                        definition: "http://unitsofmeasure.org/ucum.html"
                    },
                    {
                        name: `${getNB("Temperature")}`,
                        symbol: "°",
                        definition: "http://unitsofmeasure.org/blank.html"
                    }
                ],
                ObservedProperties: [
                    {
                        name: `${getNB("humidity")}`,
                        definition: "humidity",
                        description: "valeur en pourcentage du taux d'humidity de l'air"
                    },
                    {
                        name: `${getNB("Temperature")}`,
                        definition: "Temperature",
                        description: "valeur en degré de la Temperature de l'air"
                    }
                ],
                "FeaturesOfInterest": { "@iot.id": 2 }
            };
            const infos = addTest({
                api : `{post} ${entity.name} Post with default FOI`,
                apiName: `Post${entity.name}FOI`,
                apiDescription: `Post a new ${entity.name} with default FOI`,
                apiReference: "",
                apiExample: {
                    http: `${testVersion}/MultiDatastreams`,
                    curl: defaultPost("curl", "KEYHTTP", datas),
                    javascript: defaultPost("javascript", "KEYHTTP", datas),
                    python: defaultPost("python", "KEYHTTP", datas)
                },
                apiParamExample: datas
            });
            chai.request(server)
                .post(`/test/${infos.apiExample.http}`)
                .send(infos.apiParamExample)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
					res.header.selflink.should.contain(entity.name);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    addToApiDoc({ ...infos, result: limitResult(res) });                    
                    done();
                });
        });
    });
    describe(`{patch} ${entity.name} ${nbColorTitle}[10.3]`, () => {
		afterEach(() => { writeLog(true); });
        it(`Return updated ${entity.name} ${nbColor}[10.3.1]`, (done) => {
            executeQuery(last(entity.table,true)).then((items: Record<string, any>) => {
                    const datas = {
                        description: "Modification of the description"
                    };
                    const infos = addTest({
                        api : `{patch} ${entity.name} Patch one`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
                        apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
                        apiExample: {
                            http: `${testVersion}/${entity.name}(${items["id"]})`,                            
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
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.should.include.keys(testsKeys);
                            const newItems = res.body;
                            newItems.description.should.not.eql(items["description"]);
                            addToApiDoc({ ...infos, result: limitResult(res) });
                            done();
                        });
                });
        });
		it(`Return Error if the ${entity.name} not exist`, (done) => {
			const datas = {
                    observationType: "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    description: "Temp readings",
                    name: "temp_readings"
                };
			const infos = addTest({
				api: `{patch} return Error if the ${entity.name} not exist`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`,
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
		afterEach(() => { writeLog(true); });
        
		it(`Delete ${entity.name} return no content with code 204 ${nbColor}[10.4.1]`, (done) => {
			executeQuery(`SELECT (SELECT count(id) FROM "${entity.table}")::int as count, (${last(entity.table)})::int as id `).then((beforeDelete: Record<string, any>)  => {
				const infos = addTest({
					api : `{delete} ${entity.name} Delete one`,
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
						executeQuery(`SELECT count(id)::int FROM "${entity.table}"`).then((afterDelete: Record<string, any>)  => {
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
			const infos = addTest({
				api: `{delete} return Error if the ${entity.name} not exist`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`,
				}
			});
			chai.request(server)
				.delete(`/test/${infos.apiExample.http}`)
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