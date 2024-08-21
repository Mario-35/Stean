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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, identification, keyTokenName, defaultGet, defaultPost, defaultPatch, defaultDelete, listOfColumns, limitResult, infos, apiInfos, showHide, nbColor, nbColorTitle, testVersion, _RAWDB, getNB } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { executeQuery, last } from "./executeQuery";
import { addStartNewTest, addTest, writeLog, } from "./tests";

export const testsKeys = [
	"@iot.selfLink",
	"@iot.id",
	"Things@iot.navigationLink",
	"HistoricalLocations@iot.navigationLink",
	"name",
	"description",
	"encodingType",
	"location"
];

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Locations;



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

describe("endpoint : Locations [8.2.2]", () => {
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
					res.body["@iot.selfLink"].should.contain("/Locations(1)");
					res.body["@iot.id"].should.eql(1);
					res.body["Things@iot.navigationLink"].should.contain("/Locations(1)/Things");
					res.body["HistoricalLocations@iot.navigationLink"].should.contain("/Locations(1)/HistoricalLocations");
					addToApiDoc({
						...infos,
						result: res
					});
					
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

		it(`Return error /Location invalid path`, (done) => {
			const infos = addTest({
				api : `{get} return error /Location invalid path`,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
					http: `${testVersion}/Location`,
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

		it(`Return all ${entity.name} of a specific Thing ${nbColor}[9.2.6]`, (done) => {
			const infos = addTest({
				api : `{get} Things(:id)/${entity.name} Get from specific Thing`,
				apiName: `GetAllFromThing${entity.name}`,
				apiDescription: `Retrieve Locations of a specific Thing.${apiInfos["9.2.6"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-navigation-property",
				apiExample: {
					http: `${testVersion}/Things(6)/${entity.name}`,				
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
					res.body.value.length.should.eql(1);
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					
					done();
				});
		});

		it(`Return ${entity.name} Subentity Things ${nbColor}[9.2.6]`, (done) => {
			const name = "Things";
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
					res.body.value[0]["Locations@iot.navigationLink"].should.contain(`/${name}(${id})/Locations`);
					res.body.value[0]["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}(${id})/HistoricalLocations`);
					res.body.value[0]["Datastreams@iot.navigationLink"].should.contain(`/${name}(${id})/Datastreams`);
					res.body.value[0]["MultiDatastreams@iot.navigationLink"].should.contain(`/${name}(${id})/MultiDatastreams`);
					
					done();
				});
		});

		it(`Return all ${entity.name} Subentity HistoricalLocations ${nbColor}[9.2.6]`, (done) => {
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
				.get(`/test/${infos.apiExample.http}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					res.body.value.length.should.eql(2);
					const id = Number(res.body.value[0]["@iot.id"]);
					res.body.value[0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
					res.body.value[0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
					res.body.value[0]["Locations@iot.navigationLink"].should.contain(`/${name}(${id})/Locations`);
					
					done();
				});
		});

		it(`Return all ${entity.name} Expand Things ${nbColor}[9.3.2.1]`, (done) => {
			const name = "Things";
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
					res.body[name][0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
					res.body[name][0]["Locations@iot.navigationLink"].should.contain(`${name}(${id})/Locations`);
					res.body[name][0]["HistoricalLocations@iot.navigationLink"].should.contain(`/${name}(${id})/HistoricalLocations`);
					res.body[name][0]["Datastreams@iot.navigationLink"].should.contain(`${name}(${id})/Datastreams`);
					res.body[name][0]["MultiDatastreams@iot.navigationLink"].should.contain(`${name}(${id})/MultiDatastreams`);
					
					done();
				});
		});

		it(`Return all ${entity.name} Expand HistoricalLocations ${nbColor}[9.3.2.1]`, (done) => {
			const name = "HistoricalLocations";
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
					res.body[name][0]["@iot.selfLink"].should.contain(`/${name}(${id})`);
					res.body[name][0]["Thing@iot.navigationLink"].should.contain(`/${name}(${id})/Thing`);
					res.body[name][0]["Locations@iot.navigationLink"].should.contain(`${name}(${id})/Locations`);					
					done();
				});
		});
	});

	describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
		afterEach(() => { writeLog(true); });
	
		it(`Return added ${entity.name} ${nbColor}[10.2.1]`, (done) => {
			const datas = {
				"name": "Inrae - Saint-Gilles",
				"description": "New location test Inrae - Saint-Gilles",
				"encodingType": "application/geo+json",
				"location": {
					"type": "Point",
					"coordinates": [48.14523718972358, -1.8305352019940178]
				}
			};
			const infos = addTest({
				api : `{post} ${entity.name} Post basic`,
				apiName: `Post${entity.name}`,
				apiDescription: `Post a new Location.${showHide(`Post${entity.name}`, apiInfos["10.2"])}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request",
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
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					addToApiDoc({
						...infos,
						result: res
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
					http: `${testVersion}/${entity.name}`
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

		it(`Return added Location with existing Thing ${nbColor}[10.2.1.1]`, (done) => {
			const datas = {
				"name": `Au Comptoir Vénitien ${getNB(entity.name)}`,
				"description": "Au Comptoir Vénitien",
				"encodingType": "application/geo+json",
				"location": {
					"type": "Point",
					"coordinates": [48.11829243294942, -1.717928984533772]
				}
			};
			const infos = addTest({
				api : `{post} ${entity.name} Post with existing Thing`,				
				apiName: `PostLocationThing${entity.name}`,
				apiDescription: `POST a new Location with existing Thing.${apiInfos["10.2.1.1"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#link-existing-entities-when-creating",
				apiExample: {
					http: `${testVersion}/Things(1)/${entity.name}`,
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
				.end(async (err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
					res.type.should.equal("application/json");
					res.body.should.include.keys(testsKeys);
					executeQuery(`SELECT * FROM "thinglocation" WHERE "thing_id" = 1 AND "location_id" = ${res.body["@iot.id"]}`).then((tempSearch: Record<string, any>) => {
						tempSearch.should.include.keys("location_id", "thing_id");
						tempSearch["thing_id"].should.eql(1);
						tempSearch["location_id"].should.eql(+res.body["@iot.id"]);
					});
					addToApiDoc({
						...infos,
						result: res
					});
					docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
					done();
				});
		});
	});

	describe(`{patch} ${entity.name} ${nbColorTitle}[10.3]`, () => {
		afterEach(() => { writeLog(true); });
		it(`Return updated ${entity.name} ${nbColor}[10.3.1]`, (done) => {
			executeQuery(last(entity.table)).then((locations: Record<string, any>) => {
				const datas = {
					name: "My Location has changed",
					description: "Inrae - Site De Saint-Gilles",
					encodingType: "application/geo+json",
					location: {
						type: "Point",
						coordinates: [48.14523718972358, -1.8305352019940178]
					}
				};
				const infos = addTest({
					api : `{patch} ${entity.name} Patch one`,					
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
						res.status.should.equal(200);
						res.type.should.equal("application/json");
						res.body.should.include.keys(testsKeys);
						const newLocationObject = res.body;
						newLocationObject.should.not.eql(locations["name"]);
						addToApiDoc({
							...infos,
							result: res
						});
						done();
					});
			});
		});
	
		it(`Return Error if the ${entity.name} not exist`, (done) => {
			const datas = {
				"name": "My Location has changed",
				"description": "Inrae - Site De Saint-Gilles",
				"encodingType": "application/geo+json",
				"location": {
					"type": "Point",
					"coordinates": [48.14523718972358, -1.8305352019940178]
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