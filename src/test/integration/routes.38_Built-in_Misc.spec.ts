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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, defaultGet, limitResult, testVersion } from "./constant";
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
    short: "Presentation",
    description: `Stean add some usefull function`,
    reference: "",
    result: ""
});

describe("Odata BuiltInMisc", () => {
    before((done) => {
        addStartNewTest("Built in Miscs");
        done();
    });
    afterEach(() => {
        writeLog(true);
    });
    it("interval(1 hour)", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Interval",
            description: "The interval keyword rounds the input postgresSql interval (see reference below) parameter to the nearest interval.",
            reference: "https://www.postgresql.org/docs/15/ecpg-pgtypes.html#ECPG-PGTYPES-INTERVAL",
            examples: {
                http: `${testVersion}/Datastreams(7)/Observations?$interval=1 hour`,
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
                res.body["@iot.count"].should.eql(67);
                res.body["value"][0]["@iot.id"].should.eql(122);
                res.body["value"][0]["phenomenonTime"].should.eql("2024-06-01T03:00:00");
                res.body["value"][1]["@iot.id"].should.eql(125);
                res.body["value"][1]["phenomenonTime"].should.eql("2024-06-01T04:00:00");
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("interval(15 min)", (done) => {
        const infos = addTest({
            type: "get",
            short: "interval(15 min)",

            description: "",
            reference: "",
            examples: {
                http: `${testVersion}/Datastreams(7)/Observations?$interval=15 min`
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body["@iot.count"].should.eql(199);
                res.body["value"][0]["@iot.id"].should.eql(122);
                res.body["value"][0]["phenomenonTime"].should.eql("2024-06-01T03:00:00");
                res.body["value"][1]["@iot.id"].should.eql(0);
                res.body["value"][1]["phenomenonTime"].should.eql("2024-06-01T03:15:00");
                done();
            });
    });
    it("interval(1 min)", (done) => {
        const infos = addTest({
            type: "get",
            short: "interval(1 min)",

            description: "",
            reference: "",
            examples: {
                http: `${testVersion}/Datastreams(7)/Observations?$interval=1 min`
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body["@iot.count"].should.eql(2971);
                res.body["value"][0]["@iot.id"].should.eql(122);
                res.body["value"][0]["phenomenonTime"].should.eql("2024-06-01T02:46:00");
                res.body["value"][1]["@iot.id"].should.eql(0);
                res.body["value"][1]["phenomenonTime"].should.eql("2024-06-01T02:47:00");
                done();
            });
    });
    it("interval(1 day)", (done) => {
        const infos = addTest({
            type: "get",
            short: "interval(1 day)",

            description: "",
            reference: "",
            examples: {
                http: `${testVersion}/Datastreams(7)/Observations?$interval=1 day`
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body["@iot.count"].should.eql(67);
                res.body["value"][0]["@iot.id"].should.eql(122);
                res.body["value"][0]["phenomenonTime"].should.eql("2024-06-02T02:00:00");
                res.body["value"][1]["@iot.id"].should.eql(125);
                res.body["value"][1]["phenomenonTime"].should.eql("2024-06-02T02:00:00");
                res.body["value"][5]["@iot.id"].should.eql(137);
                res.body["value"][5]["phenomenonTime"].should.eql("2024-06-02T02:00:00");
                done();
            });
    });
    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "BuiltInMisc");
        done();
    });
});
