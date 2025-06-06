/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TDD for ultime tests API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, IApiInput, prepareToApiDoc, generateApiDoc, identification, keyTokenName, limitResult, blank, testVersion, _RAWDB } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { addStartNewTest, addTest, writeLog } from "./tests";
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.CreateObservations;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};
addToApiDoc({
    type: "infos",
    short: "Presentation",
    description: `Besides creating Observation entities one by one with multiple HTTP POST requests, there is a need to create multiple Observation entities with a lighter message body in a single HTTP request. In this case, a sensing system can buffer multiple Observations and send them to a SensorThings service in one HTTP request. Here we propose an Action operation CreateObservations.
    ${blank(1)}The message body aggregates Observations by Datastreams, which means all the Observations linked to one Datastream SHALL be aggregated in one JSON object. The parameters of each JSON object are shown in the following table.
    ${blank(2)}As an Observation links to one FeatureOfInterest, to establish the link between an Observation and a FeatureOfInterest, users should include the FeatureOfInterest ids in the dataArray. If no FeatureOfInterest id presented, the FeatureOfInterest will be created based on the Location entities of the linked Thing entity by default.
    <table> <thead> <tr> <th style="width: 10%">Name</th> <th style="width: 60%">Definition</th> <th style="width: 15%">Data type</th> <th style="width: 15%">Multiplicity and use</th> </tr> </thead> <tbody> <tr> <td>Datastream or MultiDatastream</td> <td><p>The unique identifier of the Datastream or MultiDatastream linking to the group of Observation entities in the dataArray.</p></td> <td><p>The unique identifier of a Datastream or MultiDatastream</p></td> <td>One (mandatory)</td> </tr> <tr> <td>components</td> <td><p>An ordered array of Observation property names whose matched values are included in the dataArray. At least the phenomenonTime and result properties SHALL be included. To establish the link between an Observation and a FeatureOfInterest, the component name is "FeatureOfInterest/id" and the FeatureOfInterest ids should be included in the dataArray array. If no FeatureOfInterest id is presented, the FeatureOfInterest will be created based on the Location entities of the linked Thing entity by default.</p></td> <td><p>An ordered array of Observation property names</p></td> <td>One (mandatory)</td> </tr> <tr> <td>dataArray</td> <td><p>A JSON Array containing Observations. Each Observation is represented by the ordered property values. The ordered property values match with the ordered property names in components.</p></td> <td>JSON Array</td> <td>One (mandatory)</td> </tr> </tbody> </table>`,
    reference: "https://docs.ogc.org/is/18-088/18-088.html#create-observation-dataarray",
    result: ""
});
const datasObs = (datastream: number) => {
    return {
        "Datastream": { "@iot.id": datastream },
        "components": ["phenomenonTime", "result", "resultTime", "FeatureOfInterest/id"],
        "@iot.count": 4,
        "dataArray": [
            ["2017-01-13T10:20:00.000Z", 90, "2017-01-13T10:20:00.000Z", 1],
            ["2017-01-13T10:21:00.000Z", 91, "2017-01-13T10:21:00.000Z", 1],
            ["2017-02-13T10:22:00.000Z", 92, "2017-02-13T10:22:00.000Z", 1],
            ["2017-02-13T10:23:00.000Z", 93, "2017-02-13T10:23:00.000Z", 1]
        ]
    };
};
const muliDatasObs = (multiDatastream: number) => {
    return {
        "MultiDatastream": { "@iot.id": multiDatastream },
        "components": ["phenomenonTime", "result", "resultTime", "FeatureOfInterest/id"],
        "@iot.count": 4,
        "dataArray": [
            ["2017-01-13T10:20:00.000Z", [591, 592, 593], "2017-01-13T10:20:00.000Z", 1],
            ["2017-01-13T10:21:00.000Z", [691, 692, 693], "2017-01-13T10:21:00.000Z", 1],
            ["2017-02-13T10:22:00.000Z", [791, 792, 793], "2017-02-13T10:22:00.000Z", 1],
            ["2017-02-13T10:23:00.000Z", [891, 892, 893], "2017-02-13T10:23:00.000Z", 1]
        ]
    };
};
describe(`endpoint : ${entity.name} [13.2]`, () => {
    afterEach(() => {
        writeLog(true);
    });
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
    it("should return 4 observations links added that was added", (done) => {
        const infos = addTest({
            type: "post",
            short: "Add datastream",
            description: "Create Observations with CreateObservations",
            request: `${testVersion}/CreateObservations`,
            params: datasObs(1)
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(infos.params)
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body[0].should.include(`/${testVersion}/Observations(`);
                res.body[1].should.include(`/${testVersion}/Observations(`);
                res.body[2].should.include(`/${testVersion}/Observations(`);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("should throw an error if datastream does not exist", (done) => {
        const datas = {
            "Datastream": { "@iot.id": `${BigInt(Number.MAX_SAFE_INTEGER)}` },
            "components": ["phenomenonTime", "result", "resultTime", "FeatureOfInterest/id"],
            "@iot.count": 3,
            "dataArray": [
                ["2017-01-13T10:20:00.000Z", 90, "2017-01-13T10:20:00.000Z", 1],
                ["2017-01-13T10:21:00.000Z", 91, "2017-01-13T10:21:00.000Z", 1],
                ["2017-01-13T10:22:00.000Z", 92, "2017-01-13T10:22:00.000Z", 1]
            ]
        };
        const infos = addTest({
            type: "post",
            short: "Return Error if datastream does not exist",
            description: "",
            reference: "",
            request: `${testVersion}/${entity.name}`
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
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
    it("should return 4 observations in datastream 2", (done) => {
        const infos = addTest({
            type: "post",
            short: "Return Error if datastream does not exist",
            description: "",
            reference: "",
            request: `${testVersion}/${entity.name}`
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(datasObs(2))
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body[0].should.include(`/${testVersion}/Observations(`);
                res.body[1].should.include(`/${testVersion}/Observations(`);
                res.body[2].should.include(`/${testVersion}/Observations(`);
                done();
            });
    });
    it("should return 4 observations duplicate", (done) => {
        const infos = addTest({
            type: "post",
            short: "Add datastream duplicate.",
            description: "Create Observations duplicate with CreateObservations",
            request: `${testVersion}/${entity.name}`,
            params: datasObs(2)
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(datasObs(2))
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body.length.should.eql(4);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });

    it("should return 4 observations duplicate = delete", (done) => {
        const datas = {
            "duplicate": "delete",
            ...datasObs(2)
        };
        const infos = addTest({
            type: "post",
            short: "Add datastream duplicate = delete.",
            description: "Create Observations duplicate delete with CreateObservations",
            request: `${testVersion}/${entity.name}`,
            params: datas
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(datas)
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body.length.should.eql(8);
                res.body[0].should.eql("Duplicate (2017-01-13T10:20:00.000Z,90,2017-01-13T10:20:00.000Z,1)");
                res.body[1].should.include("delete id ==>");
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("should return 4 observations with multiDatastream", (done) => {
        const datas = muliDatasObs(2);
        const infos = addTest({
            type: "post",
            short: "Add multiDatastream",
            description: "Create Observations duplicate with CreateObservations",
            request: `${testVersion}/${entity.name}`,
            params: datas
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(datas)
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body.length.should.eql(4);
                res.body[0].should.include("/Observations(");
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("should return 4 observations in MultiDatastream", (done) => {
        const datas = muliDatasObs(2);
        const infos = addTest({
            type: "post",
            short: "Add multiDatastream duplicate.",
            description: "Create Observations duplicate with CreateObservations",
            request: `${testVersion}/${entity.name}`,
            params: datas
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(datas)
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body.length.should.eql(4);
                res.body[0].should.eql("Duplicate (2017-01-13T10:20:00.000Z,591,592,593,2017-01-13T10:20:00.000Z,1)");
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("should return 4 observations duplicate = delete", (done) => {
        const datas = {
            "duplicate": "delete",
            ...muliDatasObs(2)
        };
        const infos = addTest({
            type: "post",
            short: "Add multiDatastream duplicate = delete.",
            description: "Create Observations duplicate delete with CreateObservations",
            request: `${testVersion}/${entity.name}`,
            params: datas
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .send(datas)
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body.length.should.eql(8);
                res.body[0].should.eql("Duplicate (2017-01-13T10:20:00.000Z,591,592,593,2017-01-13T10:20:00.000Z,1)");
                res.body[1].should.include("delete id ==>");
                addToApiDoc({ ...infos, result: limitResult(res) });
                generateApiDoc(docs, entity.name);
                done();
            });
    });
});
