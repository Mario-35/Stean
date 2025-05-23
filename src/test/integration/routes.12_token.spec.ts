process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, prepareToApiDoc, IApiInput, identification, generateApiDoc, testVersion, _RAWDB } from "./constant";
chai.use(chaiHttp);
const should = chai.should();
import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "./tests";
const docs: IApiDoc[] = [];
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "Token"));
};

addToApiDoc({
    type: "infos",
    short: "Identification Extension",
    description: `<hr>
    <div class="text">
      <p>You have to be registered to be able to POST PUT OR DELETE datas.</p>
      </div>`,
    result: ""
});

describe("Identification : Token", () => {
    describe("GET a token", () => {
        afterEach(() => {
            writeLog(true);
        });
        it("should return JWT Identification", (done) => {
            addStartNewTest("Token");
            const infos = addTest({
                type: "post",
                short: "login get a new token",
                description: "Get a new token.",
                examples: {
                    http: `${testVersion}/login`,
                    curl: `curl -X POST KEYHTTP/login -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' -d 'username=stean&password=stean'`
                },
                params: { "username": identification.username, "password": identification.password }
            });
            chai.request(server)
                .post(`/test/${infos.examples.http}`)
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
                type: "post",
                short: "login Post basic",
                description: "Identification failed.",
                examples: {
                    http: `${testVersion}/login`,
                    curl: `curl -X POST KEYHTTP/login -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' -d 'username=test&password=test'`
                },
                params: { "username": identification.username, "password": "nowhere" }
            });
            chai.request(server)
                .post(`/test/${infos.examples.http}`)
                .type("form")
                .send(infos.params)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(401);
                    res.body.should.include.keys("message");
                    res.body.message.should.eql("Unauthorized");
                    const myError = JSON.stringify(res.body, null, 4);
                    docs[docs.length - 1].error = myError;
                    done();
                });
        });
        it("should logout", (done) => {
            const infos = addTest({
                type: "get",
                short: "logout logout actual connection.",
                description: "Logout actual connection.",
                examples: {
                    http: `${testVersion}/logout`,
                    curl: `curl -X GET KEYHTTP/logout`
                }
            });
            chai.request(server)
                .get(`/test/${infos.examples.http}`)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.body.should.include.keys("message");
                    res.body.message.should.eql("Logout succeeded");
                    res.status.should.equal(200);
                    addToApiDoc({ ...infos, result: res });
                    generateApiDoc(docs, `Token`);
                    done();
                });
        });
    });
});
