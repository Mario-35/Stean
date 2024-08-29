/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TDD for things API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";

import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, defaultGet, defaultPost, identification, keyTokenName, defaultPatch, defaultDelete, listOfColumns, limitResult, infos, apiInfos, showHide, nbColor, nbColorTitle, testVersion, _RAWDB } from "./constant";
export const testsKeys = ["@iot.id", "@iot.selfLink", "description", "name", "properties", "Locations@iot.navigationLink", "HistoricalLocations@iot.navigationLink", "Datastreams@iot.navigationLink", "MultiDatastreams@iot.navigationLink"];
import chai from "chai";
import chaiHttp from "chai-http";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { executeQuery, last } from "./executeQuery";
import { testDatas } from "../../server/db/createDb";
import { addStartNewTest, addTest, writeLog, } from "./tests";

chai.use(chaiHttp);

const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Things;

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

describe("endpoint : Thing [8.2.1]", () => {
	const myId = 0;
	const temp = listOfColumns(entity);
	const success = temp.success;
	const params = temp.params;
	let token = "";
	before((done) => {
		addStartNewTest(entity.name);
		chai.request(server)
			.post(`/test/${testVersion}/login`)
			.send(identification)
			.type("form")
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
				.get(`/test/${info.apiExample.http}`)
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
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					res.body["@iot.id"].should.eql(1);
					res.body["@iot.selfLink"].should.contain("/Things(1)");
					res.body["Locations@iot.navigationLink"].should.contain("/Things(1)/Locations");
					res.body["HistoricalLocations@iot.navigationLink"].should.contain("/Things(1)/HistoricalLocation");
					res.body["Datastreams@iot.navigationLink"].should.contain("/Things(1)/Datastreams");
					res.body["MultiDatastreams@iot.navigationLink"].should.contain("/Things(1)/MultiDatastreams");
					addToApiDoc({
						...infos,
						result: res
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
					http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`,
				}
			});
			chai.request(server)
			.get(`/test/${info.apiExample.http}`)
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
				.get(`/test/${info.apiExample.http}`)
				.end((err, res) => {
					should.not.exist(err);
					res.status.should.equal(404);
					res.type.should.equal("application/json");					
					done();
				});
		});

		it(`Return property name of Thing id: 1 ${nbColor}[9.2.4]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get only a property`,
				apiName: `GetName${entity.name}`,
				apiDescription: `Get the name of a specific Thing.${apiInfos["9.2.4"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-property-of-entity",
				apiExample: {
					http: `${testVersion}/${entity.name}(1)/name`,					
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					// there should be no errors
					should.not.exist(err);
					// there should be a 200 status code
					res.status.should.equal(200);
					// the response should be JSON
					res.type.should.equal("application/json");
					// the JSON response body should have a
					// key-value pair of {"value": 1 thing object}
					res.body.should.include.keys("name");
					Object.keys(res.body).length.should.eql(1);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it("Return error if the column does not exist", (done) => {
			const infos = addTest({
				api: "Return error if the column does not exist",
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}(1)/nameNot`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err, res) => {
					should.not.exist(err);
					res.status.should.equal(404);
					res.type.should.equal("application/json");
					docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
					done();
				});
		});

		it(`Return value of property name Thing id: 1 ${nbColor}[9.2.5]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get only the value of a property`,
				apiName: `GetNameValue${entity.name}`,
				apiDescription: `Get the value of the property of a specific Thing.${apiInfos["9.2.5"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-value-of-property",
				apiExample: {
					http: `${testVersion}/${entity.name}(1)/name/$value`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					// there should be no errors
					should.not.exist(err);
					// there should be a 200 status code
					res.status.should.equal(200);
					// the response should be text plain
					res.type.should.equal("text/plain");
					res.text.should.include(testDatas.Things[0].name);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Select @iot.id ${nbColor}[9.3.3.2]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Select with @iot.id`,
				apiName: `Get${entity.name}SelectIot`,
				apiDescription: "Get with SELECT with @iot.id.",
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
				apiExample: {
					http: `${testVersion}/${entity.name}?$select=name,description,@iot.id`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.count"].should.eql(Object.keys(testDatas[entity.name as keyof object]).length);
					res.body.value[0]["@iot.id"].should.eql(1);
					Object.keys(res.body.value[0]).length.should.eql(3);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Select id ${nbColor}[9.3.3.2]`, (done) => {
			const infos = addTest({
				api: `{get} Return ${entity.name} Select id`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}?$select=name,description,id`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.count"].should.eql(Object.keys(testDatas[entity.name as keyof object]).length);
					res.body.value[0]["@iot.id"].should.eql(1);
					Object.keys(res.body.value[0]).length.should.eql(3);
					done();
				});
		});

		it(`Return ${entity.name} Select with Datastreams navigation link ${nbColor}[9.2.6]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Select with navigation link`,
				apiName: `Get${entity.name}SelectNavLink`,
				apiDescription: "Get SELECT with navigation link",
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
				apiExample: {
					http: `${testVersion}/${entity.name}?$select=name,description,Datastreams`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.count"].should.eql(Object.keys(testDatas[entity.name as keyof object]).length);
					res.body.value[0]["Datastreams@iot.navigationLink"].should.contain("/Things(1)/Datastreams");
					Object.keys(res.body.value[0]).length.should.eql(3);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Subentity Locations ${nbColor}[9.2.6]`, (done) => {
			const name = "Locations";
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
				apiName: `Get${entity.name}Subentity`,
				apiDescription: `Get Subentity ${name} of a specific ${entity.name}.${apiInfos["9.2.6"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-navigation-property",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)/${name}`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = res.body.value[0]["@iot.id"];
					res.body.value[0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
					res.body.value[0]["Things@iot.navigationLink"].should.contain(`/${name}(${id})/Things`);
					res.body.value[0]["HistoricalLocations@iot.navigationLink"].should.contain(`${name}(${id})/HistoricalLocations`);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Subentity HistoricalLocations ${nbColor}[9.2.6]`, (done) => {
			const name = "HistoricalLocations";
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
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = res.body.value[0]["@iot.id"];
					res.body.value[0]["@iot.selfLink"].should.contain(`${name}(${id})`);
					res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
					res.body.value[0]["Locations@iot.navigationLink"].should.contain(`${name}(${id})/Locations`);
					done();
				});
		});

		it(`Return ${entity.name} Subentity Datastreams ${nbColor}[9.2.6]`, (done) => {
			const name = "Datastreams";
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
				.get(`/test/${info.apiExample.http}`)
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
					done();
				});
		});

		it(`Return ${entity.name} Subentity MultiDatastreams ${nbColor}[9.2.6]`, (done) => {
			const name = "MultiDatastreams";
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Subentity ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}(11)/${name}`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = res.body.value[0]["@iot.id"];
					res.body.value[0]["@iot.selfLink"].should.contain(`${name}(${id})`);
					res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
					res.body.value[0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
					res.body.value[0]["ObservedProperties@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperties`);
					res.body.value[0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
					done();
				});
		});

		it(`Return ${entity.name} Expand Locations ${nbColor}[9.3.2.1]`, (done) => {
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
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = res.body.Locations[0]["@iot.id"];
					res.body[name][0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
					res.body[name][0]["Things@iot.navigationLink"].should.contain(`/${name}(${id})/Things`);
					res.body[name][0]["HistoricalLocations@iot.navigationLink"].should.contain(`${name}(${id})/HistoricalLocations`);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Expand Locations With SELECT inside ${nbColor}[9.3.2.1]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Expand with Select`,				
				apiName: `Get${entity.name}ExpandSelect`,
				apiDescription: `Get Expand Locations of a specific Thing with a SELECT inside.${apiInfos["9.3.2.1"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)?$expand=Locations($select=location)`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					Object.keys(res.body.Locations[0]).should.contain("location");
					Object.keys(res.body.Locations[0]).length.should.equal(1);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Expand Locations , HistoricalLocations ${nbColor}[9.3.2.1]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Expand coma separation`,
				apiName: `Get${entity.name}ExpandComaHistorical`,
				apiDescription: `Get Expand Locations and Historical Location of a specific Thing..${apiInfos["9.3.2.1"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)?$expand=Locations,HistoricalLocations`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = res.body.Locations[0]["@iot.id"];
					res.body.Locations[0]["@iot.selfLink"].should.contain(`Locations(${id})`);
					res.body.HistoricalLocations[0]["@iot.id"].should.eql(id);
					res.body.HistoricalLocations[0]["@iot.selfLink"].should.contain(`HistoricalLocations(${id})`);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Expand Locations / HistoricalLocations ${nbColor}[9.3.2.1]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get Expand  slash separation`,				
				apiName: `Get${entity.name}ExpandSlashHistorical`,
				apiDescription: `Get Expand Locations and it's Historical Location of a specific Thing..${apiInfos["9.3.2.1"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)?$expand=Locations/HistoricalLocations`,					
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body.Locations[0]["@iot.selfLink"].should.contain(`Locations(${res.body.Locations[0]["@iot.id"]})`);
					res.body.Locations[0].HistoricalLocations[0]["@iot.selfLink"].should.contain(`HistoricalLocations(${res.body.Locations[0].HistoricalLocations[0]["@iot.id"]})`);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} Expand HistoricalLocations ${nbColor}[9.3.2.1]`, (done) => {
			const name = "HistoricalLocations";
			const infos = addTest({
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)?$expand=${name}`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = Number(res.body[name][0]["@iot.id"]);
					res.body[name][0]["@iot.selfLink"].should.contain(`${name}(${id})`);
					res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
					res.body[name][0]["Locations@iot.navigationLink"].should.contain(`${name}(${id})/Locations`);
					done();
				});
		});

		it(`Return ${entity.name} Expand Datastreams ${nbColor}[9.3.2.1]`, (done) => {
			const name = "Datastreams";
			const infos = addTest({
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)?$expand=${name}`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					const id = res.body[name][0]["@iot.id"];
					res.body[name][0]["@iot.selfLink"].should.contain(`${name}(${id})`);
					res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
					res.body[name][0]["Sensor@iot.navigationLink"].should.contain(`/${name}(${id})/Sensor`);
					res.body[name][0]["ObservedProperty@iot.navigationLink"].should.contain(`/${name}(${id})/ObservedProperty`);
					res.body[name][0]["Observations@iot.navigationLink"].should.contain(`/${name}(${id})/Observations`);
					done();
				});
		});

		it(`Return ${entity.name} Select with Expand Datastreams ${nbColor}[9.3.2.1]`, (done) => {
			const infos = addTest({
				api: `{get} return ${entity.name} Select with Expand Datastreams`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}?$select=name,description&$expand=Datastreams`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					Object.keys(res.body["value"][0]).length.should.equal(3);
					done();
				});
		});

		it(`Return ${entity.name} Expand MultiDatastreams ${nbColor}[9.3.2.1]`, (done) => {
			const name = "MultiDatastreams";
			const infos = addTest({
				api: `{get} return ${entity.name} Expand ${name}`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}(11)?$expand=${name}`,
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
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
					done();
				});
		});

		it(`Return ${entity.name} association link ${nbColor}[9.2.7]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get only references`,
				apiName: `Get${entity.name}RefLinks`,
				apiDescription: `Get only references of all Things.${apiInfos["9.2.7"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-associationlink",
				apiExample: {
					http: `${testVersion}/${entity.name}/$ref`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${testVersion}/${entity.name}/$ref`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.count"].should.eql(Object.keys(testDatas[entity.name as keyof object]).length);
					res.body.value[0]["@iot.selfLink"].should.contain("/Things(1)");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} nested resource path ${nbColor}[9.2.8]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id)/entity(:id) Get nested resource path`,				
				apiName: `Get${entity.name}NestedPath`,
				apiDescription: `Get a specific datastream resource from o specific thing. ${apiInfos["9.2.8"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-nested-resource-path",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)/Datastreams(7)`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.id"].should.eql(7);
					res.body["@iot.selfLink"].should.contain("/Datastreams(7)");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} nested resource path property ${nbColor}[9.2.8]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id)/entity(:id) Get nested resource path property`,				
				apiName: `Get${entity.name}NestedPathProperty`,
				apiDescription: `Get name property of a specific datastream resource from o specific thing. ${apiInfos["9.2.8"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-nested-resource-path",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)/Datastreams(7)/name`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["name"].should.contain("Humidité de la chambre climatique");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});		

		it(`Return ${entity.name} nested resource path entity ${nbColor}[9.2.8]`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id)/entity(:id) Get nested resource path entity`,				
				apiName: `Get${entity.name}NestedPathEntity`,
				apiDescription: `Get entity of a specific datastream resource from a specific thing. ${apiInfos["9.2.8"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-nested-resource-path",
				apiExample: {
					http: `${testVersion}/${entity.name}(6)/Datastreams(7)/Thing`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.id"].should.eql(6);
					res.body["@iot.selfLink"].should.contain("/Things(6)");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} nested filter search`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id)/entity(:id) Get filter nested resource path`,				
				apiName: `Get${entity.name}ComplexFilter`,
				apiDescription: `Get Things that's have a datastream description equal to ...`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-nested-resource-path",
				apiExample: {
					http: `${testVersion}/${entity.name}?$filter=Datastreams/description eq 'Pressure sensor'`,					
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.count"].should.eql(1);
					res.body.value.length.should.eql(1);
					res.body.value[0]["@iot.id"].should.eql(11);
					res.body.value[0]["@iot.selfLink"].should.contain("/Things(11)");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		it(`Return ${entity.name} complex nested filter search`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id)/entity(:id) Get complex filter nested resource path`,				
				apiName: `Get${entity.name}ComplexNestedFilter`,
				apiDescription: `Get Things that's have a datastream Wich have an observed property with description equal to ...`,
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}?$filter=Datastreams/ObservedProperty/description eq 'Mesure de la profondeur de la nappe'`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${info.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body["@iot.count"].should.eql(2);
					res.body.value.length.should.eql(2);
					res.body.value[0]["@iot.id"].should.eql(9);
					res.body.value[0]["@iot.selfLink"].should.contain("/Things(9)");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					done();
				});
		});

		// it(`Return ${entity.name} double complex nested filter search`, (done) => {
		//     const infos = addTest({
		//         api: `{get} ${entity.name} Get double complex filter nested resource path`,
		//         apiName: `Get${entity.name}DoubleComplexNestedFilter`,
		//         apiDescription: `Get Things that's have a datastream Wich have an observed property with description equal to ...`,
		//         apiReference: "",
		//         apiExample: {
		//             http: `${testVersion}/${entity.name}?$filter=Datastreams/Observations/resultTime ge 2016-11-12 and Datastreams/Observations/resultTime le 2016-11-15`,
		//             curl: defaultGet("curl", "KEYHTTP"),
		//             javascript: defaultGet("javascript", "KEYHTTP"),
		//             python: defaultGet("python", "KEYHTTP")
		//         }
		//     };
		//     chai.request(server)
		//         .get(`/test/${info.apiExample.http}`)
		//         .end((err: Error, res: any) => {                    
		//             should.not.exist(err);
		//             res.status.should.equal(200);
		//             res.type.should.equal("application/json");
		//             res.body["@iot.count"].should.eql(2);
		//             res.body.value.length.should.eql(2);
		//             res.body.value[0]["@iot.id"].should.eql(4);
		//             res.body.value[0]["@iot.selfLink"].should.contain("/Things(4)");
		//             addToApiDoc({ ...infos, result: limitResult(res) });
		//             done();
		//         });
		// });

	});

	describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
		afterEach(() => { writeLog(true); });
		it(`Return added ${entity.name} ${nbColor}[10.2.1]`, (done) => {
			const datas = {
				"name": "Thing test",
				"description": "Create Thing inside tests",
				"properties": {
					"organization": "Mozilla",
					"owner": "Mozilla"
				}
			};
			const infos = addTest({
				api: `{post} ${entity.name} Post basic`,
				apiName: `Post${entity.name}`,
				apiDescription: `Post a new ${entity.name}.${showHide(`Post${entity.name}`, apiInfos["10.2"])}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request",
				apiPermission: "admin:computer",
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
				.post(`/test/${info.apiExample.http}`)
				.send(info.apiParamExample)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
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
				api : `{post} return Error if the payload is malformed`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}`,
				}
			});
			chai.request(server)
				.post(`/test/${info.apiExample.http}`)
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
	
		it(`POST ${entity.name} with new Location ${nbColor}[10.2.1.2]`, (done) => {
			const datas = {
				"name": "Thing with new Location test",
				"description": "Create Thing with new location inside tests",
				"properties": {
					"Deployment Condition": "Deployed in a third floor balcony",
					"Case Used": "Radiation shield"
				},
				"Locations": {
					"name": "Au Comptoir Vénitie",
					"description": "Restaurant next to office",
					"encodingType": "application/geo+json",
					"location": {
						"type": "Point",
						"coordinates": [48.11829243294942, -1.717928984533772]
					}
				}
			};
			const infos = addTest({
				api: `{post} ${entity.name} Post with new Location`,				
				apiName: `Post${entity.name}Location`,
				apiDescription: `A Location entity can be linked to a Thing at its creation time. The Location provided will be a new Location in the system.${apiInfos["10.2.1.2"]}`,
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
				.post(`/test/${info.apiExample.http}`)
				.send(info.apiParamExample)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end(async (err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					const thingId = +res.body["@iot.id"];
					executeQuery(`SELECT id::int FROM "location" ORDER BY id desc LIMIT 1`).then(async (locationRes) => {
							executeQuery(`SELECT * FROM "thinglocation" WHERE "thing_id" = ${thingId} AND "location_id" = ${locationRes["id" as keyof object]}`).then((tempSearchNew) => {
									if (tempSearchNew) {
										Number(tempSearchNew["location_id" as keyof object]).should.eql(locationRes["id" as keyof object]);
										Number(tempSearchNew["thing_id" as keyof object]).should.eql(thingId as keyof object);
										executeQuery(`SELECT "thing_id" FROM "historicallocation" ORDER BY "id" desc LIMIT 1`)
											.then((historicallocationRes) => {
												if (historicallocationRes) {
													Number(historicallocationRes["thing_id" as keyof object]).should.eql(thingId);
													addToApiDoc({
														...infos,
														result: limitResult(res)
													});
													docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
													done();
												}
											})
											.catch((e) => console.log(e));
									}
								})
								.catch((e) => console.log(e));
						})
						.catch((e) => console.log(e));
				});
		});
	
		it(`POST ${entity.name} with existing Location ${nbColor}[10.2.1.1]`, (done) => {
			const datas = {
				"name": "Thing with existing Location test",
				"description": "Create Thing with existing location inside tests",
				"properties": {
					"Deployment Condition": "Deployed in a third floor balcony",
					"Case Used": "Radiation shield"
				},
				"Locations": [{
					"@iot.id": "1"
				}]
			};
			const infos = addTest({
				api: `{post} ${entity.name} Post with existing Location`,				
				apiName: "PostThingExistLocation",
				apiDescription: `Create a Thing with existing location.${apiInfos["10.2.1.1"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#link-existing-entities-when-creating",
				apiExample: {
					http: `${testVersion}/${entity.name}`,
					curl: defaultPost("curl", "KEYHTTP", datas),
					javascript: defaultPost("javascript", "KEYHTTP", datas),
					python: defaultPost("python", "KEYHTTP", datas)
				},
				apiParamExample: datas
			});
			chai.request(server)
				.post(`/test/${info.apiExample.http}`)
				.send(info.apiParamExample)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					const thingId = +res.body["@iot.id"];
					executeQuery(`SELECT "location_id"::int, "thing_id"::int FROM "thinglocation" WHERE "thing_id" = ${thingId} AND "location_id" = 1`)
						.then((tempSearchNew: Record<string, any> ) => {
							if (tempSearchNew) {
								tempSearchNew["location_id"].should.eql(1);
								tempSearchNew["thing_id"].should.eql(thingId);
								executeQuery(`SELECT "thing_id"::int FROM "historicallocation" ORDER BY "id" desc LIMIT 1`)
									.then((historicallocationRes: Record<string, any>) => {
										if (historicallocationRes) {
											historicallocationRes["thing_id"].should.eql(thingId);
											addToApiDoc({
												...infos,
												result: limitResult(res)
											});
											docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
											done();
										}
									})
									.catch((e) => console.log(e));
							}
						})
						.catch((e) => console.log(e));
				});
		});
	
		it(`POST ${entity.name} with existing Location that don't exist`, (done) => {
			const datas = {
				"name": "Thing with existing Location not exist test",
				"description": "Create Thing with existing location Location not exist tests",
				"properties": {
					"Deployment Condition": "Deployed in a third floor balcony",
					"Case Used": "Radiation shield"
				},
				"Locations": [{
					"@iot.id": 1908
				}]
			};
			const infos = addTest({
				api: `{post} ${entity.name} Post with existing Location that don't exist`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/Things`,
				}
			});
			chai.request(server)
				.post(`/test/${info.apiExample.http}`)
				.set("Cookie", `${keyTokenName}=${token}`)
				.send(datas)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(404);
					res.type.should.equal("application/json");
					docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
					done();
				});
		});
	
		it(`POST ${entity.name} with new Location & Datastream ${nbColor}[10.2.1.2]`, (done) => {
			const datas = {
				"name": "Thing with new Location & Datastream test",
				"description": "Create Thing with new location & Datastream inside tests",
				"properties": {
					"Deployment Condition": "Deployed in a third floor balcony",
					"Case Used": "Radiation shield"
				},
				"Locations": [{
					"name": "Glaz Arena",
					"description": "Glaz Arena sport complex",
					"encodingType": "application/geo+json",
					"location": {
						"type": "Point",
						"coordinates": [48.11472599868096, -1.594679622929148]
					}
				}],
				"Datastreams": [{
					"name": "Air Temperature DS",
					"description": "Datastream for recording temperature",
					"observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
					"unitOfMeasurement": {
						"name": "Degree Celsius for test",
						"symbol": "degC",
						"definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
					},
					"ObservedProperty": {
						"name": "Area Temperature for test",
						"description": "The degree or intensity of heat present in the area",
						"definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
					},
					"Sensor": {
						"name": "`DHT22 for test",
						"description": "DHT22 temperature sensor",
						"encodingType": "application/pdf",
						"metadata": "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
					}
				}]
			};
			const infos = addTest({
				api: `{post} ${entity.name} Post with Location and Datastream`,
				apiName: "PostThingLocationDatastream",
				apiDescription: "Create a Thing with new location & datastream.",
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
				.post(`/test/${info.apiExample.http}`)
				.send(info.apiParamExample)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					const thingId = String(res.body["@iot.id"]);
					executeQuery(`SELECT * FROM "datastream" ORDER BY "id" desc LIMIT 1`)
						.then((datastreamRes: Record<string, any>) => {
							executeQuery(`SELECT "id" FROM "sensor" ORDER BY "id" desc LIMIT 1`)
								.then((sensorRes: Record<string, any>) => {
									executeQuery(`SELECT "id" FROM "observedproperty" ORDER BY "id" desc LIMIT 1`)
										.then((observedpropertyRes: Record<string, any>) => {
											datastreamRes["thing_id"].should.eql(thingId);
											datastreamRes["sensor_id"].should.eql(sensorRes["id"]);
											datastreamRes["observedproperty_id"].should.eql(observedpropertyRes["id"]);
											addToApiDoc({
												...infos,
												result: limitResult(res)
											});
											docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
											done();
										})
										.catch((e) => console.log(e));
								})
								.catch((e) => console.log(e));
						})
						.catch((e) => console.log(e));
				});
		});
	
		it(`POST ${entity.name} with Inner Posts`, (done) => {
			const datas = {
				"description": "Thing test For inner Post",
				"name": "Thing test For inner Post",
				"properties": {
					"reference": "first"
				},
				"Locations": [{
					"name": "location for Thing test",
					"description": "location for Thing test For inner Post",
					"location": {
						"type": "Point",
						"coordinates": [
							-117.05,
							51.05
						]
					},
					"encodingType": "application/geo+json"
				}],
				"Datastreams": [{
						"unitOfMeasurement": {
							"name": "Lumen",
							"symbol": "lm",
							"definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html/Lumen"
						},
						"name": "first datastream name",
						"description": "first datastream for Thing inner test",
						"observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
						"ObservedProperty": {
							"name": "Luminous Flux",
							"definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html/LuminousFlux",
							"description": "observedProperty flux"
						},
						"Sensor": {
							"name": "first sensor name",
							"description": "first sensor for Thing inner test",
							"encodingType": "application/pdf",
							"metadata": "Light flux sensor"
						},
						"Observations": [{
								"phenomenonTime": "2015-03-03T00:00:00Z",
								"result": 3
							},
							{
								"phenomenonTime": "2015-03-04T00:00:00Z",
								"result": 4
							}
						]
					},
					{
						"unitOfMeasurement": {
							"name": "Centigrade",
							"symbol": "C",
							"definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html/Lumen"
						},
						"name": "second datastream name",
						"description": "second datastream for Thing inner test",
						"observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
						"ObservedProperty": {
							"name": "Tempretaure",
							"definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html/Tempreture",
							"description": "observedProperty second"
						},
						"Sensor": {
							"name": "second sensor name",
							"description": "second sensor for Thing inner test",
							"encodingType": "application/pdf",
							"metadata": "Tempreture sensor"
						},
						"Observations": [{
								"phenomenonTime": "2015-03-05T00:00:00Z",
								"result": 5
							},
							{
								"phenomenonTime": "2015-03-06T00:00:00Z",
								"result": 6
							}
						]
					}
				]
			};
			const infos = addTest({
				api: `{post} ${entity.name} Post with Inner Posts`,				
				apiName: "PostThingWithInnerPosts",
				apiDescription: "Create a Thing with with Inner Posts.",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}`,					
					curl: defaultPost("curl", "KEYHTTP", datas),
					javascript: defaultPost("javascript", "KEYHTTP", datas),
					python: defaultPost("python", "KEYHTTP", datas)
				},
				apiParamExample: datas
			});
			chai.request(server)
				.post(`/test/${info.apiExample.http}`)
				.send(info.apiParamExample)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					res.body["name"].should.equal("Thing test For inner Post");
					done();
				});
		});
	});

	describe(`{patch} ${entity.name} ${nbColorTitle}[10.3]`, () => {
		afterEach(() => { writeLog(true); });
		it(`Return updated ${entity.name} ${nbColor}[10.3.1]`, (done) => {
			executeQuery(`SELECT * FROM "${entity.table}" ORDER BY id desc LIMIT 1`)
				.then((things: Record<string, any>) => {
					const datas = {
						"name": "New SensorWebThing Patch",
						"properties": {
							"organization": "Mozilla",
							"owner": "Mozilla"
						}
					};
					const infos = addTest({
						api: `{patch} ${entity.name} Patch a Thing`,
						apiName: `Patch${entity.name}`,
						apiDescription: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
						apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
						apiExample: {
							http: `${testVersion}/${entity.name}(${things["id"]})`,
							curl: defaultPatch("curl", "KEYHTTP", datas),
							javascript: defaultPatch("javascript", "KEYHTTP", datas),
							python: defaultPatch("python", "KEYHTTP", datas)
						},
						apiParamExample: datas
					});
					chai.request(server)
						.patch(`/test/${info.apiExample.http}`)
						.send(info.apiParamExample)
						.set("Cookie", `${keyTokenName}=${token}`)
						.end((err: Error, res: any) => {
							should.not.exist(err);
							res.status.should.equal(200);
							res.type.should.equal("application/json");
							res.body.should.include.keys(testsKeys);
							const newThingObject = res.body;
							newThingObject.name.should.not.eql(things["name"]);
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
				api: `{patch} return Error if the ${entity.name} not exist`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`,
				}
			});
			chai.request(server)
				.patch(`/test/${info.apiExample.http}`)
				.set("Cookie", `${keyTokenName}=${token}`)
				.send(datas)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(404);
					res.type.should.equal("application/json");
					docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4).replace(Number.MAX_SAFE_INTEGER.toString(), String(myId));
					done();
				});
		});

		it(`Return updated ${entity.name} with new location`, (done) => {
			const datas = {
				"name": "New SensorWebThing back",
				"properties": {
					"organization": "Mozilla",
					"owner": "Mozilla"
				},
				"Locations": [{
					"@iot.id": 10
				}]
			};
			executeQuery(`SELECT * FROM "${entity.table}" ORDER BY id desc LIMIT 1`)
				.then((things: Record<string, any>) => {
					const infos = addTest({
						api: `{patch} ${entity.name} Patch with New location`,
						apiName: `PatchLocation${entity.name}`,
						apiDescription: "Modify location of a Thing.",
						apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
						apiExample: {
							http: `${testVersion}/${entity.name}(${things["id"]})`,							
							curl: defaultPatch("curl", "KEYHTTP", datas),
							javascript: defaultPatch("javascript", "KEYHTTP", datas),
							python: defaultPatch("python", "KEYHTTP", datas)
						},
						apiParamExample: datas
					});
					chai.request(server)
						.patch(`/test/${info.apiExample.http}`)
						.send(info.apiParamExample)
						.set("Cookie", `${keyTokenName}=${token}`)
						.end((err: Error, res: any) => {
							should.not.exist(err);
							res.status.should.equal(200);
							res.type.should.equal("application/json");
							res.body.should.include.keys(testsKeys);
							const thingId = +res.body["@iot.id"];
							executeQuery(`SELECT * FROM "thinglocation" WHERE "thing_id" = ${thingId} AND "location_id" = 10`)
								.then((tempSearchNew: Record<string, any>) => {
									if (tempSearchNew) {
										Number(tempSearchNew["location_id"]).should.eql(10);
										Number(tempSearchNew["thing_id"]).should.eql(thingId);
										executeQuery(`SELECT "thing_id"::int FROM "historicallocation" ORDER BY "id" desc LIMIT 1`)
											.then((historicallocationRes: Record<string, any>) => {
												if (historicallocationRes && historicallocationRes) {
													historicallocationRes["thing_id"].should.eql(thingId);
													addToApiDoc({
														...infos,
														result: limitResult(res)
													});
													done();
												}
											})
											.catch((e) => console.log(e));
									}
								})
								.catch((e) => console.log(e));
						});
				});
		});

		it(`Return updated ${entity.name} with only location (relation only)`, (done) => {
			executeQuery(`SELECT * FROM "${entity.table}" ORDER BY id desc LIMIT 1`)
				.then((things: Record<string, any>) => {
					const datas = {
						"Locations": [{
							"@iot.id": 2
						}]
					};
					const infos = addTest({
						api: `{patch} ${entity.name} Patch with existing Location`,
						apiName: `PatchExistLocation${entity.name}`,
						apiDescription: "Patch a Thing and only location change.",
						apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
						apiExample: {
							http: `${testVersion}/${entity.name}(${things["id"]})`,							
							curl: defaultPatch("curl", "KEYHTTP", datas),
							javascript: defaultPatch("javascript", "KEYHTTP", datas),
							python: defaultPatch("python", "KEYHTTP", datas)
						},
						apiParamExample: datas
					});
					chai.request(server)
						.patch(`/test/${info.apiExample.http}`)
						.send(info.apiParamExample)
						.set("Cookie", `${keyTokenName}=${token}`)
						.end((err: Error, res: any) => {
							should.not.exist(err);
							res.status.should.equal(200);
							res.type.should.equal("application/json");
							res.body.should.include.keys(testsKeys);
							const thingId = String(res.body["@iot.id"]);
							executeQuery(`SELECT * FROM "thinglocation" WHERE "thing_id" = ${thingId} AND "location_id" = 2`)
								.then((tempSearchNew: Record<string, any>) => {
									if (tempSearchNew) {
										tempSearchNew["location_id"].should.eql("2");
										tempSearchNew["thing_id"].should.eql(thingId);
										executeQuery(`SELECT "thing_id" FROM "historicallocation" ORDER BY "id" DESC LIMIT 1`)
											.then((historicallocationRes: Record<string, any>) => {
												if (historicallocationRes && historicallocationRes) {
													historicallocationRes["thing_id"].should.eql(thingId);
													addToApiDoc({
														...infos,
														result: limitResult(res)
													});
													done();
												}
											})
											.catch((e) => console.log(e));
									}
								})
								.catch((e) => console.log(e));
						});
				});
		});
	});

	describe(`{delete} ${entity.name} ${nbColorTitle}[10.4]`, () => {
		afterEach(() => { writeLog(true); });
		it(`Delete ${entity.name} return no content with code 204 ${nbColor}[10.4.1]`, (done) => {
			executeQuery(`SELECT (SELECT count(id) FROM "${entity.table}")::int as count, (${last(entity.table)})::int as id `).then((beforeDelete: Record<string, any>) => {
				const infos = addTest({
					api: `{delete} ${entity.name} Delete one`,
					apiName: `Delete${entity.name}`,
					apiDescription: `Delete a ${entity.singular}.${showHide(`Delete${entity.name}`, apiInfos["10.4"])}`,
					apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request_3",
					apiExample: {
						http: `${testVersion}/${entity.name}(${beforeDelete["id" as keyof object]})`,						
						curl: defaultDelete("curl", "KEYHTTP"),
						javascript: defaultDelete("javascript", "KEYHTTP"),
						python: defaultDelete("python", "KEYHTTP")
					}
				});
				chai.request(server)
					.delete(`/test/${info.apiExample.http}`)
					.set("Cookie", `${keyTokenName}=${token}`)
					.end((err: Error, res: any) => {
						should.not.exist(err);
						res.status.should.equal(204);
						executeQuery(`SELECT count(id)::int FROM "${entity.table}"`).then((afterDelete: Record<string, any>) => {
							afterDelete["count"].should.eql(beforeDelete["count"] - 1);
							executeQuery(`SELECT count(*)::int FROM "historicallocation" WHERE "thing_id" = ${beforeDelete["id"]}`)
								.then((hists: Record<string, any>) => {
									hists["count"].should.eql(0);
									addToApiDoc({
										...infos,
										result: limitResult(res)
									});
									done();
								});
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
				.delete(`/test/${info.apiExample.http}`)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(404);
					res.type.should.equal("application/json");
					docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4).replace(Number.MAX_SAFE_INTEGER.toString(), String(myId));
					generateApiDoc(docs, `apiDoc${entity.name}.js`);
					done();
				});
		});
	});
});