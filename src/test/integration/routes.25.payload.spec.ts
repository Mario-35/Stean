/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * TDD for Payload API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, identification, limitResult, nbColor, nbColorTitle, testVersion, _RAWDB, infos } from "./constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { addStartNewTest, addTest, writeLog } from "./tests";
import { EConstant } from "../../server/enums";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Payload;
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

describe("endpoint : Payload", () => {
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

    describe(`{post} ${entity.name} ${nbColorTitle}[10.2]`, () => {
        afterEach(() => {
            writeLog(true);
        });

        it("should return the Lora observation that was added", (done) => {
            const datas = {
                "deveui": "2CF7F1202520017E",
                "timestamp": "2021-10-18T14:53:44+02:00",
                "payload_ciphered": null,
                "frame": "010610324200000107103E4900009808"
            };
            const infos = addTest({
                type: "post",
                short: "Post observation basic",
                description: "Post a new Observation in a Lora Thing.",
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
                    res.header.location.should.contain("Observations");
                    res.type.should.equal("application/json");
                    res.body["@iot.selfLink"].should.contain("/Observations(");
                    res.body["result"][0].should.eql(18.75);
                    res.body["result"][1].should.eql(16.946);
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    done();
                });
        });

        it("should return Error decoder Message", (done) => {
            const datas = {
                "deveui": "8CF9574000002D1D",
                "timestamp": "2021-10-18T14:53:44+02:00",
                "payload_ciphered": null,
                "frame": "AA010610324200000107103E4900009808"
            };
            const infos = addTest({
                type: "post",
                short: "Post observation payload basic",
                description: `Post a new Observation in a Lora Thing.`,
                request: `${testVersion}/${entity.name}`,
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    done();
                });
        });

        it("should return Error Invalid Payload Message", (done) => {
            const datas = {
                "deveui": "8CF9574000002D2D",
                "timestamp": "2021-10-18T14:53:44+02:00",
                "payload_ciphered": null,
                "frame": "AA010610324200000107103E4900009808"
            };
            const infos = addTest({
                type: "post",
                short: "Basic",
                description: `Post a new Observation in a Lora Thing.`,
                request: `${testVersion}/${entity.name}`,
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body["detail"].should.eql("Invalid Payload");
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
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should return that Observation already exist", (done) => {
            const datas = {
                "deveui": "2CF7F1202520017E",
                "timestamp": "2021-10-18T14:53:44+02:00",
                "payload_ciphered": null,
                "frame": "010610324200000107103E4900009808"
            };
            const infos = addTest({
                type: "post",
                short: "Post Duplicate",
                description: "Post a new Duplicate Lora Observation.",
                request: `${testVersion}/${entity.name}`,
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(409);
                    res.type.should.equal("application/json");
                    res.body["detail"].should.eql("Observation already exist");
                    done();
                });
        });

        it("should return the Observation that was added with Sort", (done) => {
            const datas = {
                "data": {
                    "Temperature": 25,
                    "moisture": 100
                },
                "deveui": "2CF7F1202520017E",
                "sensor_id": "2CF7F1202520017E",
                "timestamp": "2021-10-15T14:53:44+02:00",
                "payload_ciphered": null
            };
            const infos = addTest({
                type: "post",
                short: "Post Sort",
                description: "Post a new Lora Observation Sorted.",
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
                    res.header.location.should.contain("Observations");
                    res.type.should.equal("application/json");
                    res.body["@iot.selfLink"].should.contain("/Observations(");
                    res.body["result"][0].should.eql(100);
                    res.body["result"][1].should.eql(25);
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    done();
                });
        });

        it("should return the Observation with data null", (done) => {
            const datas = {
                "data": null,
                "deveui": "2CF7F1202520017E",
                "sensor_id": "2CF7F1202520017E",
                "timestamp": "2021-10-15T14:53:44+02:00",
                "payload_ciphered": null,
                "payload_deciphered": ""
            };
            const infos = addTest({
                type: "post",
                short: "Post Data Null",
                description: "Post a new Lora Observation With Data null.",
                request: `${testVersion}/${entity.name}`,
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body["detail"].should.eql("Data is missing or Null");
                    done();
                });
        });

        it("should return error that Data not corresponding", (done) => {
            const datas = {
                "data": {
                    "lost": 50,
                    "nothing": 25,
                    "dontknow": 100
                },
                "deveui": "2CF7F1202520017E",
                "sensor_id": "2CF7F1202520017E",
                "timestamp": "2021-10-15T14:53:44+02:00",
                "payload_ciphered": null,
                "payload_deciphered": ""
            };
            const infos = addTest({
                type: "post",
                short: "Post Data Nots",
                description: "Post a new Lora Observation Data not corresponding.",
                request: `${testVersion}/${entity.name}`,
                params: datas
            });
            chai.request(server)
                .post(`/test/${infos.request}`)
                .send(infos.params)
                .set("Cookie", `${EConstant.appName}=${token}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body["detail"].should.include("Data not corresponding");
                    generateApiDoc(docs, entity.name);
                    done();
                });
        });
    });
});
