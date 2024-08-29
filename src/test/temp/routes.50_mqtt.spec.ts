process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
const mqtt = require('mqtt');
import { IApiDoc, prepareToApiDoc, IApiInput, identification, generateApiDoc, testVersion, _RAWDB } from "../integration/constant";

chai.use(chaiHttp);

const should = chai.should();

import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "../integration/tests";

const docs: IApiDoc[] = [];

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "Mqtt"));
};


addToApiDoc({
    api: `{infos} /Identification Infos`,
    apiName: `InfosMqtt`,
    apiDescription: `<hr>
    <div class="text">
      <p>You have to be registered to be able to POST PUT OR DELETE datas.</p>
      </div>`,
      result: ""
    });
    
    describe("suscribe : mqtt", () => {
        describe("GET a mqtt subscribe", () => {
            afterEach(() => { writeLog(true); });
            it("should return id subscribe", (done) => {     
                addStartNewTest("Mqtt");
                const mqttClient = mqtt.connect('ws://localhost:1883/test/v1.1/login', { username: "zobi", password: "zobi"});

            const infos = addTest({
                api: `{post} login get a new token`,
                apiName: `TokenLogin`,
                apiDescription: "Get a new token.",
                apiExample: {
                    http: `${testVersion}/login`,
                    curl: `curl -X POST KEYHTTP/login -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' -d 'username=stean&password=stean'`
                },
                apiParamExample: { "username": identification.username, "password": identification.password }
            });
            chai.request(server)
                .post(`/test/${info.apiExample.http}`)
                .type("form")
                .send(identification)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.body.should.include.keys("token");
                    res.body.should.include.keys("message");
                    res.body.message.should.eql("Login succeeded");
                    res.status.should.equal(200);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
        it("Return Error if the identification wrong", (done) => {
            const infos = addTest({
                api: `{post} login Post basic`,
                apiName: `TokenError`,
                apiDescription: "Identification failed.",
                apiExample: {
                    http: `${testVersion}/login`,                    
                    curl: `curl -X POST KEYHTTP/login -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' -d 'username=test&password=test'`
                },
                apiParamExample: { "username": identification.username, "password": "nowhere" }
            });
            chai.request(server)
                .post(`/test/${info.apiExample.http}`)
                .type("form")
                .send(info.apiParamExample)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(401);
                    res.body.should.include.keys("message");
                    res.body.message.should.eql("Unauthorized");
                    const myError = JSON.stringify(res.body, null, 4);
                    docs[docs.length - 1].apiErrorExample = myError;					
                    done();
                });
        });
        it("should logout", (done) => {
            const infos = addTest({
                api: `{get} logout logout actual connection.`,
                apiName: `TokenLogout`,
                apiDescription: "Logout actual connection.",
                apiExample: {
                    http: `${testVersion}/logout`,                    
                    curl: `curl -X GET KEYHTTP/logout`
                }
            });
            chai.request(server)
                .get(`/test/${info.apiExample.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.body.should.include.keys("message");
                    res.body.message.should.eql("Logout succeeded");
                    res.status.should.equal(200);
                    addToApiDoc({ ...infos, result: res });
                    generateApiDoc(docs, `apiDocToken.js`);
                    done();
                });
        });
    });
});
