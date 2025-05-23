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
import { addStartNewTest, addTest, writeLog } from "./tests";
import geo from "./files/geo.json";

export const testsKeys = ["@iot.selfLink", "@iot.id", "Things@iot.navigationLink", "HistoricalLocations@iot.navigationLink", "name", "description", "encodingType", "location"];
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Locations;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    type: "infos",
    short: "Presentation",
    description: infos[entity.name].definition,
    reference: infos[entity.name].reference,
    result: ""
});
describe("endpoint : Locations [8.2.2]", () => {
    const temp = listOfColumns(entity);
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
        afterEach(() => {
            writeLog(true);
        });
        it(`Return all ${entity.name} ${nbColor}[9.2.2]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "all",

                description: `Retrieve all ${entity.name}.${showHide(`Get${entity.name}`, apiInfos["9.2.2"])}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-collection-entities",
                examples: {
                    http: `${testVersion}/${entity.name}`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                },
                //                  structure: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
                structure: temp
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
                short: "one",

                description: `Get a specific ${entity.singular}.${apiInfos["9.2.3"]}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-entity",
                examples: {
                    http: `${testVersion}/${entity.name}(1)`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
                type: "get",
                short: "Return error if exist",
                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
                examples: {
                    http: `${testVersion}/${entity.singular}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    done();
                });
        });
        it(`Return error /Location invalid path`, (done) => {
            const infos = addTest({
                type: "get",
                short: "Return error /Location invalid path",
                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/Location`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    done();
                });
        });
        it(`Return all ${entity.name} of a specific Thing ${nbColor}[9.2.6]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "from specific Thing",
                description: `Retrieve Locations of a specific Thing.${apiInfos["9.2.6"]}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-navigation-property",
                examples: {
                    http: `${testVersion}/Things(6)/${entity.name}`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                },
                // structure: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
                structure: temp
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
                type: "get",
                short: `Subentity ${name}`,

                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(6)/${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
                type: "get",
                short: `Subentity ${name}`,

                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(6)/${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value.length.should.eql(1);
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
                type: "get",
                short: `Return error${entity.name} Expand ${name}`,

                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
                type: "get",
                short: `Return error${entity.name} Expand ${name}`,

                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(1)?$expand=${name}`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
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
        it(`Return value of property location ${entity.name} id: 1 ${nbColor}[9.2.5]`, (done) => {
            const infos = addTest({
                type: "get",
                short: "only the value of a property",
                description: `Get the value of the property of a specific Locanion.${apiInfos["9.2.5"]}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-value-of-property",
                examples: {
                    http: `${testVersion}/${entity.name}(1)/location/$value`,
                    curl: defaultGet("curl", "KEYHTTP"),
                    javascript: defaultGet("javascript", "KEYHTTP"),
                    python: defaultGet("python", "KEYHTTP")
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
                .end((err: Error, res: any) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be text plain
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("type");
                    addToApiDoc({
                        ...infos,
                        result: res
                    });
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
                "name": "Inrae - Saint-Gilles",
                "description": "New location test Inrae - Saint-Gilles",
                "encodingType": "application/geo+json",
                "location": geo["Saint-Malo"].geometry
            };
            const infos = addTest({
                type: "post",
                short: "Post basic",
                description: `Post a new Location.${showHide(`Post${entity.name}`, apiInfos["10.2"])}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#_request",
                examples: {
                    http: `${testVersion}/${entity.name}`,
                    curl: defaultPost("curl", "KEYHTTP"),
                    javascript: defaultPost("javascript", "KEYHTTP"),
                    python: defaultPost("python", "KEYHTTP")
                },
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.examples.http}`)
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
                        result: res
                    });
                    done();
                });
        });
        it(`Return Error if the payload is malformed ${nbColor}[10.2.2]`, (done) => {
            const infos = addTest({
                type: "post",
                short: "return Error if the payload is malformed",
                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}`
                }
            });
            chai.request(server)
                .post(`/test/${infos.examples.http}`)
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
        it(`Return added Location with existing Thing ${nbColor}[10.2.1.1]`, (done) => {
            const datas = {
                "name": `Au Comptoir Vénitien ${getNB(entity.name)}`,
                "description": "Au Comptoir Vénitien",
                "encodingType": "application/geo+json",
                "location": geo.Guimgamp.geometry
            };
            const infos = addTest({
                type: "post",
                short: "Post with existing Thing",
                description: `POST a new Location with existing Thing.${apiInfos["10.2.1.1"]}`,
                reference: "https://docs.ogc.org/is/18-088/18-088.html#link-existing-entities-when-creating",
                examples: {
                    http: `${testVersion}/Things(1)/${entity.name}`,
                    curl: defaultPost("curl", "KEYHTTP"),
                    javascript: defaultPost("javascript", "KEYHTTP"),
                    python: defaultPost("python", "KEYHTTP")
                },
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.examples.http}`)
                .send(infos.params)
                .set("Cookie", `${keyTokenName}=${token}`)
                .end(async (err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.header.location.should.contain(entity.name);
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
                    type: "patch",
                    short: "One",
                    description: `Patch a ${entity.singular}.${showHide(`Patch${entity.name}`, apiInfos["10.3"])}`,
                    reference: "https://docs.ogc.org/is/18-088/18-088.html#_request_2",
                    examples: {
                        http: `${testVersion}/${entity.name}(${locations["id"]})`,
                        curl: defaultPatch("curl", "KEYHTTP"),
                        javascript: defaultPatch("javascript", "KEYHTTP"),
                        python: defaultPatch("python", "KEYHTTP")
                    },
                    params: datas
                });
                chai.request(server)
                    .patch(`/test/${infos.examples.http}`)
                    .send(infos.params)
                    .set("Cookie", `${keyTokenName}=${token}`)
                    .end((err: Error, res: any) => {
                        should.not.exist(err);
                        res.status.should.equal(201);
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
                "location": geo["Saint-Brieuc"].geometry
            };
            const infos = addTest({
                type: "patch",
                short: "Return Error if not exist",

                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
                }
            });
            chai.request(server)
                .patch(`/test/${infos.examples.http}`)
                .send(datas)
                .set("Cookie", `${keyTokenName}=${token}`)
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
                    examples: {
                        http: `${testVersion}/${entity.name}(${beforeDelete["id"]})`,
                        curl: defaultDelete("curl", "KEYHTTP"),
                        javascript: defaultDelete("javascript", "KEYHTTP"),
                        python: defaultDelete("python", "KEYHTTP")
                    }
                });
                chai.request(server)
                    .delete(`/test/${infos.examples.http}`)
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
                type: "delete",
                short: "Return Error if not exist",

                description: "",
                reference: "",
                examples: {
                    http: `${testVersion}/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`
                }
            });
            chai.request(server)
                .delete(`/test/${infos.examples.http}`)
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
