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
    docs.push(prepareToApiDoc(input, "BuiltInMisc"));
};

addToApiDoc({
    api: `{infos} /BuiltInMisc Infos`,
    apiName: "InfosBuiltInMisc",
    apiDescription: `Stean add some usefull function`,
    apiReference: "",
    result: ""
});
   
describe("Odata BuiltInMisc", () => {
    before((done) => {
        addStartNewTest("Built in Miscs");
		done();
	});
	afterEach(() => { writeLog(true); });
    it("interval(1 hour)", (done) => {
        const infos = addTest({
            api: "{get} Observations Interval",
            apiName: "BuiltInMiscInterval",
            apiDescription: "The interval keyword rounds the input postgresSql interval (see reference below) parameter to the nearest interval.",
            apiReference: "https://www.postgresql.org/docs/15/ecpg-pgtypes.html#ECPG-PGTYPES-INTERVAL",
            apiExample: { 
                http: `${testVersion}/Datastreams(3)/Observations?$interval=1 hour`,
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
                res.body["@iot.count"].should.eql(276);
                res.body["value"][0]["@iot.id"].should.eql(49);
                res.body["value"][0]["phenomenonTime"].should.eql('2023-03-01T11:00:00');
                res.body["value"][1]["@iot.id"].should.eql(0);
                res.body["value"][1]["phenomenonTime"].should.eql('2023-03-01T12:00:00');
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("interval(15 min)", (done) => {
        const infos = addTest({
            api: `{get} interval(15 min)`,
            apiName: "",
            apiDescription: "",
            apiReference: "",
            apiExample: {
                        http: `${testVersion}/Datastreams(3)/Observations?$interval=15 min`,
					}
				});
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => { 
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body["@iot.count"].should.eql(1101);
                res.body["value"][0]["@iot.id"].should.eql(49);
                res.body["value"][0]["phenomenonTime"].should.eql('2023-03-01T11:00:00');
                res.body["value"][1]["@iot.id"].should.eql(0);
                res.body["value"][1]["phenomenonTime"].should.eql('2023-03-01T11:15:00');
                
                done();
            });
    });

    it("interval(1 min)", (done) => {
        const infos = addTest({
            api: `{get} interval(1 min)`,
            apiName: "",
            apiDescription: "",
            apiReference: "",
            apiExample: {
                        http: `${testVersion}/Datastreams(3)/Observations?$interval=1 min`,
					}
				});
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {     
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body["@iot.count"].should.eql(16501);
                res.body["value"][0]["@iot.id"].should.eql(49);
                res.body["value"][0]["phenomenonTime"].should.eql('2023-03-01T10:50:00');
                res.body["value"][1]["@iot.id"].should.eql(0);
                res.body["value"][1]["phenomenonTime"].should.eql('2023-03-01T10:51:00');
                
                done();
            });
    });

    it("interval(1 day)", (done) => {
        const infos = addTest({
            api: `{get} interval(1 day)`,
            apiName: "",
            apiDescription: "",
            apiReference: "",
            apiExample: {
                        http: `${testVersion}/Datastreams(4)/Observations?$interval=1 day`,
					}
				});
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => { 
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body["@iot.count"].should.eql(12);
                res.body["value"][0]["@iot.id"].should.eql(73);
                res.body["value"][0]["phenomenonTime"].should.eql('2023-04-02T02:00:00');
                res.body["value"][1]["@iot.id"].should.eql(74);
                res.body["value"][1]["phenomenonTime"].should.eql('2023-04-03T02:00:00');
                res.body["value"][5]["@iot.id"].should.eql(78);
                res.body["value"][5]["phenomenonTime"].should.eql('2023-04-07T02:00:00');
                
                done();
            });
    });

    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "apiDocBuiltInMisc.js");
        done();
    });

});
