/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TDD for Configs API.
 *
 * @copyright 2020-present Inrae
 * @review 29-10-2024
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, limitResult, testVersion } from "./constant";
import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "./tests";
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};
addToApiDoc({
    type: "infos",
    short: "Presentation Extension",
    description: `Format result json as default, dataArray, csv, txt,  graph or graphDatas, note that $value return result as text.`,
    result: ""
});
describe("Output formats", () => {
    before((done) => {
        addStartNewTest("Output formats");
        done();
    });
    afterEach(() => {
        writeLog(true);
    });
    describe("{get} resultFormat csv", () => {
        it("Return result in csv format.", (done) => {
            const infos = addTest({
                type: "get",
                short: "ResultFormat as csv",
                description: 'Use $resultFormat=csv to get datas as csv format.<br><img class="tabLogo" src="./assets/csv.jpg" alt="csv result">',
                request: `${testVersion}/Datastreams(1)/Observations?$top=20&$resultFormat=csv`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("text/csv");
                    res.text.startsWith(`"@iot.${"id"}";`);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });
    describe("{get} resultFormat dataArray", () => {
        it("Return Things in dataArray format.", (done) => {
            const infos = addTest({
                type: "get",
                short: "Things as dataArray",
                description: "Use $resultFormat=dataArray to get datas as dataArray format.",
                request: `${testVersion}/Things?$resultFormat=dataArray`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body["@iot.count"].should.eql(16);
                    res.body.value[0].component.length.should.eql(4);
                    res.body.value[0].dataArray.length.should.eql(16);
                    res.body.value[0].dataArray = [res.body.value[0].dataArray[0], res.body.value[0].dataArray[1], " ... "];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Return Datastream/Observations in dataArray format.", (done) => {
            const infos = addTest({
                type: "get",
                short: "Observations as dataArray",
                description: "Use $resultFormat=dataArray to get datas as dataArray format.",
                request: `${testVersion}/Datastreams(1)/Observations?$resultFormat=dataArray&$select=id,result`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value[0].component.length.should.eql(2);
                    res.body["@iot.count"].should.eql(33);
                    res.body.value[0].dataArray.length.should.eql(33);
                    res.body.value[0].dataArray = [res.body.value[0].dataArray[0], res.body.value[0].dataArray[1], " ... "];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
        it("Return Observations expand Datastream name in dataArray format.", (done) => {
            chai.request(server)
                .get(`/test/${testVersion}/Observations?$expand=Datastream($select=name)&$select=phenomenonTime,result&$resultFormat=dataArray`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value[0]["component"].should.includes("Datastream");
                    res.body["@iot.count"].should.eql(552);
                    done();
                });
        });
        it("Return Observations expand Datastream id in dataArray format.", (done) => {
            chai.request(server)
                .get(`/test/${testVersion}/Observations?$expand=Datastream($select=id)&$select=phenomenonTime,result&$resultFormat=dataArray`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value[0]["component"].should.includes("Datastream");
                    res.body["@iot.count"].should.eql(552);
                    res.body.value[0]["dataArray"][0][2]["@iot.id"].should.equal(1);
                    done();
                });
        });
        it("Return Observations expand Datastream id and name in dataArray format.", (done) => {
            chai.request(server)
                .get(`/test/${testVersion}/Observations?$expand=Datastream($select=id,name)&$select=phenomenonTime,result&$resultFormat=dataArray`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value[0]["component"].should.includes("Datastream");
                    Object.keys(res.body.value[0]["dataArray"][0][2]).should.include("@iot.id");
                    Object.keys(res.body.value[0]["dataArray"][0][2]).should.include("name");
                    res.body["@iot.count"].should.eql(552);
                    done();
                });
        });
    });
    describe("{get} resultFormat graph", () => {
        it("Return result in graph format.", (done) => {
            const infos = addTest({
                type: "get",
                short: "ResultFormat as graph",
                description: 'Use $resultFormat=graph to get datas into graphical representation.<br><img class="tabLogo" src="./assets/graph.png" alt="graph result">',
                request: `${testVersion}/Datastreams(1)/Observations?$resultFormat=graph`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("text/html");
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    done();
                });
        });
    });

    describe("{get} resultFormat graphDatas", () => {
        it("Return result in graphDatas format.", (done) => {
            const infos = addTest({
                type: "get",
                short: "ResultFormat as graphDatas",
                description: "Use $resultFormat=graphDatas to get datas into echarts compatible format.",
                reference: "https://echarts.apache.org/en/index.html",
                request: `${testVersion}/Datastreams(1)/Observations?$resultFormat=graphDatas`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });
    describe("{get} resultFormat GeoJSON", () => {
        it("Return result in GeoJSON format.", (done) => {
            const infos = addTest({
                type: "get",
                short: "ResultFormat as GeoJSON",
                description: "Use $resultFormat=GeoJSON to get datas into GeoJSON compatible format.",
                reference: "https://geojson.org/",
                request: `${testVersion}/Locations?$resultFormat=GeoJSON&$top=3`
            });
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    done();
                });
        });
    });
    describe("Save apiDocFormat.", () => {
        it("Do not test only for save apiDoc", (done) => {
            generateApiDoc(docs, "Format");
            done();
        });
    });
});
